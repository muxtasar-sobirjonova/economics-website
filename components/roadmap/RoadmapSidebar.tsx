"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { switchTrackAction } from "@/app/actions/user";

export function getLeagueData(totalXP: number) {
  if (totalXP < 100) return { name: "Bronze", min: 0, max: 100, next: "Silver" };
  if (totalXP < 250) return { name: "Silver", min: 100, max: 250, next: "Gold" };
  if (totalXP < 500) return { name: "Gold", min: 250, max: 500, next: "Platinum" };
  if (totalXP < 1000) return { name: "Platinum", min: 500, max: 1000, next: "Diamond" };
  return { name: "Diamond", min: 1000, max: 1000, next: null };
}

const TRACKS = [
  { id: "ENTREPRENEURSHIP_ECONOMICS", name: "Entrepreneurship" },
  { id: "DEVELOPMENT_ECONOMICS", name: "Development" },
  { id: "BEHAVIORAL_ECONOMICS", name: "Behavioral" },
] as const;

export const RoadmapSidebar = ({
  serverTotalXP,
  activeTrack,
  progressByTrack = {},
  rank,
  mistakesCount = 0,
  notesCount = 0,
}: {
  serverTotalXP: number;
  activeTrack: string;
  progressByTrack?: Record<string, { currentDay: number; xp: number } | undefined>;
  rank?: number | null;
  mistakesCount?: number;
  notesCount?: number;
}) => {
  const [isPending, startTransition] = useTransition();
  const league = getLeagueData(serverTotalXP);
  const toNext = Math.max(0, league.max - serverTotalXP);
  const pct = league.next
    ? Math.max(0, Math.min(100, ((serverTotalXP - league.min) / (league.max - league.min)) * 100))
    : 100;

  const switchTo = (trackId: string) => {
    if (trackId === activeTrack) return;
    startTransition(async () => {
      try {
        await switchTrackAction(trackId);
      } catch (err) {
        console.error("Failed to switch track:", err);
      }
    });
  };

  return (
    <aside className="w-full xl:w-[300px] shrink-0 flex flex-col gap-s3 xl:overflow-y-auto">
      {/* Your track */}
      <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s4">
        <h2 className="text-label uppercase text-faint mb-s3">Your track</h2>
        <div className="grid gap-s1">
          {TRACKS.map((t) => {
            const p = progressByTrack[t.id];
            const on = activeTrack === t.id;
            const started = Boolean(p && (p.currentDay > 1 || p.xp > 0));
            return (
              <button
                key={t.id}
                onClick={() => switchTo(t.id)}
                disabled={isPending || on}
                aria-current={on ? "true" : undefined}
                className={`flex items-center justify-between gap-s3 px-s3 py-s2 rounded-md text-left transition-colors min-h-[44px] ${
                  on ? "bg-accent-soft" : "hover:bg-bg-sunk disabled:opacity-60"
                }`}
              >
                <span className={`text-ui ${on ? "text-accent-strong font-semibold" : "text-ink"}`}>
                  {t.name}
                </span>
                <span className="font-mono text-meta text-faint tabular shrink-0">
                  {started && p ? `day ${p.currentDay} of 56` : "not started"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* League */}
      <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s4">
        <div className="flex items-baseline justify-between gap-s3 mb-s3">
          <h2 className="text-label uppercase text-faint">League</h2>
          {rank ? (
            <span className="font-mono text-meta text-muted tabular">rank {rank}</span>
          ) : null}
        </div>

        <div className="flex items-baseline gap-s3">
          <span className="text-h3 font-semibold text-ink">{league.name}</span>
          <span className="font-mono text-meta text-muted tabular">
            {serverTotalXP.toLocaleString()} XP
          </span>
        </div>

        <p className="text-meta text-muted mt-1">
          {league.next ? `${toNext.toLocaleString()} XP to ${league.next}` : "Top league — nothing above this."}
        </p>

        <div className="w-full bg-bg-sunk h-1 rounded-sm overflow-hidden mt-s3">
          <div className="h-full rounded-sm bg-reward transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </section>

      {/* Quick links */}
      <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
        {[
          { href: "/review", label: "Review mistakes", count: mistakesCount },
          { href: "/saved", label: "My notes", count: notesCount },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center justify-between gap-s3 px-s4 py-s3 border-b border-line last:border-b-0 hover:bg-bg-sunk transition-colors min-h-[48px]"
          >
            <span className="text-ui text-ink">{l.label}</span>
            <span className="font-mono text-meta text-faint tabular">{l.count}</span>
          </Link>
        ))}
      </section>
    </aside>
  );
};
