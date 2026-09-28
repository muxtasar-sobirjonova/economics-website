import { GradedBy, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { markAnswer, type AskModel } from "./marking";
import { gradeWithModel, graderAvailable } from "./grader";
import { answerKeyOf } from "./problem";
import { plainText } from "./markdown";
import {
  pickProblem, topicCounts, aiLeftToday, startOfDay, totalsOf, practiceMode,
  MAX_PRACTICE_ANSWER, DAILY_AI_LIMIT,
  type PracticeCandidate, type TopicCount, type PracticeTotals,
} from "./practice";
import type { Outcome } from "./service";

/**
 * Practice — the bank, on your own.
 *
 * The two rules the room service follows hold here too, for the same reasons:
 *
 *   1. **A solution never leaves the server before the answer is in.** It is
 *      not selected when a problem is served, only when one is marked. This is
 *      the whole of practice's security: there is no clock and no invigilator,
 *      so the only thing standing between a student and the answer is what the
 *      server chooses to send.
 *   2. **A mark is never invented.** The model being unreachable is said out
 *      loud rather than recorded as a zero.
 *
 * One more, specific to this file: a practice attempt is written to
 * `ProblemAttempt` and nowhere else. It never touches a competition, a score
 * or a rating.
 */

const SELECT_FOR_PICK = {
  id: true, topic: true, answerKind: true, gradingMode: true,
  numericValue: true, numericTolerance: true, acceptedAnswers: true,
  solution: true, practiceOpen: true,
} satisfies Prisma.ProblemSelect;

type PickRow = Prisma.ProblemGetPayload<{ select: typeof SELECT_FOR_PICK }>;

function candidateOf(r: PickRow): PracticeCandidate {
  return {
    id: r.id,
    topic: r.topic,
    answerKind: r.answerKind,
    gradingMode: r.gradingMode,
    hasKey: answerKeyOf(r).kind !== "OPEN",
    hasSolution: Boolean(r.solution),
    practiceOpen: r.practiceOpen,
  };
}

/** Everything a person's practice page needs, in one read. */
async function poolAndSeen(userId: string) {
  const [rows, attempts] = await Promise.all([
    prisma.problem.findMany({ where: { active: true }, select: SELECT_FOR_PICK }),
    prisma.problemAttempt.findMany({
      where: { userId },
      select: { problemId: true, points: true, maxPoints: true, createdAt: true },
    }),
  ]);

  return {
    pool: rows.map(candidateOf),
    seen: new Set(attempts.map((a) => a.problemId)),
    attempts,
  };
}

export interface PracticeOverview {
  topics: TopicCount[];
  totals: PracticeTotals;
  /** Practisable problems left, across every topic. */
  left: number;
  aiLeft: number;
  aiLimit: number;
  /** False when no marking model is configured: open problems cannot be set. */
  modelReady: boolean;
  /** False when the tables are not there yet. Said out loud, never swallowed. */
  available: boolean;
}

const EMPTY: PracticeOverview = {
  topics: [], totals: { attempted: 0, points: 0, outOf: 0, fullMarks: 0 },
  left: 0, aiLeft: 0, aiLimit: DAILY_AI_LIMIT, modelReady: false, available: false,
};

export async function getPracticeOverview(userId: string): Promise<PracticeOverview> {
  try {
    const { pool, seen, attempts } = await poolAndSeen(userId);
    const topics = topicCounts(pool, seen);

    return {
      topics,
      totals: totalsOf(attempts),
      left: topics.reduce((n, t) => n + (t.total - t.done), 0),
      aiLeft: aiLeftToday(await aiUsedToday(userId)),
      aiLimit: DAILY_AI_LIMIT,
      modelReady: graderAvailable(),
      available: true,
    };
  } catch (e) {
    console.error(
      "practice overview failed — has 20260928_add_problem_practice been run?",
      e
    );
    return EMPTY;
  }
}

/** How much AI marking this person has spent today. */
async function aiUsedToday(userId: string): Promise<number> {
  return prisma.problemAttempt.count({
    where: { userId, gradedBy: GradedBy.AI, createdAt: { gte: startOfDay(new Date()) } },
  });
}

export interface PracticeProblem {
  id: string;
  title: string;
  topic: string;
  statement: string;
  imageUrl: string | null;
  answerKind: "NUMERIC" | "SHORT" | "OPEN";
  answerHint: string | null;
  maxPoints: number;
  /** Whether answering it will spend one of today's model calls. */
  costsAi: boolean;
}

export type NextResult =
  | { problem: PracticeProblem; aiLeft: number }
  | { empty: "topic-done" | "all-done" | "ai-spent" };

/**
 * The next problem to work.
 *
 * Selected twice on purpose: once without the solution to choose, once without
 * the solution to send. There is no path through this function that reads a
 * solution into memory, which is a stronger guarantee than remembering to
 * delete a key from an object.
 */
export async function nextProblem(
  userId: string,
  topic?: string | null
): Promise<NextResult> {
  const { pool, seen } = await poolAndSeen(userId);
  const aiLeft = aiLeftToday(await aiUsedToday(userId));

  const picked = pickProblem(pool, { seen, topic: topic || null, aiLeft });
  if ("empty" in picked) return picked;

  const row = await prisma.problem.findUnique({
    where: { id: picked.problem.id },
    select: {
      id: true, title: true, topic: true, statement: true, imageUrl: true,
      answerKind: true, answerHint: true, maxPoints: true,
    },
  });
  if (!row) return { empty: "all-done" };

  return {
    problem: { ...row, costsAi: practiceMode(picked.problem) === "AI" },
    aiLeft,
  };
}

export interface PracticeResult {
  points: number;
  maxPoints: number;
  gradedBy: "AUTO" | "AI" | "PENDING";
  feedback: string | null;
  /** Handed over only now, once the answer is in and recorded. */
  solution: string | null;
  aiLeft: number;
}

/**
 * Mark one practice answer and record it.
 *
 * Written before the solution is returned, and written even when the model
 * could not be reached — a student must not be able to see a solution without
 * the attempt existing, because an attempt that can be thrown away is an
 * answer key with a retry button.
 */
export async function answerPractice(
  userId: string,
  problemId: string,
  rawText: unknown,
  rawMs: unknown
): Promise<Outcome<PracticeResult>> {
  const text = typeof rawText === "string" ? rawText.trim().slice(0, MAX_PRACTICE_ANSWER) : "";
  if (!text) return { ok: false, error: "Write an answer first." };

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true, statement: true, solution: true, answerKind: true, topic: true,
      numericValue: true, numericTolerance: true, acceptedAnswers: true,
      maxPoints: true, gradingMode: true, active: true, practiceOpen: true,
    },
  });
  if (!problem || !problem.active) return { ok: false, error: "That problem is not available." };

  const candidate = candidateOf(problem);
  const mode = practiceMode(candidate);
  if (!problem.practiceOpen || mode === null) {
    return { ok: false, error: "That problem is not open for practice." };
  }

  // One go each. Checked here as well as by the unique index, so the answer is
  // a clear sentence rather than a constraint violation.
  const already = await prisma.problemAttempt.findUnique({
    where: { userId_problemId: { userId, problemId } },
    select: { id: true },
  });
  if (already) return { ok: false, error: "You have already worked this one." };

  let aiLeft = aiLeftToday(await aiUsedToday(userId));

  // The allowance is checked at marking time, not only at serving time: a page
  // left open since this morning would otherwise spend a call that is gone.
  if (mode === "AI" && aiLeft <= 0) {
    return {
      ok: false,
      error: `You have used today's ${DAILY_AI_LIMIT} marked answers. Problems with an answer key are still open.`,
    };
  }

  const ask: AskModel = mode === "AI" ? gradeWithModel : async () => null;

  // `gradingMode` is overridden with what practice decided rather than what the
  // room would do: HOST here means nobody, and nobody marks nothing.
  const mark = await markAnswer(
    { ...problem, gradingMode: mode } as Parameters<typeof markAnswer>[0],
    text,
    ask
  );

  const ms = typeof rawMs === "number" && Number.isFinite(rawMs)
    ? Math.min(Math.max(0, Math.round(rawMs)), 6 * 60 * 60 * 1000)
    : 0;

  const gradedBy = mark.gradedBy === "HOST" ? "PENDING" : mark.gradedBy;

  await prisma.$transaction([
    prisma.problemAttempt.create({
      data: {
        userId, problemId, text,
        points: mark.points,
        maxPoints: problem.maxPoints,
        gradedBy: gradedBy as GradedBy,
        feedback: mark.feedback,
        ms,
      },
    }),
    prisma.problem.update({
      where: { id: problemId },
      data: { timesPractised: { increment: 1 } },
    }),
  ]);

  if (gradedBy === "AI") aiLeft = Math.max(0, aiLeft - 1);

  return {
    ok: true,
    data: {
      points: mark.points,
      maxPoints: problem.maxPoints,
      gradedBy: gradedBy as "AUTO" | "AI" | "PENDING",
      feedback: mark.feedback,
      solution: problem.solution,
      aiLeft,
    },
  };
}

