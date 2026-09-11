import { CompetitionStatus, CompetitionFormat, GradedBy } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { shuffle } from "@/lib/duel/selection";
import { normaliseCode } from "./code";
import { rank, type Ranked } from "./scoring";
import { judge, parseAwayLog, type FocusPolicy } from "./focus";
import { deadlineOf, recomputeScore } from "./problemService";
import type { Outcome } from "./service";

/**
 * A multiple choice room run as an exam.
 *
 * The same bank and the same room as the fast quiz; a different shape of
 * sitting. One clock for the whole paper, every question reachable at any
 * time, an answer that can be changed until it is handed in.
 *
 * Which one a room is, is decided by `durationMinutes`: set means an exam,
 * null means the fast per-question quiz that came first. No new column and no
 * migration — the field already exists for written papers, and it means the
 * same thing here.
 *
 * Everything the fast quiz is careful about still holds. The correct answer is
 * never selected when serving; options are shuffled per player; the clock is
 * the server's; answers match by question id, never by position.
 */

/** A save in flight must not be lost to the second the clock turns over. */
const GRACE_MS = 5_000;

export interface ExamQuestion {
  id: string;
  topic: string;
  questionText: string;
  options: string[];
  /** What this player has chosen so far. Null is unanswered, not wrong. */
  chosen: string | null;
  flagged: boolean;
}

export interface ExamSession {
  competitionId: string;
  code: string;
  title: string;
  questions: ExamQuestion[];
  deadline: Date | null;
  submitted: boolean;
  locked: boolean;
  lockReason: string | null;
  lockedByHost: boolean;
  focusPolicy: "NONE" | "WARN" | "LOCK";
  focusRemaining: number;
  standings: Ranked[];
}

/** True when this room is an exam rather than the fast quiz. */
export function isExam(format: CompetitionFormat, durationMinutes: number | null): boolean {
  return format === CompetitionFormat.QUIZ && durationMinutes !== null;
}

export async function getExamSession(
  userId: string,
  rawCode: string
): Promise<ExamSession | null> {
  const code = normaliseCode(rawCode);
  if (!code) return null;

  const row = await prisma.competition.findUnique({
    where: { code },
    select: {
      id: true, code: true, title: true, questionIds: true, format: true,
      durationMinutes: true, startedAt: true, focusPolicy: true, focusAllowance: true,
      players: {
        select: {
          userId: true, score: true, totalMs: true, answered: true, finishedAt: true,
          disqualifiedAt: true, disqualifyReason: true,
          lockedAt: true, lockReason: true, lockedById: true, awayLog: true,
          user: { select: { name: true } },
        },
      },
    },
  });
  if (!row || !isExam(row.format, row.durationMinutes)) return null;

  const me = row.players.find((p) => p.userId === userId);
  if (!me) return null;

  const [questionRows, mine] = await Promise.all([
    prisma.duelQuestion.findMany({
      where: { id: { in: row.questionIds } },
      // No `correctAnswer`. Not fetched and stripped — never fetched, so no
      // change downstream can leak one.
      select: { id: true, topic: true, questionText: true, options: true },
    }),
    prisma.competitionAnswer.findMany({
      where: { competitionId: row.id, userId },
      select: { questionId: true, chosen: true, flagged: true },
    }),
  ]);

  const chosen = new Map(mine.map((a) => [a.questionId, a.chosen]));
  const flags = new Map(mine.map((a) => [a.questionId, a.flagged]));
  const byId = new Map(questionRows.map((q) => [q.id, q]));

  const questions = row.questionIds
    .map((id) => byId.get(id))
    .filter((q): q is NonNullable<typeof q> => Boolean(q))
    .map((q) => ({
      ...q,
      options: shuffle(q.options),
      chosen: chosen.get(q.id) ?? null,
      flagged: flags.get(q.id) ?? false,
    }));

  return {
    competitionId: row.id,
    code: row.code,
    title: row.title,
    questions,
    deadline: deadlineOf(row.startedAt, row.durationMinutes),
    submitted: me.finishedAt !== null,
    locked: me.lockedAt !== null,
    lockReason: me.lockReason,
    lockedByHost: me.lockedById != null,
    focusPolicy: row.focusPolicy as "NONE" | "WARN" | "LOCK",
    focusRemaining: (() => {
      const verdict = judge(
        parseAwayLog(me.awayLog),
        row.focusPolicy as FocusPolicy,
        row.focusAllowance
      );
      return Number.isFinite(verdict.remaining) ? verdict.remaining : -1;
    })(),
    standings: rank(
      row.players.map((p) => ({
        userId: p.userId, name: p.user.name, score: p.score, totalMs: p.totalMs,
        answered: p.answered, finished: p.finishedAt !== null,
        disqualified: p.disqualifiedAt !== null, disqualifyReason: p.disqualifyReason,
      }))
    ),
  };
}

/**
 * Choose, or change your mind.
 *
 * Graded on the way in so nothing has to be re-read at the end, but the result
 * is never returned — the room is still sitting, and a response that differed
 * between a right and a wrong answer would be an answer key delivered one
 * request at a time.
 */
