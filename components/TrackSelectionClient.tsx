"use client";

import React, { useTransition, useState } from "react";
import { switchTrackAction } from "@/app/actions/user";
import { useRouter } from "next/navigation";

interface TrackProgress {
  currentDay: number;
  xp: number;
}

interface TrackSelectionClientProps {
  currentTrack: string | null;
  progressByTrack?: Record<string, TrackProgress | undefined>;
}

const TRACKS = [
  {
    id: "ENTREPRENEURSHIP_ECONOMICS",
    name: "Entrepreneurship",
    blurb: "Pricing, moats, margins and the decisions founders actually face.",
    tone: "quiz",
  },
  {
    id: "DEVELOPMENT_ECONOMICS",
    name: "Development",
    blurb: "Why some countries grow and others stall — institutions, aid, trade.",
    tone: "article",
  },
  {
    id: "BEHAVIORAL_ECONOMICS",
    name: "Behavioral",
    blurb: "The gap between the rational buyer in the model and the one in the shop.",
    tone: "concept",
  },
] as const;

export function TrackSelectionClient({ currentTrack, progressByTrack = {} }: TrackSelectionClientProps) {
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  const choose = (trackId: string) => {
    if (trackId === currentTrack) {
      router.push("/home");
      return;
    }
    setBusyId(trackId);
    startTransition(async () => {
      try {
        const res = await switchTrackAction(trackId);
        if (!res.success) {
          console.error("Failed to switch track:", res.error);
          setBusyId(null);
          return;
        }
        router.push("/home");
        router.refresh();
      } catch (err) {
        console.error("Failed to switch track:", err);
        setBusyId(null);
      }
    });
  };

  return (
    <div className="w-full max-w-[820px] flex flex-col gap-s3">
      {TRACKS.map((track) => {
        const p = progressByTrack[track.id];
        const started = Boolean(p && (p.currentDay > 1 || p.xp > 0));
        const isCurrent = currentTrack === track.id;
        const busy = busyId === track.id && isPending;

        const cta = isCurrent ? "Continue" : started ? "Switch to this" : "Break ground";

        return (
          <section
            key={track.id}
            className={`rounded-lg border bg-surface shadow-sh1 p-s5 flex flex-col sm:flex-row sm:items-center gap-s4 ${
              isCurrent ? "border-accent" : "border-line"
            }`}
          >
            <span
              aria-hidden
              className="w-1 h-full min-h-[3rem] rounded-sm shrink-0 hidden sm:block"
              style={{ background: `var(--${track.tone})` }}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-s3 flex-wrap">
                <h2 className="text-h3 font-semibold text-ink pb-[2px]">{track.name}</h2>
                {isCurrent && (
                  <span className="text-label uppercase px-s2 py-1 rounded-sm bg-accent-soft text-accent-strong">
                    Current
                  </span>
                )}
              </div>
              <p className="text-meta text-muted mt-s2 max-w-[58ch]">{track.blurb}</p>
              <p className="font-mono text-meta text-faint tabular mt-s3">
                {started && p
                  ? `day ${p.currentDay} of 56 · ${p.xp.toLocaleString()} XP`
                  : "not started · empty lot"}
              </p>
            </div>

            <button
              onClick={() => choose(track.id)}
              disabled={isPending}
              className={`shrink-0 px-s5 py-s3 rounded-md text-ui font-semibold transition-colors min-h-[44px] disabled:opacity-50 ${
                isCurrent
                  ? "bg-accent text-on-accent hover:bg-accent-strong"
                  : "border border-line-strong text-ink hover:border-accent hover:text-accent"
              }`}
            >
              {busy ? "Switching…" : cta}
            </button>
          </section>
        );
      })}
    </div>
  );
}
