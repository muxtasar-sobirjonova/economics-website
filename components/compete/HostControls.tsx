"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { endCompetitionAction, extendCompetitionAction } from "@/app/actions/compete";

/**
 * The host's bar while a competition runs.
 *
 * Ending is the host's call, not automatic: everyone finishing does not mean
 * everyone has arrived, and a room that closes itself would shut out the
 * person who joined a minute ago.
 */
export function HostControls({
  id,
  progress,
  clock,
}: {
  id: string;
  progress: { total: number; finished: number; playing: number; completion: number };
  /** Minutes on the whole-paper clock, or null when there is no clock to add to. */
  clock?: number | null;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const t = setInterval(() => router.refresh(), 4000);
    return () => clearInterval(t);
  }, [router]);

  const everyoneDone = progress.total > 0 && progress.finished === progress.total;

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s4 flex flex-wrap items-center gap-s4">
      <div className="flex-1 min-w-0">
        <span className="font-mono text-label uppercase text-faint">Room</span>
        <p className="text-ui text-ink mt-1">
          {progress.finished} finished · {progress.playing} still playing
        </p>
        <span className="block h-1.5 rounded-full bg-bg-sunk mt-s2 max-w-[280px] overflow-hidden" aria-hidden>
          <span
            className="block h-full rounded-full transition-[width] duration-700"
            style={{
              width: `${Math.round(progress.completion * 100)}%`,
              background: everyoneDone ? "var(--success)" : "var(--accent)",
            }}
          />
        </span>
      </div>

      {/*
        A lesson that overran used to mean watching papers submit themselves.
        Only adds — shortening a clock mid-paper would end a room under
        someone's hands, and the button that ends a room already says so.
      */}
      {clock != null && (
        <button
          onClick={() => start(async () => { await extendCompetitionAction(id); router.refresh(); })}
          disabled={pending}
          className="inline-flex items-center min-h-[44px] px-s4 rounded-md border border-line text-ui text-ink hover:border-accent transition-colors disabled:opacity-60"
        >
          {pending ? "…" : `+10 min (now ${clock})`}
        </button>
      )}

      {confirming ? (
        <div className="flex flex-wrap gap-s2">
          <button
            onClick={() => start(async () => { await endCompetitionAction(id); router.refresh(); })}
            disabled={pending}
            className="inline-flex items-center min-h-[44px] px-s4 rounded-md text-ui font-semibold text-on-accent transition-colors disabled:opacity-60"
            style={{ background: "var(--danger)" }}
          >
            {pending ? "Ending…" : "Yes, end it"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="inline-flex items-center min-h-[44px] px-s4 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors"
          >
            Keep going
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className={`inline-flex items-center min-h-[44px] px-s5 rounded-md text-ui font-semibold transition-colors ${
            everyoneDone
              ? "bg-accent text-on-accent hover:bg-accent-strong"
              : "border border-line text-muted hover:text-ink"
          }`}
        >
          {everyoneDone ? "Everyone is done — end it" : "End it"}
        </button>
      )}
    </section>
  );
}
