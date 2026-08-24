import React from "react";

export interface LadderRow {
  userId: string;
  rating: number;
  played: number;
  won: number;
  lost: number;
  drawn: number;
  name: string | null;
}

/**
 * The ladder. Only players who have settled at least one duel appear —
 * a table full of untouched 1000s says nothing about anyone.
 */
export function DuelLadder({ rows, meId }: { rows: LadderRow[]; meId: string }) {
  if (rows.length === 0) {
    return (
      <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s6 text-center">
        <h3 className="text-h3 font-semibold text-ink">Nobody is ranked yet</h3>
        <p className="text-meta text-muted mt-s2 max-w-[44ch] mx-auto">
          A rating appears once two people have faced the same ten questions.
          Play a set and you will be the first.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="grid grid-cols-[2.5rem_1fr_auto] gap-s3 px-s4 py-s3 bg-bg-sunk text-label uppercase text-faint">
        <span>Rank</span>
        <span>Player</span>
        <span className="text-right">Rating</span>
      </div>

      {rows.map((r, i) => {
        const isMe = r.userId === meId;
        return (
          <div
            key={r.userId}
            className={`relative grid grid-cols-[2.5rem_1fr_auto] gap-s3 items-center px-s4 py-s3 border-t border-line ${
              isMe ? "bg-accent-soft" : ""
            }`}
          >
            {isMe && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent" aria-hidden />}

            <span className={`font-mono text-meta tabular ${isMe ? "text-accent-strong" : "text-faint"}`}>
              {String(i + 1).padStart(2, "0")}
            </span>

            <span className="min-w-0">
              <span className={`block text-ui truncate pb-[2px] ${isMe ? "text-accent-strong font-semibold" : "text-ink"}`}>
                {isMe ? `You · ${r.name || "Anonymous"}` : r.name || "Anonymous"}
              </span>
              <span className="block font-mono text-label uppercase text-faint">
                {r.won}W · {r.lost}L · {r.drawn}D
              </span>
            </span>

            <span className="font-mono text-ui text-ink tabular text-right">{r.rating}</span>
          </div>
        );
      })}
    </section>
  );
}
