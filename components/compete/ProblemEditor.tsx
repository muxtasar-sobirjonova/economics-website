"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProblemAction } from "@/app/actions/problems";
import { Rich } from "@/components/compete/Rich";
import { MAX_POINTS, MIN_POINTS } from "@/lib/compete/problem";

/**
 * Writing a problem.
 *
 * The preview is the point. A problem arrives as a picture of a page — a table
 * of figures, a formula, a diagram — and whether it survived being typed in is
 * a question about how it *looks*, which no validation error can answer.
 */

type Kind = "NUMERIC" | "SHORT" | "OPEN";
type Mode = "AUTO" | "AI" | "HOST";

export interface Draft {
  id?: string;
  title: string;
  topic: string;
  statement: string;
  imageUrl: string;
  answerKind: Kind;
  numericValue: string;
  numericTolerance: string;
  acceptedAnswers: string;
  answerHint: string;
  solution: string;
  maxPoints: number;
  gradingMode: Mode;
}

export const BLANK: Draft = {
  title: "",
  topic: "",
  statement: "",
  imageUrl: "",
  answerKind: "NUMERIC",
  numericValue: "",
  numericTolerance: "0",
  acceptedAnswers: "",
  answerHint: "",
  solution: "",
  maxPoints: 5,
  gradingMode: "AUTO",
};

const FIELD =
  "bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink placeholder:text-faint min-h-[44px]";

const KIND_COPY: Record<Kind, string> = {
  NUMERIC: "A number. Marked against a value, so 1,200 and “1200 so‘m” both count.",
  SHORT: "A word or a phrase. Marked against the spellings you list.",
  OPEN: "Working, an argument, a derivation. No key exists, so a marker is needed.",
};

const MODE_COPY: Record<Mode, string> = {
  AUTO: "The key marks it, the moment a paper is handed in. Anything the key cannot read waits for you.",
  AI: "The key first; the model reads the rest and may give part marks. Every mark is yours to change.",
  HOST: "Nothing is marked until you read it.",
};

