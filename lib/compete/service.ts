import { CompetitionStatus, CompetitionFormat, Prisma, StaffPermission } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { actorFor } from "@/lib/staff";
import { can } from "@/lib/permissions";
import { shuffle } from "@/lib/duel/selection";
import { generateCode, normaliseCode } from "./code";
import { rank, progress, type Ranked } from "./scoring";
import { buildReview, parseGraded, type ReviewLine } from "@/lib/duel/review";
import { parseSetup, SETUP_ERROR_COPY, type SetupInput } from "./setup";

/**
 * Competitions.
 *
 * Unrated on purpose — the host chooses the length and the topic, so results
 * are not comparable between events and must never reach Elo. Everything here
 * is separate from the duel engine for the same reason.
 */

export type Outcome<T> = { ok: true; data: T } | { ok: false; error: string };

export interface CompetitionView {
  id: string;
  code: string;
  title: string;
  status: CompetitionStatus;
  access: "OPEN" | "LINK";
  /** A quiz room answers the bank; a problem room answers written papers. */
  format: CompetitionFormat;
  topic: string | null;
  questionCount: number;
  secondsPerQuestion: number;
  /** One clock for the whole set, for a problem room. Null means the host's call. */
  durationMinutes: number | null;
  startsClosingAt: Date | null;
  hostName: string | null;
  isHost: boolean;
  joined: boolean;
  standings: Ranked[];
  progress: ReturnType<typeof progress>;
  startedAt: Date | null;
  endedAt: Date | null;
}

/** Codes are random, so a clash is rare — but rare is not never. */
const CODE_ATTEMPTS = 8;

export async function createCompetition(
  userId: string,
  email: string | null | undefined,
  input: SetupInput
): Promise<Outcome<{ code: string }>> {
  const actor = await actorFor(userId, email);
  if (!can(actor, StaffPermission.HOST_COMPETITIONS)) {
    return { ok: false, error: "You cannot run competitions." };
  }

  const parsed = parseSetup(input);
  if ("error" in parsed) return { ok: false, error: SETUP_ERROR_COPY[parsed.error] };
  const setup = parsed.setup;

  const pool = await prisma.duelQuestion.findMany({
    where: { active: true, ...(setup.topic ? { topic: setup.topic } : {}) },
    select: { id: true },
  });
  if (pool.length < setup.questionCount) {
    return {
      ok: false,
      error: `Only ${pool.length} question${pool.length === 1 ? "" : "s"} available${
        setup.topic ? ` in ${setup.topic}` : ""
      }. Choose fewer, or a different topic.`,
    };
  }

  const questionIds = shuffle(pool.map((q) => q.id)).slice(0, setup.questionCount);

  for (let attempt = 0; attempt < CODE_ATTEMPTS; attempt++) {
    const code = generateCode();
    try {
      await prisma.competition.create({
        data: {
          code,
          title: setup.title,
          hostId: userId,
          access: setup.access,
          topic: setup.topic,
          secondsPerQuestion: setup.secondsPerQuestion,
          questionIds,
          focusPolicy: setup.focusPolicy,
          focusAllowance: setup.focusAllowance,
          durationMinutes: setup.durationMinutes,
        },
      });
      return { ok: true, data: { code } };
    } catch (e) {
      // The unique index caught a collision; draw another code.
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") continue;
      console.error("createCompetition failed", e);
      return { ok: false, error: "Could not open that competition." };
    }
  }

  return { ok: false, error: "Could not find a free code. Try again." };
}

export async function getCompetition(
  userId: string,
  rawCode: string
): Promise<CompetitionView | null> {
  const code = normaliseCode(rawCode);
  if (!code) return null;

  const row = await prisma.competition.findUnique({
    where: { code },
    select: {
      id: true, code: true, title: true, status: true, access: true, topic: true,
      questionIds: true, secondsPerQuestion: true, hostId: true, startedAt: true, endedAt: true,
      format: true, problemIds: true, durationMinutes: true,
      host: { select: { name: true } },
      players: {
        select: {
          userId: true, score: true, totalMs: true, answered: true, finishedAt: true,
          disqualifiedAt: true, disqualifyReason: true,
          user: { select: { name: true } },
        },
      },
    },
  });
  if (!row) return null;

  const standings = rank(
    row.players.map((p) => ({
      userId: p.userId,
      name: p.user.name,
      score: p.score,
      totalMs: p.totalMs,
      answered: p.answered,
      finished: p.finishedAt !== null,
        disqualified: p.disqualifiedAt !== null,
        disqualifyReason: p.disqualifyReason,
    }))
  );

  return {
    id: row.id,
    code: row.code,
    title: row.title,
    status: row.status,
    access: row.access,
    format: row.format,
    topic: row.topic,
    questionCount:
      row.format === CompetitionFormat.PROBLEMS ? row.problemIds.length : row.questionIds.length,
    secondsPerQuestion: row.secondsPerQuestion,
    durationMinutes: row.durationMinutes,
    startsClosingAt:
      row.startedAt && row.durationMinutes
        ? new Date(row.startedAt.getTime() + row.durationMinutes * 60_000)
        : null,
    hostName: row.host.name,
    isHost: row.hostId === userId,
    joined: row.players.some((p) => p.userId === userId),
    standings,
    progress: progress(standings, row.questionIds.length),
    startedAt: row.startedAt,
    endedAt: row.endedAt,
  };
}

