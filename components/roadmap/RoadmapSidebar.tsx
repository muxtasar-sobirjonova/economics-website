"use client";

import React, { useEffect, useState } from "react";

export function getLeagueData(totalXP: number) {
  if (totalXP < 100) return { name: "Bronze League", min: 0, max: 100 };
  if (totalXP < 500) return { name: "Silver League", min: 100, max: 500 };
  if (totalXP < 1000) return { name: "Gold League", min: 500, max: 1000 };
  return { name: "Diamond League", min: 1000, max: 2000 };
}

import { Lesson } from "@prisma/client";

export const RoadmapSidebar = ({
  serverTotalXP,
  completedLessonIds,
  lessons,
}: {
  serverTotalXP: number;
  completedLessonIds: number[];
  lessons: Lesson[];
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalXP = serverTotalXP;
  
  const allCompletedLessonIds = completedLessonIds;

  const nextLesson = (lessons || []).find(l => !allCompletedLessonIds.includes(Number(l.id)));
  
  const agendaMessage = nextLesson 
    ? `You're on track. Start with ${nextLesson.title} when you're ready.`
    : "You're all caught up for today! Come back tomorrow for more.";

  const league = getLeagueData(totalXP);
  const progressPercentage = Math.max(0, Math.min(100, ((totalXP - league.min) / (league.max - league.min)) * 100));

  return (
    <div className="w-full xl:w-[280px] shrink-0 flex flex-col gap-5 bg-transparent xl:overflow-y-auto">
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
              {league.max - totalXP} XP to next league
            </div>
          </div>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full">
          <div
            className="h-1.5 transition-all duration-500 rounded-full bg-indigo-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Today's Agenda Card */}
      <div className="bg-white p-4 rounded-xl border border-gray-border shadow-sm">
        <div className="font-bold mb-4 text-[11px] tracking-widest text-slate-400 uppercase">
          Today's agenda
        </div>
        <div className="flex flex-col gap-2 text-xs text-slate-700">
          <p>{agendaMessage}</p>
        </div>
      </div>
    </div>
  );
};
