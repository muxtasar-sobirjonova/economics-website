"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createProblemCompetitionAction,
  retireProblemAction,
} from "@/app/actions/problems";
import type { ProblemSummary } from "@/lib/compete/problemService";
import { MAX_PROBLEMS, MIN_MINUTES, MAX_MINUTES } from "@/lib/compete/problemService";
import { ProblemEditor } from "@/components/compete/ProblemEditor";
import { plainText } from "@/lib/compete/markdown";

/**
 * The problem bank, and opening a room out of it.
 *
 * Picking is ordered rather than filtered: the order problems are ticked in is
 * the order they are answered in, because a paper has a first question and a
 * last one and a host who typed them in that order meant it.
 */

const KIND_LABEL: Record<string, string> = {
  NUMERIC: "number",
  SHORT: "short",
  OPEN: "written",
};

const MODE_LABEL: Record<string, string> = {
  AUTO: "key",
  AI: "model",
  HOST: "you",
};

export function ProblemBank({
  problems,
  mayHost,
}: {
  problems: ProblemSummary[];
  mayHost: boolean;
}) {
  const router = useRouter();
  const [picked, setPicked] = useState<string[]>([]);
  const [writing, setWriting] = useState(false);
  const [topicFilter, setTopicFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(45);
  const [timed, setTimed] = useState(true);
  const [access, setAccess] = useState<"OPEN" | "LINK">("OPEN");

  const topics = useMemo(
    () => [...new Set(problems.map((p) => p.topic))].sort(),
    [problems]
  );

  const shown = topicFilter ? problems.filter((p) => p.topic === topicFilter) : problems;
  const byId = useMemo(() => new Map(problems.map((p) => [p.id, p])), [problems]);
  const marks = picked.reduce((sum, id) => sum + (byId.get(id)?.maxPoints ?? 0), 0);

  const toggle = (id: string) =>
    setPicked((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  const open = () => {
    setError(null);
    start(async () => {
      const res = await createProblemCompetitionAction({
        title,
        problemIds: picked,
        durationMinutes: timed ? minutes : null,
        access,
      });
      if (!res.ok) return setError(res.error);
      router.push(`/compete/${res.data.code}`);
    });
  };

  const retire = (id: string, active: boolean) =>
    start(async () => {
      await retireProblemAction(id, active);
      router.refresh();
    });

  return (
    <div className="flex flex-col gap-s5">
      {writing ? (
        <ProblemEditor topics={topics} onDone={() => setWriting(false)} />
      ) : (
        <button
          onClick={() => setWriting(true)}
          className="inline-flex items-center justify-center min-h-[48px] px-s5 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors self-start"
        >
          Write a problem
        </button>
      )}

      {mayHost && picked.length > 0 && (
        <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5 flex flex-col gap-s4">
          <h2 className="text-h3 font-semibold text-ink">
            Open a set · {picked.length}{" "}
            {picked.length === 1 ? "problem" : "problems"} · {marks} marks
          </h2>

          <ol className="list-decimal pl-s5 text-meta text-muted flex flex-col gap-1">
            {picked.map((id) => (
              <li key={id} className="truncate">
                {byId.get(id)?.title ?? "Problem"} · {byId.get(id)?.maxPoints ?? 0}
              </li>
            ))}
          </ol>

          <label className="flex flex-col gap-s2">
            <span className="text-label uppercase text-faint">Name</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              placeholder="Round one — micro"
              className="bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink placeholder:text-faint min-h-[44px]"
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-s4">
            <label className="flex flex-col gap-s2">
              <span className="text-label uppercase text-faint">Who can join</span>
              <select
                value={access}
                onChange={(e) => setAccess(e.target.value === "LINK" ? "LINK" : "OPEN")}
                className="bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink min-h-[44px]"
              >
                <option value="OPEN">Anyone — listed on the page</option>
                <option value="LINK">Only people with the code</option>
              </select>
            </label>

            <label className="flex flex-col gap-s2">
              <span className="text-label uppercase text-faint">
                {timed ? `Time · ${minutes} minutes for the whole set` : "No clock"}
              </span>
              <input
                type="range"
                min={MIN_MINUTES}
                max={MAX_MINUTES}
                step={5}
                value={minutes}
                disabled={!timed}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="min-h-[44px] accent-[var(--accent)] disabled:opacity-40"
              />
              <button
                type="button"
                onClick={() => setTimed((v) => !v)}
                className="text-meta text-accent hover:text-accent-strong text-left min-h-[24px]"
              >
                {timed ? "Take the clock off — I will close it myself" : "Put a clock on it"}
              </button>
            </label>
          </div>

          {error && (
            <p className="text-meta" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-s3">
            <button
              onClick={open}
              disabled={pending}
              className="inline-flex items-center min-h-[48px] px-s6 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors disabled:opacity-60"
            >
              {pending ? "Opening…" : "Open it"}
            </button>
            <button
              onClick={() => setPicked([])}
              className="inline-flex items-center min-h-[48px] px-s5 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors"
            >
              Clear the set
            </button>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-s3">
        <div className="flex flex-wrap items-center gap-s3">
          <h2 className="text-h2 font-semibold text-ink">The bank</h2>
          <span className="h-px bg-line flex-1 min-w-[20px]" />
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="bg-raised border border-line rounded-md px-s3 py-s2 text-meta text-ink min-h-[44px]"
          >
            <option value="">Every topic ({problems.length})</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t} ({problems.filter((p) => p.topic === t).length})
              </option>
            ))}
          </select>
        </div>

        {shown.length === 0 ? (
          <p className="text-meta text-muted">
            No problems yet. Write one above — a paper of them is what a
            competition needs before anything else here matters.
          </p>
        ) : (
          <ul className="list-none m-0 p-0 rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
            {shown.map((p) => {
              const at = picked.indexOf(p.id);
              const chosen = at >= 0;

              return (
                <li
                  key={p.id}
                  className="grid grid-cols-[auto_1fr_auto] gap-s3 items-start px-s4 py-s3 border-t border-line first:border-t-0"
                  style={{ opacity: p.active ? 1 : 0.5 }}
                >
                  {mayHost ? (
                    <button
                      onClick={() => toggle(p.id)}
                      disabled={!p.active || (!chosen && picked.length >= MAX_PROBLEMS)}
                      aria-pressed={chosen}
                      aria-label={chosen ? `Remove ${p.title} from the set` : `Add ${p.title} to the set`}
                      className="w-11 h-11 rounded-md border grid place-items-center shrink-0 font-mono text-meta transition-colors disabled:opacity-40"
                      style={
                        chosen
                          ? { borderColor: "var(--accent)", background: "var(--accent)", color: "var(--on-accent)" }
                          : { borderColor: "var(--border)", color: "var(--faint)" }
                      }
                    >
                      {chosen ? at + 1 : "+"}
                    </button>
                  ) : (
                    <span className="w-11" />
                  )}

                  <span className="min-w-0">
                    <span className="block text-ui text-ink truncate pb-[2px]">{p.title}</span>
                    <span className="block text-meta text-muted line-clamp-2">
                      {plainText(p.statement, 120)}
                    </span>
                    <span className="block font-mono text-label uppercase text-faint mt-1">
                      {p.topic} · {p.maxPoints} marks · {KIND_LABEL[p.answerKind] ?? "written"} ·
                      marked by {MODE_LABEL[p.gradingMode] ?? "you"}
                      {p.gradingMode === "AI" && !p.hasSolution ? " · no solution" : ""}
                      {p.active ? "" : " · retired"}
                    </span>
                  </span>

                  <button
                    onClick={() => retire(p.id, !p.active)}
                    disabled={pending}
                    className="text-label uppercase text-faint hover:text-ink transition-colors min-h-[44px] px-s2 shrink-0"
                  >
                    {p.active ? "Retire" : "Restore"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
