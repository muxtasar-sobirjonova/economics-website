"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { REGION_SHAPES, MAP_VIEWBOX, MAP_TRANSFORM } from "@/lib/internships/mapShapes";

export interface MapRegion {
  region: string;
  symbol: string;
  total: number;
  topCategory: string;
}

/**
 * The board as geography. Each region is shaded by how many organisations sit
 * on it, and selecting one filters the listings through the same URL params the
 * cards use — so the map and the board can never disagree.
 */
export function RegionMap({ regions }: { regions: MapRegion[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [hover, setHover] = useState<string | null>(null);

  const selected = params.get("region");
  const byName = new Map(regions.map((r) => [r.region, r]));
  const max = Math.max(1, ...regions.map((r) => r.total));

  const select = (region: string) => {
    const next = new URLSearchParams(params.toString());
    if (next.get("region") === region) next.delete("region");
    else next.set("region", region);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const focus = hover ? byName.get(hover) : selected ? byName.get(selected) : null;

  return (
    <div className="rounded-lg border border-line bg-surface shadow-sh1 p-s4">
      <div className="flex items-baseline justify-between gap-s3 mb-s3 flex-wrap">
        <h3 className="text-label uppercase text-faint">Coverage by region</h3>
        <div className="flex items-center gap-s2">
          <span className="text-label uppercase text-faint">fewer</span>
          <span className="flex h-2 w-24 rounded-sm overflow-hidden">
            {[0.15, 0.35, 0.55, 0.75, 1].map((o) => (
              <span key={o} className="flex-1" style={{ background: "var(--accent)", opacity: o }} />
            ))}
          </span>
          <span className="text-label uppercase text-faint">more</span>
        </div>
      </div>

      <svg
        viewBox={MAP_VIEWBOX}
        className="w-full h-auto block"
        role="img"
        aria-label="Map of Uzbekistan — organisations by region"
      >
        <g transform={MAP_TRANSFORM}>
        {REGION_SHAPES.map((shape) => {
          if (!shape.region) {
            return <path key={shape.id} d={shape.d} fill="var(--bg-sunk)" stroke="var(--border)" strokeWidth="1" />;
          }

          const stat = byName.get(shape.region);
          const isSelected = selected === shape.region;
          const isHover = hover === shape.region;

          // A region with no records is drawn, but plainly not clickable.
          if (!stat) {
            return (
              <path
                key={shape.id}
                d={shape.d}
                fill="var(--bg-sunk)"
                stroke="var(--border)"
                strokeWidth="1"
                opacity=".7"
              >
                <title>{shape.region} — no records yet</title>
              </path>
            );
          }

          const intensity = 0.18 + (stat.total / max) * 0.72;

          return (
            <path
              key={shape.id}
              d={shape.d}
              role="button"
              tabIndex={0}
              aria-label={`${shape.region}: ${stat.total} organisations`}
              aria-pressed={isSelected}
              onClick={() => select(shape.region!)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  select(shape.region!);
                }
              }}
              onMouseEnter={() => setHover(shape.region)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(shape.region)}
              onBlur={() => setHover(null)}
              className="cursor-pointer focus:outline-none transition-opacity"
              fill="var(--accent)"
              fillOpacity={isSelected || isHover ? 1 : intensity}
              stroke={isSelected ? "var(--accent-strong)" : "var(--surface)"}
              strokeWidth={isSelected ? 2.5 : 1.2}
            >
              <title>{shape.region} — {stat.total} organisations</title>
            </path>
          );
        })}
        </g>
      </svg>

      <div className="mt-s3 pt-s3 border-t border-line min-h-[52px]">
        {focus ? (
          <div className="flex items-baseline justify-between gap-s3 flex-wrap">
            <span className="text-ui font-semibold text-ink">{focus.region}</span>
            <span className="font-mono text-meta text-muted tabular">
              {focus.total} organisations · mostly {focus.topCategory}
            </span>
          </div>
        ) : (
          <p className="text-meta text-faint">
            Hover a region to see its depth, or select one to filter the board.
          </p>
        )}
      </div>
    </div>
  );
}
