import {
  CompetitionStatus,
  CompetitionFormat,
  GradedBy,
  Prisma,
  StaffPermission,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { actorFor } from "@/lib/staff";
import { can } from "@/lib/permissions";
import { generateCode, normaliseCode } from "./code";
import { parseProblem, PROBLEM_ERROR_COPY, type ProblemInput } from "./problem";
import { markAnswer, hostMark, type MarkableProblem, type AskModel } from "./marking";
import { gradeWithModel, graderAvailable } from "./grader";
import { judge, parseAwayLog, type FocusPolicy } from "./focus";
import type { Outcome } from "./service";

/**
 * Problem competitions.
 *
 * A room where the answer is written rather than chosen. Everything the quiz
 * rooms already do — codes, lobbies, joining late, the host ending it — is
 * reused; what is different is here.
 *
 * Two rules are worth stating once, because every function below depends on
 * them:
 *
 *   1. **A solution never leaves the server while a room is live.** Not
 *      fetched and stripped — not selected at all, the same rule the duel
 *      engine follows for its correct answers.
 *   2. **A mark is never invented.** An answer nothing has marked is PENDING,
 *      which the screens say out loud. It is not a zero, because a zero from a
 *      model that happened to be down is indistinguishable from a zero the
 *      student earned.
 */

/** The model is never asked at submit time; the host's marking pass asks it. */
const NO_MODEL: AskModel = async () => null;

/** How many answers one marking request works through. Vercel has a clock. */
export const GRADE_BATCH = 6;

const CODE_ATTEMPTS = 8;

/* ── Writing problems ────────────────────────────────────────────────────── */

export async function saveProblem(
  userId: string,
  email: string | null | undefined,
  input: ProblemInput & { id?: unknown }
): Promise<Outcome<{ id: string }>> {
  const actor = await actorFor(userId, email);
  if (!can(actor, StaffPermission.MANAGE_QUESTIONS)) {
    return { ok: false, error: "You cannot write problems." };
  }

  const parsed = parseProblem(input);
  if ("error" in parsed) return { ok: false, error: PROBLEM_ERROR_COPY[parsed.error] };

  const data = { ...parsed.problem, authorId: userId };

  try {
    if (typeof input.id === "string" && input.id) {
      const row = await prisma.problem.update({
        where: { id: input.id },
        // The author is not overwritten on an edit: the record of who wrote a
        // problem should survive someone else fixing a typo in it.
        data: { ...parsed.problem },
        select: { id: true },
      });
      return { ok: true, data: { id: row.id } };
    }

    const row = await prisma.problem.create({ data, select: { id: true } });
    return { ok: true, data: { id: row.id } };
  } catch (e) {
    console.error("saveProblem failed", e);
    return { ok: false, error: "Could not save that problem." };
  }
}

export async function retireProblem(
  userId: string,
  email: string | null | undefined,
  id: string,
  active: boolean
): Promise<Outcome<null>> {
  const actor = await actorFor(userId, email);
  if (!can(actor, StaffPermission.MANAGE_QUESTIONS)) {
    return { ok: false, error: "You cannot change problems." };
  }

  try {
    // Retired, never deleted: rooms that used it still have to review against
    // something.
    await prisma.problem.update({ where: { id }, data: { active } });
    return { ok: true, data: null };
  } catch (e) {
    console.error("retireProblem failed", e);
    return { ok: false, error: "Could not change that problem." };
  }
}

export interface ProblemSummary {
  id: string;
  title: string;
  topic: string;
  statement: string;
  maxPoints: number;
  answerKind: string;
  gradingMode: string;
  hasSolution: boolean;
  active: boolean;
}

/** The list a host picks a set from. Solutions are not selected. */
export async function listProblems(includeRetired = false): Promise<ProblemSummary[]> {
  const rows = await prisma.problem.findMany({
    where: includeRetired ? {} : { active: true },
    orderBy: [{ topic: "asc" }, { createdAt: "desc" }],
    take: 300,
    select: {
      id: true, title: true, topic: true, statement: true, maxPoints: true,
      answerKind: true, gradingMode: true, active: true, solution: true,
    },
  });

  return rows.map(({ solution, ...r }) => ({ ...r, hasSolution: Boolean(solution) }));
}

/**
 * The bank, or an honest admission that it is not there.
 *
 * The problem tables arrive in a migration that is pasted into Supabase by
 * hand, so "not run yet" is a real state a page has to survive. Reported
 * rather than swallowed: a bank that is empty because a table is missing looks
 * exactly like a bank nobody has written to yet, and that confusion has
 * already cost this project a table that silently never existed.
 */
export async function listProblemsSafe(
  includeRetired = false
): Promise<{ problems: ProblemSummary[]; available: boolean }> {
  try {
    return { problems: await listProblems(includeRetired), available: true };
  } catch (e) {
    console.error(
      "listProblems failed — has 20260909_add_problem_competitions been run?",
      e
    );
    return { problems: [], available: false };
  }
}

/** One problem, with everything, for the editor. Never for a player. */
export async function getProblemForEditor(
  userId: string,
  email: string | null | undefined,
  id: string
) {
  const actor = await actorFor(userId, email);
  if (!can(actor, StaffPermission.MANAGE_QUESTIONS)) return null;
  return prisma.problem.findUnique({ where: { id } });
}

/* ── Opening a room ──────────────────────────────────────────────────────── */

export const MIN_PROBLEMS = 1;
export const MAX_PROBLEMS = 20;
export const MIN_MINUTES = 5;
export const MAX_MINUTES = 240;

export interface ProblemSetupInput {
  title?: unknown;
  problemIds?: unknown;
  durationMinutes?: unknown;
  access?: unknown;
  focusPolicy?: unknown;
  focusAllowance?: unknown;
}

export async function createProblemCompetition(
  userId: string,
  email: string | null | undefined,
  input: ProblemSetupInput
): Promise<Outcome<{ code: string }>> {
  const actor = await actorFor(userId, email);
  if (!can(actor, StaffPermission.HOST_COMPETITIONS)) {
    return { ok: false, error: "You cannot run competitions." };
  }

  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (!title) return { ok: false, error: "Give the competition a name." };
  if (title.length > 80) return { ok: false, error: "Keep the name under 80 characters." };

  const wanted = Array.isArray(input.problemIds)
    ? input.problemIds.filter((id): id is string => typeof id === "string" && id.length > 0)
    : [];
  // The host's order is the order they are answered in, so duplicates are
  // dropped rather than sorted away.
  const problemIds = [...new Set(wanted)];

  if (problemIds.length < MIN_PROBLEMS) return { ok: false, error: "Choose at least one problem." };
  if (problemIds.length > MAX_PROBLEMS) {
    return { ok: false, error: `At most ${MAX_PROBLEMS} problems in one set.` };
  }

  const found = await prisma.problem.findMany({
    where: { id: { in: problemIds }, active: true },
    select: { id: true },
  });
  if (found.length !== problemIds.length) {
    return { ok: false, error: "One of those problems is no longer available." };
  }

  const rawMinutes = Number(input.durationMinutes);
  const durationMinutes =
    Number.isFinite(rawMinutes) && rawMinutes > 0
      ? Math.min(Math.max(Math.round(rawMinutes), MIN_MINUTES), MAX_MINUTES)
      : null; // Null is a real choice: the host closes the room by hand.

  for (let attempt = 0; attempt < CODE_ATTEMPTS; attempt++) {
    const code = generateCode();
    try {
      await prisma.competition.create({
        data: {
          code,
          title,
          hostId: userId,
          access: input.access === "LINK" ? "LINK" : "OPEN",
          format: CompetitionFormat.PROBLEMS,
          problemIds,
          questionIds: [],
          durationMinutes,
          // Unrecognised means not watched: the strict end is never a default.
          focusPolicy:
            input.focusPolicy === "LOCK" ? "LOCK" : input.focusPolicy === "WARN" ? "WARN" : "NONE",
          focusAllowance: Math.min(
            Math.max(Math.round(Number(input.focusAllowance)) || 2, 0),
            10
          ),
        },
      });
      return { ok: true, data: { code } };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") continue;
      console.error("createProblemCompetition failed", e);
      return { ok: false, error: "Could not open that competition." };
    }
  }

  return { ok: false, error: "Could not find a free code. Try again." };
}

/* ── Playing ─────────────────────────────────────────────────────────────── */

export interface PlayProblem {
  id: string;
  title: string;
  topic: string;
  statement: string;
  imageUrl: string | null;
  answerKind: "NUMERIC" | "SHORT" | "OPEN";
  answerHint: string | null;
  maxPoints: number;
  /** What this player has in the box, saved. */
  draft: string;
}

export interface ProblemSession {
  competitionId: string;
  code: string;
  title: string;
  problems: PlayProblem[];
  totalPoints: number;
  /** When the room closes, or null when the host closes it by hand. */
  deadline: Date | null;
  submitted: boolean;
  /** Frozen by the guard or by the host. Not finished — it can be lifted. */
  locked: boolean;
  lockReason: string | null;
  /** True when a person stopped them, false when the guard did. */
  lockedByHost: boolean;
  focusPolicy: "NONE" | "WARN" | "LOCK";
  /** Strikes still allowed. Infinity is not JSON, so an unwatched room sends -1. */
  focusRemaining: number;
  /** Names and how far along, never marks: marks would leak the answers. */
  room: { userId: string; name: string | null; answered: number; submitted: boolean }[];
}

export async function getProblemSession(
  userId: string,
  rawCode: string
): Promise<ProblemSession | null> {
  const code = normaliseCode(rawCode);
  if (!code) return null;

  const comp = await prisma.competition.findUnique({
    where: { code },
    select: {
      id: true, code: true, title: true, problemIds: true, format: true,
      durationMinutes: true, startedAt: true,
      focusPolicy: true, focusAllowance: true,
      players: {
        select: {
          userId: true, answered: true, finishedAt: true, lockedAt: true, awayLog: true,
          lockReason: true, lockedById: true,
          user: { select: { name: true } },
        },
      },
    },
  });
  if (!comp || comp.format !== CompetitionFormat.PROBLEMS) return null;

  const me = comp.players.find((p) => p.userId === userId);
  if (!me) return null;

  const [rows, mine] = await Promise.all([
    prisma.problem.findMany({
      where: { id: { in: comp.problemIds } },
      // No `solution`, and no answer key. Not fetched and stripped — never
      // fetched, so no change downstream can leak one.
      select: {
        id: true, title: true, topic: true, statement: true, imageUrl: true,
        answerKind: true, answerHint: true, maxPoints: true,
      },
    }),
    prisma.competitionAnswer.findMany({
      where: { competitionId: comp.id, userId },
      select: { questionId: true, text: true },
    }),
  ]);

  const drafts = new Map(mine.map((a) => [a.questionId, a.text ?? ""]));
  const byId = new Map(rows.map((r) => [r.id, r]));

  const problems = comp.problemIds
    .map((id) => byId.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ ...p, draft: drafts.get(p.id) ?? "" }));

  return {
    competitionId: comp.id,
    code: comp.code,
    title: comp.title,
    problems,
    totalPoints: problems.reduce((sum, p) => sum + p.maxPoints, 0),
    deadline: deadlineOf(comp.startedAt, comp.durationMinutes),
    submitted: me.finishedAt !== null,
    locked: me.lockedAt !== null,
    lockReason: me.lockReason,
    lockedByHost: me.lockedById != null,
    focusPolicy: comp.focusPolicy as "NONE" | "WARN" | "LOCK",
    focusRemaining: (() => {
      const verdict = judge(parseAwayLog(me.awayLog), comp.focusPolicy as FocusPolicy, comp.focusAllowance);
      return Number.isFinite(verdict.remaining) ? verdict.remaining : -1;
    })(),
    room: comp.players
      .map((p) => ({
        userId: p.userId,
        name: p.user.name,
        answered: p.answered,
        submitted: p.finishedAt !== null,
      }))
      .sort((a, b) => Number(b.submitted) - Number(a.submitted) || b.answered - a.answered),
  };
}

