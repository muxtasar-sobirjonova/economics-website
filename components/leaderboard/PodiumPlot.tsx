import React from "react";
import type { BoardEntry } from "@/lib/leaderboard";

/**
 * Each place is cast in its own metal, so the standings read at a glance
 * before you get to the names. Rank is still measured in what people built —
 * the metal only colours the building, it never replaces it.
 */
const PLACE = {
  1: {
    label: "Grand champion",
    height: 66,
    pad: "",
    metal: "gold",
    top: "var(--gold-top)",
    left: "var(--gold-left)",
    right: "var(--gold-right)",
    ink: "var(--gold-ink)",
  },
  2: {
    label: "Runner up",
    height: 50,
    pad: "sm:pt-s6",
    metal: "silver",
    top: "var(--silver-top)",
    left: "var(--silver-left)",
    right: "var(--silver-right)",
    ink: "var(--silver-ink)",
  },
  3: {
    label: "Third place",
    height: 40,
    pad: "sm:pt-s7",
    metal: "bronze",
    top: "var(--bronze-top)",
    left: "var(--bronze-left)",
    right: "var(--bronze-right)",
    ink: "var(--bronze-ink)",
  },
} as const;

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
  const glow = `podium-glow-${place}`;

  return (
    <div className={`flex-1 flex flex-col items-center text-center min-w-0 ${meta.pad}`}>
      <svg viewBox="-80 -110 160 150" className="w-full max-w-[150px]" aria-hidden>
        <defs>
          {/* A pool of the place's own metal, so the champion sits in warmer light */}
          <radialGradient id={glow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={meta.left} stopOpacity={place === 1 ? ".38" : ".22"} />
            <stop offset="100%" stopColor={meta.left} stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="0" cy="4" rx="74" ry="36" fill={`url(#${glow})`} />
        <polygon points="0,-30 66,0 0,30 -66,0" fill="var(--ground)" stroke={meta.right} strokeWidth="1.2" opacity=".9" />
        <polygon points="30,10 76,36 4,36 -16,24" fill="var(--vol-shadow)" />
        <polygon points={`-34,${-h} 0,${-h + 20} 0,18 -34,-2`} fill={meta.left} />
        <polygon points={`0,${-h + 20} 34,${-h} 34,-2 0,18`} fill={meta.right} />
        <polygon points={`0,${-h - 20} 34,${-h} 0,${-h + 20} -34,${-h}`} fill={meta.top} />
        <polygon points={`-24,${-h + 11} -13,${-h + 17} -13,${-h + 27} -24,${-h + 21}`} fill="var(--vol-window)" opacity=".85" />
        <polygon points={`13,${-h + 17} 24,${-h + 11} 24,${-h + 21} 13,${-h + 27}`} fill="var(--vol-window)" opacity=".45" />
      </svg>

      <span
        className="inline-grid place-items-center w-7 h-7 rounded-full font-mono text-meta font-semibold tabular -mt-s2 mb-s2 border"
        style={{ color: meta.ink, background: meta.top, borderColor: meta.right }}
      >
        {place}
      </span>

      <span className="font-mono text-label uppercase" style={{ color: meta.ink }}>
        {meta.label}
      </span>
      {/* Wraps rather than truncates: on a phone each column is barely wider
          than one word, and a name cut to "Nigor…" tells the reader nothing. */}
      <h3
        className={`text-meta sm:text-h3 font-semibold mt-1 pb-[3px] w-full px-s1 break-words ${entry.isYou ? "text-accent-strong" : "text-ink"}`}
      >
        {entry.isYou ? `You · ${entry.username || "Anonymous"}` : entry.username || "Anonymous"}
      </h3>
      <p className="font-mono text-meta text-muted tabular mt-1">
        {entry.lessonsCompleted} {entry.lessonsCompleted === 1 ? "lesson" : "lessons"}
      </p>
    </div>
  );
}
