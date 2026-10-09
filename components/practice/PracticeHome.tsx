"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { SetupDeck } from "@/components/practice/SetupDeck";
import { McqRun } from "@/components/practice/McqRun";
import { Ladder } from "@/components/practice/Ladder";
import { DEFAULT_SETUP, isRated, type Setup } from "@/lib/practice/session";
import { DAILY_GOAL, type PracticeHome as HomeData } from "@/lib/practice/home";

/**
 * One page where there used to be two.
 *
 * The duel was always ten multiple-choice questions under a clock, so it is
 * not a separate thing from practice — it is practice with the strictest
 * setting on. The deck says which, the ladder below says what it was worth,
 * and `/duel` is gone.
 */

// KaTeX rides along with the written problems and is most of what this page
// would weigh. Nothing needs it until a session has started.
const Practice = dynamic(
  () => import("@/components/compete/Practice").then((m) => m.Practice),
  { loading: () => <div className="h-[220px] rounded-lg border border-line bg-surface" /> }
);

function Ring({ done, goal }: { done: number; goal: number }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, goal > 0 ? done / goal : 0);

  return (
    <span className="relative w-9 h-9 shrink-0 grid place-items-center" aria-hidden>
      <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--bg-sunk)" strokeWidth="5" />
        <circle
          cx="18" cy="18" r={r} fill="none" stroke="var(--success)" strokeWidth="5"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
        />
      </svg>
    </span>
  );
}

function Chip({
  icon,
  value,
  label,
  good,
  bare,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  /** Green, for a figure that is a good thing rather than a measurement. */
  good?: boolean;
  /** The icon draws its own shape — no tinted square behind it. */
  bare?: boolean;
}) {
  return (
    // The redesign's stat tile: a fixed height, the icon in a soft square, and
    // the label above the figure rather than under it — the number is what you
    // came for, so it reads last and largest.
    <div className="h-[76px] bg-surface flex items-center gap-s3 border border-line rounded-lg px-s3 min-w-0">
      {bare ? (
        icon
      ) : (
        <span
          className="w-9 h-9 rounded-md grid place-items-center shrink-0"
          style={
            good
              ? { background: "var(--success-soft)", color: "var(--success)" }
              : { background: "var(--accent-soft)", color: "var(--accent-strong)" }
          }
          aria-hidden
        >
          {icon}
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-meta text-muted leading-tight truncate">{label}</span>
        <b className="block text-h3 font-bold tracking-tight text-ink leading-tight tabular">
          {value}
        </b>
      </span>
    </div>
  );
}

export function PracticeHome({ data }: { data: HomeData }) {
  const [setup, setSetup] = useState<Setup>(DEFAULT_SETUP);
  const [running, setRunning] = useState<Setup | null>(null);

  const topics = useMemo(
    () =>
      setup.type === "MCQ"
        ? data.mcqTopics
        : data.overview.topics.map((t) => ({ topic: t.topic, total: t.total })),
    [setup.type, data]
  );

  // Switching type can leave a topic selected that the other bank has never
  // heard of, which would deal an empty set.
  const known = topics.some((t) => t.topic === setup.topic);
  const effective: Setup = known ? setup : { ...setup, topic: null };

  const pool =
    effective.type === "MCQ"
      ? effective.topic
        ? topics.find((t) => t.topic === effective.topic)?.total ?? 0
        : data.mcqPool
      : effective.topic
        ? data.overview.topics.find((t) => t.topic === effective.topic)
          ? (data.overview.topics.find((t) => t.topic === effective.topic)!.total -
             data.overview.topics.find((t) => t.topic === effective.topic)!.done)
          : 0
        : data.overview.left;

  if (running) {
    return (
      <div className="flex flex-col gap-s4">
        <button
          type="button"
          onClick={() => setRunning(null)}
          className="self-start font-mono text-label uppercase text-accent hover:text-accent-strong min-h-[44px]"
        >
          ← Change the setup
        </button>

        {running.type === "MCQ" ? (
          <McqRun setup={running} onLeave={() => setRunning(null)} />
        ) : (
          <Practice overview={data.overview} lockedTopic={running.topic} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-s5">
      <div>
        <h1 className="font-reading text-h1 font-semibold tracking-tight text-ink leading-[1.1]">
          Practice
        </h1>
        <p className="text-ui text-muted mt-s2 max-w-[56ch]">
          Build a session, solve, and climb your league.
        </p>
      </div>

      {/* Four figures, across the page rather than crowded beside the title:
          what you have kept up, what you have earned, what is left today, and
          where that puts you. */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-s3">
        <Chip
          good
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3.5 5 5.5 5 10a5 5 0 01-10 0c0-1.7.8-3 1.8-4 .2 1.2.9 2 1.7 2.3C10 7.5 10.5 4.5 12 2z"/></svg>}
          value={`${data.streak} ${data.streak === 1 ? "day" : "days"}`}
          label="Streak"
        />
        <Chip
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>}
          value={data.weeklyXp.toLocaleString("en-US")}
          label="XP"
        />
        <Chip
          icon={<Ring done={data.solvedToday} goal={DAILY_GOAL} />}
          value={`${data.solvedToday} of ${DAILY_GOAL}`}
          label="Daily goal"
          bare
        />
        <Chip
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0zM17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3"/></svg>}
          value={data.rank ? `#${data.rank}` : "—"}
          label="League rank"
        />
      </div>

      <SetupDeck
        setup={effective}
        setSetup={setSetup}
        topics={topics}
        poolSize={pool}
        pending={false}
        error={
          effective.type === "OPEN" && !data.overview.available
            ? "Written problems are not set up yet — the practice migration has not been run."
            : null
        }
        onStart={() => setRunning(effective)}
      />

      {isRated(effective) && (
        <p className="text-meta text-faint max-w-[62ch]">
          A rated session is paired with whoever else sits the same ten
          questions — it may settle minutes later or hours later. Everything you
          answer here, rated or not, is remembered, so a question never comes
          back in a duel.
        </p>
      )}

      <Ladder ladder={data.ladder} xp={data.xp} myRating={data.myRating} />
    </div>
  );
}
