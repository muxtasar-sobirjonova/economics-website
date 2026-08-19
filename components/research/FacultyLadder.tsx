"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * The register, ranked.
 *
 * This replaces an isometric block of 24 towers. That version looked like
 * something but you could not tell which building was which university
 * without hovering each one, which is most of what the picture was for. Every
 * row here is named, and the bar does a second job the towers could not: the
 * solid part is the faculty who publish their own address, so the chart shows
 * how reachable a university is, not only how large.
 */

export interface LadderRow {
  university: string;
  short: string;
  city: string;
  tier: number;
  total: number;
  direct: number;
  topDepartment: string;
  /** Precomputed on the server: a function prop cannot cross this boundary. */
  href: string;
}

export function FacultyLadder({
  rows,
  selected,
}: {
  rows: LadderRow[];
  selected?: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(1, ...rows.map((r) => r.total));

  return (
    <div className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="flex items-center justify-between gap-s4 flex-wrap px-s4 py-s3 border-b border-line bg-bg-sunk">
        <h3 className="text-label uppercase text-faint">Faculty per university</h3>
        <div className="flex items-center gap-s4 flex-wrap">
          <span className="flex items-center gap-s2">
            <span className="w-3 h-2.5 rounded-[2px]" style={{ background: "var(--tier-1)" }} aria-hidden />
            <span className="text-label uppercase text-faint">Reachable directly</span>
          </span>
          <span className="flex items-center gap-s2">
            <span className="w-3 h-2.5 rounded-[2px]" style={{ background: "var(--tier-1)", opacity: 0.28 }} aria-hidden />
            <span className="text-label uppercase text-faint">Via a faculty line</span>
          </span>
        </div>
      </div>

      <ul className="list-none m-0 p-0">
        {rows.map((r) => {
          const on = selected === r.university;
          const lit = on || hover === r.university;
          const tone = `var(--tier-${Math.min(3, r.tier)})`;
          const width = (r.total / max) * 100;
          const directShare = r.total > 0 ? (r.direct / r.total) * 100 : 0;

          return (
            <li key={r.university}>
              <Link
                href={r.href}
                aria-current={on ? "true" : undefined}
                onMouseEnter={() => setHover(r.university)}
                onMouseLeave={() => setHover(null)}
                className={`grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,21rem)_1fr_auto] items-center gap-x-s4 gap-y-s2 px-s4 py-s3 border-t border-line transition-colors ${
                  on ? "bg-accent-soft" : "hover:bg-bg-sunk"
                }`}
              >
                <span className="min-w-0">
                  <span
                    className={`block text-ui truncate pb-[2px] ${
                      on ? "text-accent-strong font-semibold" : "text-ink"
                    }`}
                  >
                    {r.short}
                  </span>
                  <span className="block font-mono text-label uppercase text-faint truncate">
                    Tier {r.tier} · {r.city}
                  </span>
                </span>

                {/* Full width is the largest faculty on the register; the solid
                    head of the bar is the part you can write to directly. */}
                <span className="col-span-2 sm:col-span-1 order-last sm:order-none h-2.5 rounded-full bg-bg-sunk overflow-hidden" aria-hidden>
                  <span
                    className="flex h-full rounded-full overflow-hidden transition-[width] duration-200"
                    style={{ width: `${Math.max(width, 3)}%` }}
                  >
                    <span
                      className="h-full transition-opacity"
                      style={{ width: `${directShare}%`, background: tone, opacity: lit ? 1 : 0.9 }}
                    />
                    <span
                      className="h-full flex-1"
                      style={{ background: tone, opacity: lit ? 0.4 : 0.28 }}
                    />
                  </span>
                </span>

                <span className="text-right whitespace-nowrap">
                  <span className="font-mono text-ui text-ink tabular">{r.total}</span>
                  <span className="block font-mono text-label uppercase text-faint">
                    {r.direct} direct
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
