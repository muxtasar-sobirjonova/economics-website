import React from "react";
import type { RatingPoint } from "@/lib/duel/engine";
import { START_RATING } from "@/lib/duel/elo";

/**
 * Where the rating has been.
 *
 * A single number says nothing about direction, which is most of what a player
 * wants to know. Drawn server-side as a plain path — no library, no client
 * bundle, and it renders before any JavaScript arrives.
 */
const W = 600;
const H = 120;
const PAD = 8;

export function RatingGraph({ points }: { points: RatingPoint[] }) {
  if (points.length < 2) return null;

  const series = [{ rating: START_RATING }, ...points];
  const values = series.map((p) => p.rating);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  // A flat run would divide by zero and, drawn edge to edge, would also
  // exaggerate a rating that has barely moved.
  const span = Math.max(hi - lo, 40);
  const mid = (hi + lo) / 2;
  const top = mid + span / 2;

  const x = (i: number) => PAD + (i / (series.length - 1)) * (W - PAD * 2);
  const y = (v: number) => PAD + ((top - v) / span) * (H - PAD * 2);

  const line = series.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.rating).toFixed(1)}`).join(" ");
  const area = `${line} L${x(series.length - 1).toFixed(1)},${H} L${x(0).toFixed(1)},${H} Z`;

  const last = points[points.length - 1];
  const net = last.rating - START_RATING;

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="flex items-baseline justify-between gap-s3 flex-wrap px-s4 py-s3 border-b border-line bg-bg-sunk">
        <h3 className="text-label uppercase text-faint">Rating</h3>
        <span className="font-mono text-meta tabular" style={{ color: net >= 0 ? "var(--success)" : "var(--danger)" }}>
          {net > 0 ? "+" : ""}
          {net} over {points.length} {points.length === 1 ? "duel" : "duels"}
        </span>
      </div>

      <div className="px-s4 py-s4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img"
          aria-label={`Rating went from ${START_RATING} to ${last.rating} over ${points.length} duels`}>
          <defs>
            <linearGradient id="ratingFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity=".22" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Where you started, so a line above it reads as progress */}
          <line x1={PAD} y1={y(START_RATING)} x2={W - PAD} y2={y(START_RATING)}
            stroke="var(--border)" strokeWidth="1" strokeDasharray="4 5" />

          <path d={area} fill="url(#ratingFill)" />
          <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2"
            strokeLinejoin="round" strokeLinecap="round" />

          {series.map((p, i) =>
            i === 0 ? null : (
              <circle key={i} cx={x(i)} cy={y(p.rating)} r={i === series.length - 1 ? 4 : 2.5}
                fill={i === series.length - 1 ? "var(--accent)" : "var(--surface)"}
                stroke="var(--accent)" strokeWidth="1.5" />
            )
          )}
        </svg>

        <div className="flex items-baseline justify-between gap-s3 mt-s2">
          <span className="font-mono text-label uppercase text-faint">start {START_RATING}</span>
          <span className="font-mono text-label uppercase text-faint">
            low {lo} · high {hi}
          </span>
          <span className="font-mono text-meta text-ink tabular">{last.rating}</span>
        </div>
      </div>
    </section>
  );
}
