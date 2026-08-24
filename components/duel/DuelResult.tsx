"use client";

import Link from "next/link";
import type { StartedDuel, DuelOutcome } from "@/lib/duel/engine";
import { DuelReviewList } from "@/components/duel/DuelReviewList";

/* ── Result ───────────────────────────────────────────────────────────── */

export function DuelResult({
  outcome,
  duel,
  onAgain,
}: {
  outcome: DuelOutcome;
  duel: StartedDuel;
  onAgain: () => void;
}) {
  const s = outcome.settled;
  const tone = !s ? "muted" : s.result === "won" ? "success" : s.result === "lost" ? "danger" : "reward";

  return (
    <section className="flex flex-col gap-s4">
      <div className="rounded-lg border border-line bg-surface shadow-sh1 p-s6 text-center">
        <span className="font-mono text-label uppercase" style={{ color: `var(--${tone})` }}>
          {!s ? "Waiting for a challenger" : s.result === "won" ? "You won" : s.result === "lost" ? "You lost" : "Drawn"}
        </span>

        <div className="font-mono text-display text-ink tabular leading-none mt-s3">
          {outcome.score}
          <span className="text-h2 text-faint">/{outcome.total}</span>
        </div>

        {s ? (
          <>
            <p className="text-ui text-muted mt-s4">
              {s.opponentName || "Anonymous"} scored {s.opponentScore}
            </p>
            <p className="font-mono text-h3 mt-s3" style={{ color: `var(--${tone})` }}>
              {s.delta > 0 ? "+" : ""}
              {s.delta} → {s.rating}
            </p>
          </>
        ) : (
          <p className="text-meta text-muted mt-s4 max-w-[48ch] mx-auto">
            Nobody has faced this set yet. Your run is parked — the next player
            dealt these ten questions plays against you, and your rating moves
            then. Nothing is lost by leaving.
          </p>
        )}

        <div className="flex flex-wrap gap-s3 justify-center mt-s5">
          <button
            onClick={onAgain}
            className="inline-flex items-center min-h-[48px] px-s5 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors"
          >
            Play again
          </button>
          <Link
            href="/duel"
            className="inline-flex items-center min-h-[48px] px-s5 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors"
          >
            Back to the ladder
          </Link>
        </div>
      </div>

      {outcome.review ? (
        <DuelReviewList lines={outcome.review} />
      ) : (
        <div className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
          <h3 className="text-label uppercase text-faint mb-s4">The ten</h3>
          <ol className="list-none m-0 p-0 flex flex-col gap-s3">
            {duel.questions.map((q, i) => (
              <li key={q.id} className="border-t border-line pt-s3 first:border-0 first:pt-0">
                <div className="flex items-baseline gap-s3">
                  <span className="font-mono text-label text-faint tabular">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ui text-ink">{q.questionText}</span>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-meta text-faint mt-s4 pt-s4 border-t border-line">
            Answers open once someone has faced this set. Until then it is still
            in play, and showing them here would show them to your opponent too.
          </p>
        </div>
      )}
    </section>
  );
}
