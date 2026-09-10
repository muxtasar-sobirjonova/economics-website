"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { ProblemSummary } from "@/lib/compete/problemService";

/**
 * Both forms are loaded on demand.
 *
 * The problem side pulls in the editor, which pulls in the renderer, which
 * pulls in KaTeX — about a hundred kilobytes that every student who opens
 * /compete would otherwise download to look at a list of rooms they are
 * joining. Nothing here renders until a host presses a button, so nothing
 * here needs to be in the page's first load.
 */
const QuizSetup = dynamic(
  () => import("@/components/compete/QuizSetup").then((m) => m.QuizSetup),
  { ssr: false, loading: () => <Loading /> }
);

const ProblemPicker = dynamic(
  () => import("@/components/compete/ProblemPicker").then((m) => m.ProblemPicker),
  { ssr: false, loading: () => <Loading /> }
);

function Loading() {
  return <p className="text-meta text-faint">One moment…</p>;
}

/**
 * Opening a room.
 *
 * Two kinds, one panel, chosen at the top: a quiz out of the multiple choice
 * bank, or a set of written problems. Everything needed to fill either one —
 * including writing a question or a problem that does not exist yet — is
 * inside it. A host works out what is missing while they are setting a room
 * up, and a page they have to leave to fix it is a room opened without it.
 */

type Mode = "QUIZ" | "PROBLEMS";

export function HostPanel({
  topics,
  problems,
  problemsAvailable,
  mayHost,
  mayWrite,
}: {
  topics: { name: string; count: number }[];
  problems: ProblemSummary[];
  /** False when the problem tables are not in the database yet. */
  problemsAvailable: boolean;
  mayHost: boolean;
  mayWrite: boolean;
}) {
  const [mode, setMode] = useState<Mode | null>(null);

  const questionCount = topics.reduce((n, t) => n + t.count, 0);
  const problemCount = problems.filter((p) => p.active).length;

  if (mode === null) {
    return (
      <div className="flex flex-wrap gap-s3">
        {mayHost && (
          <>
            <button
              onClick={() => setMode("QUIZ")}
              className="inline-flex items-center justify-center min-h-[48px] px-s6 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors"
            >
              Open a quiz
            </button>
            <button
              onClick={() => setMode("PROBLEMS")}
              className="inline-flex items-center justify-center min-h-[48px] px-s6 rounded-md border border-line text-ui text-ink hover:border-accent transition-colors"
            >
              Open a problem set
            </button>
          </>
        )}
        {mayWrite && (
          <Link
            href="/compete/problems"
            className="inline-flex items-center justify-center min-h-[48px] px-s5 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors"
          >
            The problem bank
          </Link>
        )}
      </div>
    );
  }

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s4 md:p-s5 flex flex-col gap-s4">
      <h2 className="text-h3 font-semibold text-ink">Open a competition</h2>

      <div className="flex flex-wrap gap-s2">
        <ModeButton
          on={mode === "QUIZ"}
          onClick={() => setMode("QUIZ")}
          label="Quiz"
          detail={`${questionCount} multiple choice`}
        />
        <ModeButton
          on={mode === "PROBLEMS"}
          onClick={() => setMode("PROBLEMS")}
          label="Problem set"
          detail={
            problemsAvailable
              ? `${problemCount} written`
              : "not set up yet"
          }
        />
      </div>

      <p className="text-meta text-muted max-w-[58ch]">
        {mode === "QUIZ"
          ? "Four options, a clock on every question, marked the moment it is answered."
          : "Written answers out of a paper. One clock for the whole set, every problem reachable at any time, and marks by the key, the model, or you."}
      </p>

      {mode === "QUIZ" ? (
        <QuizSetup topics={topics} mayWrite={mayWrite} onCancel={() => setMode(null)} />
      ) : (
        <ProblemPicker
          problems={problems}
          mayWrite={mayWrite}
          mayHost={mayHost}
          available={problemsAvailable}
          onCancel={() => setMode(null)}
        />
      )}
    </section>
  );
}

function ModeButton({
  on,
  onClick,
  label,
  detail,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
  detail: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className="min-h-[48px] px-s4 py-s2 rounded-md border text-left transition-colors"
      style={
        on
          ? { borderColor: "var(--accent)", background: "var(--accent-soft)" }
          : { borderColor: "var(--border)" }
      }
    >
      <span
        className="block text-ui font-semibold"
        style={{ color: on ? "var(--accent-strong)" : "var(--text)" }}
      >
        {label}
      </span>
      <span className="block text-label uppercase text-faint">{detail}</span>
    </button>
  );
}
