import { Track } from "@prisma/client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TodayAgendaCard from "@/components/TodayAgendaCard";
import { DailyQuote } from "@/components/home/DailyQuote";
import { DashboardHero } from "@/components/home/DashboardHero";
import { LearningStats } from "@/components/home/LearningStats";

import { ensureUserProgress } from "@/lib/user-progress";
import { Suspense } from "react";
import { Metadata } from 'next';
import { getUserDashboardData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dashboard | That's So Econ",
  description: "Your personalized entrepreneurship economics learning dashboard.",
};


async function DashboardStatsAsync({ userId, streak, activeTrack = Track.ENTREPRENEURSHIP_ECONOMICS, totalXP, currentDay }: { userId: string, streak: number, activeTrack?: Track, totalXP: number, currentDay: number }) {
  const {
    weeklyQuizzesAgg,
    quizAgg,
    totalLessonsAgg,
  } = await getUserDashboardData(userId, activeTrack as Track, currentDay);

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
  
  const trackProgress = await prisma.trackProgress.findUnique({ where: { userId_track: { userId, track: activeTrack } } });

  if (!trackProgress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-s4">
        <h2 className="text-h2 font-semibold text-ink mb-s2">Welcome to That&apos;s So Econ</h2>
        <p className="text-ui text-muted max-w-[46ch]">
          We&apos;re setting up your learning profile. Finish onboarding, or check back in a moment.
        </p>
      </div>
    );
  }

  const streak = trackProgress.streak || 0;
  const currentDay = trackProgress.currentDay || 1;
  const xp = trackProgress.xp || 0;
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


  return (
    <>
      <DailyQuote activeTrack={activeTrack} />
      <div className="px-s4 md:px-s6 lg:px-s7 pt-s5 pb-s4">
        <DashboardHero
          completedAgendaDates={completedAgendaDates}
          completedDates={completedLessonDates}
          userName={userName}
          currentDay={currentDay}
          streak={streak}
        />
      </div>

      <div className="px-s4 md:px-s6 lg:px-s7 pb-s7">
        <div className="flex flex-col w-full mx-auto gap-s4 max-w-[1200px]">
          <TodayAgendaCard initialItems={agendaItems} />
        </div>
        
        <div className="w-full mx-auto max-w-[1200px]">
          <Suspense fallback={<div className="h-32 w-full bg-bg-sunk animate-pulse rounded-lg mt-s6" />}>
            <DashboardStatsAsync
              userId={userId}
              streak={streak}
              activeTrack={activeTrack}
              totalXP={xp}
              currentDay={currentDay}
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
    <div className="w-full bg-bg bg-sky min-h-full">
      <Suspense fallback={
        <div className="px-s4 md:px-s6 lg:px-s7 pt-s5 pb-s7 w-full max-w-[1200px] mx-auto">
          <div className="h-24 w-full bg-bg-sunk animate-pulse rounded-lg" />
          <div className="flex flex-col lg:flex-row gap-s4 mt-s5">
            <div className="h-64 flex-[1.5] bg-bg-sunk animate-pulse rounded-lg" />
            <div className="h-64 flex-1 bg-bg-sunk animate-pulse rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-s3 mt-s6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 bg-bg-sunk animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      }>
        <DashboardData userId={userId} userName={userName} />
      </Suspense>
    </div>
  );
}
