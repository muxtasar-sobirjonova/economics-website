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
  /** The host's verdict after the room ended. Ranked last, never removed. */
  disqualified?: boolean;
  disqualifyReason?: string | null;
}

export interface Ranked extends Standing {
  rank: number;
}

/**
 * Accuracy: marks won against marks attempted.
 *
 * The third tie-breaker. Two players level on score and on the clock are
 * separated by who guessed less — answering four and getting four beats
 * answering ten and getting four, on the same total. Nobody who answered
 * nothing has accuracy; they sort last among equals rather than first, which
 * a naive 0/0 = 1 would do.
 */
export function accuracy(p: Pick<Standing, "score" | "answered">): number {
  return p.answered > 0 ? p.score / p.answered : 0;
}

/**
 * Ranks share a number when they are genuinely level, and the next rank skips
 * accordingly — two firsts are followed by a third, not a second.
 */
export function rank(players: Standing[]): Ranked[] {
  const sorted = [...players].sort(
    (a, b) =>
      // Disqualified goes to the bottom whatever it scored — that is the
      // point of it — but stays on the board. Removing the row would remove
      // the evidence for the decision along with it.
      Number(a.disqualified ?? false) - Number(b.disqualified ?? false) ||
      b.score - a.score ||
      a.totalMs - b.totalMs ||
      accuracy(b) - accuracy(a) ||
      (a.name ?? "").localeCompare(b.name ?? "")
  );

  const out: Ranked[] = [];
  let lastRank = 0;
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    // Two disqualified players are not "level" with each other in any sense
    // worth printing a shared rank for.
    const level =
      prev &&
      !p.disqualified &&
      !prev.disqualified &&
      prev.score === p.score &&
      prev.totalMs === p.totalMs &&
      accuracy(prev) === accuracy(p);
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