/**
 * Take a seat.
 *
 * Joining while it is already running is allowed on purpose: a competition
 * that punishes arriving late is a competition people quietly leave.
 */
export async function joinCompetition(userId: string, rawCode: string): Promise<Outcome<{ code: string }>> {
  const code = normaliseCode(rawCode);
  if (!code) return { ok: false, error: "That code is not valid." };

  const row = await prisma.competition.findUnique({
    where: { code },
    select: { id: true, status: true, hostId: true },
  });
  if (!row) return { ok: false, error: "No competition with that code." };
  if (row.status === CompetitionStatus.ENDED) return { ok: false, error: "That competition has finished." };

  try {
    await prisma.competitionPlayer.create({ data: { competitionId: row.id, userId } });
  } catch (e) {
    // Already seated. The unique index is the check; this is not an error.
    if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) {
      console.error("joinCompetition failed", e);
      return { ok: false, error: "Could not join." };
    }
  }

  return { ok: true, data: { code } };
}

async function hostOnly(userId: string, competitionId: string) {
  const row = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { hostId: true, status: true },
  });
  if (!row || row.hostId !== userId) return null;
  return row;
}

export async function startCompetition(userId: string, competitionId: string): Promise<Outcome<null>> {
  const row = await hostOnly(userId, competitionId);
  if (!row) return { ok: false, error: "Not your competition." };
  if (row.status !== CompetitionStatus.LOBBY) return { ok: false, error: "It has already started." };

  await prisma.competition.update({
    where: { id: competitionId },
    data: { status: CompetitionStatus.RUNNING, startedAt: new Date() },
  });
  return { ok: true, data: null };
}

export async function endCompetition(userId: string, competitionId: string): Promise<Outcome<null>> {
  const row = await hostOnly(userId, competitionId);
  if (!row) return { ok: false, error: "Not your competition." };
  if (row.status === CompetitionStatus.ENDED) return { ok: true, data: null };

  await prisma.competition.update({
    where: { id: competitionId },
    data: { status: CompetitionStatus.ENDED, endedAt: new Date() },
  });

  // A paper nobody submitted is not a paper worth nothing: it is a laptop that
  // was closed, a clock that ran out with the tab in the background, or a
  // paper the focus guard froze. Without this they are never marked at all.
  const full = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { format: true, durationMinutes: true },
  });
  if (full?.format === CompetitionFormat.PROBLEMS) {
    const { settleEveryone } = await import("./problemService");
    await settleEveryone(competitionId);
  } else if (full && full.durationMinutes !== null) {
    // A multiple choice exam: everything is already graded, but a paper that
    // was never handed in has a clock that never stopped and a score that was
    // never totalled into a standing.
    const { settleExam } = await import("./examService");
    await settleExam(competitionId);
  }

  return { ok: true, data: null };
}

/** Everything worth listing on the competitions page. */
export async function listCompetitions(userId: string) {
  const [open, mine] = await Promise.all([
    prisma.competition.findMany({
      where: { access: "OPEN", status: { in: [CompetitionStatus.LOBBY, CompetitionStatus.RUNNING] } },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        code: true, title: true, status: true, topic: true, questionIds: true,
        format: true, problemIds: true,
        host: { select: { name: true } },
        _count: { select: { players: true } },
      },
    }),
    prisma.competition.findMany({
      where: { hostId: userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        code: true, title: true, status: true, topic: true, questionIds: true,
        format: true, problemIds: true,
        host: { select: { name: true } },
        _count: { select: { players: true } },
      },
    }),
  ]);

  const shape = (c: (typeof open)[number]) => ({
    code: c.code,
    title: c.title,
    status: c.status,
    format: c.format,
    topic: c.topic,
    questionCount:
      c.format === CompetitionFormat.PROBLEMS ? c.problemIds.length : c.questionIds.length,
    hostName: c.host.name,
    players: c._count.players,
  });

  return { open: open.map(shape), mine: mine.map(shape) };
}