export function deadlineOf(startedAt: Date | null, durationMinutes: number | null): Date | null {
  if (!startedAt || !durationMinutes) return null;
  return new Date(startedAt.getTime() + durationMinutes * 60_000);
}

/** A little slack past the deadline, so a save in flight is not lost to a second. */
const GRACE_MS = 5_000;

/**
 * Save what is in one box.
 *
 * Called as the student types, so it is an upsert and nothing else: no
 * marking, no counters that could drift, no reading of a key. Marking happens
 * once, on submit.
 */
export async function saveProblemDraft(
  userId: string,
  competitionId: string,
  problemId: string,
  text: string
): Promise<Outcome<{ savedAt: number }>> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: {
      status: true, format: true, problemIds: true, startedAt: true, durationMinutes: true,
    },
  });
  if (!comp || comp.format !== CompetitionFormat.PROBLEMS) return { ok: false, error: "No such competition." };
  if (comp.status !== CompetitionStatus.RUNNING) return { ok: false, error: "That competition is not running." };
  if (!comp.problemIds.includes(problemId)) return { ok: false, error: "That problem is not in this set." };

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

  const body = typeof text === "string" ? text.slice(0, 4000) : "";

  try {
    await prisma.competitionAnswer.upsert({
      where: { competitionId_userId_questionId: { competitionId, userId, questionId: problemId } },
      create: {
        competitionId, userId, questionId: problemId, text: body,
        gradedBy: GradedBy.PENDING, points: 0, maxPoints: 0,
      },
      update: { text: body },
    });

    await prisma.competitionPlayer.update({
      where: { competitionId_userId: { competitionId, userId } },
      // Counted, not incremented: a box emptied again has to count down too.
      data: {
        answered: await prisma.competitionAnswer.count({
          where: { competitionId, userId, NOT: { text: "" } },
        }),
      },
    });

    return { ok: true, data: { savedAt: Date.now() } };
  } catch (e) {
    console.error("saveProblemDraft failed", e);
    return { ok: false, error: "Could not save that." };
  }
}

