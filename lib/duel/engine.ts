import { DuelRunStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { QUESTIONS_PER_DUEL, gradeRun, elapsedMs, type SubmittedAnswer } from "./grading";
import { pickQuestionIds, shuffle } from "./selection";
import { START_RATING, resolveDuel } from "./elo";
import { buildReview, parseGraded, type ReviewLine } from "./review";
import { dayKey, pickDailyQuestionId } from "./daily";

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
  /** The run you are chasing, if someone has already played this set. */
  opponent: OpponentPace | null;
  /** Set when you were paired with someone sitting at the same set right now. */
  liveOpponentName: string | null;
}

export interface OpponentPace {
  name: string | null;
  score: number;
  /**
   * Per question, in set order. Whether they got it and how long they took —
   * never what they picked. Knowing an opponent answered correctly does not
   * narrow four options down; knowing their answer would give it away.
   */
  pace: { correct: boolean; ms: number }[];
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
/**
 * How recently someone must have started for them to count as still playing.
 * Long enough to cover ten questions at twenty seconds each, plus reading.
 */
const LIVE_WINDOW_MS = 5 * 60 * 1000;

export interface StartOptions {
  /** A finished run shared by its player: face exactly that set. */
  faceRunId?: string;
  /** Prefer a set this particular player is waiting on. */
  rematchUserId?: string;
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
  let liveOpponentName: string | null = null;
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

    // A rematch is a preference, not a promise: if they have nothing waiting
    // you still get a duel, and the screen says so rather than refusing.
    const rematch =
      !invited && options.rematchUserId
        ? await findSetWaitingFrom(userId, options.rematchUserId)
        : null;

    const live = invited || rematch ? null : await findLiveSet(userId);

