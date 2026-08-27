"use client";

import { useRef, useState } from "react";
import { answerDailyAction } from "@/app/actions/duel";
import type { DailyState } from "@/lib/duel/engine";

/**
 * The question of the day.
 *
 * A duel needs a second person and most days there will not be one. This works
 * alone, which makes it the reason to open the page when the ladder is quiet.
 * One attempt, no clock — it is not rated, so there is nothing to rush.
 */
export function DailyQuestion({ initial }: { initial: DailyState }) {
  const [state, setState] = useState(initial);
  const [busy, setBusy] = useState(false);
  const shownAt = useRef(Date.now());

  if (!state.question) return null;

  const done = state.answered;
  const rate =
    state.totals.played > 0 ? Math.round((state.totals.correct / state.totals.played) * 100) : null;

  const answer = async (option: string) => {
    if (busy || done) return;
    setBusy(true);
    const res = await answerDailyAction(option, Date.now() - shownAt.current);
    if (res.ok) setState(res.data);
    setBusy(false);
  };

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="flex items-baseline justify-between gap-s3 flex-wrap px-s4 py-s3 border-b border-line bg-bg-sunk">
        <h3 className="text-label uppercase text-faint">
          Question of the day · {state.question.topic}
        </h3>
        {done && rate !== null && (
          <span className="text-meta text-muted">
            {state.totals.correct} of {state.totals.played} got it · {rate}%
          </span>
        )}
      </div>

      <div className="p-s5">
        <h4 className="text-h3 font-semibold text-ink">{state.question.questionText}</h4>

        <div className="grid gap-s2 mt-s4">
          {state.question.options.map((option) => {
            const chosen = done?.chosen === option;
            const isAnswer = done && option === done.correctAnswer;

            // Before answering these are buttons; after, they are a marked-up
            // record of what happened, so they stop being clickable.
            const tone = !done
              ? null
              : isAnswer
                ? "success"
                : chosen
                  ? "danger"
                  : null;

            return (
              <button
                key={option}
                onClick={() => answer(option)}
                disabled={Boolean(done) || busy}
                className={`text-left px-s4 py-s3 min-h-[48px] rounded-md border text-ui transition-colors ${
                  done
                    ? "cursor-default"
                    : "border-line bg-raised text-ink hover:border-accent hover:bg-accent-soft"
                }`}
                style={
                  tone
                    ? { borderColor: `var(--${tone})`, background: `var(--${tone}-soft)`, color: `var(--${tone})` }
                    : done
                      ? { borderColor: "var(--border)", opacity: 0.55 }
                      : undefined
                }
              >
                <span className="flex items-center justify-between gap-s3">
                  <span>{option}</span>
                  {chosen && (
                    <span className="font-mono text-label uppercase shrink-0">your answer</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {done && (
          <div className="mt-s4 pt-s4 border-t border-line">
            <p
              className="font-mono text-label uppercase"
              style={{ color: done.isCorrect ? "var(--success)" : "var(--danger)" }}
            >
              {done.isCorrect ? "Correct" : done.chosen === null ? "No answer" : "Not this time"}
            </p>
            {done.explanation && (
              <p className="text-meta text-muted mt-s2 max-w-[68ch]">{done.explanation}</p>
            )}
            <p className="text-meta text-faint mt-s3">A new one tomorrow.</p>
          </div>
        )}
      </div>
    </section>
  );
}
