import { prisma } from "@/lib/prisma";

export interface BoardEntry {
  userId: string;
  rank: number;
  username: string | null;
  profileImage: string | null;
  lessonsCompleted: number;
  totalXP: number;
  isYou: boolean;
}

export interface Standing {
  rank: number | null;
  lessonsCompleted: number;
  totalXP: number;
  totalRanked: number;
}

/**
 * The cron fills LeaderboardRank every 12 hours, but that table has no
 * migration and may not exist in a given database at all — in which case the
 * query throws rather than returning nothing. Either way the board falls back
 * to the same ranking computed live, so it is never blank or broken.
 */
async function rankedUsers(limit: number) {
  let cached: Array<{
    userId: string;
    username: string | null;
    profileImage: string | null;
    lessonsCompleted: number;
    totalXP: number;
    rank: number;
  }> = [];

  try {
    cached = await prisma.leaderboardRank.findMany({
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
  } catch {
    // No LeaderboardRank table here — rank live instead.
    cached = [];
  }

  if (cached.length > 0) {
    try {
      const total = await prisma.leaderboardRank.count();
      return { rows: cached, total, live: false };
    } catch {
      return { rows: cached, total: cached.length, live: false };
    }
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

  const entries: BoardEntry[] = rows.map((r) => ({
    ...r,
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
      totalRanked: total,
    };
  } else if (!live) {
    const mine = await prisma.leaderboardRank
      .findUnique({ where: { userId: currentUserId } })
      .catch(() => null);
    standing = {
      rank: mine?.rank ?? null,
      lessonsCompleted: mine?.lessonsCompleted ?? 0,
      totalXP: mine?.totalXP ?? 0,
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
