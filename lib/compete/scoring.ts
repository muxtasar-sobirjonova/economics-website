/**
 * Standings inside one competition.
 *
 * Deliberately the same rule as a duel — more correct answers wins, ties go to
 * the faster total — so a player never has to learn two scoring systems.
 * Unrated: nothing here touches Elo.
 */

export interface Standing {
  userId: string;
  name: string | null;
  score: number;
  totalMs: number;
  answered: number;
  finished: boolean;
}

export interface Ranked extends Standing {
  rank: number;
}

/**
 * Ranks share a number when they are genuinely level, and the next rank skips
 * accordingly — two firsts are followed by a third, not a second.
 */
export function rank(players: Standing[]): Ranked[] {
  const sorted = [...players].sort(
    (a, b) =>
      b.score - a.score ||
      a.totalMs - b.totalMs ||
      (a.name ?? "").localeCompare(b.name ?? "")
  );

  const out: Ranked[] = [];
  let lastRank = 0;
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    const level = prev && prev.score === p.score && prev.totalMs === p.totalMs;
    lastRank = level ? lastRank : i + 1;
    out.push({ ...p, rank: lastRank });
  });
  return out;
}

/** Progress across everyone, for the host's view. */
export function progress(players: Standing[], questionCount: number) {
  const total = players.length;
  const finished = players.filter((p) => p.finished).length;
  const answers = players.reduce((sum, p) => sum + p.answered, 0);
  return {
    total,
    finished,
    playing: total - finished,
    /** 0–1 across the whole room. */
    completion: total * questionCount > 0 ? answers / (total * questionCount) : 0,
  };
}
