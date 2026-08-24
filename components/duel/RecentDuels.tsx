import React from "react";
import Link from "next/link";
import type { RecentDuel } from "@/lib/duel/engine";

const TONE: Record<RecentDuel["result"], string> = {
  won: "success",
  lost: "danger",
  drew: "reward",
};

/**
 * Duels settle while you are away — someone faces a set you played days ago
 * and your rating moves without you there. Without this list the ladder would
 * seem to shift for no reason.
 */
export function RecentDuels({ duels }: { duels: RecentDuel[] }) {
  if (duels.length === 0) return null;

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="px-s4 py-s3 bg-bg-sunk">
        <h3 className="text-label uppercase text-faint">Settled recently</h3>
      </div>

      {duels.map((d) => (
        <Link
          key={d.runId}
          href={`/duel/${d.runId}`}
          className="grid grid-cols-[auto_1fr_auto] gap-s3 items-center px-s4 py-s3 border-t border-line hover:bg-bg-sunk transition-colors"
        >
          <span
            className="text-label uppercase px-s2 py-1 rounded-sm shrink-0"
            style={{
              background: `var(--${TONE[d.result]}-soft)`,
              color: `var(--${TONE[d.result]})`,
            }}
          >
            {d.result === "won" ? "Won" : d.result === "lost" ? "Lost" : "Drew"}
          </span>

          <span className="min-w-0">
            <span className="block text-ui text-ink truncate pb-[2px]">
              {d.opponentName || "Anonymous"}
            </span>
            <span className="block font-mono text-label uppercase text-faint">
              {d.yourScore}–{d.theirScore} · {new Date(d.at).toLocaleDateString()}
            </span>
          </span>

          <span
            className="font-mono text-ui tabular text-right"
            style={{ color: `var(--${TONE[d.result]})` }}
          >
            {d.delta > 0 ? "+" : ""}
            {d.delta}
          </span>
        </Link>
      ))}
    </section>
  );
}
