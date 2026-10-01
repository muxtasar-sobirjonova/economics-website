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
          <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--text)]/50">
            Your Progress
          </span>
          <p className="text-[var(--text)] font-bold text-lg mt-0.5 leading-tight">
            Lesson {displayLesson} <span className="font-medium text-[var(--text)]/50">of {totalLessons}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-[22px] font-black text-[var(--text)]">{progressPercentage}%</span>
          <p className="text-[11px] font-bold tracking-wider uppercase text-[var(--text)]/40 mt-0.5">Completed</p>
        </div>
      </div>
      <div className="w-full h-1.5 bg-bg-sunk rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-700 ease-out rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
