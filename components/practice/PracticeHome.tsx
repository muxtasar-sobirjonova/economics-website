"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { SetupDeck } from "@/components/practice/SetupDeck";
import { McqRun } from "@/components/practice/McqRun";
import { Ladder } from "@/components/practice/Ladder";
import { DEFAULT_SETUP, isRated, type Setup } from "@/lib/practice/session";
import type { PracticeHome as HomeData } from "@/lib/practice/home";

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

function Chip({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-s3 border border-line rounded-2xl py-s2 pl-s2 pr-s4">
      <span
        className="w-9 h-9 rounded-xl grid place-items-center shrink-0"
        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        aria-hidden
      >
        {icon}
      </span>
      <span className="min-w-0">
        <b className="block text-ui font-extrabold leading-tight text-ink">{value}</b>
        <small className="text-meta text-muted">{label}</small>
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
      <div className="flex flex-wrap items-end justify-between gap-s4">
        <div>
          <h1 className="text-h1 font-extrabold tracking-tight text-ink pb-[3px]">Practice</h1>
          <p className="text-meta text-muted mt-s2 max-w-[50ch]">
            Build your session, solve, and climb the ladder.
          </p>
        </div>

        <div className="flex flex-wrap gap-s3">
          <Chip
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3.5 5 5.5 5 10a5 5 0 01-10 0c0-1.7.8-3 1.8-4 .2 1.2.9 2 1.7 2.3C10 7.5 10.5 4.5 12 2z"/></svg>}
            value={`${data.streak} ${data.streak === 1 ? "day" : "days"}`}
            label="Streak"
          />
          <Chip
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>}
            value={`${data.weeklyXp.toLocaleString("en-US")} XP`}
            label="All time"
          />
          {data.myRating !== null && (
            <Chip
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V12M12 20V6M20 20V3"/></svg>}
              value={String(data.myRating)}
              label="Rating"
            />
          )}
        </div>
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
