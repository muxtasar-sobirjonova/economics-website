import { prisma } from "@/lib/prisma";

export interface BoardEntry {
  userId: string;
  rank: number;
  username: string | null;
  profileImage: string | null;
  lessonsCompleted: number;
  totalXP: number;
  weeklyXP: number;
  isYou: boolean;
}

export interface Standing {
  rank: number | null;
  lessonsCompleted: number;
  totalXP: number;
  weeklyXP: number;
  totalRanked: number;
}

/** Monday 00:00 UTC of the current week — the same boundary the dashboard uses. */
function weekStart(): Date {
  const now = new Date();
  const jsDay = now.getUTCDay();
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - (jsDay === 0 ? 6 : jsDay - 1));
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

/** XP earned since Monday, per user, summed across tracks. */
async function weeklyXpFor(userIds: string[]): Promise<Record<string, number>> {
  if (userIds.length === 0) return {};
  const rows = await prisma.quizResult.groupBy({
    by: ["userId"],
    where: { userId: { in: userIds }, date: { gte: weekStart() } },
    _sum: { xpEarned: true },
  });
  const out: Record<string, number> = {};
  rows.forEach((r) => {
    out[r.userId] = r._sum.xpEarned ?? 0;
  });
  return out;
}

/**
 * The cron fills LeaderboardRank every 12 hours. If it has not run yet the
 * board would look empty while users clearly exist, so fall back to the same
 * ranking computed live.
 */
async function rankedUsers(limit: number) {
  const cached = await prisma.leaderboardRank.findMany({
    orderBy: { rank: "asc" },
    take: limit,
    select: {
      userId: true,
      username: true,
      profileImage: true,
      lessonsCompleted: true,
      totalXP: true,
      rank: true,
    },
  });

  if (cached.length > 0) {
    const total = await prisma.leaderboardRank.count();
    return { rows: cached, total, live: false };
  }

  const users = await prisma.user.findMany({
    where: { lessonsCompleted: { gt: 0 }, deletedAt: null },
    orderBy: [
      { lessonsCompleted: "desc" },
      { lastLessonCompletedAt: "asc" },
      { createdAt: "asc" },
    ],
    take: limit,
    select: {
      id: true,
      name: true,
      image: true,
      lessonsCompleted: true,
      progress: { select: { totalXP: true } },
    },
  });

  const total = await prisma.user.count({
    where: { lessonsCompleted: { gt: 0 }, deletedAt: null },
  });

  return {
    rows: users.map((u, i) => ({
      userId: u.id,
      username: u.name,
      profileImage: u.image,
      lessonsCompleted: u.lessonsCompleted,
      totalXP: u.progress?.totalXP ?? 0,
      rank: i + 1,
    })),
    total,
    live: true,
  };
}

export async function getLeaderboard(currentUserId: string, limit = 10) {
  const { rows, total, live } = await rankedUsers(limit);

  const ids = rows.map((r) => r.userId);
  if (!ids.includes(currentUserId)) ids.push(currentUserId);
  const weekly = await weeklyXpFor(ids);

  const entries: BoardEntry[] = rows.map((r) => ({
    ...r,
    weeklyXP: weekly[r.userId] ?? 0,
    isYou: r.userId === currentUserId,
  }));

  // The current user's own standing, whether or not they made the top slice.
  const inSlice = entries.find((e) => e.isYou);
  let standing: Standing;

  if (inSlice) {
    standing = {
      rank: inSlice.rank,
      lessonsCompleted: inSlice.lessonsCompleted,
      totalXP: inSlice.totalXP,
      weeklyXP: inSlice.weeklyXP,
      totalRanked: total,
    };
  } else if (!live) {
    const mine = await prisma.leaderboardRank.findUnique({ where: { userId: currentUserId } });
    standing = {
      rank: mine?.rank ?? null,
      lessonsCompleted: mine?.lessonsCompleted ?? 0,
      totalXP: mine?.totalXP ?? 0,
      weeklyXP: weekly[currentUserId] ?? 0,
      totalRanked: total,
    };
  } else {
    const me = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { lessonsCompleted: true, progress: { select: { totalXP: true } } },
    });
    const ahead = me && me.lessonsCompleted > 0
      ? await prisma.user.count({
          where: {
            deletedAt: null,
            lessonsCompleted: { gt: me.lessonsCompleted },
          },
        })
      : null;
    standing = {
      rank: ahead === null ? null : ahead + 1,
      lessonsCompleted: me?.lessonsCompleted ?? 0,
      totalXP: me?.progress?.totalXP ?? 0,
      weeklyXP: weekly[currentUserId] ?? 0,
      totalRanked: total,
    };
  }

  return {
    podium: entries.slice(0, 3),
    rest: entries.slice(3),
    standing,
    totalRanked: total,
  };
}
