import { Track } from "@prisma/client";
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
import { getUserDashboardData, getUserRoadmapProgress } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dashboard | That's So Econ",
  description: "Your personalized entrepreneurship economics learning dashboard.",
};


async function DashboardStatsAsync({ userId, streak, activeTrack = Track.ENTREPRENEURSHIP_ECONOMICS, totalXP }: { userId: string, streak: number, activeTrack?: Track, totalXP: number }) {
  const localDate = new Date();
  const jsDay = localDate.getUTCDay();
  const todayIndex = jsDay === 0 ? 6 : jsDay - 1;
  const monday = new Date(localDate);
  monday.setUTCDate(localDate.getUTCDate() - todayIndex);
  monday.setUTCHours(0, 0, 0, 0);

  const {
    weeklyQuizzesAgg,
    quizAgg,
    totalLessonsAgg,
  } = await getUserDashboardData(userId, activeTrack as Track, 1);
  await getUserRoadmapProgress(userId, activeTrack);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const xpThisWeek = (weeklyQuizzesAgg as any)?._sum?.xpEarned || 0;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let avgQuizScore = (quizAgg as any)?._avg?.score ? Math.round((quizAgg as any)._avg.score * 10) : 0;
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
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeTrack: true }
  });

  if (!userRecord || !userRecord.activeTrack) {
    redirect("/track-selection");
  }

  const activeTrack = userRecord.activeTrack;
  await ensureUserProgress(userId);
  
  const userProgress = await prisma.userProgress.findUnique({ where: { userId } });

  if (!userProgress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-2 text-[#362A5C]">Welcome to That&apos;s So Econ!</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We&apos;re setting up your learning profile. Please complete your onboarding or check back in a moment to view your dashboard.
        </p>
      </div>
    );
  }

  const streak = userProgress.streak || 0;
  const currentDay = userProgress.currentDay || 1;
  const {
    recentLessons,
    recentCompletions,
    upcomingLessons,
    upcomingQuizzes,
    relevantAgendaCompletions
  } = await getUserDashboardData(userId, activeTrack as Track, currentDay);

  const todayStr = new Date().toISOString().split("T")[0];
  
  const extractDateStr = (dateVal: Date | string) => {
    if (typeof dateVal === 'string') return dateVal.split("T")[0];
    return dateVal.toISOString().split("T")[0];
  };

  const completedLessonIdsToday = recentLessons
    .filter((l: { date: Date | string; lessonId: string }) => extractDateStr(l.date) === todayStr)
    .map((l: { lessonId: string }) => l.lessonId);

  const completedLessonDates = recentLessons.map((l: { date: Date | string }) => extractDateStr(l.date));
  const completedAgendaDates = recentCompletions.map((dc: { normalizedDate: Date | string }) => extractDateStr(dc.normalizedDate));

  const isCompleted = (type: string, id: string) => {
    return relevantAgendaCompletions.some((c: { lessonId: string | null; quizId: string | null; itemType: string }) => {
      if (type === 'concept') return c.lessonId === id && c.itemType === 'LESSON';
      if (type === 'article') return c.lessonId === id && c.itemType === 'ARTICLE';
      if (type === 'quiz') return c.quizId === id && c.itemType === 'QUIZ';
      return false;
    });
  };

  const agendaItems = [];

  const maxDayOrder = Math.max(
    ...upcomingLessons.map((l: { dayOrder: number }) => l.dayOrder),
    ...upcomingQuizzes.map((q: { dayOrder: number }) => q.dayOrder),
    currentDay
  );

  let activeDay = currentDay;
  for (let d = currentDay > 1 ? currentDay - 1 : currentDay; d <= maxDayOrder; d++) {
    const lesson = upcomingLessons.find((l: { dayOrder: number; id: string; title: string }) => l.dayOrder === d);
    const quiz = upcomingQuizzes.find((q: { dayOrder: number; id: string; title: string; tag: string }) => q.dayOrder === d);
    
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
    } else if (lesson && completedLessonIdsToday.includes(lesson.id)) {
      // If it was completed TODAY, stay on this day to show the checkmarks!
      activeDay = d;
      break;
    }
  }

  const activeLesson = upcomingLessons.find((l: { dayOrder: number; id: string; title: string }) => l.dayOrder === activeDay);
  const activeQuiz = upcomingQuizzes.find((q: { dayOrder: number; id: string; title: string; tag: string }) => q.dayOrder === activeDay);

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
      isCompleted: conceptCompleted,
      url: `/lessons/${activeLesson.dayOrder}/concepts`
    });
    agendaItems.push({
      id: `lesson-article-${activeLesson.id}`,
      itemType: "LESSON" as const,
      itemId: `${activeLesson.dayOrder}-article`,
      title: `Reading: ${activeLesson.title}`,
      tag: 'ARTICLE',
      timeEstimate: 20,
      isCompleted: articleCompleted,
      url: `/lessons/${activeLesson.dayOrder}/articles`
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
      timeEstimate: 10,
      isCompleted: quizCompleted,
      url: `/lessons/${activeQuiz.dayOrder}/quizzes`
    });
  }

  const trackNames: Record<string, string> = {
    ENTREPRENEURSHIP_ECONOMICS: "Entrepreneurship Economics",
    BEHAVIORAL_ECONOMICS: "Behavioral Economics",
    DEVELOPMENT_ECONOMICS: "Development Economics"
  };
  const activeTrackName = trackNames[activeTrack] || "Economics";

  return (
    <>
      <DailyQuote activeTrack={activeTrack} />
      <div className="flex flex-col justify-center py-10 px-4 md:px-12">
        <DashboardHero 
          completedAgendaDates={completedAgendaDates}
          completedDates={completedLessonDates}
          userName={userName} 
          activeTrackName={activeTrackName}
        />
      </div>

      <div className="flex flex-col justify-start py-4 px-4 md:px-12">
        <div className="flex flex-col lg:flex-row w-full mx-auto gap-6 max-w-[1200px]">
          <TodayAgendaCard initialItems={agendaItems} />
          <DailyChallengeCard userId={userId} />
        </div>
        
        <div className="mt-6 w-full mx-auto max-w-[1200px]">
          <Suspense fallback={<div className="h-32 w-full bg-slate-100 animate-pulse rounded-xl" />}>
            <DashboardStatsAsync 
              userId={userId} 
              streak={streak} 
              activeTrack={activeTrack}
              totalXP={userProgress.totalXP}
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
    <div className="w-full bg-[#F8F9FC]">
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
