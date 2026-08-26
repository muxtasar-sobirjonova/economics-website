"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ServedQuestion, StartedDuel } from "@/lib/duel/engine";
import type { SubmittedAnswer } from "@/lib/duel/grading";

/** Twenty seconds a question. The server caps at thirty, so this leaves room
 *  for a slow network without the clock ever being the reason someone lost. */
export const SECONDS_PER_QUESTION = 20;

/** Long enough to see the choice register, short enough not to be a wait. */
const LOCK_MS = 240;

export function DuelBoard({
  duel,
  onFinish,
}: {
  duel: StartedDuel;
  onFinish: (duel: StartedDuel, answers: SubmittedAnswer[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState(SECONDS_PER_QUESTION);
  const [locked, setLocked] = useState<string | null>(null);

  const answers = useRef<SubmittedAnswer[]>([]);
  const shownAt = useRef<number>(Date.now());
  const lockedRef = useRef(false);
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
      setLocked(null);
      lockedRef.current = false;
      shownAt.current = Date.now();
    },
    [duel, index, total, onFinish]
  );

  /**
   * The choice is held on screen for a moment before moving on. Without it a
   * player clicks ten times into nothing — the answer is never marked right or
   * wrong here, because the set is still live for the opponent, so this pause
   * is the only acknowledgement there is.
   */
  const choose = (option: string) => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setLocked(option);
    setTimeout(() => advance(option), LOCK_MS);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          if (!lockedRef.current) {
            lockedRef.current = true;
            advance(null);
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [advance]);

  if (!question) return null;

  const urgent = left <= 5;
  const opponent = duel.opponent;

  // Their score over the questions you have already passed — the number to beat,
  // not a comment on how you are doing, which you cannot be told yet.
  const theirSoFar = opponent
    ? opponent.pace.slice(0, index).filter((p) => p.correct).length
    : 0;
  const theirSeconds = opponent?.pace[index]?.ms
    ? Math.max(1, Math.round(opponent.pace[index].ms / 1000))
    : null;

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="flex items-center justify-between gap-s3 px-s5 py-s3 border-b border-line bg-bg-sunk">
        <span className="font-mono text-label uppercase text-faint">
          {question.topic} · {index + 1} of {total}
        </span>
        <span
          className="font-mono text-meta tabular"
          style={{ color: urgent ? "var(--danger)" : "var(--muted)" }}
        >
          {left}s
        </span>
      </div>

      <div className="h-1 bg-bg-sunk relative" aria-hidden>
        <div
          className="h-full transition-[width] duration-1000 ease-linear"
          style={{
            width: `${(left / SECONDS_PER_QUESTION) * 100}%`,
            background: urgent ? "var(--danger)" : "var(--accent)",
          }}
        />
        {/* Where the opponent finished this question. Pass the mark and you are
            ahead of them on the clock. */}
        {theirSeconds !== null && theirSeconds <= SECONDS_PER_QUESTION && (
          <span
            className="absolute top-0 bottom-0 w-[2px] bg-ink opacity-40"
            style={{ left: `${((SECONDS_PER_QUESTION - theirSeconds) / SECONDS_PER_QUESTION) * 100}%` }}
          />
        )}
      </div>

      {/* Progress dots: where you are, not how you are doing. */}
      <div className="flex items-center gap-s2 px-s5 pt-s4" aria-hidden>
        {duel.questions.map((q, i) => (
          <span
            key={q.id}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={{
              background:
                i < index ? "var(--muted)" : i === index ? "var(--accent)" : "var(--bg-sunk)",
            }}
          />
        ))}
      </div>

      {opponent && (
        <div className="flex items-center justify-between gap-s3 px-s5 pt-s3">
          <span className="font-mono text-label uppercase text-faint truncate">
            Chasing {opponent.name || "Anonymous"}
          </span>
          <span className="font-mono text-meta text-muted tabular shrink-0">
            {/* "0/0 so far" says nothing on the first question, so it opens
                with the number to beat and switches to the running tally. */}
            {index === 0 ? `${opponent.score} to beat` : `${theirSoFar}/${index} so far`}
            {theirSeconds !== null && ` · ${theirSeconds}s here`}
          </span>
        </div>
      )}

      <div className="p-s5">
        {index === 0 &&
          (duel.liveOpponentName || duel.reused || duel.resumed || duel.challengerName) && (
            <p className="text-meta mb-s4 pb-s3 border-b border-line">
              {duel.liveOpponentName ? (
                <span className="flex items-center gap-s2">
                  <span
                    className="w-[7px] h-[7px] rounded-full animate-ringpulse shrink-0"
                    style={{ background: "var(--success)" }}
                    aria-hidden
                  />
                  <span className="text-ink">
                    {duel.liveOpponentName} is answering these right now.
                  </span>
                </span>
              ) : (
                <span className="text-muted">
                  {duel.challengerName
                    ? `${duel.challengerName} challenged you with this set.`
                    : duel.resumed
                      ? "Picking up where you left off — the clock has been running since you started."
                      : "The bank is short, so some of these have come round again."}
                </span>
              )}
            </p>
          )}

        <h2 className="text-h3 font-semibold text-ink">{question.questionText}</h2>

        <div className="grid gap-s3 mt-s5">
          {question.options.map((option) => {
            const chosen = locked === option;
            const dimmed = locked !== null && !chosen;
            return (
              <button
                key={option}
                onClick={() => choose(option)}
                disabled={locked !== null}
                aria-pressed={chosen}
                className={`text-left px-s4 py-s3 min-h-[52px] rounded-md border text-ui transition-all duration-150 ${
                  chosen
                    ? "border-accent bg-accent-soft text-accent-strong font-semibold"
                    : "border-line bg-raised text-ink hover:border-accent hover:bg-accent-soft"
                }`}
                style={{ opacity: dimmed ? 0.35 : 1 }}
              >
                {option}
              </button>
            );
          })}
        </div>

        <p className="text-meta text-faint mt-s5">
          {locked ? "Locked in." : "No going back — pick the one you believe."}
        </p>
      </div>
    </section>
  );
}
