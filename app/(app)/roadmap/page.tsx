import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RoadmapMap } from "@/components/roadmap/RoadmapMap";
import { RoadmapSidebar } from "@/components/roadmap/RoadmapSidebar";

import { RoadmapProgress } from "@/lib/types/roadmap";
import { ensureUserProgress } from "@/lib/user-progress";
import { getLessons } from "@/lib/data";

import { Suspense } from "react";

async function RoadmapContent({ userId }: { userId: string }) {
  let progressData: RoadmapProgress = {
    totalXP: 0,
    completedLessonIds: [],
    completedQuizIds: [],
  };
  let activeTrack = "ENTREPRENEURSHIP_ECONOMICS";

  try {
    const localDate = new Date();
    const jsDay = localDate.getUTCDay();
    const todayIndex = jsDay === 0 ? 6 : jsDay - 1;
    const monday = new Date(localDate);
    monday.setUTCDate(localDate.getUTCDate() - todayIndex);
    monday.setUTCHours(0, 0, 0, 0);

    const [, user] = await Promise.all([
      ensureUserProgress(userId),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          activeTrack: true,
          completedLessons: {
            select: { lessonId: true, track: true }
          },
          quizResults: {
            select: { quizId: true, track: true }
          },
        },
      }),
      prisma.trackProgress.findFirst({
        where: { userId } // We'll get the specific one after knowing activeTrack
      })
    ]);

    if (user?.activeTrack) {
      activeTrack = user.activeTrack;
    }

    const trackProgress = await prisma.trackProgress.findUnique({
      where: { userId_track: { userId, track: activeTrack as import("@prisma/client").Track } }
    });

    progressData = {
      totalXP: trackProgress?.xp || 0,
      completedLessonIds: (user?.completedLessons ?? [])
        .filter(l => l.track === activeTrack)
        .map(l => parseInt(l.lessonId) || 0),
      completedQuizIds: (user?.quizResults ?? [])
        .filter(q => q.track === activeTrack)
        .map(q => parseInt(q.quizId) || 0),
    };
  } catch (error) {
    console.error("Failed to fetch roadmap data:", error);
    // gracefully fall back to initial 0/empty state
  }

  const lessonsData = await getLessons(activeTrack as import("@prisma/client").Track);
  const lessons = JSON.parse(JSON.stringify(lessonsData));

  return (
    <div className="flex flex-col-reverse xl:flex-row flex-1 overflow-y-auto xl:overflow-hidden p-4 gap-5">
      {/* Left Content Area */}
      <div className="flex-1 flex flex-col items-center xl:overflow-y-auto pb-10">
        <RoadmapMap lessons={lessons} 
          completedLessonDayOrders={progressData.completedLessonIds} 
          completedQuizDayOrders={progressData.completedQuizIds}
          activeTrack={activeTrack}
        />
      </div>

      {/* Right panel */}
      <RoadmapSidebar lessons={lessons} 
        serverTotalXP={progressData.totalXP} 
        completedLessonDayOrders={progressData.completedLessonIds}
        activeTrack={activeTrack} 
      />
    </div>
  );
}

function RoadmapSkeleton() {
  return (
    <div className="flex flex-col-reverse xl:flex-row flex-1 overflow-y-auto xl:overflow-hidden p-4 gap-5">
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
  const avatarLetter = (session?.user?.name?.trim().charAt(0) || session?.user?.email?.trim().charAt(0) || "?").toUpperCase();

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
