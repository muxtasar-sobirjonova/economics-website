import { CompetitionStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  judge, noticeFor, parseAwayLog, appendAway,
  type FocusPolicy, type FocusVerdict,
} from "./focus";
import type { Outcome } from "./service";

/**
 * Recording that someone left their paper.
 *
 * **The duration is the client's, and it cannot be otherwise.** Only the page
 * knows when it lost focus; the server never sees it happen. A patched client
 * can report nothing at all, and this will believe it. That is a real limit
 * and it is written here rather than hidden: this catches the cheap routes —
 * a second tab, a minimised window, a pasted answer — and it is evidence for
 * a host, never proof.
 *
 * What the server does keep is the *time*. `at` is stamped on arrival rather
 * than taken from the report, so the timeline a host reads is one this machine
 * observed even when the duration beside it was not.
 */

export interface FocusState {
  policy: FocusPolicy;
  verdict: FocusVerdict;
  notice: string | null;
}

/** Under this, a report is a rounding error rather than an absence. */
const IGNORE_BELOW_MS = 400;

/**
 * Prisma's Json input wants a shape with an index signature, which a named
 * interface does not have. Rebuilt as plain objects rather than cast through
 * `unknown`, so the thing written is still the thing that was checked.
 */
function asJson(log: { at: number; ms: number }[]): Prisma.InputJsonValue {
  return log.map((e) => ({ at: e.at, ms: e.ms }));
}

export async function reportAway(
  userId: string,
  competitionId: string,
  ms: unknown
): Promise<Outcome<FocusState>> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { status: true, focusPolicy: true, focusAllowance: true },
  });
  if (!comp) return { ok: false, error: "No such competition." };

  const seat = await prisma.competitionPlayer.findUnique({
    where: { competitionId_userId: { competitionId, userId } },
    select: { awayLog: true, finishedAt: true, lockedAt: true },
  });
  if (!seat) return { ok: false, error: "You are not in this competition." };

  const policy = comp.focusPolicy as FocusPolicy;
  const log = parseAwayLog(seat.awayLog);

  // Nothing is watched, the paper is in, or it is already frozen: the report
  // is still refused politely rather than written, because a finished paper's
  // record should not keep growing while its author reads the results page.
  const idle =
    policy === "NONE" ||
    comp.status !== CompetitionStatus.RUNNING ||
    seat.finishedAt !== null;

  if (idle) {
    const verdict = judge(log, policy, comp.focusAllowance);
    return { ok: true, data: { policy, verdict, notice: null } };
  }

  const reported = typeof ms === "number" ? ms : Number(ms);
  const duration = Number.isFinite(reported) ? reported : 0;

  const next =
    duration < IGNORE_BELOW_MS
      ? log
      : appendAway(log, { at: Date.now(), ms: duration });

  const verdict = judge(next, policy, comp.focusAllowance);

  await prisma.competitionPlayer.update({
    where: { competitionId_userId: { competitionId, userId } },
    data: {
      awayLog: asJson(next),
      awayCount: next.length,
      awayMs: verdict.awayMs,
      // Set once. A paper already frozen is not frozen harder, and the host
      // needs the moment it happened rather than the moment of the last blip.
      ...(verdict.locked && seat.lockedAt === null ? { lockedAt: new Date() } : {}),
    },
  });

  return { ok: true, data: { policy, verdict, notice: noticeFor(verdict, policy) } };
}

/** Where a player stands, without writing anything. For rendering the page. */
export async function focusStateFor(
  userId: string,
  competitionId: string
): Promise<FocusState & { lockedAt: Date | null }> {
  const [comp, seat] = await Promise.all([
    prisma.competition.findUnique({
      where: { id: competitionId },
      select: { focusPolicy: true, focusAllowance: true },
    }),
    prisma.competitionPlayer.findUnique({
      where: { competitionId_userId: { competitionId, userId } },
      select: { awayLog: true, lockedAt: true },
    }),
  ]);

  const policy = (comp?.focusPolicy ?? "NONE") as FocusPolicy;
  const log = parseAwayLog(seat?.awayLog);
  const verdict = judge(log, policy, comp?.focusAllowance ?? 0);

  return {
    policy,
    verdict,
    notice: noticeFor(verdict, policy),
    // The stored lock wins over a fresh verdict: a host who let someone back
    // in has cleared it, and recomputing from a log that still holds the old
    // strikes would lock them again on the next render.
    lockedAt: seat?.lockedAt ?? null,
  };
}

export interface FocusRow {
  userId: string;
  name: string | null;
  strikes: number;
  total: number;
  awayMs: number;
  locked: boolean;
  /** Most recent first, so the host reads what just happened. */
  log: { at: number; ms: number }[];
}

/** The record, for the host. Everyone in the room, worst first. */
export async function focusRecord(
  hostId: string,
  competitionId: string
): Promise<{ policy: FocusPolicy; rows: FocusRow[] } | null> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { hostId: true, focusPolicy: true, focusAllowance: true },
  });
  if (!comp || comp.hostId !== hostId) return null;

  const players = await prisma.competitionPlayer.findMany({
    where: { competitionId },
    select: {
      userId: true, awayLog: true, lockedAt: true,
      user: { select: { name: true } },
    },
  });

  const policy = comp.focusPolicy as FocusPolicy;

  const rows = players
    .map((p) => {
      const log = parseAwayLog(p.awayLog);
      const verdict = judge(log, policy, comp.focusAllowance);
      return {
        userId: p.userId,
        name: p.user.name,
        strikes: verdict.strikes,
        total: verdict.total,
        awayMs: verdict.awayMs,
        locked: p.lockedAt !== null,
        log: [...log].reverse().slice(0, 20),
      };
    })
    // Worst first: the host is looking for who to talk to, not for a register.
    .sort((a, b) => b.awayMs - a.awayMs || b.total - a.total);

  return { policy, rows };
}

/**
 * Letting someone carry on.
 *
 * Clears the lock and the record it was built from. Both, deliberately: a lock
 * cleared while the strikes remain would snap shut again on the next absence,
 * and a host who said "carry on" meant it.
 */
export async function unlockPlayer(
  hostId: string,
  competitionId: string,
  playerId: string
): Promise<Outcome<null>> {
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { hostId: true },
  });
  if (!comp || comp.hostId !== hostId) return { ok: false, error: "Not your competition." };

  try {
    await prisma.competitionPlayer.update({
      where: { competitionId_userId: { competitionId, userId: playerId } },
      data: { lockedAt: null, awayLog: [], awayCount: 0, awayMs: 0 },
    });
    return { ok: true, data: null };
  } catch (e) {
    console.error("unlockPlayer failed", e);
    return { ok: false, error: "Could not let them back in." };
  }
}

/** Refuse to write while a paper is frozen. Checked on the server, not the page. */
export async function isLocked(userId: string, competitionId: string): Promise<boolean> {
  const seat = await prisma.competitionPlayer.findUnique({
    where: { competitionId_userId: { competitionId, userId } },
    select: { lockedAt: true },
  });
  return seat?.lockedAt != null;
}
