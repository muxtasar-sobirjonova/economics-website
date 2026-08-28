"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveQuestionAction } from "@/app/actions/duelBank";

const BLANK = { topic: "", questionText: "", options: ["", "", "", ""], correctAnswer: "", explanation: "" };

/**
 * Writing a question without a developer.
 *
 * The bank is the constraint on everything else here, and until now growing it
 * meant a CSV and a hand-run SQL paste. Validation is the importer's, so a
 * question typed here is held to exactly the standard a loaded one is.
 */
export function QuestionEditor({ topics }: { topics: string[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(BLANK);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  const setOption = (i: number, value: string) => {
    const options = [...draft.options];
    const previous = options[i];
    options[i] = value;
    setDraft({
      ...draft,
      options,
      // Keep the marked answer pointing at the option it was marking.
      correctAnswer: draft.correctAnswer === previous ? value : draft.correctAnswer,
    });
  };

  const submit = () => {
    setError(null);
    setSaved(false);
    start(async () => {
      const res = await saveQuestionAction({
        topic: draft.topic,
        questionText: draft.questionText,
        options: draft.options.filter((o) => o.trim()),
        correctAnswer: draft.correctAnswer,
        explanation: draft.explanation,
      });
      if (!res.ok) return setError(res.error ?? "Could not save.");
      setDraft(BLANK);
      setSaved(true);
      router.refresh();
    });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center min-h-[48px] px-s5 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors self-start"
      >
        Write a question
      </button>
    );
  }

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5 flex flex-col gap-s4">
      <h2 className="text-h3 font-semibold text-ink">Write a question</h2>

      <label className="flex flex-col gap-s2">
        <span className="text-label uppercase text-faint">Topic</span>
        <input
          list="bank-topics"
          value={draft.topic}
          onChange={(e) => setDraft({ ...draft, topic: e.target.value })}
          placeholder="Microeconomics"
          className="bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink placeholder:text-faint min-h-[44px]"
        />
        <datalist id="bank-topics">
          {topics.map((t) => <option key={t} value={t} />)}
        </datalist>
      </label>

      <label className="flex flex-col gap-s2">
        <span className="text-label uppercase text-faint">Question</span>
        <textarea
          value={draft.questionText}
          onChange={(e) => setDraft({ ...draft, questionText: e.target.value })}
          rows={3}
          placeholder="A government sets a maximum bread price below the market equilibrium. What follows?"
          className="bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink placeholder:text-faint"
        />
      </label>

      <div className="flex flex-col gap-s2">
        <span className="text-label uppercase text-faint">
          Options · tap the circle to mark the right one
        </span>
        {draft.options.map((option, i) => {
          const isAnswer = option.trim() !== "" && draft.correctAnswer === option;
          return (
            <div key={i} className="flex items-center gap-s2">
              <button
                type="button"
                onClick={() => option.trim() && setDraft({ ...draft, correctAnswer: option })}
                aria-label={`Mark option ${i + 1} as the answer`}
                aria-pressed={isAnswer}
                className="w-11 h-11 rounded-full border grid place-items-center shrink-0 transition-colors"
                style={
                  isAnswer
                    ? { borderColor: "var(--success)", background: "var(--success-soft)", color: "var(--success)" }
                    : { borderColor: "var(--border)", color: "var(--faint)" }
                }
              >
                {isAnswer ? "✓" : String.fromCharCode(65 + i)}
              </button>
              <input
                value={option}
                onChange={(e) => setOption(i, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className="flex-1 min-w-0 bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink placeholder:text-faint min-h-[44px]"
              />
            </div>
          );
        })}
      </div>

      <label className="flex flex-col gap-s2">
        <span className="text-label uppercase text-faint">Why (shown after the duel)</span>
        <textarea
          value={draft.explanation}
          onChange={(e) => setDraft({ ...draft, explanation: e.target.value })}
          rows={2}
          placeholder="Below equilibrium, quantity demanded exceeds quantity supplied."
          className="bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink placeholder:text-faint"
        />
      </label>

      {error && <p className="text-meta" style={{ color: "var(--danger)" }}>{error}</p>}
      {saved && <p className="text-meta" style={{ color: "var(--success)" }}>Saved. Write another.</p>}

      <div className="flex flex-wrap gap-s3">
        <button
          onClick={submit}
          disabled={pending}
          className="inline-flex items-center min-h-[48px] px-s5 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save it"}
        </button>
        <button
          onClick={() => { setOpen(false); setDraft(BLANK); setError(null); setSaved(false); }}
          className="inline-flex items-center min-h-[48px] px-s5 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors"
        >
          Done
        </button>
      </div>
    </section>
  );
}
