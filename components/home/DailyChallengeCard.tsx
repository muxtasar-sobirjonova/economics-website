import React from "react";
import { DAILY_CHALLENGES } from "@/lib/challenges";

export function DailyChallengeCard() {
  // Simple date-based rotation
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const dayOfYear = getDayOfYear();
  const challenge = DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full md:w-[350px] shrink-0 flex flex-col justify-between">
      <div>
        <h3 className="font-[700] text-[18px] text-[#362A5C] mb-4 flex items-center gap-2">
          💡 Daily Challenge
        </h3>
        
        <p className="text-[15px] leading-relaxed text-gray-700 mb-6">
          {challenge.prompt}
        </p>
      </div>

      <button className="w-full py-3 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors font-[700] rounded-xl text-[14px]">
        Reflect
      </button>
    </div>
  );
}
