import React from "react";
import type { ReviewLine } from "@/lib/duel/review";

/**
 * The ten questions with both sets of answers.
 *
 * The decisive rows — where exactly one player got it — are the ones that
 * actually settled the duel, so they are marked. This is the screen the whole
 * game exists to reach: a score says you got six, this says which six and why.
 */
export function DuelReviewList({ lines }: { lines: ReviewLine[] }) {
  const decisive = lines.filter((l) => l.decisive).length;

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="flex items-baseline justify-between gap-s3 flex-wrap px-s5 py-s3 border-b border-line bg-bg-sunk">
        <h3 className="text-label uppercase text-faint">The ten, side by side</h3>
        <span className="text-meta text-muted">
          {decisive === 0
            ? "You both answered identically"
            : `${decisive} ${decisive === 1 ? "question" : "questions"} separated you`}
        </span>
      </div>

      <ol className="list-none m-0 p-0">
        {lines.map((l, i) => (
          <li key={l.id} className="px-s5 py-s4 border-t border-line first:border-t-0">
            <div className="flex items-baseline gap-s3">
              <span className="font-mono text-label text-faint tabular shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <span className="font-mono text-label uppercase text-faint">{l.topic}</span>
                <h4 className="text-ui text-ink mt-1">{l.questionText}</h4>
              </div>
              {l.decisive && (
                <span
                  className="text-label uppercase px-s2 py-1 rounded-sm shrink-0"
                  style={{
                    background: l.yourCorrect ? "var(--success-soft)" : "var(--danger-soft)",
                    color: l.yourCorrect ? "var(--success)" : "var(--danger)",
                  }}
                >
                  {l.yourCorrect ? "Won it" : "Lost it"}
                </span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-s3 mt-s3 ml-0 sm:ml-[2.2rem]">
              <Answer label="You" answer={l.yourAnswer} correct={l.yourCorrect} />
              <Answer label="Opponent" answer={l.theirAnswer} correct={l.theirCorrect} />
            </div>

            {!l.yourCorrect && (
              <p className="text-meta mt-s3 sm:ml-[2.2rem]">
                <span className="text-faint">Answer: </span>
                <span className="text-ink font-semibold">{l.correctAnswer}</span>
              </p>
            )}

            {l.explanation && (
              <p className="text-meta text-muted mt-s2 sm:ml-[2.2rem] max-w-[70ch]">
                {l.explanation}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Answer({
  label,
  answer,
  correct,
}: {
  label: string;
  answer: string | null;
  correct: boolean;
}) {
  const tone = answer === null ? "faint" : correct ? "success" : "danger";
  return (
    <div className="rounded-md border border-line px-s3 py-s2 min-w-0">
      <span className="block font-mono text-label uppercase text-faint">{label}</span>
      <span
        className="block text-meta mt-1 break-words"
        style={{ color: `var(--${tone})` }}
      >
        {answer === null ? "No answer" : answer}
      </span>
    </div>
  );
}
