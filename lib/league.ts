/**
 * Leagues are measured in lessons completed, not XP — the curriculum is 56
 * days in eight chapters of seven, so the tiers fall on chapter boundaries.
 *
 * Plain module with no "use client": both the roadmap sidebar (client) and the
 * leaderboard (server) call this.
 */
export interface League {
  name: string;
  /** Lessons needed to enter this league. */
  min: number;
  /** Lessons needed to leave it. */
  max: number;
  next: string | null;
}

export function getLeagueData(lessonsCompleted: number): League {
  if (lessonsCompleted < 7) return { name: "Bronze", min: 0, max: 7, next: "Silver" };
  if (lessonsCompleted < 14) return { name: "Silver", min: 7, max: 14, next: "Gold" };
  if (lessonsCompleted < 28) return { name: "Gold", min: 14, max: 28, next: "Platinum" };
  if (lessonsCompleted < 42) return { name: "Platinum", min: 28, max: 42, next: "Diamond" };
  return { name: "Diamond", min: 42, max: 56, next: null };
}
