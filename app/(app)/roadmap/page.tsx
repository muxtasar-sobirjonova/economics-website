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

export default async function RoadmapPage() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  await ensureUserProgress(userId);

  const lessons = await getLessons();

  let progressData: RoadmapProgress = {
    totalXP: 0,
    completedLessonIds: [],
    completedQuizIds: [],
  };

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        progress: {
          select: { totalXP: true }
        },
        completedLessons: {
          select: { lessonId: true }
        },
        quizResults: {
          select: { quizId: true }
        },
      },
    });

    progressData = {
      totalXP: user?.progress?.totalXP || 0,
      completedLessonIds: (user?.completedLessons ?? []).map(l => parseInt(l.lessonId) || 0),
      completedQuizIds: (user?.quizResults ?? []).map(q => parseInt(q.quizId) || 0),
    };
  } catch (error) {
    console.error("Failed to fetch roadmap data:", error);
    // gracefully fall back to initial 0/empty state
  }

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
      <div className="flex flex-col xl:flex-row flex-1 overflow-y-auto xl:overflow-hidden p-4 gap-5">
        {/* Left Content Area */}
        <div className="flex-1 flex flex-col items-center xl:overflow-y-auto pb-10">
          <RoadmapUnitCard />

          {/* @ts-ignore */}
          <RoadmapMap lessons={lessons} 
            completedLessonIds={progressData.completedLessonIds} 
            completedQuizIds={progressData.completedQuizIds} 
          />
        </div>

        {/* Right panel */}
        {/* @ts-ignore */}
          <RoadmapSidebar lessons={lessons} 
          serverTotalXP={progressData.totalXP} 
          completedLessonIds={progressData.completedLessonIds} 
        />
      </div>
    </div>
  );
}