/* ── Playing ─────────────────────────────────────────────────────────────── */

export interface PlayQuestion {
  id: string;
  topic: string;
  questionText: string;
  options: string[];
}

export interface PlaySession {
  competitionId: string;
  code: string;
  title: string;
  secondsPerQuestion: number;
  questions: PlayQuestion[];
  /** Ids already answered, so a reload resumes rather than restarts. */
  answeredIds: string[];
  standings: Ranked[];
  finished: boolean;
  /** The guard, which watches quiz rooms on the same terms as problem rooms. */
  focusPolicy: "NONE" | "WARN" | "LOCK";
  locked: boolean;
  lockReason: string | null;
  lockedByHost: boolean;
}

/**
 * Everything the player needs to play.
 *
 * The correct answer is never selected, exactly as in a duel: not fetched and
 * stripped later, never fetched. Options are shuffled per player so the room
 * cannot call out "it's the third one".
 */
export async function getPlaySession(userId: string, rawCode: string): Promise<PlaySession | null> {
  const code = normaliseCode(rawCode);
  if (!code) return null;

  const row = await prisma.competition.findUnique({
    where: { code },
    select: {
      id: true, code: true, title: true, questionIds: true, secondsPerQuestion: true, status: true,
      focusPolicy: true,
      players: {
        select: {
          userId: true, score: true, totalMs: true, answered: true, finishedAt: true,
          disqualifiedAt: true, disqualifyReason: true,
          lockedAt: true, lockReason: true, lockedById: true,
          user: { select: { name: true } },
        },
      },
    },
  });
  if (!row) return null;

  const me = row.players.find((p) => p.userId === userId);
  if (!me) return null;

  const [questionRows, mine] = await Promise.all([
    prisma.duelQuestion.findMany({
      where: { id: { in: row.questionIds } },
      select: { id: true, topic: true, questionText: true, options: true },
    }),
    prisma.competitionAnswer.findMany({
      where: { competitionId: row.id, userId },
      select: { questionId: true },
    }),
  ]);

  const byId = new Map(questionRows.map((q) => [q.id, q]));
  const questions = row.questionIds
    .map((id) => byId.get(id))
    .filter((q): q is NonNullable<typeof q> => Boolean(q))
    .map((q) => ({ ...q, options: shuffle(q.options) }));

  return {
    competitionId: row.id,
    code: row.code,
    title: row.title,
    secondsPerQuestion: row.secondsPerQuestion,
    questions,
    answeredIds: mine.map((a) => a.questionId),
    standings: rank(
      row.players.map((p) => ({
        userId: p.userId, name: p.user.name, score: p.score,
        totalMs: p.totalMs, answered: p.answered, finished: p.finishedAt !== null,
        disqualified: p.disqualifiedAt !== null,
        disqualifyReason: p.disqualifyReason,
      }))
    ),
    finished: me.finishedAt !== null,
    focusPolicy: row.focusPolicy as "NONE" | "WARN" | "LOCK",
    locked: me.lockedAt !== null,
    lockReason: me.lockReason,
    lockedByHost: me.lockedById != null,
  };
}

/**
 * Record one answer.
 *
 * The clock is the server's: time is measured from the previous answer, or
 * from when play began for the first one. The client is not asked how long it
 * took, because ties break on time and a client that reports its own time will
 * eventually report zero.
 */
