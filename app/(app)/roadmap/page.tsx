import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RoadmapMap } from "@/components/roadmap/RoadmapMap";
import { RoadmapSidebar } from "@/components/roadmap/RoadmapSidebar";
import { RoadmapUnitCard } from "@/components/roadmap/RoadmapUnitCard";
import { RoadmapProgress } from "@/lib/types/roadmap";
import { ensureUserProgress } from "@/lib/user-progress";
import { getLessons } from "@/lib/data";

import { Suspense } from "react";

async function RoadmapContent({ userId }: { userId: string }) {
  await ensureUserProgress(userId);

  const lessons = await getLessons();

  let progressData: RoadmapProgress = {
    totalXP: 0,
    completedLessonIds: [],
    completedQuizIds: [],
  };

  try {
    const localDate = new Date();
    const jsDay = localDate.getUTCDay();
    const todayIndex = jsDay === 0 ? 6 : jsDay - 1;
    const monday = new Date(localDate);
    monday.setUTCDate(localDate.getUTCDate() - todayIndex);
    monday.setUTCHours(0, 0, 0, 0);

    const [user, weeklyQuizzesAgg] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          completedLessons: {
            select: { lessonId: true }
          },
          quizResults: {
            select: { quizId: true }
          },
        },
      }),
      prisma.quizResult.aggregate({
        where: { userId, date: { gte: monday } },
        _sum: { xpEarned: true }
      })
    ]);

    progressData = {
      totalXP: weeklyQuizzesAgg._sum.xpEarned || 0,
      completedLessonIds: (user?.completedLessons ?? []).map(l => parseInt(l.lessonId) || 0),
      completedQuizIds: (user?.quizResults ?? []).map(q => parseInt(q.quizId) || 0),
    };
  } catch (error) {
    console.error("Failed to fetch roadmap data:", error);
    // gracefully fall back to initial 0/empty state
  }

  return (
    <div className="flex flex-col xl:flex-row flex-1 overflow-y-auto xl:overflow-hidden p-4 gap-5">
      {/* Left Content Area */}
      <div className="flex-1 flex flex-col items-center xl:overflow-y-auto pb-10">
        <RoadmapUnitCard 
          chapterNumber={1} 
          title="The Science of Prosperity" 
          description="Understand what development really means and how we measure progress." 
        />

        <RoadmapMap lessons={lessons} 
          completedLessonDayOrders={progressData.completedLessonIds} 
          completedQuizDayOrders={progressData.completedQuizIds} 
        />
      </div>

      {/* Right panel */}
      <RoadmapSidebar lessons={lessons} 
        serverTotalXP={progressData.totalXP} 
        completedLessonDayOrders={progressData.completedLessonIds}
        activeTrack="ENTREPRENEURSHIP_ECONOMICS" 
      />
    </div>
  );
}

function RoadmapSkeleton() {
  return (
    <div className="flex flex-col xl:flex-row flex-1 overflow-y-auto xl:overflow-hidden p-4 gap-5">
      <div className="flex-1 flex flex-col items-center xl:overflow-y-auto pb-10">
        <div className="w-full max-w-2xl h-32 bg-slate-100 animate-pulse rounded-2xl mb-8"></div>
        <div className="w-full max-w-md h-[600px] bg-slate-100 animate-pulse rounded-2xl"></div>
      </div>
      <div className="w-full xl:w-80 h-[500px] bg-slate-100 animate-pulse rounded-2xl shrink-0"></div>
    </div>
  );
}

export default async function RoadmapPage() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Derive initial for avatar
  const avatarLetter = session.user.name 
    ? session.user.name.charAt(0).toUpperCase() 
    : session.user.email 
      ? session.user.email.charAt(0).toUpperCase() 
      : "U";

  return (
    <div className="roadmap-page min-h-screen w-full font-sans flex flex-col p-0">
      {/* Page Header */}
      <div className="w-full bg-white flex justify-between items-center shrink-0 border-b border-slate-100 px-8 h-[52px]">
        <div className="text-[22px] font-bold text-gray-900">
          Roadmap
        </div>
        <div className="bg-brand-primary text-white shadow-sm cursor-pointer hover:opacity-90 transition-all rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm">
          {avatarLetter}
        </div>
      </div>

      {/* Content area */}
      <Suspense fallback={<RoadmapSkeleton />}>
        <RoadmapContent userId={userId} />
      </Suspense>
    </div>
  );
}
