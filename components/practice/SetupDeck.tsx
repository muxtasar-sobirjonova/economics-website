"use client";

import { useState } from "react";
import {
  LENGTHS, MODE_NOTE, describe, isRated, lengthOf, maxXp,
  type Setup, type SessionType, type SessionMode,
} from "@/lib/practice/session";

/**
 * Building a session.
 *
 * Four choices and a panel that says what they add up to. The panel is the
 * point: "strict multiple choice" does not obviously mean "this moves your
 * rating", and a player should not discover that at the end.
 */

function Group<T extends string>({
  label,
  value,
  options,
  onPick,
}: {
  label: string;
  value: T;
  options: { v: T; name: string; badge?: string; icon: React.ReactNode }[];
  onPick: (v: T) => void;
}) {
  return (
    <div className="grid sm:grid-cols-[64px_1fr] items-center gap-s2 sm:gap-s3">
      <span className="text-meta font-bold text-muted">{label}</span>
      {/* Fills its row. A grid item is blockified, so the mock's inline-flex
          bar spans the cell; ours was hugging its buttons and left every row
          looking half-finished. */}
      <div className="flex flex-wrap gap-[3px] bg-bg-sunk border border-line p-[3px] rounded-md">
        {options.map((o) => {
          const on = o.v === value;
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => onPick(o.v)}
              aria-pressed={on}
              className="inline-flex items-center gap-2 min-h-[44px] px-s4 rounded-sm text-ui font-semibold transition-colors"
              style={
                on
                  ? { background: "var(--accent)", color: "var(--on-accent)" }
                  : { color: "var(--accent-strong)" }
              }
            >
              {o.icon}
              {o.name}
              {o.badge && (
                <span
                  className="text-label font-bold rounded px-1.5 py-[1px]"
                  style={
                    on
                      ? { background: "rgba(255,255,255,.22)", color: "var(--on-accent)" }
                      : { background: "var(--accent-soft)", color: "var(--accent-strong)" }
                  }
                >
                  {o.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TopicChip({
  children,
  on,
  onClick,
}: {
  children: React.ReactNode;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="min-h-[40px] px-s4 rounded-md border text-meta font-semibold transition-colors"
      style={
        on
          ? { background: "var(--accent)", borderColor: "var(--accent)", color: "var(--on-accent)" }
          : { borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }
      }
    >
      {children}
    </button>
  );
}

const icon = (d: string) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden
    className="shrink-0"
  >
    <path d={d} />
  </svg>
);

export function SetupDeck({
  setup,
  setSetup,
  topics,
  poolSize,
  pending,
  onStart,
  error,
}: {
  setup: Setup;
  setSetup: (s: Setup) => void;
  topics: { topic: string; total: number }[];
  /** How many questions are left unseen under the current filter. */
  poolSize: number;
  pending: boolean;
  onStart: () => void;
  error: string | null;
}) {
  const rated = isRated(setup);
  const [open, setOpen] = useState(false);

  const inline = topics.slice(0, 3);
  const rest = topics.slice(3);
  const restIsChosen = rest.some((t) => t.topic === setup.topic);

  return (
    <div className="grid lg:grid-cols-[1fr_320px] rounded-lg border border-line overflow-hidden">
      <div className="p-s5 flex flex-col gap-s4 justify-center">
        <Group<SessionType>
          label="Type"
          value={setup.type}
          onPick={(type) => setSetup({ ...setup, type })}
          options={[
            { v: "MCQ", name: "Multiple choice", icon: icon("M4 7l2 2 3-3M4 17l2 2 3-3M13 8h7M13 18h7") },
            { v: "OPEN", name: "Open-ended", badge: "2×", icon: icon("M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z") },
          ]}
        />

        <Group<SessionMode>
          label="Mode"
          value={setup.mode}
          onPick={(mode) => setSetup({ ...setup, mode })}
          options={[
            { v: "DEFAULT", name: "Default", icon: icon("M8 12.5l3 3 5-6") },
            { v: "STRICT", name: "Strict", badge: "1.5×", icon: icon("M8 11V8a4 4 0 018 0v3M5 11h14v9H5z") },
          ]}
        />

        <Group<string>
          label="Length"
          value={String(lengthOf(setup))}
          onPick={(v) => setSetup({ ...setup, length: Number(v) })}
          options={LENGTHS.map((n) => ({ v: String(n), name: String(n), icon: null }))}
        />

        <div className="grid sm:grid-cols-[64px_1fr] items-start gap-s2 sm:gap-s3">
          <span className="text-meta font-bold text-muted sm:pt-s2">Topic</span>
          <div className="flex flex-wrap gap-s2">
            <TopicChip on={setup.topic === null} onClick={() => setSetup({ ...setup, topic: null })}>
              Any topic
            </TopicChip>

            {/* The first few inline, the rest behind a count. A bank with
                twenty topics in it would otherwise be twenty chips before you
                reach the button. */}
            {inline.map((t) => {
              const on = setup.topic === t.topic;
              return (
                <TopicChip
                  key={t.topic}
                  on={on}
                  onClick={() => setSetup({ ...setup, topic: on ? null : t.topic })}
                >
                  {t.topic}
                </TopicChip>
              );
            })}

            {rest.length > 0 && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                className="min-h-[40px] px-s4 rounded-md border border-dashed text-meta font-semibold inline-flex items-center gap-s2 transition-colors"
                style={{
                  borderColor: "var(--border-strong)",
                  background: "var(--bg-sunk)",
                  color: "var(--accent-strong)",
                }}
              >
                {restIsChosen ? setup.topic : "Cases & subjects"}
                <b
                  className="text-label rounded-sm px-1.5"
                  style={{ background: "var(--accent)", color: "var(--on-accent)" }}
                >
                  {rest.length}
                </b>
              </button>
            )}
          </div>
        </div>

        <p className="text-meta text-muted border-t border-dashed border-line pt-s3 sm:pl-[76px] max-w-[62ch]">
          {MODE_NOTE[setup.mode]}
          {rated && (
            <> Multiple choice played this way is the rated duel: it is paired with
            whoever else sits the same ten questions.</>
          )}
          {rated && setup.length !== 10 && (
            <> That is why the length is fixed — two people cannot meet on a set
            whose size depends on who dealt it.</>
          )}
          {setup.type === "OPEN" && (
            <> Written answers are marked by a model against the worked solution.</>
          )}
        </p>
      </div>

      <aside
        className="relative overflow-hidden p-s5 flex flex-col justify-center text-white"
        style={{ background: "linear-gradient(155deg, var(--accent), var(--accent-strong))" }}
      >
        <svg
          className="absolute -right-3 -bottom-2 w-[260px] opacity-[.22] pointer-events-none"
          viewBox="0 0 260 160" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" aria-hidden
        >
          <path d="M20 140L240 20M20 20c60 10 150 60 220 120" />
          <circle cx="135" cy="80" r="9" fill="#fff" stroke="none" />
          <path d="M135 80V150M135 80H10" strokeWidth={2} strokeDasharray="5 7" />
        </svg>

        <div className="relative flex flex-col gap-s1">
          <h3 className="text-meta font-bold opacity-75">Your session</h3>
          <p className="text-[46px] font-extrabold leading-none tracking-tight">
            {maxXp(setup)}
            <span className="text-h3 font-semibold opacity-80 ml-1.5">XP</span>
          </p>
          <p className="text-meta opacity-80">{describe(setup)}</p>

          <p className="text-meta opacity-85 flex items-center gap-s2 mt-s2">
            <span className="w-2 h-2 rounded-full bg-white shrink-0" aria-hidden />
            {setup.topic ?? "Any topic"} · {poolSize} unsolved
          </p>

          {rated && (
            <p className="text-meta font-semibold mt-s2">This one moves your rating.</p>
          )}

          {error && <p className="text-meta mt-s2 font-semibold">{error}</p>}

          <button
            type="button"
            onClick={onStart}
            disabled={pending}
            className="mt-s4 min-h-[48px] px-s5 rounded-lg bg-white text-ui font-extrabold inline-flex items-center justify-center gap-2 disabled:opacity-70 transition-opacity"
            style={{ color: "var(--accent-strong)" }}
          >
            {pending ? "Dealing…" : "Start practice"}
            {!pending && icon("M5 12h14M13 6l6 6-6 6")}
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-s5"
          style={{ background: "rgba(36,31,64,.4)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Choose a topic"
            className="w-full sm:max-w-[420px] max-h-[78vh] bg-surface rounded-t-lg sm:rounded-lg shadow-sh3 flex flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-s2">
              {rest.map((t) => {
                const on = setup.topic === t.topic;
                return (
                  <button
                    key={t.topic}
                    type="button"
                    onClick={() => {
                      setSetup({ ...setup, topic: on ? null : t.topic });
                      setOpen(false);
                    }}
                    aria-pressed={on}
                    className="w-full flex items-center justify-between gap-s3 text-left px-s4 min-h-[48px] rounded-md hover:bg-bg-sunk transition-colors"
                  >
                    <span className="text-ui text-ink truncate">{t.topic}</span>
                    <span
                      className="font-mono text-meta shrink-0"
                      style={{ color: on ? "var(--accent-strong)" : "var(--muted)" }}
                    >
                      {t.total}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-s4 p-s3 border-t border-line bg-bg-sunk">
              <button
                type="button"
                onClick={() => {
                  setSetup({ ...setup, topic: null });
                  setOpen(false);
                }}
                className="text-meta font-semibold min-h-[44px]"
                style={{ color: "var(--accent-strong)" }}
              >
                Any topic
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto min-h-[44px] px-s5 rounded-md text-meta font-semibold"
                style={{ background: "var(--accent)", color: "var(--on-accent)" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
