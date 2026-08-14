import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RoadmapMap } from "@/components/roadmap/RoadmapMap";
import { RoadmapSidebar } from "@/components/roadmap/RoadmapSidebar";

import { RoadmapProgress } from "@/lib/types/roadmap";
import { ensureUserProgress } from "@/lib/user-progress";
import { getLessons } from "@/lib/data";
import { quizIdToDayOrder } from "@/lib/lesson-access";

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
      // quizId is stored as `100 + dayOrder`; the roadmap compares day orders.
      completedQuizIds: (user?.quizResults ?? [])
        .filter(q => q.track === activeTrack)
        .map(q => quizIdToDayOrder(q.quizId) ?? 0),
    };
  } catch (error) {
    console.error("Failed to fetch roadmap data:", error);
    // gracefully fall back to initial 0/empty state
  }

  const lessonsData = await getLessons(activeTrack as import("@prisma/client").Track);
  const lessons = JSON.parse(JSON.stringify(lessonsData));

  return (
    <div className="flex flex-col-reverse xl:flex-row flex-1 overflow-y-auto xl:overflow-hidden p-s4 gap-s5">
      {/* Left Content Area */}
      <div className="flex-1 flex flex-col items-center xl:overflow-y-auto pb-s7">
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
      <div className="flex-1 flex flex-col items-center xl:overflow-y-auto pb-s7">
        <div className="w-full max-w-[520px] h-32 bg-bg-sunk animate-pulse rounded-lg mb-s6" />
        <div className="w-full max-w-[460px] h-[600px] bg-bg-sunk animate-pulse rounded-lg" />
      </div>
      <div className="w-full xl:w-[300px] h-[420px] bg-bg-sunk animate-pulse rounded-lg shrink-0" />
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
    <div className="roadmap-page min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full bg-surface border-b border-line flex justify-between items-center shrink-0 px-s5 h-14">
        <div>
          <span className="text-label uppercase text-faint block">Your plot</span>
          <h1 className="text-h3 font-semibold text-ink leading-tight">Roadmap</h1>
        </div>
        <span className="w-9 h-9 rounded-full bg-accent-soft text-accent grid place-items-center font-semibold text-meta">
          {avatarLetter}
        </span>
      </div>

      {/* Content area */}
      <Suspense fallback={<RoadmapSkeleton />}>
        <RoadmapContent userId={userId} />
      </Suspense>
    </div>
  );
}
