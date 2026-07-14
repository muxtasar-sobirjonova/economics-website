import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TodayAgendaCard from "@/components/TodayAgendaCard";
import { DailyQuote } from "@/components/home/DailyQuote";
import { DailyChallengeCard } from "@/components/home/DailyChallengeCard";
import { DashboardHero } from "@/components/home/DashboardHero";
import { LearningStats } from "@/components/home/LearningStats";

import { ensureUserProgress } from "@/lib/user-progress";
import { Suspense } from "react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dashboard | That's So Econ",
  description: "Your personalized entrepreneurship economics learning dashboard.",
};


async function DashboardStatsAsync({ userId, streak, totalXP }: { userId: string, streak: number, totalXP: number }) {
  const localDate = new Date();
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const jsDay = localDate.getUTCDay();
  const todayIndex = jsDay === 0 ? 6 : jsDay - 1;
  const monday = new Date(localDate);
  monday.setUTCDate(localDate.getUTCDate() - todayIndex);
  monday.setUTCHours(0, 0, 0, 0);

  const [weeklyLessonsAgg, weeklyQuizzesAgg, quizAgg, totalLessonsAgg] = await Promise.all([
    prisma.completedLesson.aggregate({
      where: { userId, date: { gte: monday } },
      _sum: { xpEarned: true }
    }),
    prisma.quizResult.aggregate({
      where: { userId, date: { gte: monday } },
      _sum: { xpEarned: true }
    }),
    prisma.quizResult.aggregate({
      where: { userId },
      _avg: { score: true },
    }),
    prisma.completedLesson.count({
      where: { userId }
    })
  ]);

  const lessonXpThisWeek = weeklyLessonsAgg._sum.xpEarned || 0;
  const quizXpThisWeek = weeklyQuizzesAgg._sum.xpEarned || 0;
  const xpThisWeek = lessonXpThisWeek + quizXpThisWeek;
  let avgQuizScore = quizAgg._avg.score ? Math.round(quizAgg._avg.score * 10) : 0;
  if (avgQuizScore > 100) avgQuizScore = 100;

  return (
    <LearningStats 
      backendStreak={streak}
      completedLessonsCount={totalLessonsAgg}
      avgQuizScore={avgQuizScore}
      xpThisWeek={xpThisWeek}
      totalXP={totalXP}
    />
  );
}

