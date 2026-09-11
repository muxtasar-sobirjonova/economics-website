/**
 * Watching whether someone stayed on the page.
 *
 * What this can and cannot do is worth writing down once, because the whole
 * design follows from it.
 *
 * **It cannot stop anyone cheating.** A student with a phone beside the laptop
 * can ask a model anything, and no code that runs in a browser will ever see
 * that. Treating this as enforcement would be a lie told to a teacher.
 *
 * **It can make leaving the page visible and expensive.** Switching tabs,
 * minimising, and pasting an answer in are the cheap routes, and those are the
 * ones most people take. Every one of them is recorded with a time and a
 * duration, and the host reads the record beside the paper.
 *
 * Two rules exist because the alternative is worse than the problem:
 *
 * 1. **A brief loss of focus is not a strike.** A notification, an incoming
 *    call, a screen lock and an OS dialog all look exactly like switching to
 *    another window. Ending a forty-five minute paper over a Telegram message
 *    would be far worse than the cheating it was meant to catch, so only an
 *    absence longer than `STRIKE_AFTER_MS` counts against anyone. Shorter ones
 *    are still recorded — the host sees "left 14 times" even when not one of
 *    them was a strike.
 *
 * 2. **Being locked is not being finished.** A locked paper freezes; it is not
 *    submitted. The host can let someone carry on, and they resume where they
 *    were. A lock nobody can undo turns one accident into a lost exam.
 */

export type FocusPolicy =
  /** Not watched at all. */
  | "NONE"
  /** Recorded, and the student is told it was seen. Nothing freezes. */
  | "WARN"
  /** Recorded, and the paper freezes once the allowance is used up. */
  | "LOCK";

/** Below this, an absence is a notification rather than a decision. */
export const STRIKE_AFTER_MS = 10_000;

/** A client that wants to grow a row without limit gets this far and no further. */
export const MAX_LOG = 200;

/** Nobody is away for six hours; anything longer is a closed laptop. */
export const MAX_AWAY_MS = 6 * 60 * 60 * 1000;

export interface AwayEvent {
  /** When they left, epoch milliseconds, as the server saw it. */
  at: number;
  /** How long they were gone. */
  ms: number;
}

export interface FocusVerdict {
  /** Absences long enough to count. */
  strikes: number;
  /** Every absence, however brief. */
  total: number;
  awayMs: number;
  locked: boolean;
  /** Strikes still allowed before the paper freezes. Infinity when it cannot. */
  remaining: number;
}

/**
 * The log is a Json column, which means it is a column anything could be in
 * after a bad write or a hand edit. Parsed defensively rather than cast.
 */
export function parseAwayLog(value: unknown): AwayEvent[] {
  if (!Array.isArray(value)) return [];

  const out: AwayEvent[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const e = raw as Record<string, unknown>;
    const at = typeof e.at === "number" && Number.isFinite(e.at) ? e.at : null;
    const ms = typeof e.ms === "number" && Number.isFinite(e.ms) ? e.ms : null;
    if (at === null || ms === null) continue;
    out.push({ at, ms: Math.min(Math.max(Math.round(ms), 0), MAX_AWAY_MS) });
  }
  return out.slice(-MAX_LOG);
}

/** One more absence on the record, oldest dropped once the cap is reached. */
export function appendAway(log: AwayEvent[], event: AwayEvent): AwayEvent[] {
  const ms = Number.isFinite(event.ms) ? Math.min(Math.max(Math.round(event.ms), 0), MAX_AWAY_MS) : 0;
  const at = Number.isFinite(event.at) ? event.at : Date.now();
  return [...log, { at, ms }].slice(-MAX_LOG);
}

export function judge(
  log: AwayEvent[],
  policy: FocusPolicy,
  allowance: number
): FocusVerdict {
  const strikes = log.filter((e) => e.ms >= STRIKE_AFTER_MS).length;
  const awayMs = log.reduce((sum, e) => sum + e.ms, 0);

  if (policy !== "LOCK") {
    return { strikes, total: log.length, awayMs, locked: false, remaining: Infinity };
  }

  // A negative or nonsense allowance would lock a room on its first blink.
  const allowed = Number.isFinite(allowance) ? Math.max(0, Math.round(allowance)) : 0;

  return {
    strikes,
    total: log.length,
    awayMs,
    locked: strikes > allowed,
    remaining: Math.max(0, allowed - strikes),
  };
}

/**
 * Why the guard stopped someone, in the words they will read.
 *
 * Written by the machine, so it states what was observed and nothing more.
 * A host stopping someone by hand writes their own reason instead.
 */
export function lockReasonFor(verdict: FocusVerdict): string {
  const times = verdict.strikes === 1 ? "once" : `${verdict.strikes} times`;
  return `Left the page ${times} while the paper was running.`;
}

/** What the student is told when they come back. Never accusing — reporting. */
export function noticeFor(verdict: FocusVerdict, policy: FocusPolicy): string | null {
  if (policy === "NONE" || verdict.strikes === 0) return null;

  if (verdict.locked) {
    return "Your paper is paused because you left it. Nothing you wrote is lost — ask the host to let you carry on.";
  }

  if (policy === "WARN") {
    return verdict.strikes === 1
      ? "You left this page. The host can see that."
      : `You have left this page ${verdict.strikes} times. The host can see that.`;
  }

  return verdict.remaining === 0
    ? "You left this page. Leaving it again pauses your paper."
    : `You left this page. ${verdict.remaining} more and your paper pauses.`;
}
