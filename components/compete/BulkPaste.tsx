"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { importProblemsAction } from "@/app/actions/problems";
import { importQuestionsAction } from "@/app/actions/duelBank";
import {
  parseProblemImport,
  parseQuestionImport,
  type ImportIssue,
} from "@/lib/compete/bulkImport";

/**
 * A whole paper in one box.
 *
 * The form is right for writing a question and wrong for entering ten that
 * already exist on a page in front of you. This reads them all at once and
 * counts what it found *before* anything is saved, because the moment to find
 * out that the separators are wrong is before sixty problems land in the bank.
 */

type Kind = "PROBLEMS" | "QUESTIONS";

const EXAMPLE: Record<Kind, string> = {
  PROBLEMS: `## Problem 1 — the bread market
Demand is $Q_d = 100 - 2P$ and supply is $Q_s = 20 + P$.

Find the equilibrium price.
@topic Microeconomics
@answer 26.67
@tolerance 0.1
@points 5
---
Explain who bears a tax on a good with inelastic demand.
@topic Microeconomics
@points 10
@solution The more inelastic side of the market bears more of the tax.`,

  QUESTIONS: `Topic: Microeconomics
A government sets a maximum bread price below equilibrium. What follows?
* A shortage
- A surplus
- No change in quantity
> Below equilibrium, quantity demanded exceeds quantity supplied.
---
Topic: Macroeconomics
What is a sustained fall in the general price level?
- Disinflation
* Deflation
- Stagflation`,
};

const HELP: Record<Kind, React.ReactNode> = {
  PROBLEMS: (
    <>
      Separate problems with <code className="font-mono">---</code> on its own
      line. A leading <code className="font-mono">##</code> heading becomes the
      title. Everything else is the problem, until the lines that start with{" "}
      <code className="font-mono">@</code>:{" "}
      <code className="font-mono">@answer</code>,{" "}
      <code className="font-mono">@tolerance</code>,{" "}
      <code className="font-mono">@points</code>,{" "}
      <code className="font-mono">@topic</code>,{" "}
      <code className="font-mono">@hint</code>,{" "}
      <code className="font-mono">@solution</code>,{" "}
      <code className="font-mono">@image</code>,{" "}
      <code className="font-mono">@marker</code>. A solution can run over
      several lines. No <code className="font-mono">@answer</code> means a
      written problem.
    </>
  ),
  QUESTIONS: (
    <>
      Separate questions with <code className="font-mono">---</code>. Mark the
      right option with <code className="font-mono">*</code> and the rest with{" "}
      <code className="font-mono">-</code>. A line starting with{" "}
      <code className="font-mono">&gt;</code> is the explanation shown
      afterwards, and <code className="font-mono">Topic:</code> sets the topic.
      Questions written here join the shared bank, so they can be drawn into
      duels as well as rooms.
    </>
  ),
};

export function BulkPaste({ kind, onDone }: { kind: Kind; onDone?: () => void }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ added: number; issues: ImportIssue[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  // Read as they type. Nothing is saved by this; it only says what will be.
  const preview =
    kind === "PROBLEMS" ? parseProblemImport(text) : parseQuestionImport(text);
  const found = preview.records.length;

  const save = () => {
    setError(null);
    setResult(null);
    start(async () => {
      if (kind === "PROBLEMS") {
        const res = await importProblemsAction(text);
        if (!res.ok) return setError(res.error);
        setResult(res.data);
        if (res.data.added > 0) setText("");
      } else {
        const res = await importQuestionsAction(text);
        if (!res.ok) return setError(res.error ?? "Could not save those.");
        setResult({ added: res.added ?? 0, issues: res.issues ?? [] });
        if ((res.added ?? 0) > 0) setText("");
      }
      router.refresh();
      onDone?.();
    });
  };

  const noun = kind === "PROBLEMS" ? "problem" : "question";

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s4 md:p-s5 flex flex-col gap-s4">
      <h2 className="text-h3 font-semibold text-ink">
        Paste a whole {kind === "PROBLEMS" ? "paper" : "sheet"}
      </h2>

      <p className="text-meta text-muted max-w-[62ch]">{HELP[kind]}</p>

      <label className="flex flex-col gap-s2">
        <span className="text-label uppercase text-faint">
          {found > 0
            ? `${found} ${noun}${found === 1 ? "" : "s"} read so far`
            : "Paste here"}
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={14}
          spellCheck={false}
          placeholder={EXAMPLE[kind]}
          className="bg-raised border border-line rounded-md px-s3 py-s3 text-ui text-ink placeholder:text-faint font-mono leading-relaxed resize-y min-h-[260px]"
        />
      </label>

      {/* What it read, before anything is written. */}
      {text.trim() !== "" && (
        <div className="rounded-md border border-line bg-bg-sunk p-s4 flex flex-col gap-s2">
          <span className="text-label uppercase text-faint">What it read</span>
          {found === 0 ? (
            <p className="text-meta text-muted">
              Nothing yet. Check the separators are <code className="font-mono">---</code>{" "}
              on their own line.
            </p>
          ) : (
            <ol className="list-decimal pl-s5 text-meta text-muted flex flex-col gap-1">
              {preview.records.slice(0, 12).map((r, i) => (
                <li key={i} className="break-words">
                  {"title" in r
                    ? `${r.title} · ${r.maxPoints} marks · ${
                        r.answerKind === "NUMERIC"
                          ? "number"
                          : r.answerKind === "SHORT"
                            ? "short"
                            : "written"
                      }`
                    : `${r.questiontext.slice(0, 70)}${r.questiontext.length > 70 ? "…" : ""} · ${
                        r.options.length
                      } options`}
                </li>
              ))}
              {found > 12 && <li className="list-none text-faint">…and {found - 12} more</li>}
            </ol>
          )}

          {preview.issues.length > 0 && (
            <ul className="list-none m-0 p-0 flex flex-col gap-1 mt-s2">
              {preview.issues.map((issue, i) => (
                <li key={i} className="text-meta" style={{ color: "var(--danger)" }}>
                  Block {issue.block}: {issue.problem}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && <p className="text-meta" style={{ color: "var(--danger)" }}>{error}</p>}

      {result && (
        <div className="flex flex-col gap-1">
          <p className="text-meta" style={{ color: "var(--success)" }}>
            Added {result.added} {noun}
            {result.added === 1 ? "" : "s"}.
          </p>
          {result.issues.map((issue, i) => (
            <p key={i} className="text-meta" style={{ color: "var(--danger)" }}>
              Block {issue.block} was skipped: {issue.problem}
            </p>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-s3">
        <button
          onClick={save}
          disabled={pending || found === 0}
          className="inline-flex items-center min-h-[48px] px-s5 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors disabled:opacity-50"
        >
          {pending
            ? "Saving…"
            : found === 0
              ? "Nothing to add"
              : `Add ${found} ${noun}${found === 1 ? "" : "s"}`}
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
