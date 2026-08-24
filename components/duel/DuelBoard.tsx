"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ServedQuestion, StartedDuel } from "@/lib/duel/engine";
import type { SubmittedAnswer } from "@/lib/duel/grading";

/** Twenty seconds a question. The server caps at thirty, so this leaves room
 *  for a slow network without the clock ever being the reason someone lost. */
export const SECONDS_PER_QUESTION = 20;

/* ── Playing ──────────────────────────────────────────────────────────── */

export function DuelBoard({
  duel,
  onFinish,
}: {
  duel: StartedDuel;
  onFinish: (duel: StartedDuel, answers: SubmittedAnswer[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState(SECONDS_PER_QUESTION);
  const answers = useRef<SubmittedAnswer[]>([]);
  const shownAt = useRef<number>(Date.now());
  const submitted = useRef(false);

  const question: ServedQuestion | undefined = duel.questions[index];
  const total = duel.questions.length;

  const advance = useCallback(
    (chosen: string | null) => {
      const q = duel.questions[index];
      if (!q) return;

      answers.current.push({
        questionId: q.id,
        chosen,
        ms: Date.now() - shownAt.current,
      });

      if (index + 1 >= total) {
        if (submitted.current) return;
        submitted.current = true;
        onFinish(duel, answers.current);
        return;
      }
      setIndex((i) => i + 1);
      setLeft(SECONDS_PER_QUESTION);
      shownAt.current = Date.now();
    },
    [duel, index, total, onFinish]
  );

  // One interval per question. Running out counts as no answer rather than a
  // wrong one — the score is the same, but the review reads honestly.
  useEffect(() => {
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          advance(null);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [advance]);

  if (!question) return null;

  const urgent = left <= 5;

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="flex items-center justify-between gap-s3 px-s5 py-s3 border-b border-line bg-bg-sunk">
        <span className="font-mono text-label uppercase text-faint">
          {question.topic} · {index + 1} of {total}
        </span>
        <span
          className="font-mono text-meta tabular"
          style={{ color: urgent ? "var(--danger)" : "var(--muted)" }}
          aria-live="off"
        >
          {left}s
        </span>
      </div>

      <div className="h-1 bg-bg-sunk" aria-hidden>
        <div
          className="h-full transition-[width] duration-1000 ease-linear"
          style={{
            width: `${(left / SECONDS_PER_QUESTION) * 100}%`,
            background: urgent ? "var(--danger)" : "var(--accent)",
          }}
        />
      </div>

      <div className="p-s5">
        <h2 className="text-h3 font-semibold text-ink">{question.questionText}</h2>

        <div className="grid gap-s3 mt-s5">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => advance(option)}
              className="text-left px-s4 py-s3 min-h-[52px] rounded-md border border-line bg-raised text-ui text-ink hover:border-accent hover:bg-accent-soft transition-colors"
            >
              {option}
            </button>
          ))}
        </div>

        <p className="text-meta text-faint mt-s5">
          No going back — pick the one you believe.
        </p>
      </div>
    </section>
  );
}

