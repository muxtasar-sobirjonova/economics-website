import { Prisma, Track } from "@prisma/client";

type StreakDb = Pick<Prisma.TransactionClient, "trackProgress">;

/**
 * Records study activity for today and returns the resulting streak.
 *
 * Nothing used to write `streak`, so "Current Streak" was permanently stuck at
 * 0 days. Any completed agenda item (concept, article or quiz attempt) now
 * counts as activity for the day.
 */
export async function touchStreak(db: StreakDb, userId: string, track: Track): Promise<number> {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setUTCDate(today.getUTCDate() - 1);

  const progress = await db.trackProgress.findUnique({
    where: { userId_track: { userId, track } }
  });

  let lastActive: Date | null = null;
  if (progress?.lastActive) {
    lastActive = new Date(progress.lastActive);
    lastActive.setUTCHours(0, 0, 0, 0);
  }

  const previousStreak = progress?.streak ?? 0;
  let streak: number;

  if (lastActive && lastActive.getTime() === today.getTime()) {
    streak = Math.max(previousStreak, 1); // already counted today
  } else if (lastActive && lastActive.getTime() === yesterday.getTime()) {
    streak = previousStreak + 1;
  } else {
    streak = 1; // first day, or the chain was broken
  }

  await db.trackProgress.upsert({
    where: { userId_track: { userId, track } },
    update: { streak, lastActive: today },
    create: { userId, track, streak, lastActive: today }
  });

  return streak;
}
