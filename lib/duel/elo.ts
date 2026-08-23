/**
 * Rating maths for duel mode.
 *
 * Standard Elo with one adjustment: a player's first ten duels move their
 * rating twice as hard. Without it a genuinely strong newcomer needs forty
 * games to reach their real rating, which is the difference between a ladder
 * that feels responsive and one that feels broken.
 *
 * Pure functions, no database and no Prisma import — the duel engine and the
 * tests both call these, and they must stay cheap enough to call in a loop.
 */

export const START_RATING = 1000;
export const PROVISIONAL_GAMES = 10;
export const K_PROVISIONAL = 40;
export const K_ESTABLISHED = 20;

/** 1 for a win, 0.5 for a draw, 0 for a loss. */
export type Score = 1 | 0.5 | 0;

export interface RunResult {
  /** Correct answers out of the set. */
  score: number;
  /** Total time across the run, the tiebreak on equal scores. */
  totalMs: number;
}

export function kFactor(played: number): number {
  return played < PROVISIONAL_GAMES ? K_PROVISIONAL : K_ESTABLISHED;
}

/** The share of a point a player of this rating is expected to take. */
export function expectedScore(rating: number, opponentRating: number): number {
  return 1 / (1 + Math.pow(10, (opponentRating - rating) / 400));
}

/**
 * Who won, from A's side.
 *
 * More correct answers wins. On a tie, the faster run wins — speed is a
 * tiebreak rather than points on purpose: a scoring rule a player cannot
 * compute in their head is a scoring rule they will not trust.
 */
export function outcome(a: RunResult, b: RunResult): Score {
  if (a.score !== b.score) return a.score > b.score ? 1 : 0;
  if (a.totalMs !== b.totalMs) return a.totalMs < b.totalMs ? 1 : 0;
  return 0.5;
}

/**
 * How far a rating moves. Rounded away from zero so a decided duel always
 * shifts the ladder by at least a point — a win worth +0 reads as a bug.
 */
export function ratingDelta(
  rating: number,
  opponentRating: number,
  played: number,
  score: Score
): number {
  const raw = kFactor(played) * (score - expectedScore(rating, opponentRating));
  if (raw === 0) return 0;
  const rounded = Math.round(Math.abs(raw));
  return Math.sign(raw) * Math.max(rounded, score === 0.5 ? 0 : 1);
}

export interface Side {
  rating: number;
  played: number;
  result: RunResult;
}

export interface Resolution {
  /** "A", "B", or null for a draw. */
  winner: "A" | "B" | null;
  deltaA: number;
  deltaB: number;
  ratingA: number;
  ratingB: number;
}

/**
 * Settle one duel. Both deltas are computed from the ratings as they stand
 * now, before either is written — otherwise whichever player is updated first
 * would change the other's result.
 */
export function resolveDuel(a: Side, b: Side): Resolution {
  const scoreA = outcome(a.result, b.result);
  const scoreB = (1 - scoreA) as Score;

  const deltaA = ratingDelta(a.rating, b.rating, a.played, scoreA);
  const deltaB = ratingDelta(b.rating, a.rating, b.played, scoreB);

  return {
    winner: scoreA === 1 ? "A" : scoreA === 0 ? "B" : null,
    deltaA,
    deltaB,
    ratingA: a.rating + deltaA,
    ratingB: b.rating + deltaB,
  };
}