export function ProblemEditor({
  initial,
  topics,
  onDone,
}: {
  initial?: Draft;
  topics: string[];
  onDone?: () => void;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(initial ?? BLANK);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  // An open problem has no key, so the key's own marking mode cannot apply.
  const modes: Mode[] = draft.answerKind === "OPEN" ? ["AI", "HOST"] : ["AUTO", "AI", "HOST"];
  const mode = modes.includes(draft.gradingMode) ? draft.gradingMode : "AI";

  const submit = () => {
    setError(null);
    setSaved(false);
    start(async () => {
      const res = await saveProblemAction({
        id: draft.id,
        title: draft.title,
        topic: draft.topic,
        statement: draft.statement,
        imageUrl: draft.imageUrl,
        answerKind: draft.answerKind,
        numericValue: draft.numericValue,
        numericTolerance: draft.numericTolerance,
        acceptedAnswers: draft.acceptedAnswers,
        answerHint: draft.answerHint,
        solution: draft.solution,
        maxPoints: draft.maxPoints,
        gradingMode: mode,
      });

      if (!res.ok) return setError(res.error);
      setSaved(true);
      if (!draft.id) setDraft(BLANK);
      router.refresh();
      onDone?.();
    });
  };

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5 flex flex-col gap-s4">
      <h2 className="text-h3 font-semibold text-ink">
        {draft.id ? "Edit the problem" : "Write a problem"}
      </h2>

      <div className="grid sm:grid-cols-[2fr_1fr] gap-s4">
        <label className="flex flex-col gap-s2">
          <span className="text-label uppercase text-faint">
            Title · shown above the problem, so do not repeat it in the text
          </span>
          <input
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Problem 3 — the bread market"
            className={FIELD}
          />
        </label>

        <label className="flex flex-col gap-s2">
          <span className="text-label uppercase text-faint">Topic</span>
          <input
            list="problem-topics"
            value={draft.topic}
            onChange={(e) => set("topic", e.target.value)}
            placeholder="Microeconomics"
            className={FIELD}
          />
          <datalist id="problem-topics">
            {topics.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </label>
      </div>

      <label className="flex flex-col gap-s2">
        <span className="text-label uppercase text-faint">
          The problem · **bold**, *italic*, $Q_d = 100 - 2P$, tables, - lists
        </span>
        <textarea
          value={draft.statement}
          onChange={(e) => set("statement", e.target.value)}
          rows={10}
          placeholder={
            "Demand in the bread market is $Q_d = 100 - 2P$ and supply is $Q_s = 20 + P$.\n\n" +
            "| Year | Output |\n| --- | ---: |\n| 2023 | 1,200 |\n\n" +
            "Find the equilibrium price."
          }
          className="bg-raised border border-line rounded-md px-s3 py-s3 text-ui text-ink placeholder:text-faint font-mono leading-relaxed resize-y min-h-[220px]"
        />
      </label>

      {draft.statement.trim() && (
        <div className="rounded-md border border-line bg-bg-sunk p-s4">
          <span className="text-label uppercase text-faint">How it will look</span>
          <div className="mt-s3">
            <Rich source={draft.statement} />
          </div>
        </div>
      )}

      <label className="flex flex-col gap-s2">
        <span className="text-label uppercase text-faint">
          Diagram (optional) · a file in /problems/ or an https address
        </span>
        <input
          value={draft.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          placeholder="/problems/bread-market.png"
          className={FIELD}
        />
      </label>

      <fieldset className="flex flex-col gap-s3 border-0 p-0 m-0">
        <legend className="text-label uppercase text-faint">The answer</legend>
        <div className="flex flex-wrap gap-s2">
          {(["NUMERIC", "SHORT", "OPEN"] as Kind[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => set("answerKind", k)}
              aria-pressed={draft.answerKind === k}
              className="min-h-[44px] px-s4 rounded-md border text-ui transition-colors"
              style={
                draft.answerKind === k
                  ? { borderColor: "var(--accent)", background: "var(--accent-soft)", color: "var(--accent-strong)" }
                  : { borderColor: "var(--border)", color: "var(--muted)" }
              }
            >
              {k === "NUMERIC" ? "A number" : k === "SHORT" ? "A short answer" : "Written working"}
            </button>
          ))}
        </div>
        <p className="text-meta text-muted">{KIND_COPY[draft.answerKind]}</p>
      </fieldset>

      {draft.answerKind === "NUMERIC" && (
        <div className="grid sm:grid-cols-2 gap-s4">
          <label className="flex flex-col gap-s2">
            <span className="text-label uppercase text-faint">The right number</span>
            <input
              value={draft.numericValue}
              onChange={(e) => set("numericValue", e.target.value)}
              inputMode="decimal"
              placeholder="26.67"
              className={FIELD}
            />
          </label>
          <label className="flex flex-col gap-s2">
            <span className="text-label uppercase text-faint">Give or take</span>
            <input
              value={draft.numericTolerance}
              onChange={(e) => set("numericTolerance", e.target.value)}
              inputMode="decimal"
              placeholder="0.1"
              className={FIELD}
            />
          </label>
        </div>
      )}

      {draft.answerKind === "SHORT" && (
        <label className="flex flex-col gap-s2">
          <span className="text-label uppercase text-faint">
            Accepted answers · separated by |
          </span>
          <input
            value={draft.acceptedAnswers}
            onChange={(e) => set("acceptedAnswers", e.target.value)}
            placeholder="inflatsiya | inflation"
            className={FIELD}
          />
        </label>
      )}

      <div className="grid sm:grid-cols-2 gap-s4">
        <label className="flex flex-col gap-s2">
          <span className="text-label uppercase text-faint">Hint in the box (optional)</span>
          <input
            value={draft.answerHint}
            onChange={(e) => set("answerHint", e.target.value)}
            placeholder="in thousands of so‘m"
            className={FIELD}
          />
        </label>

        <label className="flex flex-col gap-s2">
          <span className="text-label uppercase text-faint">
            Worth · {draft.maxPoints} {draft.maxPoints === 1 ? "mark" : "marks"}
          </span>
          <input
            type="range"
            min={MIN_POINTS}
            max={25}
            value={draft.maxPoints}
            onChange={(e) => set("maxPoints", Number(e.target.value))}
            className="min-h-[44px] accent-[var(--accent)]"
          />
          <span className="text-meta text-faint">
            Up to {MAX_POINTS}; the slider stops at 25 because a set of them has to add up.
          </span>
        </label>
      </div>

      <label className="flex flex-col gap-s2">
        <span className="text-label uppercase text-faint">
          The worked solution {mode === "AI" ? "· the model marks against this" : "· shown after the room ends"}
        </span>
        <textarea
          value={draft.solution}
          onChange={(e) => set("solution", e.target.value)}
          rows={5}
          placeholder={"Set $Q_d = Q_s$: $100 - 2P = 20 + P$, so $P = 26.67$."}
          className="bg-raised border border-line rounded-md px-s3 py-s3 text-ui text-ink placeholder:text-faint font-mono leading-relaxed resize-y"
        />
      </label>

      <fieldset className="flex flex-col gap-s3 border-0 p-0 m-0">
        <legend className="text-label uppercase text-faint">Who marks it</legend>
        <div className="flex flex-wrap gap-s2">
          {modes.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => set("gradingMode", m)}
              aria-pressed={mode === m}
              className="min-h-[44px] px-s4 rounded-md border text-ui transition-colors"
              style={
                mode === m
                  ? { borderColor: "var(--accent)", background: "var(--accent-soft)", color: "var(--accent-strong)" }
                  : { borderColor: "var(--border)", color: "var(--muted)" }
              }
            >
              {m === "AUTO" ? "The key" : m === "AI" ? "The model, then you" : "You"}
            </button>
          ))}
        </div>
        <p className="text-meta text-muted">{MODE_COPY[mode]}</p>
      </fieldset>

      {error && (
        <p className="text-meta" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
      {saved && (
        <p className="text-meta" style={{ color: "var(--success)" }}>
          Saved.
        </p>
      )}

      <div className="flex flex-wrap gap-s3">
        <button
          onClick={submit}
          disabled={pending}
          className="inline-flex items-center min-h-[48px] px-s6 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors disabled:opacity-60"
        >
          {pending ? "Saving…" : draft.id ? "Save the changes" : "Add it to the bank"}
        </button>
        {onDone && (
          <button
            onClick={onDone}
            className="inline-flex items-center min-h-[48px] px-s5 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </section>
  );
}
