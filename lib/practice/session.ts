/**
 * Building a practice session.
 *
 * One page now does what two did. The choice a player makes on it — what kind
 * of question, how closely it is invigilated, how many — decides which engine
 * runs underneath, and one of those engines moves a rating. So the rules live
 * here, pure and tested, rather than being inferred from whichever screen
 * happens to be calling.
 *
 * The rule that matters: **strict multiple choice is the rated duel.** Timed,
 * no going back, solutions at the end — that was already what a duel was. Open
 * practice reveals the answer as you go, which is incompatible with a rating,
 * so it never carries one.
 */

export type SessionType = "MCQ" | "OPEN";
export type SessionMode = "DEFAULT" | "STRICT";

export const LENGTHS = [5, 10, 20] as const;
export const DEFAULT_LENGTH = 10;

/**
 * A rated duel is always ten questions.
 *
 * Not a preference: two players settle a duel by sitting the *same* set, and a
 * set whose size depends on who dealt it cannot be shared.
 */
export const RATED_LENGTH = 10;

/** XP for one correct answer, before the multipliers. */
export const XP_PER_QUESTION = 10;

/** Writing an answer is worth more than choosing one. */
export const OPEN_MULTIPLIER = 2;

/** Under a clock, with no second chances. */
export const STRICT_MULTIPLIER = 1.5;

export interface Setup {
  type: SessionType;
  mode: SessionMode;
  length: number;
  /** Null is every topic. */
  topic: string | null;
}

export const DEFAULT_SETUP: Setup = {
  type: "MCQ",
  mode: "DEFAULT",
  length: DEFAULT_LENGTH,
  topic: null,
};

/**
 * Does this session move the ladder?
 *
 * The one place that decides it. Everything else asks this rather than
 * repeating the condition, because a second copy of it that drifts is a
 * rating that moves when it should not.
 */
export function isRated(setup: Pick<Setup, "type" | "mode">): boolean {
  return setup.type === "MCQ" && setup.mode === "STRICT";
}

/** How many questions this session will actually be. */
export function lengthOf(setup: Setup): number {
  return isRated(setup) ? RATED_LENGTH : setup.length;
}

/** The most XP a session can be worth — every answer right. */
export function maxXp(setup: Setup): number {
  const multiplier =
    (setup.type === "OPEN" ? OPEN_MULTIPLIER : 1) *
    (setup.mode === "STRICT" ? STRICT_MULTIPLIER : 1);

  return Math.round(lengthOf(setup) * XP_PER_QUESTION * multiplier);
}

/** XP actually earned, from what was right. */
export function xpEarned(setup: Setup, correct: number): number {
  const length = lengthOf(setup);
  const capped = Math.min(Math.max(0, Math.floor(correct) || 0), length);
  return Math.round((maxXp(setup) * capped) / length);
}

/** Roughly how long it will take, in minutes. */
export function estimateMinutes(setup: Setup): number {
  const perQuestion = setup.type === "OPEN" ? 4 : 1.5;
  return Math.max(1, Math.round(lengthOf(setup) * perQuestion));
}

/**
 * How long the clock runs in a strict session, in milliseconds.
 *
 * Generous rather than tight: the clock is there to stop a browser tab being
 * left open for a day with an answer half typed, not to measure typing speed.
 */
export function strictMs(setup: Setup): number | null {
  if (setup.mode !== "STRICT") return null;
  return estimateMinutes(setup) * 2 * 60_000;
}

export const MODE_NOTE: Record<SessionMode, string> = {
  DEFAULT:
    "No clock, and the worked solution shows right after each answer. Nothing counts towards your rating.",
  STRICT: "Timed, no going back, and solutions only at the end.",
};

/** What the session line says it is. */
export function describe(setup: Setup): string {
  const kind = setup.type === "OPEN" ? "Open-ended" : "Multiple choice";
  const mode = setup.mode === "STRICT" ? "Strict" : "Default";
  const n = lengthOf(setup);
  return `${kind} · ${mode} · ${n} ${n === 1 ? "problem" : "problems"}`;
}

/**
 * Read a setup off the wire.
 *
 * A server action is a public endpoint: everything here arrives as `unknown`
 * and anything unrecognised falls back to the unrated, unclocked default. A
 * misspelt mode must never buy somebody a rated run on their own terms.
 */
export function parseSetup(raw: unknown): Setup {
  const o = (raw ?? {}) as Record<string, unknown>;

  const type: SessionType = o.type === "OPEN" ? "OPEN" : "MCQ";
  const mode: SessionMode = o.mode === "STRICT" ? "STRICT" : "DEFAULT";

  const asked = Number(o.length);
  const length = (LENGTHS as readonly number[]).includes(asked) ? asked : DEFAULT_LENGTH;

  const topic =
    typeof o.topic === "string" && o.topic.trim() ? o.topic.trim().slice(0, 60) : null;

  return { type, mode, length, topic };
}