/**
 * Hand the paper in.
 *
 * Marks what a key can mark, right now, and leaves the rest pending. The model
 * is deliberately not called here: a student pressing submit should wait for a
 * database write, not for a queue of language model calls.
 */
export async function submitProblems(
  userId: string,
  competitionId: string
): Promise<Outcome<{ pending: number }>> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { status: true, format: true, problemIds: true, startedAt: true },
  });
  if (!comp || comp.format !== CompetitionFormat.PROBLEMS) return { ok: false, error: "No such competition." };
  if (comp.status === CompetitionStatus.LOBBY) return { ok: false, error: "It has not started." };

  const seat = await prisma.competitionPlayer.findUnique({
    where: { competitionId_userId: { competitionId, userId } },
    select: { finishedAt: true, joinedAt: true, lockedAt: true },
  });
  if (!seat) return { ok: false, error: "You are not in this competition." };
  if (seat.finishedAt) return { ok: true, data: { pending: 0 } };
  // Frozen means frozen. The host lets them carry on, or ending the room hands
  // in whatever they had — see settleEveryone.
  if (seat.lockedAt) return { ok: false, error: "Your paper is paused. Ask the host." };

  return { ok: true, data: { pending: await settlePaper(competitionId, userId) } };
}

/**
 * Mark one paper and hand it in.
 *
 * Split out of `submitProblems` because it has a second caller: a room that
 * ends with papers still open. Without that, a student who closed their laptop
 * — or whose paper was frozen — would never be marked at all, and their
 * answers would sit in the database as a row nobody ever scored.
 *
 * The model is deliberately not called here. Submitting should wait for a
 * database write, not for a queue of language model calls; the host's marking
 * pass asks the model afterwards.
 */
