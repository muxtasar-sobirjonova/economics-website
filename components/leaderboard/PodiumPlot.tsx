import React from "react";
import type { BoardEntry } from "@/lib/leaderboard";

const PLACE = {
  1: { label: "Grand champion", height: 66, pad: "" },
  2: { label: "Runner up", height: 50, pad: "sm:pt-s6" },
  3: { label: "Third place", height: 40, pad: "sm:pt-s7" },
} as const;

/**
 * Rank is measured in what people built, so each place is a plot with a
 * building on it rather than a medal.
 */
export function PodiumPlot({ place, entry }: { place: 1 | 2 | 3; entry?: BoardEntry }) {
  const meta = PLACE[place];

  if (!entry) {
    return (
      <div className={`flex-1 flex flex-col items-center text-center ${meta.pad}`}>
        <svg viewBox="-80 -110 160 150" className="w-full max-w-[150px]" aria-hidden>
          <polygon points="0,-30 66,0 0,30 -66,0" fill="var(--ground)" stroke="var(--ground-edge)" strokeWidth="1.2" />
          <polygon points="0,-21 46,0 0,21 -46,0" fill="none" stroke="var(--ground-edge)" strokeWidth="1.2" strokeDasharray="5 7" />
        </svg>
        <span className="font-mono text-label uppercase text-faint">{meta.label}</span>
        <p className="text-meta text-faint mt-s2">Empty lot</p>
      </div>
    );
  }

  const h = meta.height;

  return (
    <div className={`flex-1 flex flex-col items-center text-center min-w-0 ${meta.pad}`}>
      <svg viewBox="-80 -110 160 150" className="w-full max-w-[150px]" aria-hidden>
        <polygon points="0,-30 66,0 0,30 -66,0" fill="var(--ground)" stroke="var(--ground-edge)" strokeWidth="1.2" />
        <polygon points="30,10 76,36 4,36 -16,24" fill="var(--vol-shadow)" />
        <polygon points={`-34,${-h} 0,${-h + 20} 0,18 -34,-2`} fill="var(--vol-left)" />
        <polygon points={`0,${-h + 20} 34,${-h} 34,-2 0,18`} fill="var(--vol-right)" />
        <polygon points={`0,${-h - 20} 34,${-h} 0,${-h + 20} -34,${-h}`} fill="var(--vol-top)" />
        <polygon points={`-24,${-h + 11} -13,${-h + 17} -13,${-h + 27} -24,${-h + 21}`} fill="var(--vol-window)" opacity=".85" />
        <polygon points={`13,${-h + 17} 24,${-h + 11} 24,${-h + 21} 13,${-h + 27}`} fill="var(--vol-window)" opacity=".45" />
      </svg>

      <span className="font-mono text-label uppercase text-faint">{meta.label}</span>
      <h3 className={`text-h3 font-semibold mt-1 pb-[3px] truncate w-full px-s2 ${entry.isYou ? "text-accent-strong" : "text-ink"}`}>
        {entry.isYou ? `You · ${entry.username || "Anonymous"}` : entry.username || "Anonymous"}
      </h3>
      <p className="font-mono text-meta text-muted tabular mt-1">
        {entry.lessonsCompleted} {entry.lessonsCompleted === 1 ? "lesson" : "lessons"}
      </p>
    </div>
  );
}
