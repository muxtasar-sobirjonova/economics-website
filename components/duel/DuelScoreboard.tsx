import React from "react";
import type { DuelOutcome } from "@/lib/duel/engine";
import { DuelTowers } from "@/components/duel/DuelTowers";

/**
 * The moment a duel is decided.
 *
 * Shared by the screen you land on after submitting and the one you open from
 * the history, because whichever of the two players you were, the duel ended
 * the same way and you are owed the same account of it.
 */
export function DuelScoreboard({ outcome }: { outcome: DuelOutcome }) {
  const s = outcome.settled;
  const tone = !s
    ? "muted"
    : s.result === "won"
      ? "success"
      : s.result === "lost"
        ? "danger"
        : "reward";

  return (
    <div className="text-center">
      <span className="font-mono text-label uppercase" style={{ color: `var(--${tone})` }}>
        {!s
          ? "Waiting for a challenger"
          : s.result === "won"
            ? "You won"
            : s.result === "lost"
              ? "You lost"
              : "Drawn"}
      </span>

      {s ? (
        <div className="mt-s4">
          <DuelTowers
            yourScore={outcome.score}
            theirScore={s.opponentScore}
            total={outcome.total}
            opponentName={s.opponentName || "Anonymous"}
          />
          <p className="font-mono text-h3 mt-s3" style={{ color: `var(--${tone})` }}>
            {s.delta > 0 ? "+" : ""}
            {s.delta} → {s.rating}
          </p>
        </div>
      ) : (
        <>
          <div className="font-mono text-display text-ink tabular leading-none mt-s3">
            {outcome.score}
            <span className="text-h2 text-faint">/{outcome.total}</span>
          </div>
          <p className="text-meta text-muted mt-s4 max-w-[48ch] mx-auto">
            Nobody has faced this set yet. Your run is parked — the next player
            dealt these ten questions plays against you, and your rating moves
            then. Nothing is lost by leaving.
          </p>
        </>
      )}
    </div>
  );
}
