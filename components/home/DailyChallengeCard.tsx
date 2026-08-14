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
    <section className="bg-surface border border-line rounded-lg shadow-sh1 p-s4 lg:p-s5 w-full lg:w-[320px] shrink-0 flex flex-col">
      <div className="flex items-baseline justify-between gap-s2 mb-s3">
        <h3 className="text-label uppercase text-faint">Daily challenge</h3>
        <span className="text-label uppercase text-faint">Optional</span>
      </div>

      <p className="text-ui text-ink mb-s4">
        {challenge.prompt}
      </p>

      <DailyChallengeInput
        challengeId={challengeId}
        initialContent={initialNote}
      />

      <p className="text-meta text-faint mt-s3">
        No right or wrong answers &mdash; one honest sentence is enough.
      </p>
    </section>
  );
}