export interface PastAttempt {
  id: string;
  problemId: string;
  title: string;
  topic: string;
  preview: string;
  points: number;
  maxPoints: number;
  gradedBy: string;
  feedback: string | null;
  text: string;
  solution: string | null;
  createdAt: Date;
}

/**
 * What this person has already worked.
 *
 * Solutions are selected here, and that is deliberate: every problem on this
 * list has been answered and marked already, so there is nothing left to give
 * away. It is the only place in the whole module that sends one unasked.
 */
export async function practiceHistory(userId: string, take = 50): Promise<PastAttempt[]> {
  try {
    const rows = await prisma.problemAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true, problemId: true, points: true, maxPoints: true, gradedBy: true,
        feedback: true, text: true, createdAt: true,
        problem: { select: { title: true, topic: true, statement: true, solution: true } },
      },
    });

    return rows.map((r) => ({
      id: r.id,
      problemId: r.problemId,
      title: r.problem.title,
      topic: r.problem.topic,
      preview: plainText(r.problem.statement, 160),
      points: r.points,
      maxPoints: r.maxPoints,
      gradedBy: r.gradedBy,
      feedback: r.feedback,
      text: r.text,
      solution: r.problem.solution,
      createdAt: r.createdAt,
    }));
  } catch (e) {
    console.error("practice history failed", e);
    return [];
  }
}