export async function settlePaper(competitionId: string, userId: string): Promise<number> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { problemIds: true, startedAt: true },
  });
  const seat = await prisma.competitionPlayer.findUnique({
    where: { competitionId_userId: { competitionId, userId } },
    select: { joinedAt: true, finishedAt: true },
  });
  if (!comp || !seat || seat.finishedAt) return 0;

  const [problems, answers] = await Promise.all([
    prisma.problem.findMany({ where: { id: { in: comp.problemIds } } }),
    prisma.competitionAnswer.findMany({ where: { competitionId, userId } }),
  ]);

  const byId = new Map(problems.map((p) => [p.id, p]));
  const written = new Map(answers.map((a) => [a.questionId, a.text ?? ""]));

  let pending = 0;

  for (const problemId of comp.problemIds) {
    const problem = byId.get(problemId);
    if (!problem) continue;

    const mark = await markAnswer(problem as MarkableProblem, written.get(problemId) ?? "", NO_MODEL);
    if (mark.gradedBy === "PENDING") pending++;

    await prisma.competitionAnswer.upsert({
      where: { competitionId_userId_questionId: { competitionId, userId, questionId: problemId } },
      create: {
        competitionId, userId, questionId: problemId,
        text: written.get(problemId) ?? "",
        points: mark.points, maxPoints: problem.maxPoints,
        isCorrect: mark.isCorrect, feedback: mark.feedback,
        gradedBy: mark.gradedBy as GradedBy,
        gradedAt: mark.gradedBy === "PENDING" ? null : new Date(),
      },
      update: {
        points: mark.points, maxPoints: problem.maxPoints,
        isCorrect: mark.isCorrect, feedback: mark.feedback,
        gradedBy: mark.gradedBy as GradedBy,
        gradedAt: mark.gradedBy === "PENDING" ? null : new Date(),
      },
    });
  }

  const startedAt = comp.startedAt && comp.startedAt > seat.joinedAt ? comp.startedAt : seat.joinedAt;

  await prisma.competitionPlayer.update({
    where: { competitionId_userId: { competitionId, userId } },
    data: {
      finishedAt: new Date(),
      // The server's clock, as everywhere else here: a tie broken on a time
      // the client reported is a tie broken on a number the client chose.
      totalMs: Math.max(0, Date.now() - startedAt.getTime()),
    },
  });

  await recomputeScore(competitionId, userId);
  return pending;
}

