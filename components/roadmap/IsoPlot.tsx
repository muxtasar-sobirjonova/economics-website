"use client";

import React from "react";

/**
 * The roadmap metaphor: one plot per chapter, laid on an isometric grid.
 * A completed day carries a building, the active day is a foundation with
 * dashed intent, and a locked day is bare ground.
 *
 * Positions are generated from the day list, so a chapter of 7 and a chapter
 * of 70 both lay out correctly.
 */

const TILE_W = 140;
const TILE_H = 80;
const PER_ROW = 3;

export type DayState = "done" | "active" | "locked";

export interface PlotDay {
  dayOrder: number;
  title: string;
  state: DayState;
  isQuiz?: boolean;
  href?: string;
}

/** Serpentine index -> isometric cell, so the road never has to jump. */
function cellOf(index: number) {
  const row = Math.floor(index / PER_ROW);
  const inRow = index % PER_ROW;
  const col = row % 2 === 0 ? inRow : PER_ROW - 1 - inRow;
  return { row, col };
}

function isoPos(index: number) {
  const { row, col } = cellOf(index);
  return {
    x: (col - row) * (TILE_W / 2),
    y: (col + row) * (TILE_H / 2),
  };
}

const GroundTile = ({ dashed }: { dashed?: boolean }) => (
  <polygon
    points={`0,${-TILE_H / 2} ${TILE_W / 2},0 0,${TILE_H / 2} ${-TILE_W / 2},0`}
    fill="var(--ground)"
    stroke={dashed ? "var(--accent)" : "var(--ground-edge)"}
    strokeWidth={dashed ? 2 : 1.2}
    strokeDasharray={dashed ? "7 6" : undefined}
  />
);

/** A finished day: plinth shadow, two side faces, a lit roof and two windows. */
const Building = ({ tall }: { tall?: boolean }) => {
  const h = tall ? 60 : 44;
  return (
    <g>
      <polygon points="34,12 84,40 6,40 -18,26" fill="var(--vol-shadow)" />
      <polygon points={`-38,${-h} 0,${-h + 22} 0,22 -38,0`} fill="var(--vol-left)" />
      <polygon points={`0,${-h + 22} 38,${-h} 38,0 0,22`} fill="var(--vol-right)" />
      <polygon points={`0,${-h - 22} 38,${-h} 0,${-h + 22} -38,${-h}`} fill="var(--vol-top)" />
      <polygon
        points={`-27,${-h + 12} -15,${-h + 19} -15,${-h + 30} -27,${-h + 23}`}
        fill="var(--vol-window)"
        opacity=".85"
      />
      <polygon
        points={`15,${-h + 19} 27,${-h + 12} 27,${-h + 23} 15,${-h + 30}`}
        fill="var(--vol-window)"
        opacity=".45"
      />
    </g>
  );
};

/** The day you are on: a poured foundation waiting for its volume. */
const Foundation = () => (
  <g>
    <polygon points="0,-14 34,4 0,22 -34,4" fill="var(--plinth)" />
    <polygon points="0,-22 38,0 0,22 -38,0" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 5" />
    <circle r="26" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity=".45" className="animate-ringpulse" />
    <path d="M-5,-9 L8,-1 L-5,7 Z" fill="var(--accent)" />
  </g>
);

const Padlock = () => (
  <g opacity=".7">
    <rect x="-7" y="-3" width="14" height="11" rx="2" fill="var(--faint)" />
    <path d="M-3.5,-3 v-3.5 a3.5,3.5 0 0,1 7,0 v3.5" fill="none" stroke="var(--faint)" strokeWidth="1.8" />
  </g>
);

function depthKey(index: number) {
  const { row, col } = cellOf(index);
  return { depth: row + col, row };
}

export function IsoPlot({
  days,
  onSelect,
  ariaLabel,
}: {
  days: PlotDay[];
  onSelect: (day: PlotDay) => void;
  ariaLabel: string;
}) {
  const positions = days.map((_, i) => isoPos(i));

  // Painter's algorithm: sort by isometric depth, not by day order.
  const drawOrder = days
    .map((_, i) => i)
    .sort((a, b) => {
      const da = depthKey(a);
      const db = depthKey(b);
      return da.depth - db.depth || da.row - db.row;
    });

  const xs = positions.map((p) => p.x);
  const ys = positions.map((p) => p.y);
  const padX = TILE_W;
  const padTop = 120; // headroom for the tallest building and its label
  const padBottom = 80;

  const minX = Math.min(...xs) - padX;
  const maxX = Math.max(...xs) + padX;
  const minY = Math.min(...ys) - padTop;
  const maxY = Math.max(...ys) + padBottom;

  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      className="w-full h-auto block"
      role="img"
      aria-label={ariaLabel}
    >
      {drawOrder.map((i) => {
        const day = days[i];
        const { x, y } = positions[i];
        const interactive = day.state !== "locked";
        const label = day.isQuiz ? "Review quiz" : `Day ${day.dayOrder}`;
        const shortLabel = day.isQuiz ? "QUIZ" : `D${day.dayOrder}`;

        return (
          <g
            key={`${day.dayOrder}-${day.isQuiz ? "q" : "d"}`}
            transform={`translate(${x}, ${y})`}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label={`${label}: ${day.title} — ${
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
            <GroundTile dashed={day.state === "active"} />
            {day.state === "done" && <Building tall={day.isQuiz} />}
            {day.state === "active" && <Foundation />}
            {day.state === "locked" && <Padlock />}

            <text
              textAnchor="middle"
              y={day.state === "active" ? 30 : 26}
              fontSize="10.5"
              letterSpacing="1.2"
              fill={day.state === "active" ? "var(--accent-strong)" : day.state === "done" ? "var(--muted)" : "var(--faint)"}
              style={{ fontFamily: "var(--font-mono), monospace" }}
              opacity={day.state === "done" || day.state === "active" ? 0 : 1}
            >
              {shortLabel}
            </text>
          </g>
        );
      })}

      {/* Drawn last so the marker is never covered by a later tile. */}
      {days.map((day, i) =>
        day.state === "active" ? (
          <g
            key="active-marker"
            transform={`translate(${positions[i].x}, ${positions[i].y - 62})`}
            pointerEvents="none"
          >
            <rect
              x="-72" y="-15" width="144" height="26" rx="13"
              fill="var(--surface)"
              stroke="var(--accent)"
              strokeWidth="1.2"
            />
            <text
              textAnchor="middle"
              y="4"
              fontSize="10.5"
              letterSpacing="1.4"
              fill="var(--accent-strong)"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {day.isQuiz ? "REVIEW · BUILD IT" : `DAY ${day.dayOrder} · BUILD IT`}
            </text>
          </g>
        ) : null
      )}
    </svg>
  );
}
