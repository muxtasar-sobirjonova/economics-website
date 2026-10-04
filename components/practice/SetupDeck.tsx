"use client";

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
      <div className="inline-flex flex-wrap gap-[3px] bg-bg-sunk p-[3px] rounded-xl justify-self-start max-w-full">
        {options.map((o) => {
          const on = o.v === value;
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => onPick(o.v)}
              aria-pressed={on}
              className="inline-flex items-center gap-2 min-h-[44px] px-s4 rounded-[9px] text-ui font-semibold transition-colors"
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

  return (
    <div className="grid lg:grid-cols-[1fr_320px] rounded-xl border border-line overflow-hidden">
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
            <button
              type="button"
              onClick={() => setSetup({ ...setup, topic: null })}
              aria-pressed={setup.topic === null}
              className="min-h-[40px] px-s4 rounded-full border text-meta font-semibold transition-colors"
              style={
                setup.topic === null
                  ? { background: "var(--accent)", borderColor: "var(--accent)", color: "var(--on-accent)" }
                  : { borderColor: "var(--border)", color: "var(--text)" }
              }
            >
              Any topic
            </button>
            {topics.map((t) => {
              const on = setup.topic === t.topic;
              return (
                <button
                  key={t.topic}
                  type="button"
                  onClick={() => setSetup({ ...setup, topic: on ? null : t.topic })}
                  aria-pressed={on}
                  className="min-h-[40px] px-s4 rounded-full border text-meta font-semibold transition-colors"
                  style={
                    on
                      ? { background: "var(--accent)", borderColor: "var(--accent)", color: "var(--on-accent)" }
                      : { borderColor: "var(--border)", color: "var(--text)" }
                  }
                >
                  {t.topic}
                </button>
              );
            })}
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
            {setup.topic ?? "Any topic"} · {poolSize} unseen
          </p>

          {rated && (
            <p className="text-meta font-semibold mt-s2">This one moves your rating.</p>
          )}

          {error && <p className="text-meta mt-s2 font-semibold">{error}</p>}

          <button
            type="button"
            onClick={onStart}
            disabled={pending}
            className="mt-s4 min-h-[48px] px-s5 rounded-xl bg-white text-ui font-extrabold inline-flex items-center justify-center gap-2 disabled:opacity-70 transition-opacity"
            style={{ color: "var(--accent-strong)" }}
          >
            {pending ? "Dealing…" : "Start practice"}
            {!pending && icon("M5 12h14M13 6l6 6-6 6")}
          </button>
        </div>
      </aside>
    </div>
  );
}
