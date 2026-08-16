"use client";

import React from "react";

/**
 * One plot per chapter, on an isometric grid. Geometry is taken verbatim from
 * the design: a ground tile is a 140×80 diamond, the chain steps ±124 in x and
 * +72 in y, and the direction flips every two steps so the plot zigzags.
 *
 * A completed day carries a building, the active day is a poured foundation
 * with dashed intent, and a locked day is bare ground.
 */

const STEP_X = 124;
const STEP_Y = 72;
const ORIGIN = { x: 300, y: 120 };

export type DayState = "done" | "active" | "locked";

export interface PlotDay {
  dayOrder: number;
  title: string;
  state: DayState;
  isQuiz?: boolean;
  score?: number | null;
  xp?: number | null;
  href?: string;
}

/** Two steps right, two steps left, repeating — the zigzag from the design. */
export function plotPos(index: number) {
  let x = ORIGIN.x;
  for (let i = 1; i <= index; i++) {
    const goRight = Math.floor((i - 1) / 2) % 2 === 0;
    x += goRight ? STEP_X : -STEP_X;
  }
  return { x, y: ORIGIN.y + index * STEP_Y };
}

const GroundTile = () => (
  <polygon
    points="0,-40 70,0 0,40 -70,0"
    fill="var(--ground)"
    stroke="var(--ground-edge)"
    strokeWidth="1.2"
  />
);

const Building = () => (
  <>
    <polygon points="40,14 96,46 8,46 -20,30" fill="var(--vol-shadow)" />
    <polygon points="-44,-44 0,-19 0,25 -44,0" fill="var(--vol-left)" />
    <polygon points="0,-19 44,-44 44,0 0,25" fill="var(--vol-right)" />
    <polygon points="0,-69 44,-44 0,-19 -44,-44" fill="var(--vol-top)" />
    <polygon points="-31,-29 -17,-21 -17,-8 -31,-16" fill="var(--vol-window)" opacity=".85" />
    <polygon points="-31,-8 -17,0 -17,13 -31,5" fill="var(--vol-window)" opacity=".5" />
    <polygon points="17,-21 31,-29 31,-16 17,-8" fill="var(--accent)" opacity=".45" />
  </>
);

const Foundation = () => (
  <>
    <polygon points="40,14 96,46 8,46 -20,30" fill="var(--vol-shadow)" opacity=".7" />
    <polygon points="-44,-18 0,7 0,25 -44,0" fill="var(--plinth-left)" />
    <polygon points="0,7 44,-18 44,0 0,25" fill="var(--plinth-right)" />
    <polygon points="0,-43 44,-18 0,7 -44,-18" fill="var(--plinth-top)" />
    {/* The volume it is about to become */}
    <polygon
      points="-44,0 -44,-44 0,-69 44,-44 44,0 0,25"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.6"
      strokeDasharray="6 6"
      opacity=".85"
    />
  </>
);

const BareGround = () => (
  <polygon
    points="0,-28 49,0 0,28 -49,0"
    fill="none"
    stroke="var(--ground-edge)"
    strokeWidth="1.2"
    strokeDasharray="5 7"
  />
);

/** Small tag beside a finished day. */
const DoneTag = ({ x, y, day, score, xp }: { x: number; y: number; day: number; score?: number | null; xp?: number | null }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-44" y="-15" width="88" height="30" rx="8" fill="var(--surface)" stroke="var(--border)" />
    <text x="0" y="-1" textAnchor="middle" style={{ font: "600 10px var(--font-mono), monospace", fill: "var(--success)" }}>
      DAY {day}
    </text>
    <text x="0" y="10" textAnchor="middle" style={{ font: "500 9.5px var(--font-literata), Georgia, serif", fill: "var(--muted)" }}>
      {score != null ? `${score}/10` : "cleared"}{xp ? ` · +${xp} XP` : ""}
    </text>
  </g>
);