    if (invited) {
      setId = invited.setId;
      facingOpponent = true;
      challengerName = invited.challengerName;
    } else if (rematch) {
      setId = rematch.setId;
      facingOpponent = true;
      challengerName = rematch.name;
    } else if (live) {
      // Someone is at this set right now. Preferred over a run that finished
      // earlier: both of you are here, so it settles in minutes rather than
      // whenever the next person happens to turn up.
      setId = live.setId;
      facingOpponent = true;
      liveOpponentName = live.name;
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
        const [seenRuns, seenInCompetitions, active] = await Promise.all([
          prisma.duelRun.findMany({
            where: { userId },
            select: { set: { select: { questionIds: true } } },
          }),
          // A question met in a competition is a question this player already
          // knows the answer to. Counting it as seen is what keeps a
          // competition from quietly corrupting the rated ladder.
          prisma.competitionAnswer.findMany({
            where: { userId },
            select: { questionId: true },
            distinct: ["questionId"],
          }),
          prisma.duelQuestion.findMany({ where: { active: true }, select: { id: true } }),
        ]);

        const seen: string[] = [];
        seenRuns.forEach((r) => seen.push(...r.set.questionIds));
        seenInCompetitions.forEach((a) => seen.push(a.questionId));

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

  const [questions, opponent] = await Promise.all([
    serveQuestions(setId),
    loadOpponentPace(setId, userId),
  ]);

  return {
    runId,
    questions,
    rating: rating.rating,
    reused,
    facingOpponent,
    resumed,
    challengerName,
    opponent,
    liveOpponentName,
  };
}

/** A run this specific player has finished and nobody has faced yet. */
async function findSetWaitingFrom(userId: string, opponentId: string) {
  if (opponentId === userId) return null;

  const run = await prisma.duelRun.findFirst({
    where: {
      userId: opponentId,
      status: DuelRunStatus.OPEN,
      finishedAt: { not: null },
      set: { runs: { none: { userId } } },
    },
    orderBy: { finishedAt: "asc" },
    select: { setId: true, user: { select: { name: true } } },
  });

  return run ? { setId: run.setId, name: run.user.name } : null;
}

/**
 * Find someone playing right now and sit down opposite them.
 *
 * Without this, two people who press start within seconds of each other are
 * dealt separate sets and never meet — which is the one thing a duel is
 * supposed to do. The pairing is still asynchronous underneath; they simply
 * happen to be answering the same ten questions at the same time.
 *
 * Only a set with exactly one run so far, or a third player would join a pair
 * and one of the three would be left unmatched.
 */
async function findLiveSet(userId: string) {
  const candidate = await prisma.duelRun.findFirst({
    where: {
      finishedAt: null,
      status: DuelRunStatus.OPEN,
      userId: { not: userId },
      startedAt: { gt: new Date(Date.now() - LIVE_WINDOW_MS) },
      set: { runs: { none: { userId } } },
    },
    // Freshest first: most likely to still be at the board.
    orderBy: { startedAt: "desc" },
    select: {
      setId: true,
      user: { select: { name: true } },
      set: { select: { _count: { select: { runs: true } } } },
    },
  });

  if (!candidate || candidate.set._count.runs !== 1) return null;
  return { setId: candidate.setId, name: candidate.user.name };
}

/**
 * The ghost you are racing.
 *
 * A duel is played against a run that already happened, so the opponent's
 * whole performance is sitting in the database while you play. Showing their
 * pace turns a solo quiz into a race — the same thing a chess clock does —
 * and costs nothing, because the data is already there.
 */
async function loadOpponentPace(setId: string, userId: string): Promise<OpponentPace | null> {
  const run = await prisma.duelRun.findFirst({
    where: {
      setId,
      userId: { not: userId },
      finishedAt: { not: null },
      status: DuelRunStatus.OPEN,
    },
    orderBy: { finishedAt: "asc" },
    select: {
      score: true,
      answers: true,
      user: { select: { name: true } },
      set: { select: { questionIds: true } },
    },
  });
  if (!run) return null;

  const byId = new Map(parseGraded(run.answers).map((g) => [g.questionId, g]));
  return {
    name: run.user.name,
    score: run.score,
    pace: run.set.questionIds.map((id) => {
      const g = byId.get(id);
      return { correct: g?.isCorrect ?? false, ms: g?.ms ?? 0 };
    }),
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
    opponentId: string;
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
      opponentId: them.userId,
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
 * Everything about a settled run: score, opponent, rating change, review.
 *
 * The player who submits first never sees a result — their duel settles later,
 * while they are elsewhere. This is how they get the same screen afterwards
 * instead of only a line in a list.
 */
export async function getDuelOutcome(
  userId: string,
  runId: string
): Promise<DuelOutcome | null> {
  const run = await prisma.duelRun.findUnique({
    where: { id: runId },
    select: { userId: true, finishedAt: true },
  });
  if (!run || run.userId !== userId || !run.finishedAt) return null;

  return readOutcome(userId, runId);
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

export interface RatingPoint {
  rating: number;
  delta: number;
  at: Date;
  result: "won" | "lost" | "drew";
}

/**
 * The rating as a line rather than a number.
 *
 * Reconstructed by walking the deltas forward from the starting rating, which
 * is exact: every point a rating has ever moved came from one settled duel.
 */
export async function getRatingHistory(userId: string, limit = 40): Promise<RatingPoint[]> {
  const duels = await prisma.duel.findMany({
    where: { OR: [{ runA: { userId } }, { runB: { userId } }] },
    orderBy: { createdAt: "asc" },
    take: limit,
    select: {
      createdAt: true,
      winnerId: true,
      deltaA: true,
      deltaB: true,
      runA: { select: { userId: true } },
    },
  });

  let rating = START_RATING;
  return duels.map((d) => {
    const delta = d.runA.userId === userId ? d.deltaA : d.deltaB;
    rating += delta;
    return {
      rating,
      delta,
      at: d.createdAt,
      result:
        d.winnerId === null ? ("drew" as const) : d.winnerId === userId ? ("won" as const) : ("lost" as const),
    };
  });
}

/** How many people are mid-duel, for the lobby. */
export async function countLivePlayers(excludeUserId: string): Promise<number> {
  return prisma.duelRun.count({
    where: {
      finishedAt: null,
      status: DuelRunStatus.OPEN,
      userId: { not: excludeUserId },
      startedAt: { gt: new Date(Date.now() - LIVE_WINDOW_MS) },
    },
  });
}

/** Runs finished and waiting for anyone to face them. */
export async function countWaitingSets(excludeUserId: string): Promise<number> {
  return prisma.duelRun.count({
    where: {
      status: DuelRunStatus.OPEN,
      finishedAt: { not: null },
      userId: { not: excludeUserId },
    },
  });
}

export interface DailyState {
  day: string;
  question: { id: string; topic: string; questionText: string; options: string[] } | null;
  /** Filled once the player has answered today. */
  answered: {
    chosen: string | null;
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string | null;
  } | null;
  /** How everyone did today. Only meaningful once you have answered. */
  totals: { played: number; correct: number };
}

/**
 * One question a day, the same for everyone.
 *
 * The duel needs a second person; most days there will not be one. This does
 * not — it is the reason to open the page when the ladder is empty.
 *
 * The answer is only revealed after the player has committed to one, and the
 * options are shuffled per view like everywhere else.
 */
export async function getDailyState(userId: string): Promise<DailyState> {
  const day = dayKey();

  const active = await prisma.duelQuestion.findMany({
    where: { active: true },
    select: { id: true },
  });
  const questionId = pickDailyQuestionId(active.map((q) => q.id), day);
  if (!questionId) return { day, question: null, answered: null, totals: { played: 0, correct: 0 } };

  const [row, mine, played, correct] = await Promise.all([
    prisma.duelQuestion.findUnique({
      where: { id: questionId },
      select: {
        id: true, topic: true, questionText: true, options: true,
        correctAnswer: true, explanation: true,
      },
    }),
    prisma.dailyAnswer.findUnique({ where: { userId_day: { userId, day } } }),
    prisma.dailyAnswer.count({ where: { day } }),
    prisma.dailyAnswer.count({ where: { day, isCorrect: true } }),
  ]);
  if (!row) return { day, question: null, answered: null, totals: { played: 0, correct: 0 } };

  return {
    day,
    question: {
      id: row.id,
      topic: row.topic,
      questionText: row.questionText,
      options: shuffle(row.options),
    },
    answered: mine
      ? {
          chosen: mine.chosen,
          isCorrect: mine.isCorrect,
          correctAnswer: row.correctAnswer,
          explanation: row.explanation,
        }
      : null,
    totals: { played, correct },
  };
}

/**
 * Record today's answer. The unique index on (userId, day) is what actually
 * enforces one attempt — two tabs cannot both slip through a check in code.
 */
export async function answerDaily(
  userId: string,
  chosen: string | null,
  ms: number
): Promise<DailyState> {
  const day = dayKey();
  const state = await getDailyState(userId);

  if (state.question && !state.answered) {
    const row = await prisma.duelQuestion.findUnique({
      where: { id: state.question.id },
      select: { correctAnswer: true },
    });
    const isCorrect = typeof chosen === "string" && chosen === row?.correctAnswer;

    try {
      await prisma.dailyAnswer.create({
        data: {
          userId,
          day,
          questionId: state.question.id,
          chosen: typeof chosen === "string" ? chosen : null,
          isCorrect,
          ms: Number.isFinite(ms) && ms > 0 ? Math.min(Math.round(ms), 300_000) : 0,
        },
      });
    } catch (e) {
      // Already answered today: the index did its job, so read it back.
      if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) throw e;
    }
  }

  return getDailyState(userId);
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