/**
 * Hand in every paper still open.
 *
 * Called when the host ends a problem room. A paper nobody submitted is not a
 * paper worth nothing — it is a laptop that was closed, a clock that ran out
 * with the tab in the background, or a paper the guard froze.
 */
export async function settleEveryone(competitionId: string): Promise<void> {
  const open = await prisma.competitionPlayer.findMany({
    where: { competitionId, finishedAt: null },
    select: { userId: true },
  });

  // One at a time: thirty papers of twenty problems each is a lot of writes,
  // and a host pressing "end it" can wait a moment longer for all of them.
  for (const player of open) await settlePaper(competitionId, player.userId);
}

/** One player's marks, added up. Recomputed rather than incremented. */
export async function recomputeScore(competitionId: string, userId: string): Promise<number> {
  const rows = await prisma.competitionAnswer.findMany({
    where: { competitionId, userId },
    select: { points: true, text: true },
  });

  const score = rows.reduce((sum, r) => sum + r.points, 0);
  await prisma.competitionPlayer.update({
    where: { competitionId_userId: { competitionId, userId } },
    data: { score, answered: rows.filter((r) => (r.text ?? "") !== "").length },
  });
  return score;
}

/* ── Marking ─────────────────────────────────────────────────────────────── */

export interface MarkingProgress {
  pending: number;
  marked: number;
  total: number;
  /** False when no key is configured, which is a state, not a failure. */
  modelAvailable: boolean;
}

export async function markingProgress(
  userId: string,
  competitionId: string
): Promise<MarkingProgress | null> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { hostId: true },
  });
  if (!comp || comp.hostId !== userId) return null;

  const [pending, total] = await Promise.all([
    prisma.competitionAnswer.count({ where: { competitionId, gradedBy: GradedBy.PENDING } }),
    prisma.competitionAnswer.count({ where: { competitionId } }),
  ]);

  return { pending, marked: total - pending, total, modelAvailable: graderAvailable() };
}

