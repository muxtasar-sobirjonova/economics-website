import React from "react";
import type { Ranked } from "@/lib/compete/scoring";

/** The live table. Shared by the play screen and the final results. */
export function Standings({
  rows,
  meId,
  questionCount,
  compact = false,
}: {
  rows: Ranked[];
  meId: string;
  questionCount: number;
  compact?: boolean;
}) {
  if (rows.length === 0) {
    return <p className="text-meta text-muted p-s4 text-center">Nobody yet.</p>;
  }

  return (
    <ul className="list-none m-0 p-0">
      {rows.map((r) => {
        const isMe = r.userId === meId;
        const pct = questionCount > 0 ? Math.round((r.answered / questionCount) * 100) : 0;

        return (
          <li
            key={r.userId}
            className={`relative grid grid-cols-[2rem_1fr_auto] gap-s3 items-center px-s4 ${
              compact ? "py-s2" : "py-s3"
            } border-t border-line first:border-t-0 ${isMe ? "bg-accent-soft" : ""}`}
          >
            {isMe && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent" aria-hidden />}

            <span className={`font-mono text-meta tabular ${isMe ? "text-accent-strong" : "text-faint"}`}>
              {String(r.rank).padStart(2, "0")}
            </span>

            <span className="min-w-0">
              <span
                className={`block text-ui truncate pb-[2px] ${
                  isMe ? "text-accent-strong font-semibold" : "text-ink"
                }`}
              >
                {isMe ? `You · ${r.name || "Anonymous"}` : r.name || "Anonymous"}
              </span>
              {/* How far through they are — the thing that makes a live table
                  readable, since a low score may just mean they started late. */}
              <span className="block h-[3px] rounded-full bg-bg-sunk mt-1 max-w-[160px]" aria-hidden>
                <span
                  className="block h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${Math.max(pct, 2)}%`,
                    background: r.finished ? "var(--success)" : "var(--accent)",
                    opacity: isMe ? 1 : 0.5,
                  }}
                />
              </span>
            </span>

            <span className="text-right shrink-0">
              <span className="block font-mono text-ui text-ink tabular">{r.score}</span>
              <span className="block font-mono text-label uppercase text-faint">
                {r.finished ? "done" : `${r.answered}/${questionCount}`}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