export function IsoPlot({
  days,
  onSelect,
  activitiesLeft,
  ariaLabel,
}: {
  days: PlotDay[];
  onSelect: (day: PlotDay) => void;
  activitiesLeft?: number;
  ariaLabel: string;
}) {
  const pos = days.map((_, i) => plotPos(i));

  const activeIndex = days.findIndex((d) => d.state === "active");

  // The viewBox is measured from what is actually drawn — tile, volume and any
  // label a tile carries — so nothing clips and no dead space is left over.
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const ext = (x1: number, x2: number, y1: number, y2: number) => {
    if (x1 < minX) minX = x1;
    if (x2 > maxX) maxX = x2;
    if (y1 < minY) minY = y1;
    if (y2 > maxY) maxY = y2;
  };

  days.forEach((day, i) => {
    const { x, y } = pos[i];
    ext(x - 70, x + 70, y - 40, y + 40);                       // ground tile
    if (day.state === "done") {
      ext(x - 44, x + 96, y - 69, y + 46);                     // building + shadow
      ext(x - 130, x - 42, y - 51, y - 21);                    // its tag
    }
    if (day.state === "active") {
      ext(x - 44, x + 96, y - 69, y + 46);                     // dashed volume
      ext(x - 92, x + 92, y - 158, y - 106);                   // "build it" callout
      if (activitiesLeft) ext(x - 58, x + 58, y + 50, y + 74); // activities pill
    }
    if (day.state === "locked" && !day.isQuiz) ext(x - 84, x + 8, y + 16, y + 44);
    if (day.isQuiz && day.state !== "done") ext(x + 58, x + 174, y - 12, y + 20);
  });

  const M = 12;
  minX -= M; maxX += M; minY -= M; maxY += M;
  const lockedRun = days
    .map((d, i) => ({ d, i }))
    .filter(({ d }) => d.state === "locked" && !d.isQuiz);

  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      className="w-full h-auto block"
      role="img"
      aria-label={ariaLabel}
    >
      {days.map((day, i) => {
        const { x, y } = pos[i];
        const interactive = day.state !== "locked";
        return (
          <g
            key={`${day.dayOrder}-${day.isQuiz ? "q" : "d"}`}
            transform={`translate(${x}, ${y})`}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label={`Day ${day.dayOrder}: ${day.title} — ${
              day.state === "done" ? "completed" : day.state === "active" ? "ready to start" : "locked"
            }`}
            onClick={interactive ? () => onSelect(day) : undefined}
            onKeyDown={
              interactive
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(day);
                    }
                  }
                : undefined
            }
            className={interactive ? "cursor-pointer focus:outline-none" : undefined}
          >
            <GroundTile />
            {day.state === "done" && <Building />}
            {day.state === "active" && <Foundation />}
            {day.state === "locked" && <BareGround />}
          </g>
        );
      })}

      {/* Tags sit above the tiles so a building never covers one. */}
      {days.map((day, i) =>
        day.state === "done" ? (
          <DoneTag
            key={`tag-${day.dayOrder}`}
            x={pos[i].x - 86}
            y={pos[i].y - 36}
            day={day.dayOrder}
            score={day.score}
          />
        ) : null
      )}

      {/* The day you are on */}
      {activeIndex >= 0 && (
        <g transform={`translate(${pos[activeIndex].x}, ${pos[activeIndex].y - 132})`} pointerEvents="none">
          <rect x="-92" y="-26" width="184" height="52" rx="10" fill="var(--accent)" opacity=".14" />
          <rect x="-92" y="-26" width="184" height="52" rx="10" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5" />
          <text x="0" y="-7" textAnchor="middle" style={{ font: "600 10px var(--font-literata), Georgia, serif", letterSpacing: ".14em", fill: "var(--accent-strong)" }}>
            DAY {days[activeIndex].dayOrder} · BUILD IT
          </text>
          <text x="0" y="9" textAnchor="middle" style={{ font: "500 11px var(--font-literata), Georgia, serif", fill: "var(--text)" }}>
            {days[activeIndex].title.length > 26 ? `${days[activeIndex].title.slice(0, 25)}…` : days[activeIndex].title}
          </text>
        </g>
      )}

      {activeIndex >= 0 && typeof activitiesLeft === "number" && activitiesLeft > 0 && (
        <g transform={`translate(${pos[activeIndex].x}, ${pos[activeIndex].y + 36})`} pointerEvents="none">
          <path d="M0 0 l0 14" stroke="var(--accent)" strokeWidth="1.5" />
          <rect x="-58" y="14" width="116" height="24" rx="12" fill="var(--accent)" />
          <text x="0" y="30" textAnchor="middle" style={{ font: "600 11px var(--font-literata), Georgia, serif", letterSpacing: ".06em", fill: "#FFFFFF" }}>
            {activitiesLeft} {activitiesLeft === 1 ? "ACTIVITY" : "ACTIVITIES"} LEFT
          </text>
        </g>
      )}

      {/* One tag for the whole locked stretch, as in the design */}
      {lockedRun.length > 0 && (() => {
        const mid = lockedRun[Math.floor(lockedRun.length / 2)];
        const first = lockedRun[0].d.dayOrder;
        const last = lockedRun[lockedRun.length - 1].d.dayOrder;
        return (
          <g transform={`translate(${pos[mid.i].x - 38}, ${pos[mid.i].y + 30})`} pointerEvents="none">
            <rect x="-46" y="-14" width="92" height="28" rx="8" fill="var(--bg-sunk)" stroke="var(--border)" />
            <text x="0" y="4" textAnchor="middle" style={{ font: "500 10.5px var(--font-literata), Georgia, serif", fill: "var(--faint)" }}>
              {first === last ? `DAY ${first} LOCKED` : `DAYS ${first}–${last} LOCKED`}
            </text>
          </g>
        );
      })()}

      {/* The chapter review closes the plot */}
      {days.map((day, i) =>
        day.isQuiz && day.state !== "done" ? (
          <g key="quiz-tag" transform={`translate(${pos[i].x + 116}, ${pos[i].y + 4})`} pointerEvents="none">
            <rect x="-58" y="-16" width="116" height="32" rx="8" fill="var(--reward-soft)" stroke="var(--reward)" strokeWidth="1.2" />
            <text x="0" y="-1" textAnchor="middle" style={{ font: "600 10px var(--font-literata), Georgia, serif", letterSpacing: ".1em", fill: "var(--reward)" }}>
              DAY {day.dayOrder} · REVIEW
            </text>
            <text x="0" y="10" textAnchor="middle" style={{ font: "500 9.5px var(--font-literata), Georgia, serif", fill: "var(--muted)" }}>
              closes the chapter
            </text>
          </g>
        ) : null
      )}
    </svg>
  );
}
