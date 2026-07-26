import React from "react";
import { DAILY_CHALLENGES } from "@/lib/challenges";
import { prisma } from "@/lib/prisma";
import { DailyChallengeInput } from "./DailyChallengeInput";

export async function DailyChallengeCard({ userId }: { userId?: string }) {
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const dayOfYear = getDayOfYear();
  const challenge = DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
  const challengeId = `day-${dayOfYear}`;

  let initialNote = "";
  if (userId) {
    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { activeTrack: true }
    });
    const activeTrack = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

    const note = await prisma.note.findFirst({
      where: {
        userId,
        source: `DailyChallenge-${challengeId}`,
        track: activeTrack
      }
    });
    if (note) {
      initialNote = note.content;
    }
  }

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 w-full md:w-[320px] shrink-0 flex flex-col relative">
      <div className="absolute top-6 right-6 bg-purple-100/50 text-purple-600 text-[11px] font-bold tracking-wide px-3 py-1 rounded-full">
        Optional
      </div>
      
      <h3 className="font-bold text-[17px] text-[#1A1A3E] mb-3 flex items-center gap-2">
        💡 Daily Challenge
      </h3>
      
      <p className="text-[14px] leading-[1.6] text-slate-700 mb-4">
        {challenge.prompt}
      </p>

      <div className="bg-purple-50/50 border border-dashed border-purple-200 rounded-[16px] p-4 mb-4">
        <h4 className="text-[13px] font-bold text-purple-600 mb-1 flex items-center gap-1.5">
          <span className="text-sm">✨</span> Hint
        </h4>
        <p className="text-[13px] text-slate-600 leading-relaxed">
          Think about what customers truly value, what they&apos;re missing right now, or what experience doesn&apos;t exist yet.
        </p>
      </div>

      <DailyChallengeInput 
        challengeId={challengeId} 
        initialContent={initialNote} 
      />
      
      <div className="text-[12px] font-medium text-slate-400 mt-3 text-left">
        This is optional. No right or wrong answers!
      </div>
    </div>
  );
}
