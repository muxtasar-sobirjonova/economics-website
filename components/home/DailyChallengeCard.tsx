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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full md:w-[320px] shrink-0 flex flex-col relative">
      <div className="absolute top-4 right-4 bg-[#F0FDF4] text-[#166534] text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-md border border-[#DCFCE7]">
        Optional
      </div>
      
      <h3 className="font-[700] text-[16px] text-[#362A5C] mb-3 flex items-center gap-2">
        💡 Daily Challenge
      </h3>
      
      <p className="text-[14px] leading-relaxed text-gray-700 mb-4">
        {challenge.prompt}
      </p>

      <div className="bg-amber-50 border border-amber-100/50 rounded-xl p-3 mb-4">
        <h4 className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">✨ Hint</h4>
        <p className="text-[13px] text-amber-900/80 leading-relaxed">
          Think about what customers truly value, what they're missing today, or what existing assumption you could challenge.
        </p>
      </div>

      <textarea
        placeholder="✏️ Write your thoughts here..."
        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/30 resize-none min-h-[80px]"
      />
    </div>
  );
}
