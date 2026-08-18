/**
 * League thresholds, in a plain module so both the roadmap sidebar (a client
 * component) and the leaderboard (a server component) can use them. Exporting
 * it from a "use client" file made every server-side call throw.
 */
export interface League {
  name: string;
  min: number;
  max: number;
  next: string | null;
}

export function getLeagueData(totalXP: number): League {
  if (totalXP < 100) return { name: "Bronze", min: 0, max: 100, next: "Silver" };
  if (totalXP < 250) return { name: "Silver", min: 100, max: 250, next: "Gold" };
  if (totalXP < 500) return { name: "Gold", min: 250, max: 500, next: "Platinum" };
  if (totalXP < 1000) return { name: "Platinum", min: 500, max: 1000, next: "Diamond" };
  return { name: "Diamond", min: 1000, max: 1000, next: null };
}
