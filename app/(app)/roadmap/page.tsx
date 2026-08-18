import React, { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Track } from "@prisma/client";
import { RoadmapMap } from "@/components/roadmap/RoadmapMap";
import { RoadmapSidebar } from "@/components/roadmap/RoadmapSidebar";
import { ensureUserProgress } from "@/lib/user-progress";
import { getLessons } from "@/lib/data";
import { quizIdToDayOrder } from "@/lib/lesson-access";

const TRACK_LABEL: Record<string, string> = {
  ENTREPRENEURSHIP_ECONOMICS: "Entrepreneurship economics",
  DEVELOPMENT_ECONOMICS: "Development economics",
  BEHAVIORAL_ECONOMICS: "Behavioral economics",
};

async function RoadmapContent({ userId }: { userId: string }) {
  const [, user] = await Promise.all([
    ensureUserProgress(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        activeTrack: true,
        completedLessons: { select: { lessonId: true, track: true } },
        quizResults: { select: { quizId: true, score: true, track: true } },
      },
    }),
  ]);

  const activeTrack = (user?.activeTrack || Track.ENTREPRENEURSHIP_ECONOMICS) as Track;

  const [trackProgressAll, progress, mistakesCount, notesCount] = await Promise.all([
    prisma.trackProgress.findMany({
      where: { userId },
      select: { track: true, currentDay: true, xp: true, streak: true },
    }),
    prisma.userProgress.findUnique({ where: { userId }, select: { hearts: true, streak: true } }),
    prisma.mistakeReview.count({ where: { userId, reviewed: false, track: activeTrack } }),
    prisma.note.count({ where: { userId, track: activeTrack } }),
  ]);

  const current = trackProgressAll.find((t) => t.track === activeTrack);

  const progressByTrack = Object.fromEntries(
    trackProgressAll.map((t) => [t.track, { currentDay: t.currentDay, xp: t.xp }])
  );

  const completedLessonDayOrders = (user?.completedLessons ?? [])
    .filter((l) => l.track === activeTrack)
    .map((l) => parseInt(l.lessonId, 10) || 0);

  // quizId is stored as `100 + dayOrder`; the plot compares day orders.
  const trackQuizzes = (user?.quizResults ?? []).filter((q) => q.track === activeTrack);
  const completedQuizDayOrders = trackQuizzes
    .map((q) => quizIdToDayOrder(q.quizId) ?? 0);

  const scoresByDay: Record<number, number> = {};
  trackQuizzes.forEach((q) => {
    const d = quizIdToDayOrder(q.quizId);
    if (d != null) scoresByDay[d] = q.score;
  });

  const lessonsCompleted = completedLessonDayOrders.length;

  const lessonsData = await getLessons(activeTrack);
  const lessons = JSON.parse(JSON.stringify(lessonsData));

  const hearts = progress?.hearts ?? 5;
  const streak = current?.streak ?? progress?.streak ?? 0;

  return (
    <>
      {/* Page header */}
      <header className="w-full flex flex-wrap items-end justify-between gap-s4 px-s4 md:px-s5 pt-s5 pb-s4">
        <div className="w-full sm:w-auto min-w-0">
          <span className="font-mono text-label uppercase text-faint block break-words">
            {TRACK_LABEL[activeTrack] ?? "Economics"} · 56-day build
          </span>
          <h1 className="text-h1 font-semibold text-ink mt-s2 pb-[3px]">Your plot</h1>
        </div>

        <div className="flex items-center gap-s3 shrink-0">
          <span className="flex items-center gap-s2 px-s3 py-s2 rounded-md bg-surface border border-line">
            <span className="text-danger">&hearts;</span>
            <span className="font-mono text-meta text-ink tabular">{hearts}/5</span>
          </span>
          <span className="flex items-center gap-s2 px-s3 py-s2 rounded-md bg-reward-soft">
            <span aria-hidden>🔥</span>
            <span className="font-mono text-meta tabular" style={{ color: "var(--reward)" }}>{streak}</span>
          </span>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row flex-1 gap-s4 px-s4 md:px-s5 pb-s8">
        <div className="flex-1 flex flex-col items-center min-w-0">
          <RoadmapMap
            lessons={lessons}
            completedLessonDayOrders={completedLessonDayOrders}
            completedQuizDayOrders={completedQuizDayOrders}
            activeTrack={activeTrack}
            scoresByDay={scoresByDay}
          />
        </div>

        <RoadmapSidebar
          lessonsCompleted={lessonsCompleted}
          activeTrack={activeTrack}
          progressByTrack={progressByTrack}
          mistakesCount={mistakesCount}
          notesCount={notesCount}
        />
      </div>
    </>
  );
}

function RoadmapSkeleton() {
  return (
    <div className="flex flex-col xl:flex-row flex-1 gap-s4 px-s4 md:px-s5 py-s5">
      <div className="flex-1 flex flex-col items-center gap-s3">
        <div className="w-full max-w-[880px] h-20 bg-bg-sunk animate-pulse rounded-lg" />
        <div className="w-full max-w-[880px] h-[620px] bg-bg-sunk animate-pulse rounded-lg" />
      </div>
      <div className="w-full xl:w-[300px] h-[400px] bg-bg-sunk animate-pulse rounded-lg shrink-0" />
    </div>
  );
}

export default async function RoadmapPage() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  return (
    /* theme-v2 opts this page into the new tokens and the reading face without
       touching any page that has not been migrated yet. */
    <div className="theme-v2 roadmap-page min-h-screen w-full flex flex-col bg-bg bg-sky">
      <Suspense fallback={<RoadmapSkeleton />}>
        <RoadmapContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}
