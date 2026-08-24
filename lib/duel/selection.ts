/**
 * Choosing the ten questions a duel is played over.
 *
 * Pure, with the random source injected so the rule can be tested.
 */

export type Rng = () => number;

/** Fisher–Yates, on a copy. */
export function shuffle<T>(items: T[], rng: Rng = Math.random): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface Selection {
  ids: string[];
  /** True when the bank was too small to fill the set with unseen questions. */
  reused: boolean;
}

/**
 * Unseen questions first. A player who has exhausted the bank still gets a
 * duel — refusing to start would be worse — but the caller is told, because a
 * duel over questions one side has already answered is not a fair rating
 * event and should eventually be flagged as such.
 */
export function pickQuestionIds(
  activeIds: string[],
  seenIds: string[],
  count: number,
  rng: Rng = Math.random
): Selection {
  const seen = new Set(seenIds);
  const unseen = activeIds.filter((id) => !seen.has(id));

  if (unseen.length >= count) {
    return { ids: shuffle(unseen, rng).slice(0, count), reused: false };
  }

  const topUp = shuffle(
    activeIds.filter((id) => seen.has(id)),
    rng
  ).slice(0, count - unseen.length);

  return { ids: shuffle([...unseen, ...topUp], rng), reused: topUp.length > 0 };
}
