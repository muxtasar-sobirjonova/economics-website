"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Progress {
  currentDay: number;
  streak: number;
  hearts: number;
  lessonsCompleted: number;
  totalDays: number;
}

/**
 * Where the learner stands, on every page.
 *
 * Fetched client-side on purpose — see app/api/me/progress. Until it arrives
 * the block holds its space with a quiet skeleton, and if the call fails it
 * disappears rather than breaking the panel it sits in.
 */
export function SidebarProgress() {
  const [data, setData] = useState<Progress | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/me/progress")
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        if (j?.success && j.data) setData(j.data);
        else setFailed(true);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  if (failed) return null;

  if (!data) {
    return (
      <div className="rounded-xl bg-[rgba(255,255,255,.07)] px-3.5 py-3 mb-7 animate-pulse">
        <div className="h-2.5 w-20 rounded bg-[rgba(255,255,255,.15)]" />
        <div className="h-1.5 w-full rounded-full bg-[rgba(255,255,255,.12)] mt-3" />
        <div className="h-2.5 w-24 rounded bg-[rgba(255,255,255,.12)] mt-3" />
      </div>
    );
  }

  const pct = Math.min(100, Math.round((data.lessonsCompleted / data.totalDays) * 100));

  return (
    <Link
      href="/roadmap"
      className="block rounded-xl bg-[rgba(255,255,255,.08)] hover:bg-[rgba(255,255,255,.13)] transition-colors px-3.5 py-3 mb-7 border border-[rgba(255,255,255,.10)]"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[rgba(255,255,255,.65)]">
          Day {data.currentDay}
        </span>
        <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[rgba(255,255,255,.66)]">
          of {data.totalDays}
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-[rgba(0,0,0,.22)] mt-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${Math.max(pct, 2)}%`, background: "rgba(255,255,255,.92)" }}
        />
      </div>

      <div className="flex items-center gap-3 mt-2.5">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-white">
          <span aria-hidden>🔥</span>
          {data.streak}
        </span>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-white">
          <span aria-hidden className="text-[#FF8A80]">
            &hearts;
          </span>
          {data.hearts}/5
        </span>
        <span className="ml-auto text-[11px] font-semibold text-[rgba(255,255,255,.72)] tabular-nums">
          {data.lessonsCompleted} built
        </span>
      </div>
    </Link>
  );
}
