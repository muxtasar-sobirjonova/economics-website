"use client";

import { useState, useTransition } from "react";
import { setQuestionActiveAction } from "@/app/actions/duelBank";
import { HEALTH_COPY, type Assessed, type Health } from "@/lib/duel/calibration";

const FILTERS: { key: Health | "all"; label: string }[] = [
  { key: "suspect", label: "Check the key" },
  { key: "hard", label: "Hard" },
  { key: "fine", label: "Fine" },
  { key: "trivial", label: "Too easy" },
  { key: "new", label: "Not judged" },
  { key: "all", label: "All" },
];

export function BankTable({ rows }: { rows: Assessed[] }) {
  const [filter, setFilter] = useState<Health | "all">("suspect");
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);

  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.health] = (acc[r.health] ?? 0) + 1;
    return acc;
  }, {});

  const shown = filter === "all" ? rows : rows.filter((r) => r.health === filter);

  const toggle = (id: string, next: boolean) => {
    setBusy(id);
    startTransition(async () => {
      await setQuestionActiveAction(id, next);
      setBusy(null);
    });
  };

  return (
    <section className="flex flex-col gap-s3">
      <div className="flex flex-wrap gap-s2">
        {FILTERS.map((f) => {
          const n = f.key === "all" ? rows.length : (counts[f.key] ?? 0);
          const on = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={on}
              className={`flex items-center gap-s2 px-s3 py-s2 rounded-md border text-meta min-h-[44px] transition-colors ${
                on
                  ? "border-transparent bg-accent-soft text-accent-strong"
                  : "border-line text-muted hover:text-ink hover:border-line-strong"
              }`}
            >
              {f.label}
              <span className="font-mono text-[11px] tabular opacity-70">{n}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-lg border border-line bg-surface shadow-sh1 p-s6 text-center">
          <p className="text-ui text-ink">Nothing in this group.</p>
          <p className="text-meta text-muted mt-s2">
            {filter === "suspect"
              ? "No question is landing below guessing level. The keys look right."
              : "Try another group."}
          </p>
        </div>
      ) : (
        <ul className="list-none m-0 p-0 rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
          {shown.map((r) => {
            const copy = HEALTH_COPY[r.health];
            return (
              <li
                key={r.id}
                className="px-s4 py-s3 border-t border-line first:border-t-0"
                style={{ opacity: r.active ? 1 : 0.5 }}
              >
                <div className="flex items-start justify-between gap-s3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-label uppercase text-faint">
                      {r.topic}
                      {!r.active && " · retired"}
                    </span>
                    <p className="text-ui text-ink mt-1 break-words">{r.questionText}</p>
                  </div>

                  <div className="flex items-center gap-s3 shrink-0">
                    <span className="text-right">
                      <span className="block font-mono text-ui tabular text-ink">
                        {r.rate === null ? "—" : `${Math.round(r.rate * 100)}%`}
                      </span>
                      <span className="block font-mono text-label uppercase text-faint">
                        {r.timesCorrect}/{r.timesServed}
                      </span>
                    </span>

                    <span
                      className="text-label uppercase px-s2 py-1 rounded-sm whitespace-nowrap"
                      style={{ background: `var(--${copy.tone}-soft)`, color: `var(--${copy.tone})` }}
                    >
                      {copy.label}
                    </span>

                    <button
                      onClick={() => toggle(r.id, !r.active)}
                      disabled={pending && busy === r.id}
                      className="min-h-[44px] px-s3 rounded-md border border-line text-meta text-muted hover:text-ink hover:border-line-strong transition-colors disabled:opacity-50"
                    >
                      {busy === r.id ? "…" : r.active ? "Retire" : "Restore"}
                    </button>
                  </div>
                </div>

                {(r.health === "suspect" || r.health === "trivial") && (
                  <p className="text-meta text-muted mt-s2">{copy.note}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
