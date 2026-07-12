"use client";

import React from "react";

export default function GlobalProgress({ totalLessons = 12 }: { totalLessons?: number }) {
  // TODO: Get real completed count via props or server action
  const completedCount = 0;
  const progressPercentage = Math.max(0, Math.round((completedCount / totalLessons) * 100));
  const displayLesson = Math.min(completedCount + 1, totalLessons);

  return (
    <div className="w-full mb-2">
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#111827]/50">
            Your Progress
          </span>
          <p className="text-[#111827] font-bold text-lg mt-0.5 leading-tight">
            Lesson {displayLesson} <span className="font-medium text-[#111827]/50">of {totalLessons}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-[22px] font-black text-[#111827]">{progressPercentage}%</span>
          <p className="text-[11px] font-bold tracking-wider uppercase text-[#111827]/40 mt-0.5">Completed</p>
        </div>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-700 ease-out rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
