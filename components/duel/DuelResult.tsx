"use client";

import Link from "next/link";
import type { StartedDuel, DuelOutcome } from "@/lib/duel/engine";
import { DuelReviewList } from "@/components/duel/DuelReviewList";
import { ChallengeLink } from "@/components/duel/ChallengeLink";
import { DuelScoreboard } from "@/components/duel/DuelScoreboard";

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

  return (
    <section className="flex flex-col gap-s4">
      <div className="rounded-lg border border-line bg-surface shadow-sh1 p-s6 text-center">
        <DuelScoreboard outcome={outcome} />

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

      {!s && <ChallengeLink runId={outcome.runId} />}

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