/**
 * Work through the unmarked answers, a few at a time.
 *
 * Called repeatedly by the host's screen rather than once: thirty players by
 * ten problems is three hundred model calls, and a serverless function has
 * seconds. Each call is a batch, each batch is resumable, and the screen shows
 * how many are left — so a request that dies costs a retry, not a room.
 *
 * Only problems the host set to AI marking are ever sent. A problem marked
 * HOST stays pending until a person reads it, which is what choosing it meant.
 */
export async function gradeNextBatch(
  userId: string,
  competitionId: string,
  limit = GRADE_BATCH
): Promise<Outcome<{ graded: number; pending: number; stalled: boolean }>> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { hostId: true, format: true, problemIds: true },
  });
  if (!comp || comp.hostId !== userId) return { ok: false, error: "Not your competition." };
  if (comp.format !== CompetitionFormat.PROBLEMS) return { ok: false, error: "Nothing to mark here." };

  if (!graderAvailable()) {
    return { ok: false, error: "No marking model is configured. Mark these by hand." };
  }

  const problems = await prisma.problem.findMany({ where: { id: { in: comp.problemIds } } });
  const byId = new Map(problems.map((p) => [p.id, p]));
  const aiIds = problems.filter((p) => p.gradingMode === "AI").map((p) => p.id);

  const waiting = await prisma.competitionAnswer.findMany({
    where: { competitionId, gradedBy: GradedBy.PENDING, questionId: { in: aiIds } },
    orderBy: { createdAt: "asc" },
    take: Math.min(Math.max(1, limit), 12),
    select: { id: true, userId: true, questionId: true, text: true },
  });

  // Marked in parallel: each answer is independent, and a batch of six taken
  // one at a time is six round trips the host waits through.
  const marks = await Promise.all(
    waiting.map(async (answer) => {
      const problem = byId.get(answer.questionId);
      if (!problem) return null;
      const mark = await markAnswer(problem as MarkableProblem, answer.text, gradeWithModel);
      return { answer, problem, mark };
    })
  );

  let graded = 0;
  const touched = new Set<string>();

  for (const row of marks) {
    if (!row || row.mark.gradedBy === "PENDING") continue;

    await prisma.competitionAnswer.update({
      where: { id: row.answer.id },
      data: {
        points: row.mark.points,
        maxPoints: row.problem.maxPoints,
        isCorrect: row.mark.isCorrect,
        feedback: row.mark.feedback,
        gradedBy: row.mark.gradedBy as GradedBy,
        gradedAt: new Date(),
      },
    });
    graded++;
    touched.add(row.answer.userId);
  }

  for (const player of touched) await recomputeScore(competitionId, player);

  const pending = await prisma.competitionAnswer.count({
    where: { competitionId, gradedBy: GradedBy.PENDING, questionId: { in: aiIds } },
  });

  if (pending === 0) {
    await prisma.competition.update({ where: { id: competitionId }, data: { gradedAt: new Date() } });
  }

  return {
    ok: true,
    // Nothing marked while answers still wait means the model refused every one
    // of them. The screen stops rather than looping on a wall.
    data: { graded, pending, stalled: graded === 0 && waiting.length > 0 },
  };
}

/** The host changing a mark. The last word on every board. */
export async function overrideMark(
  userId: string,
  competitionId: string,
  answerId: string,
  points: unknown,
  feedback: unknown
): Promise<Outcome<{ points: number }>> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { hostId: true },
  });
  if (!comp || comp.hostId !== userId) return { ok: false, error: "Not your competition." };

  const answer = await prisma.competitionAnswer.findUnique({
    where: { id: answerId },
    select: { id: true, competitionId: true, userId: true, questionId: true },
  });
  if (!answer || answer.competitionId !== competitionId) {
    return { ok: false, error: "No such answer." };
  }

  const problem = await prisma.problem.findUnique({
    where: { id: answer.questionId },
    select: { maxPoints: true },
  });

  const mark = hostMark(points, problem?.maxPoints ?? 0, feedback);

  await prisma.competitionAnswer.update({
    where: { id: answer.id },
    data: {
      points: mark.points,
      maxPoints: problem?.maxPoints ?? 0,
      isCorrect: mark.isCorrect,
      feedback: mark.feedback,
      gradedBy: GradedBy.HOST,
      gradedAt: new Date(),
    },
  });

  await recomputeScore(competitionId, answer.userId);
  return { ok: true, data: { points: mark.points } };
}

