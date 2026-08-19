"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/**
 * The register as a city block. Each university is a building on an isometric
 * plot: the height is how many faculty it has, the colour is its tier, and
 * selecting one filters the listings through the same URL params the cards
 * use — so the quarter and the list can never disagree.
 *
 * Geometry follows the roadmap's isometric language: a top face is a diamond
 * of half-width W and half-height W × 0.571, and the walls drop from there.
 */

export interface QuarterBuilding {
  university: string;
  short: string;
  city: string;
  tier: number;
  total: number;
  direct: number;
  topDepartment: string;
}

const COLS = 6;
const TILE_W = 52;   // half-width of a ground tile
const TILE_H = 30;   // half-height of a ground tile
const W = 30;        // half-width of a building
const D = Math.round(W * 0.571);
const MIN_H = 20;
const MAX_H = 84;

const TIER_TONE: Record<number, string> = { 1: "reward", 2: "article", 3: "concept" };

function tone(tier: number) {
  return TIER_TONE[tier] ?? "quiz";
}

export function FacultyQuarter({ buildings }: { buildings: QuarterBuilding[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [hover, setHover] = useState<string | null>(null);

  const selected = params.get("university");
  const max = Math.max(1, ...buildings.map((b) => b.total));
  const min = Math.min(...buildings.map((b) => b.total));

  const select = (university: string) => {
    const next = new URLSearchParams(params.toString());
    if (next.get("university") === university) next.delete("university");
    else next.set("university", university);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  // Tallest first in the source order, so the biggest towers sit at the back
  // where nothing in front of them can cut off their roofline.
  const placed = buildings.map((b, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const span = Math.max(1, max - min);
    return {
      ...b,
      col,
      row,
      x: (col - row) * TILE_W,
      y: (col + row) * TILE_H,
      h: Math.round(MIN_H + ((b.total - min) / span) * (MAX_H - MIN_H)),
    };
  });

  // Painter's algorithm: back rows first, so near buildings overlap far ones.
  const drawOrder = [...placed].sort((a, b) => a.col + a.row - (b.col + b.row));

  const rows = Math.ceil(buildings.length / COLS);
  const minX = -(rows - 1) * TILE_W - TILE_W - 8;
  const maxX = (COLS - 1) * TILE_W + TILE_W + 8;
  const minY = -MAX_H - D - TILE_H - 8;
  const maxY = (COLS - 1 + rows - 1) * TILE_H + TILE_H + 8;

  const focus = hover
    ? placed.find((b) => b.university === hover)
    : selected
    ? placed.find((b) => b.university === selected)
    : null;

  return (
    <div className="rounded-lg border border-line bg-surface shadow-sh1 p-s4">
      <div className="flex items-baseline justify-between gap-s3 mb-s3 flex-wrap">
        <h3 className="text-label uppercase text-faint">The faculty quarter</h3>
        <div className="flex items-center gap-s3 flex-wrap">
          {[1, 2, 3].map((t) => (
            <span key={t} className="flex items-center gap-s2">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ background: `var(--${tone(t)})` }}
                aria-hidden
              />
              <span className="text-label uppercase text-faint">Tier {t}</span>
            </span>
          ))}
        </div>
      </div>

      {/* On a phone the block would shrink to 8px roof labels, so it keeps its
          own scroller instead — the page itself never scrolls sideways. */}
      <div className="overflow-x-auto">
      <svg
        viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
        className="w-full min-w-[560px] h-auto block"
        role="img"
        aria-label="Universities as buildings — height is the number of faculty on the register"
      >
        {drawOrder.map((b) => {
          const isSelected = selected === b.university;
          const isHover = hover === b.university;
          const t = tone(b.tier);
          const lift = isHover || isSelected ? 6 : 0;
          const h = b.h;

          return (
            <g
              key={b.university}
              transform={`translate(${b.x}, ${b.y - lift})`}
              onMouseEnter={() => setHover(b.university)}
              onMouseLeave={() => setHover(null)}
              onClick={() => select(b.university)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  select(b.university);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              aria-label={`${b.short}: ${b.total} faculty, tier ${b.tier}, ${b.city}`}
              className="cursor-pointer focus:outline-none"
              style={{ transition: "transform .12s ease-out" }}
            >
              <title>{`${b.short} — ${b.total} faculty`}</title>

              {/* Ground */}
              <polygon
                points={`0,${-TILE_H} ${TILE_W},0 0,${TILE_H} ${-TILE_W},0`}
                fill={isSelected ? "var(--accent-soft)" : "var(--ground)"}
                stroke={isSelected ? "var(--accent)" : "var(--ground-edge)"}
                strokeWidth={isSelected ? 2 : 1.1}
              />

              {/* Cast shadow */}
              <polygon
                points={`${W},${D - 6} ${W + 40},${D + 16} ${-4},${D + 16} ${-W - 8},${D - 2}`}
                fill="var(--vol-shadow)"
                opacity={isHover || isSelected ? 0.55 : 0.75}
              />

              {/* Volume */}
              <polygon points={`${-W},${-h} 0,${-h + D} 0,${D} ${-W},0`} fill={`var(--${t})`} opacity=".78" />
              <polygon points={`0,${-h + D} ${W},${-h} ${W},0 0,${D}`} fill={`var(--${t})`} opacity=".92" />
              <polygon
                points={`0,${-h - D} ${W},${-h} 0,${-h + D} ${-W},${-h}`}
                fill={`var(--${t}-soft)`}
                stroke={`var(--${t})`}
                strokeWidth="1"
              />

              {/* One lit window per storey. The left wall slopes, so the band a
                  window can occupy runs from -h + 8 down to -7.5 — placing them
                  by height alone pushes the lowest one out through the floor. */}
              {(() => {
                const top = -h + 8;
                const bottom = -7.5;
                const count = bottom >= top ? Math.floor((bottom - top) / 20) + 1 : 0;
                return Array.from({ length: count }).map((_, k) => {
                  const wy = top + k * 20;
                  return (
                    <polygon
                      key={k}
                      points={`${-W + 8},${wy} ${-W + 19},${wy + 6} ${-W + 19},${wy + 15} ${-W + 8},${wy + 9}`}
                      fill="var(--vol-window)"
                      opacity=".65"
                    />
                  );
                });
              })()}

              {/* The count sits on the roof: the tallest towers are at the
                  back, so no roof is ever hidden by the block in front. */}
              <text
                x="0"
                y={-h + 5}
                textAnchor="middle"
                className="font-mono"
                fontSize="15"
                fontWeight="600"
                fill={isSelected ? "var(--accent-strong)" : `var(--${t})`}
              >
                {b.total}
              </text>
            </g>
          );
        })}
      </svg>
      </div>

      <div className="mt-s3 pt-s3 border-t border-line min-h-[52px]">
        {focus ? (
          <>
            <div className="flex items-baseline gap-s3 flex-wrap">
              <span className="text-ui font-semibold text-ink">{focus.short}</span>
              <span
                className="text-label uppercase px-s2 py-1 rounded-sm"
                style={{
                  background: `var(--${tone(focus.tier)}-soft)`,
                  color: `var(--${tone(focus.tier)})`,
                }}
              >
                Tier {focus.tier}
              </span>
              <span className="font-mono text-meta text-faint tabular">{focus.city}</span>
            </div>
            <p className="text-meta text-muted mt-1">
              {focus.total} faculty · {focus.direct} reachable directly · {focus.topDepartment}
            </p>
          </>
        ) : (
          <p className="text-meta text-muted">
            Taller means more faculty on the register. Hover a building to read
            it, or select one to filter the list.
          </p>
        )}
      </div>
    </div>
  );
}