export async function answerExam(
  userId: string,
  competitionId: string,
  questionId: string,
  chosen: string | null
): Promise<Outcome<{ answered: number }>> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: {
      status: true, format: true, questionIds: true,
      durationMinutes: true, startedAt: true,
    },
  });
  if (!comp || !isExam(comp.format, comp.durationMinutes)) {
    return { ok: false, error: "No such exam." };
  }
  if (comp.status !== CompetitionStatus.RUNNING) {
    return { ok: false, error: "That competition is not running." };
  }
  if (!comp.questionIds.includes(questionId)) {
    return { ok: false, error: "That question is not in this exam." };
  }

  const deadline = deadlineOf(comp.startedAt, comp.durationMinutes);
  if (deadline && Date.now() > deadline.getTime() + GRACE_MS) {
    return { ok: false, error: "Time is up." };
  }

  const seat = await prisma.competitionPlayer.findUnique({
    where: { competitionId_userId: { competitionId, userId } },
    select: { finishedAt: true, lockedAt: true },
  });
  if (!seat) return { ok: false, error: "You are not in this competition." };
  if (seat.finishedAt) return { ok: false, error: "You have already handed this in." };
  if (seat.lockedAt) return { ok: false, error: "Your paper is paused. Ask the host." };

  const question = await prisma.duelQuestion.findUnique({
    where: { id: questionId },
    select: { correctAnswer: true },
  });
  const isCorrect = typeof chosen === "string" && chosen === question?.correctAnswer;

  await prisma.competitionAnswer.upsert({
    where: { competitionId_userId_questionId: { competitionId, userId, questionId } },
    create: {
      competitionId, userId, questionId, chosen, isCorrect,
      points: isCorrect ? 1 : 0, maxPoints: 1, gradedBy: GradedBy.AUTO,
      gradedAt: new Date(),
    },
    // `flagged` is left alone: it belongs to the other call, and a change of
    // answer is not a change of mind about wanting to come back to it.
    update: {
      chosen, isCorrect,
      points: isCorrect ? 1 : 0, maxPoints: 1, gradedBy: GradedBy.AUTO,
      gradedAt: new Date(),
    },
  });

  const { answered } = await recomputeScore(competitionId, userId);
  return { ok: true, data: { answered } };
}

/** Marking a question to come back to. Its own call, like a written paper's. */
export async function flagExam(
  userId: string,
  competitionId: string,
  questionId: string,
  flagged: boolean
): Promise<Outcome<null>> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { status: true, questionIds: true },
  });
  if (!comp || !comp.questionIds.includes(questionId)) {
    return { ok: false, error: "That question is not in this exam." };
  }
  if (comp.status !== CompetitionStatus.RUNNING) {
    return { ok: false, error: "That competition is not running." };
  }

  const seat = await prisma.competitionPlayer.findUnique({
    where: { competitionId_userId: { competitionId, userId } },
    select: { finishedAt: true, lockedAt: true },
  });
  if (!seat) return { ok: false, error: "You are not in this competition." };
  if (seat.finishedAt || seat.lockedAt) return { ok: false, error: "Your paper is closed." };

  try {
    await prisma.competitionAnswer.upsert({
      where: { competitionId_userId_questionId: { competitionId, userId, questionId } },
      create: {
        competitionId, userId, questionId, chosen: null, flagged,
        points: 0, maxPoints: 1, gradedBy: GradedBy.AUTO,
      },
      update: { flagged },
    });
    return { ok: true, data: null };
  } catch (e) {
    console.error("flagExam failed", e);
    return { ok: false, error: "Could not mark that." };
  }
}

/**
 * Hand the paper in.
 *
 * Everything is already graded, so this only closes the sitting and stops the
 * clock. The clock is the server's, measured from when play began for this
 * player — a tie broken on a time the client reported is a tie broken on a
 * number the client chose.
 */
export async function submitExam(
  userId: string,
  competitionId: string
): Promise<Outcome<null>> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { status: true, format: true, durationMinutes: true, startedAt: true },
  });
  if (!comp || !isExam(comp.format, comp.durationMinutes)) {
    return { ok: false, error: "No such exam." };
  }
  if (comp.status === CompetitionStatus.LOBBY) return { ok: false, error: "It has not started." };

  const seat = await prisma.competitionPlayer.findUnique({
    where: { competitionId_userId: { competitionId, userId } },
    select: { finishedAt: true, joinedAt: true, lockedAt: true },
  });
  if (!seat) return { ok: false, error: "You are not in this competition." };
  if (seat.finishedAt) return { ok: true, data: null };
  if (seat.lockedAt) return { ok: false, error: "Your paper is paused. Ask the host." };

  await closeExamPaper(competitionId, userId, comp.startedAt, seat.joinedAt);
  return { ok: true, data: null };
}

/** Shared by handing in and by the host ending the room. */
async function closeExamPaper(
  competitionId: string,
  userId: string,
  startedAt: Date | null,
  joinedAt: Date
): Promise<void> {
  const from = startedAt && startedAt > joinedAt ? startedAt : joinedAt;

  await prisma.competitionPlayer.update({
    where: { competitionId_userId: { competitionId, userId } },
    data: { finishedAt: new Date(), totalMs: Math.max(0, Date.now() - from.getTime()) },
  });

  await recomputeScore(competitionId, userId);
}

/**
 * Close every paper still open when the host ends an exam.
 *
 * The same reason written papers are settled: a student who closed their
 * laptop, or whose paper the guard froze, has answers in the database that
 * would otherwise never be counted into a standing.
 */
export async function settleExam(competitionId: string): Promise<void> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { startedAt: true },
  });
  if (!comp) return;

  const open = await prisma.competitionPlayer.findMany({
    where: { competitionId, finishedAt: null },
    select: { userId: true, joinedAt: true },
  });

  for (const player of open) {
    await closeExamPaper(competitionId, player.userId, comp.startedAt, player.joinedAt);
  }
}
