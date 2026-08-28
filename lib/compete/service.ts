import { CompetitionStatus, Prisma, StaffPermission } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { actorFor } from "@/lib/staff";
import { can } from "@/lib/permissions";
import { shuffle } from "@/lib/duel/selection";
import { generateCode, normaliseCode } from "./code";
import { rank, progress, type Ranked } from "./scoring";
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
  topic: string | null;
  questionCount: number;
  secondsPerQuestion: number;
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
      host: { select: { name: true } },
      players: {
        select: {
          userId: true, score: true, totalMs: true, answered: true, finishedAt: true,
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
    }))
  );

  return {
    id: row.id,
    code: row.code,
    title: row.title,
    status: row.status,
    access: row.access,
    topic: row.topic,
    questionCount: row.questionIds.length,
    secondsPerQuestion: row.secondsPerQuestion,
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
        host: { select: { name: true } },
        _count: { select: { players: true } },
      },
    }),
  ]);

  const shape = (c: (typeof open)[number]) => ({
    code: c.code,
    title: c.title,
    status: c.status,
    topic: c.topic,
    questionCount: c.questionIds.length,
    hostName: c.host.name,
    players: c._count.players,
  });

  return { open: open.map(shape), mine: mine.map(shape) };
}
