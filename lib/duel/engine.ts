import { DuelRunStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { QUESTIONS_PER_DUEL, gradeRun, elapsedMs, type SubmittedAnswer } from "./grading";
import { pickQuestionIds, shuffle } from "./selection";
import { START_RATING, resolveDuel } from "./elo";
import { buildReview, parseGraded, type ReviewLine } from "./review";

/**
 * The duel engine.
 *
 * Imported only from server actions and route handlers — it reaches Postgres
 * directly and must never be pulled into a client component.
 *
 * Asynchronous by design: the first player to face a set leaves it OPEN, and
 * the next player is dealt the identical set and settled against them. With a
 * small user base there is never a live opponent waiting, and a ladder whose
 * queue is always empty is not a ladder.
 */

/** What the player is allowed to see while playing. Note what is absent. */
export interface ServedQuestion {
  id: string;
  topic: string;
  questionText: string;
  options: string[];
}

export interface StartedDuel {
  runId: string;
  questions: ServedQuestion[];
  rating: number;
  /** True when the bank was too small to deal an entirely unseen set. */
  reused: boolean;
  /** True when a real opponent is already waiting on this set. */
  facingOpponent: boolean;
  /** True when this is an unfinished run being picked up again. */
  resumed: boolean;
  /** Who challenged you, when the set was opened from a shared link. */
  challengerName: string | null;
}

async function ensureRating(userId: string) {
  return prisma.playerRating.upsert({
    where: { userId },
    create: { userId, rating: START_RATING },
    update: {},
  });
}

/**
 * Deal a duel.
 *
 * Preference is always to face a run someone has already played: it settles
 * immediately on submit, and it clears the queue oldest-first so nobody is
 * left waiting forever. Only when there is nothing to answer is a new set cut.
 */
export interface StartOptions {
  /** A finished run shared by its player: face exactly that set. */
  faceRunId?: string;
}

export async function startDuel(
  userId: string,
  options: StartOptions = {}
): Promise<StartedDuel> {
  const rating = await ensureRating(userId);

  const existing = await prisma.duelRun.findFirst({
    where: { userId, finishedAt: null },
    orderBy: { startedAt: "desc" },
    select: { id: true, setId: true },
  });

  let setId: string;
  let reused = false;
  let facingOpponent = false;
  let resumed = false;
  let challengerName: string | null = null;
  let runId: string;

  if (existing) {
    // An unfinished run is resumed rather than abandoned, so a refresh does
    // not cost the player a duel they have already started. The clock is not
    // reset with it — otherwise reloading would buy thinking time.
    setId = existing.setId;
    runId = existing.id;
    facingOpponent = true;
    resumed = true;
  } else {
    const invited = options.faceRunId
      ? await findChallenge(userId, options.faceRunId)
      : null;

    if (invited) {
      setId = invited.setId;
      facingOpponent = true;
      challengerName = invited.challengerName;
    } else {
      const waiting = await prisma.duelRun.findFirst({
        where: {
          status: DuelRunStatus.OPEN,
          finishedAt: { not: null },
          userId: { not: userId },
          set: { runs: { none: { userId } } },
        },
        orderBy: { finishedAt: "asc" },
        select: { setId: true },
      });

      if (waiting) {
        setId = waiting.setId;
        facingOpponent = true;
      } else {
        const [seenRuns, active] = await Promise.all([
          prisma.duelRun.findMany({
            where: { userId },
            select: { set: { select: { questionIds: true } } },
          }),
          prisma.duelQuestion.findMany({ where: { active: true }, select: { id: true } }),
        ]);

        const seen: string[] = [];
        seenRuns.forEach((r) => seen.push(...r.set.questionIds));

        const picked = pickQuestionIds(
          active.map((q) => q.id),
          seen,
          QUESTIONS_PER_DUEL
        );
        if (picked.ids.length === 0) {
          throw new Error("The question bank is empty.");
        }

        reused = picked.reused;
        const set = await prisma.duelSet.create({ data: { questionIds: picked.ids } });
        setId = set.id;
      }
    }

    const run = await prisma.duelRun.create({
      data: { userId, setId, ratingBefore: rating.rating },
      select: { id: true },
    });
    runId = run.id;
  }

  return {
    runId,
    questions: await serveQuestions(setId),
    rating: rating.rating,
    reused,
    facingOpponent,
    resumed,
    challengerName,
  };
}

/**
 * Resolve a shared challenge link.
 *
 * Silently declines rather than throwing: a link can be stale, already
 * settled, sent to the wrong person or forwarded back to its author, and none
 * of those deserve an error page. The caller falls through to a normal duel.
 */
async function findChallenge(userId: string, runId: string) {
  const run = await prisma.duelRun.findUnique({
    where: { id: runId },
    select: {
      setId: true,
      userId: true,
      status: true,
      finishedAt: true,
      user: { select: { name: true } },
      set: { select: { runs: { where: { userId }, select: { id: true } } } },
    },
  });

  if (!run) return null;
  if (run.userId === userId) return null;              // your own link
  if (!run.finishedAt) return null;                    // they have not played it
  if (run.status !== DuelRunStatus.OPEN) return null;  // already settled
  if (run.set.runs.length > 0) return null;            // you have faced this set

  return { setId: run.setId, challengerName: run.user.name };
}

/**
 * Load a set's questions in playing form. The correct answer and the
 * explanation are never selected — not omitted later, never fetched — so no
 * refactor downstream can leak them into a response.
 *
 * Options are shuffled per serve: the bank stores one order, and a player who
 * meets a question twice must not find the answer in the same slot.
 */
async function serveQuestions(setId: string): Promise<ServedQuestion[]> {
  const set = await prisma.duelSet.findUniqueOrThrow({
    where: { id: setId },
    select: { questionIds: true },
  });

  const rows = await prisma.duelQuestion.findMany({
    where: { id: { in: set.questionIds } },
    select: { id: true, topic: true, questionText: true, options: true },
  });

  const byId = new Map(rows.map((r) => [r.id, r]));
  return set.questionIds
    .map((id) => byId.get(id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .map((r) => ({ ...r, options: shuffle(r.options) }));
}

export interface DuelOutcome {
  runId: string;
  score: number;
  total: number;
  /** Absent while no opponent has faced this set yet. */
  settled: {
    opponentName: string | null;
    opponentScore: number;
    result: "won" | "lost" | "drew";
    delta: number;
    rating: number;
  } | null;
  rating: number;
  /** Present only once a duel is settled — see getDuelReview. */
  review: ReviewLine[] | null;
}

/**
 * Grade a run and settle it if an opponent is waiting.
 *
 * The whole thing is one transaction: a run that is scored but whose rating
 * never lands would be worse than one that fails outright.
 */
export async function submitDuel(
  userId: string,
  runId: string,
  answers: SubmittedAnswer[]
): Promise<DuelOutcome> {
  const run = await prisma.duelRun.findUnique({
    where: { id: runId },
    select: {
      id: true,
      userId: true,
      setId: true,
      finishedAt: true,
      startedAt: true,
      set: { select: { questionIds: true } },
    },
  });

  if (!run || run.userId !== userId) throw new Error("Duel not found.");
  if (run.finishedAt) return readOutcome(userId, runId);

  const questions = await prisma.duelQuestion.findMany({
    where: { id: { in: run.set.questionIds } },
    select: { id: true, correctAnswer: true },
  });

  const order = new Map(run.set.questionIds.map((id, i) => [id, i]));
  questions.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  const { graded, score } = gradeRun(questions, answers ?? []);
  const finishedAt = new Date();
  const totalMs = elapsedMs(run.startedAt, finishedAt, questions.length);

  await prisma.$transaction(async (tx) => {
    await tx.duelRun.update({
      where: { id: runId },
      data: { answers: graded as unknown as Prisma.InputJsonValue, score, totalMs, finishedAt },
    });

    // Calibration counters. Cheap now, and they are what later lets a
    // question's difficulty be measured instead of guessed.
    await tx.duelQuestion.updateMany({
      where: { id: { in: graded.map((g) => g.questionId) } },
      data: { timesServed: { increment: 1 } },
    });
    const correctIds = graded.filter((g) => g.isCorrect).map((g) => g.questionId);
    if (correctIds.length > 0) {
      await tx.duelQuestion.updateMany({
        where: { id: { in: correctIds } },
        data: { timesCorrect: { increment: 1 } },
      });
    }

    await settle(tx, runId, run.setId, userId);
  });

  return readOutcome(userId, runId);
}

/** Pair this run with a finished, unmatched run on the same set. */
async function settle(
  tx: Prisma.TransactionClient,
  runId: string,
  setId: string,
  userId: string
) {
  const opponent = await tx.duelRun.findFirst({
    where: {
      setId,
      status: DuelRunStatus.OPEN,
      finishedAt: { not: null },
      userId: { not: userId },
      id: { not: runId },
    },
    orderBy: { finishedAt: "asc" },
    select: { id: true, userId: true, score: true, totalMs: true },
  });
  if (!opponent) return;

  const mine = await tx.duelRun.findUniqueOrThrow({
    where: { id: runId },
    select: { score: true, totalMs: true },
  });

  const [a, b] = await Promise.all([
    tx.playerRating.upsert({
      where: { userId },
      create: { userId, rating: START_RATING },
      update: {},
    }),
    tx.playerRating.upsert({
      where: { userId: opponent.userId },
      create: { userId: opponent.userId, rating: START_RATING },
      update: {},
    }),
  ]);

  const r = resolveDuel(
    { rating: a.rating, played: a.played, result: mine },
    { rating: b.rating, played: b.played, result: opponent }
  );

  try {
    await tx.duel.create({
      data: {
        setId,
        runAId: runId,
        runBId: opponent.id,
        winnerId: r.winner === "A" ? userId : r.winner === "B" ? opponent.userId : null,
        deltaA: r.deltaA,
        deltaB: r.deltaB,
      },
    });
  } catch (e) {
    // Unique on runAId/runBId: another submission settled this pairing first.
    // Leaving both runs OPEN is correct — the next one will match them.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return;
    throw e;
  }

  await tx.duelRun.updateMany({
    where: { id: { in: [runId, opponent.id] } },
    data: { status: DuelRunStatus.MATCHED },
  });

  await tx.playerRating.update({
    where: { userId },
    data: {
      rating: r.ratingA,
      played: { increment: 1 },
      won: { increment: r.winner === "A" ? 1 : 0 },
      lost: { increment: r.winner === "B" ? 1 : 0 },
      drawn: { increment: r.winner === null ? 1 : 0 },
    },
  });
  await tx.playerRating.update({
    where: { userId: opponent.userId },
    data: {
      rating: r.ratingB,
      played: { increment: 1 },
      won: { increment: r.winner === "B" ? 1 : 0 },
      lost: { increment: r.winner === "A" ? 1 : 0 },
      drawn: { increment: r.winner === null ? 1 : 0 },
    },
  });
}

async function readOutcome(userId: string, runId: string): Promise<DuelOutcome> {
  const run = await prisma.duelRun.findUniqueOrThrow({
    where: { id: runId },
    select: { score: true, set: { select: { questionIds: true } } },
  });

  const duel = await prisma.duel.findFirst({
    where: { OR: [{ runAId: runId }, { runBId: runId }] },
    select: {
      winnerId: true,
      deltaA: true,
      deltaB: true,
      runAId: true,
      runA: { select: { userId: true, score: true, user: { select: { name: true } } } },
      runB: { select: { userId: true, score: true, user: { select: { name: true } } } },
    },
  });

  const rating = await prisma.playerRating.findUnique({
    where: { userId },
    select: { rating: true },
  });

  let settled: DuelOutcome["settled"] = null;
  if (duel) {
    const iAmA = duel.runAId === runId;
    const them = iAmA ? duel.runB : duel.runA;
    settled = {
      opponentName: them.user.name,
      opponentScore: them.score,
      result:
        duel.winnerId === null ? "drew" : duel.winnerId === userId ? "won" : "lost",
      delta: iAmA ? duel.deltaA : duel.deltaB,
      rating: rating?.rating ?? START_RATING,
    };
  }

  return {
    runId,
    score: run.score,
    total: run.set.questionIds.length,
    settled,
    rating: rating?.rating ?? START_RATING,
    review: settled ? await getDuelReview(userId, runId) : null,
  };
}

/**
 * The two runs side by side, with the answers.
 *
 * Only ever returned for a settled duel. While a set is still waiting for a
 * challenger it is in circulation, and handing its answers to the player who
 * just finished it would hand them to whoever they talk to next.
 */
export async function getDuelReview(
  userId: string,
  runId: string
): Promise<ReviewLine[] | null> {
  const duel = await prisma.duel.findFirst({
    where: {
      OR: [{ runAId: runId }, { runBId: runId }],
    },
    select: {
      runAId: true,
      set: { select: { questionIds: true } },
      runA: { select: { userId: true, answers: true } },
      runB: { select: { userId: true, answers: true } },
    },
  });
  if (!duel) return null;

  const iAmA = duel.runA.userId === userId;
  if (!iAmA && duel.runB.userId !== userId) return null;

  const mine = parseGraded(iAmA ? duel.runA.answers : duel.runB.answers);
  const theirs = parseGraded(iAmA ? duel.runB.answers : duel.runA.answers);

  const rows = await prisma.duelQuestion.findMany({
    where: { id: { in: duel.set.questionIds } },
    select: {
      id: true,
      topic: true,
      questionText: true,
      options: true,
      correctAnswer: true,
      explanation: true,
    },
  });

  const byId = new Map(rows.map((r) => [r.id, r]));
  const ordered = duel.set.questionIds
    .map((id) => byId.get(id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return buildReview(ordered, mine, theirs);
}

export interface RecentDuel {
  runId: string;
  opponentName: string | null;
  yourScore: number;
  theirScore: number;
  result: "won" | "lost" | "drew";
  delta: number;
  at: Date;
}

/**
 * Duels settle while the player is not looking — that is what asynchronous
 * means — so the lobby has to be able to say what happened since last time.
 */
export async function getRecentDuels(userId: string, limit = 8): Promise<RecentDuel[]> {
  const duels = await prisma.duel.findMany({
    where: { OR: [{ runA: { userId } }, { runB: { userId } }] },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      winnerId: true,
      deltaA: true,
      deltaB: true,
      createdAt: true,
      runAId: true,
      runBId: true,
      runA: { select: { userId: true, score: true, user: { select: { name: true } } } },
      runB: { select: { userId: true, score: true, user: { select: { name: true } } } },
    },
  });

  return duels.map((d) => {
    const iAmA = d.runA.userId === userId;
    const me = iAmA ? d.runA : d.runB;
    const them = iAmA ? d.runB : d.runA;
    return {
      runId: iAmA ? d.runAId : d.runBId,
      opponentName: them.user.name,
      yourScore: me.score,
      theirScore: them.score,
      result:
        d.winnerId === null ? ("drew" as const) : d.winnerId === userId ? ("won" as const) : ("lost" as const),
      delta: iAmA ? d.deltaA : d.deltaB,
      at: d.createdAt,
    };
  });
}

/** The ladder. */
export async function getDuelLadder(limit = 20) {
  return prisma.playerRating.findMany({
    where: { played: { gt: 0 } },
    orderBy: [{ rating: "desc" }, { played: "desc" }],
    take: limit,
    select: {
      userId: true,
      rating: true,
      played: true,
      won: true,
      lost: true,
      drawn: true,
      user: { select: { name: true, image: true } },
    },
  });
}
