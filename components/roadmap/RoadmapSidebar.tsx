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
    <div className="w-full xl:w-[280px] shrink-0 flex flex-col gap-5 bg-transparent xl:overflow-y-auto">
      {/* Track Selector Card */}
      <div className="bg-white p-4 flex flex-col gap-3 rounded-xl border border-gray-border shadow-sm">
        <div className="font-bold text-[11px] tracking-widest text-slate-400 uppercase">
          Active Curriculum
        </div>
        <div className="relative">
          <select
            value={activeTrack}
            onChange={handleTrackChange}
            disabled={isPending}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 text-sm font-semibold rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
          >
            {tracks.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          {isPending && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* League Card */}
      <div className="bg-white p-4 flex flex-col gap-3 rounded-xl border border-gray-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-xl">
            🔥
          </div>
          <div>
            <div className="font-bold text-sm text-slate-800">
              {league.name}
            </div>
            <div className="text-xs mt-0.5 text-slate-500">
              {league.name === "Diamond League" ? "You are in the top league!" : `${league.max - totalXP} XP to next league`}
            </div>
          </div>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-1.5 transition-all duration-500 rounded-full bg-indigo-500"
            style={{ width: league.name === "Diamond League" ? "100%" : `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Today's Agenda Card */}
      <div className="bg-white p-4 rounded-xl border border-gray-border shadow-sm">
        <div className="font-bold mb-4 text-[11px] tracking-widest text-slate-400 uppercase">
          Today&apos;s agenda
        </div>
        <div className="flex flex-col gap-2 text-xs text-slate-700">
          <p>{agendaMessage}</p>
        </div>
      </div>
    </div>
  );
};
