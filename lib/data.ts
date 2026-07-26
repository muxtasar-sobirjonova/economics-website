import { Track } from "@prisma/client";




export const LESSON_CONCEPTS: { [key: number]: string } = {
  1: "Understand what entrepreneurship economics is, why entrepreneurs exist, and how businesses create, deliver, and capture value in the economy.",
  2: "Explore why entrepreneurs exist to solve inefficiencies and fill gaps that large incumbents ignore or cannot see.",
  3: "Discover how to identify true economic opportunities by distinguishing simple problems from profitable solutions.",
  4: "Learn the core economic drivers behind consumer behavior and why customers choose one product over another.",
  5: "Analyze the mechanisms of value creation, delivery, and how to effectively capture a share of that value.",
  6: "Examine how profit drives incentives and shapes the daily decision-making process of successful entrepreneurs.",

  8: "Understand the fundamental economic problem of having seemingly unlimited human wants in a world of limited resources.",
  9: "Learn what a trade-off is and how to weigh the expected value and opportunity cost of each choice.",
  10: "Discover Opportunity Cost, the potential benefit you lose when you choose one alternative over another.",
  11: "Understand Capital Scarcity and how budgeting forces prioritization and extends a startup's runway.",
  12: "Explore Time Scarcity, the entrepreneur's only true asset, and how delegation reclaims it.",
  13: "Learn about Sunk Costs, the fallacy of letting unrecoverable past costs influence your future decision-making.",
};
import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { CacheService } from "./cache";
import { Lesson, Quiz } from "@prisma/client";

export const getLessons = cache(async (track: Track = "ENTREPRENEURSHIP_ECONOMICS") => {
  const cacheKey = `lessons:${track}`;
  let lessons = await CacheService.get<Lesson[]>(cacheKey);
  
  if (!lessons) {
    lessons = await prisma.lesson.findMany({
      where: { track },
      orderBy: { dayOrder: 'asc' }
    });
    await CacheService.set(cacheKey, lessons, 3600); // cache for 1 hour
  }
  return lessons;
});

export const getQuizzes = cache(async (track: Track = "ENTREPRENEURSHIP_ECONOMICS") => {
  const cacheKey = `quizzes:${track}`;
  let quizzes = await CacheService.get<Quiz[]>(cacheKey);

  if (!quizzes) {
    quizzes = await prisma.quiz.findMany({
      where: { track },
      orderBy: { dayOrder: 'asc' }
    });
    await CacheService.set(cacheKey, quizzes, 3600); // cache for 1 hour
  }
  return quizzes;
});

export const getUserRoadmapProgress = async (userId: string, track: Track) => {
  const cacheKey = `user_roadmap_progress:${userId}:${track}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data = await CacheService.get<any>(cacheKey);

  if (!data) {
    const [user, trackProgress] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          activeTrack: true,
          completedLessons: {
            where: { track }
          },
          quizResults: {
            where: { track }
          },
        },
      }),
      prisma.trackProgress.findUnique({
        where: { userId_track: { userId, track } }
      })
    ]);

    data = { user, trackProgress };
    await CacheService.set(cacheKey, data, 300); // cache for 5 minutes
  }

  return data;
};

export const invalidateUserCache = async (userId: string, track: Track) => {
  await CacheService.delete(`user_roadmap_progress:${userId}:${track}`);
  await CacheService.delete(`user_dashboard_data:${userId}:${track}`);
};

export const getUserDashboardData = async (userId: string, track: Track, currentDay: number) => {
  const cacheKey = `user_dashboard_data:${userId}:${track}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data = await CacheService.get<any>(cacheKey);

  if (!data) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const localDate = new Date();
    const jsDay = localDate.getUTCDay();
    const todayIndex = jsDay === 0 ? 6 : jsDay - 1;
    const monday = new Date(localDate);
    monday.setUTCDate(localDate.getUTCDate() - todayIndex);
    monday.setUTCHours(0, 0, 0, 0);

    const [
      recentLessons, 
      recentCompletions, 
      upcomingLessons, 
      upcomingQuizzes,
      weeklyQuizzesAgg,
      quizAgg,
      totalLessonsAgg
    ] = await Promise.all([
      prisma.completedLesson.findMany({ where: { userId, track, date: { gte: thirtyDaysAgo } }, select: { date: true, lessonId: true } }),
      prisma.dailyCompletion.findMany({ where: { userId, normalizedDate: { gte: thirtyDaysAgo } }, select: { normalizedDate: true } }),
      prisma.lesson.findMany({ where: { track, dayOrder: { gte: currentDay - 1 } }, orderBy: { dayOrder: 'asc' }, take: 10 }),
      prisma.quiz.findMany({ where: { track, dayOrder: { gte: currentDay - 1 } }, orderBy: { dayOrder: 'asc' }, take: 10 }),
      prisma.quizResult.aggregate({ where: { userId, track, date: { gte: monday } }, _sum: { xpEarned: true } }),
      prisma.quizResult.aggregate({ where: { userId, track }, _avg: { score: true } }),
      prisma.completedLesson.count({ where: { userId, track } })
    ]);

    const lessonIds = upcomingLessons.map(l => l.id);
    const quizIds = upcomingQuizzes.map(q => q.id);

    const relevantAgendaCompletions = await prisma.agendaCompletion.findMany({
      where: { 
        userId,
        OR: [
          { lessonId: { in: lessonIds } },
          { quizId: { in: quizIds } }
        ]
      },
      select: { lessonId: true, quizId: true, itemType: true }
    });

    data = {
      recentLessons,
      recentCompletions,
      upcomingLessons,
      upcomingQuizzes,
      weeklyQuizzesAgg,
      quizAgg,
      totalLessonsAgg,
      relevantAgendaCompletions
    };

    await CacheService.set(cacheKey, data, 300); // cache for 5 minutes
  }

  return data;
};

