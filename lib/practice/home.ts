import { prisma } from "@/lib/prisma";
import { getDuelLadder } from "@/lib/duel/engine";
import { getPracticeOverview, type PracticeOverview } from "@/lib/compete/practiceService";
import { startOfDay } from "@/lib/compete/practice";
import type { LadderRow, XpRow } from "@/components/practice/Ladder";

/**
 * Everything the practice page draws, in one place.
 *
 * Each piece is allowed to fail on its own. The ladder and the chips are
 * reference data, and a fault in either must not cost the player the page they
 * came to use — which is the rule the duel page already followed for the same
 * reason.
 */

export interface TopicCount {
  topic: string;
  total: number;
}

/**
 * Questions a day the page sets as a target.
 *
 * A number, not a setting. `UserProgress.dailyTimeGoal` is sixty minutes and
 * means something else; reusing it would have made the tile read as minutes
 * while counting questions.
 */
export const DAILY_GOAL = 10;

export interface PracticeHome {
  streak: number;
  weeklyXp: number;
  dailyGoal: number;
  /** Questions answered today, across both banks. */
  solvedToday: number;
  /** Place on the board, or null for somebody not on it yet. */
  rank: number | null;
  /** Multiple-choice topics, with how many questions each has. */
  mcqTopics: TopicCount[];
  mcqPool: number;
  /** Written-problem topics and how many are left for this player. */
  overview: PracticeOverview;
  ladder: LadderRow[];
  xp: XpRow[];
  myRating: number | null;
}

async function mcqTopics(): Promise<TopicCount[]> {
  const rows = await prisma.duelQuestion.groupBy({
    by: ["topic"],
    where: { active: true },
    _count: { _all: true },
  });

  return rows
    .map((r) => ({ topic: r.topic, total: r._count._all }))
    .sort((a, b) => a.topic.localeCompare(b.topic));
}

export async function getPracticeHome(userId: string): Promise<PracticeHome> {
  const empty: PracticeHome = {
    streak: 0,
    weeklyXp: 0,
    dailyGoal: 10,
    solvedToday: 0,
    rank: null,
    mcqTopics: [],
    mcqPool: 0,
    overview: await getPracticeOverview(userId),
    ladder: [],
    xp: [],
    myRating: null,
  };

  const since = startOfDay(new Date());

  const [progress, topics, pool, ladder, rating, board, written, runs, mine] = await Promise.all([
    prisma.userProgress.findUnique({
      where: { userId },
      select: { streak: true, totalXP: true },
    }).catch(() => null),
    mcqTopics().catch(() => [] as TopicCount[]),
    prisma.duelQuestion.count({ where: { active: true } }).catch(() => 0),
    getDuelLadder(10).catch(() => []),
    prisma.playerRating
      .findUnique({ where: { userId }, select: { rating: true } })
      .catch(() => null),
    prisma.leaderboardRank
      .findMany({
        orderBy: { rank: "asc" },
        take: 10,
        select: { userId: true, username: true, totalXP: true, rank: true },
      })
      .catch(() => []),
    // Both banks count towards the day: a question is a question.
    prisma.problemAttempt
      .count({ where: { userId, createdAt: { gte: since } } })
      .catch(() => 0),
    prisma.duelRun
      .findMany({
        where: { userId, finishedAt: { gte: since } },
        select: { set: { select: { questionIds: true } } },
      })
      .catch(() => []),
    prisma.leaderboardRank
      .findUnique({ where: { userId }, select: { rank: true } })
      .catch(() => null),
  ]);

  return {
    ...empty,
    streak: progress?.streak ?? 0,
    weeklyXp: progress?.totalXP ?? 0,
    solvedToday: written + runs.reduce((n, r) => n + r.set.questionIds.length, 0),
    rank: mine?.rank ?? null,
    mcqTopics: topics,
    mcqPool: pool,
    ladder: ladder.map((r) => ({
      userId: r.userId,
      name: r.user.name,
      rating: r.rating,
      played: r.played,
      won: r.won,
      me: r.userId === userId,
    })),
    xp: board.map((r) => ({
      userId: r.userId,
      name: r.username,
      totalXP: r.totalXP,
      rank: r.rank,
      me: r.userId === userId,
    })),
    myRating: rating?.rating ?? null,
  };
}
