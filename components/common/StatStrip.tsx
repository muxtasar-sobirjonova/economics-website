"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * The header numbers, with what is inside them.
 *
 * A count on its own ("24 universities") hides the shape of the thing it
 * counts. Each tile keeps its number and gains one composition bar: the
 * segments are the parts, hovering names the part, and where a filter exists
 * for that part the segment links to it — the same readout-and-select pattern
 * the region map and the faculty quarter already use.
 */

export interface Segment {
  label: string;
  value: number;
  /** Token name for a semantic colour ("reward"). Falls back to an accent ramp. */
  tone?: string;
  /** Present when this part can be selected on the page below. */
  href?: string;
}

export interface StatTile {
  label: string;
  value: string;
  /** Shown under the bar until a segment is hovered. */
  caption: string;
  segments: Segment[];
  /** Parts that are counted in the bar but not in the headline number. */
  total?: number;
}

/** Semantic parts keep their own colour; unnamed parts share one hue,
    stepped in opacity so a many-part bar still reads as a single whole. */
function segTone(s: Segment) {
  return s.tone ? `var(--${s.tone})` : "var(--accent)";
}

function segOpacity(s: Segment, i: number, n: number) {
  if (s.tone) return 1;
  return 0.85 - (i / Math.max(1, n - 1)) * 0.6;
}

function Tile({ tile }: { tile: StatTile }) {
  const [hover, setHover] = useState<number | null>(null);
  const sum = tile.total ?? tile.segments.reduce((a, s) => a + s.value, 0);
  const focus = hover != null ? tile.segments[hover] : null;

  return (
    <div className="px-s4 py-s3 border-b border-r border-line sm:border-b-0 last:border-r-0 sm:flex-1 sm:min-w-[152px] min-w-0">
      <div className="text-label uppercase text-faint">{tile.label}</div>
      <div className="font-mono text-h2 text-ink tabular leading-none mt-s2">{tile.value}</div>

      {/* The bar is 7px tall but each part is grabbed through an 18px row, so a
          segment can actually be hit with a mouse or a thumb. */}
      <div
        className="flex gap-[2px] h-[18px] items-center mt-s2 -mb-[5px]"
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label={tile.segments.map((s) => `${s.label}: ${s.value}`).join(", ")}
      >
        {tile.segments.map((s, i) => {
          const pct = sum > 0 ? (s.value / sum) * 100 : 0;
          const lit = hover === null || hover === i;
          const fill = (
            <span
              className="block w-full rounded-[2px]"
              style={{
                height: lit && hover === i ? 11 : 7,
                background: segTone(s),
                opacity: lit ? segOpacity(s, i, tile.segments.length) : 0.22,
                transition: "opacity .12s ease-out, height .12s ease-out",
              }}
            />
          );
          // A segment is a few pixels wide on a phone, which is a mis-tap
          // waiting to happen — so it only becomes clickable where there is a
          // real pointer. Touch users filter from the chips and cards below,
          // and the bar stays what it always was: a picture of the number.
          const box =
            "flex items-center h-full min-w-[3px] pointer-events-none [@media(hover:hover)]:pointer-events-auto";
          const width = { width: `${Math.max(pct, 1.5)}%` };

          if (s.href) {
            return (
              <Link
                key={s.label}
                href={s.href}
                title={`${s.label}: ${s.value}`}
                aria-label={`Filter to ${s.label} — ${s.value}`}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className={box}
                style={width}
              >
                {fill}
              </Link>
            );
          }
          return (
            <span
              key={s.label}
              title={`${s.label}: ${s.value}`}
              onMouseEnter={() => setHover(i)}
              className={box}
              style={width}
            >
              {fill}
            </span>
          );
        })}
      </div>

      {/* Every line the tile can ever show is stacked in one grid cell, so the
          box is sized once by the longest of them. Swapping the caption for a
          segment label then changes no height, and the strip cannot jump under
          the cursor that caused it. */}
      <div className="grid text-meta leading-snug mt-s2">
        <span
          className="col-start-1 row-start-1 text-muted"
          style={{ visibility: focus ? "hidden" : "visible" }}
        >
          {tile.caption}
        </span>
        {tile.segments.map((s, i) => (
          <span
            key={s.label}
            aria-hidden={hover !== i}
            className="col-start-1 row-start-1"
            style={{ visibility: hover === i ? "visible" : "hidden" }}
          >
            <span className="text-ink">{s.label}</span>{" "}
            <span className="font-mono tabular text-faint">{s.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function StatStrip({ tiles }: { tiles: StatTile[] }) {
  return (
    <div className="grid grid-cols-2 sm:flex w-full sm:w-auto border border-line rounded-lg bg-surface shadow-sh1 overflow-hidden">
      {tiles.map((t) => (
        <Tile key={t.label} tile={t} />
      ))}
    </div>
  );
}