async function DashboardData({ userId, userName }: { userId: string; userName: string }) {
  await ensureUserProgress(userId);
  
  const userProgress = await prisma.userProgress.findUnique({ where: { userId } });

  if (!userProgress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-2 text-[#362A5C]">Welcome to That's So Econ!</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We're setting up your learning profile. Please complete your onboarding or check back in a moment to view your dashboard.
        </p>
      </div>
    );
  }

  const streak = userProgress.streak || 0;
  const currentDay = userProgress.currentDay || 1;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [recentLessons, recentCompletions, upcomingLessons, upcomingQuizzes] = await Promise.all([
    prisma.completedLesson.findMany({ where: { userId, date: { gte: thirtyDaysAgo } }, select: { date: true } }),
    prisma.dailyCompletion.findMany({ where: { userId, dateString: { gte: thirtyDaysAgo } }, select: { dateString: true } }),
    prisma.lesson.findMany({
      where: { dayOrder: { gte: currentDay } },
      orderBy: { dayOrder: 'asc' },
      take: 10
    }),
    prisma.quiz.findMany({
      where: { dayOrder: { gte: currentDay } },
      orderBy: { dayOrder: 'asc' },
      take: 10
    })
  ]);

  const completedLessonDates = recentLessons.map(l => l.date.toISOString().split("T")[0]);
  const completedAgendaDates = recentCompletions.map(dc => dc.dateString.toISOString().split("T")[0]);

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

  const isCompleted = (type: string, id: string) => {
    return relevantAgendaCompletions.some(c => {
      if (type === 'concept') return c.lessonId === id && c.itemType === 'LESSON';
      if (type === 'article') return c.lessonId === id && c.itemType === 'ARTICLE';
      if (type === 'quiz') return c.quizId === id && c.itemType === 'QUIZ';
      return false;
    });
  };

  const agendaItems = [];

  const maxDayOrder = Math.max(
    ...upcomingLessons.map(l => l.dayOrder),
    ...upcomingQuizzes.map(q => q.dayOrder),
    currentDay
  );

  let activeDay = currentDay;
  for (let d = currentDay; d <= maxDayOrder; d++) {
    const lesson = upcomingLessons.find(l => l.dayOrder === d);
    const quiz = upcomingQuizzes.find(q => q.dayOrder === d);
    
    let dayFullyCompleted = true;
    if (lesson) {
      const conceptCompleted = isCompleted('concept', lesson.id);
      const articleCompleted = isCompleted('article', lesson.id);
      if (!conceptCompleted || !articleCompleted) dayFullyCompleted = false;
    }
    if (quiz) {
      const quizCompleted = isCompleted('quiz', quiz.id);
      if (!quizCompleted) dayFullyCompleted = false;
    }
    
    if (!lesson && !quiz) continue;

    if (!dayFullyCompleted) {
      activeDay = d;
      break;
    }
  }

  const activeLesson = upcomingLessons.find(l => l.dayOrder === activeDay);
  const activeQuiz = upcomingQuizzes.find(q => q.dayOrder === activeDay);

  if (activeLesson) {
    const conceptCompleted = isCompleted('concept', activeLesson.id);
    const articleCompleted = isCompleted('article', activeLesson.id);

    agendaItems.push({
      id: `lesson-concept-${activeLesson.id}`,
      itemType: "LESSON" as const,
      itemId: `${activeLesson.dayOrder}-concept`,
      title: activeLesson.title,
      tag: 'CONCEPT',
      timeEstimate: 10,
      isCompleted: conceptCompleted
    });
    agendaItems.push({
      id: `lesson-article-${activeLesson.id}`,
      itemType: "LESSON" as const,
      itemId: `${activeLesson.dayOrder}-article`,
      title: `Reading: ${activeLesson.title}`,
      tag: 'ARTICLE',
      timeEstimate: 20,
      isCompleted: articleCompleted
    });
  }

  if (activeQuiz) {
    const quizCompleted = isCompleted('quiz', activeQuiz.id);
    agendaItems.push({
      id: `quiz-${activeQuiz.id}`,
      itemType: "QUIZ" as const,
      itemId: (100 + activeQuiz.dayOrder).toString(),
      title: activeQuiz.title,
      tag: activeQuiz.tag,
      timeEstimate: activeQuiz.timeEstimate,
      isCompleted: quizCompleted
    });
  }

  return (
    <>
      <div className="flex flex-col justify-center py-10 px-4 md:px-12">
        <DashboardHero 
          completedAgendaDates={completedAgendaDates}
          completedDates={completedLessonDates}
          userName={userName} 
        />
      </div>

      <div className="flex flex-col justify-start py-4 px-4 md:px-12">
        <div className="flex flex-col lg:flex-row w-full mx-auto gap-6 max-w-[1200px]">
          <TodayAgendaCard initialItems={agendaItems} />
          <DailyChallengeCard />
        </div>
        
        <div className="mt-6 w-full mx-auto max-w-[1200px]">
          <Suspense fallback={<div className="h-32 w-full bg-slate-100 animate-pulse rounded-xl" />}>
            <DashboardStatsAsync 
              userId={userId} 
              streak={streak} 
              totalXP={userProgress?.totalXP || 0} 
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const userName = session.user.name || "";

  return (
    <div className="flex flex-col font-sans min-h-screen bg-[#F8F9FC]">
      <DailyQuote />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-primary rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
        </div>
      }>
        <DashboardData userId={userId} userName={userName} />
      </Suspense>
    </div>
  );
}