/* ── Reading the marks back ──────────────────────────────────────────────── */

export interface MarkedAnswer {
  answerId: string;
  playerId: string;
  playerName: string | null;
  problemId: string;
  problemTitle: string;
  statement: string;
  text: string;
  points: number;
  maxPoints: number;
  gradedBy: GradedBy;
  feedback: string | null;
}

/** Everything the host reads while marking one room. */
export async function getMarkingSheet(
  userId: string,
  competitionId: string
): Promise<MarkedAnswer[] | null> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { hostId: true, problemIds: true },
  });
  if (!comp || comp.hostId !== userId) return null;

  const [answers, problems] = await Promise.all([
    prisma.competitionAnswer.findMany({
      where: { competitionId },
      orderBy: [{ gradedBy: "asc" }, { createdAt: "asc" }],
      select: {
        id: true, userId: true, questionId: true, text: true, points: true,
        maxPoints: true, gradedBy: true, feedback: true,
        user: { select: { name: true } },
      },
    }),
    prisma.problem.findMany({
      where: { id: { in: comp.problemIds } },
      select: { id: true, title: true, statement: true, maxPoints: true },
    }),
  ]);

  const byId = new Map(problems.map((p) => [p.id, p]));

  return answers.map((a) => ({
    answerId: a.id,
    playerId: a.userId,
    playerName: a.user.name,
    problemId: a.questionId,
    problemTitle: byId.get(a.questionId)?.title ?? "Problem",
    statement: byId.get(a.questionId)?.statement ?? "",
    text: a.text ?? "",
    points: a.points,
    maxPoints: a.maxPoints || byId.get(a.questionId)?.maxPoints || 0,
    gradedBy: a.gradedBy,
    feedback: a.feedback,
  }));
}

export interface ProblemReviewLine {
  id: string;
  title: string;
  topic: string;
  statement: string;
  imageUrl: string | null;
  solution: string | null;
  yourAnswer: string;
  points: number;
  maxPoints: number;
  gradedBy: GradedBy;
  feedback: string | null;
}

/**
 * What one player sees afterwards.
 *
 * Solutions are selected here and nowhere else, and only once the room has
 * ended — a player who hands in early is still sitting in a room where others
 * are writing.
 */
export async function getProblemReview(
  userId: string,
  competitionId: string
): Promise<ProblemReviewLine[] | null> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { status: true, format: true, problemIds: true },
  });
  if (!comp || comp.format !== CompetitionFormat.PROBLEMS) return null;
  if (comp.status !== CompetitionStatus.ENDED) return null;

  const [problems, mine] = await Promise.all([
    prisma.problem.findMany({ where: { id: { in: comp.problemIds } } }),
    prisma.competitionAnswer.findMany({
      where: { competitionId, userId },
      select: {
        questionId: true, text: true, points: true, maxPoints: true,
        gradedBy: true, feedback: true,
      },
    }),
  ]);

  const answers = new Map(mine.map((a) => [a.questionId, a]));
  const byId = new Map(problems.map((p) => [p.id, p]));

  return comp.problemIds
    .map((id) => byId.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => {
      const a = answers.get(p.id);
      return {
        id: p.id,
        title: p.title,
        topic: p.topic,
        statement: p.statement,
        imageUrl: p.imageUrl,
        solution: p.solution,
        yourAnswer: a?.text ?? "",
        points: a?.points ?? 0,
        maxPoints: p.maxPoints,
        gradedBy: a?.gradedBy ?? GradedBy.PENDING,
        feedback: a?.feedback ?? null,
      };
    });
}
