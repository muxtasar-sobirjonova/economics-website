"use client";

import React, { useTransition } from "react";
import { Lesson } from "@prisma/client";
import { switchTrackAction } from "@/app/actions/user";


export function getLeagueData(weeklyXP: number) {
  if (weeklyXP < 100) return { name: "Bronze League", min: 0, max: 100 };
  if (weeklyXP < 250) return { name: "Silver League", min: 100, max: 250 };
  if (weeklyXP < 500) return { name: "Gold League", min: 250, max: 500 };
  if (weeklyXP < 1000) return { name: "Platinum League", min: 500, max: 1000 };
  return { name: "Diamond League", min: 1000, max: 1000 };
}

export const RoadmapSidebar = ({
  serverTotalXP,
  completedLessonDayOrders,
  lessons,
  activeTrack,
}: {
  serverTotalXP: number;
  completedLessonDayOrders: number[];
  lessons: Lesson[];
  activeTrack: string;
}) => {
  
  const [isPending, startTransition] = useTransition();
  const totalXP = serverTotalXP;
  
  const allCompletedDayOrders = completedLessonDayOrders;

  const nextLesson = (lessons || []).find(l => !allCompletedDayOrders.includes(l.dayOrder));
  
  const agendaMessage = nextLesson 
    ? `You're on track. Start with ${nextLesson.title} when you're ready.`
    : "You're all caught up for today! Come back tomorrow for more.";

  const league = getLeagueData(totalXP);
  const progressPercentage = Math.max(0, Math.min(100, ((totalXP - league.min) / (league.max - league.min)) * 100));

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTrack = e.target.value;
    startTransition(async () => {
      try {
        const res = await switchTrackAction(newTrack);
        if (!res.success) {
          console.error("Failed to switch track:", res.error);
        }
      } catch (err) {
        console.error("Failed to switch track:", err);
      }
    });
  };

  const tracks = [
    { id: "ENTREPRENEURSHIP_ECONOMICS", name: "Entrepreneurship Economics" },
    { id: "BEHAVIORAL_ECONOMICS", name: "Behavioral Economics" },
    { id: "DEVELOPMENT_ECONOMICS", name: "Development Economics" }
  ];

  return (
    <aside className="w-full xl:w-[300px] shrink-0 flex flex-col gap-s4 xl:overflow-y-auto">
      {/* Track */}
      <section className="bg-surface border border-line rounded-lg shadow-sh1 p-s4">
        <h2 className="text-label uppercase text-faint mb-s3">Active curriculum</h2>
        <div className="relative">
          <label htmlFor="track-select" className="sr-only">Choose a track</label>
          <select
            id="track-select"
            value={activeTrack}
            onChange={handleTrackChange}
            disabled={isPending}
            className="w-full p-s3 bg-raised border border-line rounded-md text-ui text-ink cursor-pointer disabled:opacity-50 min-h-[44px]"
          >
            {tracks.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          {isPending && (
            <div className="absolute right-s6 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </section>

      {/* League */}
      <section className="bg-surface border border-line rounded-lg shadow-sh1 p-s4">
        <div className="flex items-baseline justify-between gap-s3 mb-s3">
          <h2 className="text-label uppercase text-faint">League</h2>
          <span className="font-mono text-meta text-ink tabular">
            {totalXP.toLocaleString()} XP
          </span>
        </div>

        <div className="text-h3 font-semibold text-ink">{league.name}</div>
        <p className="text-meta text-muted mt-1">
          {league.name === "Diamond League"
            ? "Top league — nothing above this."
            : `${(league.max - totalXP).toLocaleString()} XP to ${getLeagueData(league.max).name.replace(" League", "")}`}
        </p>

        <div className="w-full bg-bg-sunk h-1 rounded-sm overflow-hidden mt-s3">
          <div
            className="h-full rounded-sm bg-reward transition-all duration-500"
            style={{ width: league.name === "Diamond League" ? "100%" : `${progressPercentage}%` }}
          />
        </div>
      </section>

      {/* What's next */}
      <section className="bg-surface border border-line rounded-lg shadow-sh1 p-s4">
        <h2 className="text-label uppercase text-faint mb-s3">What&apos;s next</h2>
        <p className="text-ui text-ink">{agendaMessage}</p>
      </section>
    </aside>
  );
};
