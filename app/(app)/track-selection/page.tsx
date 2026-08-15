import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Track } from "@prisma/client";
import { TrackSelectionClient } from "@/components/TrackSelectionClient";

export default async function TrackSelectionPage() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeTrack: true }
  });

  // Each track keeps its own progress, so the cards can show where you stand
  // on every one of them rather than a bare list of names.
  const progress = await prisma.trackProgress.findMany({
    where: { userId },
    select: { track: true, currentDay: true, xp: true },
  });

  const progressByTrack = Object.fromEntries(
    progress.map((p) => [p.track, { currentDay: p.currentDay, xp: p.xp }])
  ) as Record<Track, { currentDay: number; xp: number } | undefined>;

  return (
    <div className="min-h-screen bg-bg bg-sky flex flex-col items-center px-s4 py-s8">
      <div className="max-w-[820px] w-full mb-s6">
        <span className="font-mono text-label uppercase text-accent-strong">Track selection</span>
        <h1 className="text-h1 font-semibold text-ink mt-s3 text-balance">
          Pick the plot you want to build
        </h1>
        <p className="text-ui text-muted mt-s3 max-w-[62ch]">
          Each track is its own 56 days, its own eight chapters and its own
          progress. You can switch any time &mdash; nothing you built is lost.
        </p>
      </div>

      <TrackSelectionClient
        currentTrack={user?.activeTrack || null}
        progressByTrack={progressByTrack}
      />
    </div>
  );
}