export async function answerCompetition(
  userId: string,
  competitionId: string,
  questionId: string,
  chosen: string | null
): Promise<Outcome<{ standings: Ranked[]; answered: number; finished: boolean }>> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { id: true, status: true, questionIds: true, secondsPerQuestion: true, startedAt: true },
  });
  if (!comp) return { ok: false, error: "No such competition." };
  if (comp.status !== CompetitionStatus.RUNNING) {
    return { ok: false, error: "That competition is not running." };
  }
  if (!comp.questionIds.includes(questionId)) {
    return { ok: false, error: "That question is not in this competition." };
  }

  const seat = await prisma.competitionPlayer.findUnique({
    where: { competitionId_userId: { competitionId, userId } },
    select: { id: true, joinedAt: true, lockedAt: true },
  });
  if (!seat) return { ok: false, error: "You are not in this competition." };
  if (seat.lockedAt) return { ok: false, error: "Your paper is paused. Ask the host." };

  const last = await prisma.competitionAnswer.findFirst({
    where: { competitionId, userId },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  const since = last?.createdAt ?? (comp.startedAt && comp.startedAt > seat.joinedAt ? comp.startedAt : seat.joinedAt);
  const cap = comp.secondsPerQuestion * 1000;
  const elapsed = Date.now() - since.getTime();
  const ms = Math.min(Math.max(Number.isFinite(elapsed) ? elapsed : cap, 0), cap);

  const question = await prisma.duelQuestion.findUnique({
    where: { id: questionId },
    select: { correctAnswer: true },
  });
  const isCorrect = typeof chosen === "string" && chosen === question?.correctAnswer;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.competitionAnswer.create({
        // A quiz answer is worth one mark, settled the moment it is given.
        // Written in the same columns a problem uses, so a room's marks are
        // one currency however it was answered.
        data: {
          competitionId, userId, questionId, chosen, isCorrect, ms,
          points: isCorrect ? 1 : 0, maxPoints: 1,
        },
      });
      await tx.competitionPlayer.update({
        where: { competitionId_userId: { competitionId, userId } },
        data: {
          answered: { increment: 1 },
          score: { increment: isCorrect ? 1 : 0 },
          totalMs: { increment: ms },
        },
      });
    });
  } catch (e) {
    // Already answered. The unique index is the guard; scoring twice for one
    // question is exactly what it exists to stop.
    if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) {
      console.error("answerCompetition failed", e);
      return { ok: false, error: "Could not record that answer." };
    }
  }

  const player = await prisma.competitionPlayer.findUnique({
    where: { competitionId_userId: { competitionId, userId } },
    select: { answered: true, finishedAt: true },
  });

  if (player && player.finishedAt === null && player.answered >= comp.questionIds.length) {
    await prisma.competitionPlayer.update({
      where: { competitionId_userId: { competitionId, userId } },
      data: { finishedAt: new Date() },
    });
  }

  const players = await prisma.competitionPlayer.findMany({
    where: { competitionId },
    select: {
      userId: true, score: true, totalMs: true, answered: true, finishedAt: true,
          disqualifiedAt: true, disqualifyReason: true,
      user: { select: { name: true } },
    },
  });

  return {
    ok: true,
    data: {
      standings: rank(
        players.map((p) => ({
          userId: p.userId, name: p.user.name, score: p.score,
          totalMs: p.totalMs, answered: p.answered, finished: p.finishedAt !== null,
        disqualified: p.disqualifiedAt !== null,
        disqualifyReason: p.disqualifyReason,
        }))
      ),
      answered: player?.answered ?? 0,
      finished: (player?.answered ?? 0) >= comp.questionIds.length,
    },
  };
}

/** Live standings on their own, for polling. */
export async function getStandings(competitionId: string): Promise<Ranked[]> {
  const players = await prisma.competitionPlayer.findMany({
    where: { competitionId },
    select: {
      userId: true, score: true, totalMs: true, answered: true, finishedAt: true,
          disqualifiedAt: true, disqualifyReason: true,
      user: { select: { name: true } },
    },
  });
  return rank(
    players.map((p) => ({
      userId: p.userId, name: p.user.name, score: p.score,
      totalMs: p.totalMs, answered: p.answered, finished: p.finishedAt !== null,
        disqualified: p.disqualifiedAt !== null,
        disqualifyReason: p.disqualifyReason,
    }))
  );
}

/**
 * The questions with their answers — only once the whole competition has
 * ended. A player who finishes early is still in a room where others are
 * playing, and handing them the answers hands them to the room.
 */
export async function getCompetitionReview(
  userId: string,
  competitionId: string
): Promise<ReviewLine[] | null> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { status: true, questionIds: true },
  });
  if (!comp || comp.status !== CompetitionStatus.ENDED) return null;

  const [rows, mine] = await Promise.all([
    prisma.duelQuestion.findMany({
      where: { id: { in: comp.questionIds } },
      select: {
        id: true, topic: true, questionText: true, options: true,
        correctAnswer: true, explanation: true,
      },
    }),
    prisma.competitionAnswer.findMany({
      where: { competitionId, userId },
      select: { questionId: true, chosen: true, isCorrect: true, ms: true },
    }),
  ]);

  const byId = new Map(rows.map((r) => [r.id, r]));
  const ordered = comp.questionIds
    .map((id) => byId.get(id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const graded = parseGraded(
    mine.map((a) => ({
      questionId: a.questionId, chosen: a.chosen,
      correctAnswer: "", isCorrect: a.isCorrect, ms: a.ms,
    }))
  );

  // No opponent column here: a competition has a room, not one other player.
  return buildReview(ordered, graded, []);
}
