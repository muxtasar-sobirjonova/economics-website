import React from "react";
import Link from "next/link";
import { PodiumPlot } from "./PodiumPlot";
import { getLeagueData } from "@/lib/league";
import type { BoardEntry, Standing } from "@/lib/leaderboard";

function Row({ entry }: { entry: BoardEntry }) {
  return (
    <div
      className={`grid grid-cols-[2.5rem_1fr_auto] gap-s3 items-center px-s4 py-s3 border-t border-line ${
        entry.isYou ? "bg-accent-soft" : ""
      }`}
    >
      <span className={`font-mono text-meta tabular ${entry.isYou ? "text-accent-strong" : "text-faint"}`}>
        {String(entry.rank).padStart(2, "0")}
      </span>

      <span className="flex items-center gap-s3 min-w-0">
        <span className="w-8 h-8 rounded-full grid place-items-center shrink-0 bg-bg-sunk text-muted font-semibold text-meta">
          {(entry.username || "?").charAt(0).toUpperCase()}
        </span>
        <span className={`text-ui truncate pb-[2px] ${entry.isYou ? "text-accent-strong font-semibold" : "text-ink"}`}>
          {entry.isYou ? `You · ${entry.username || "Anonymous"}` : entry.username || "Anonymous"}
        </span>
      </span>

      <span className="font-mono text-meta text-ink tabular text-right">
        {entry.lessonsCompleted}
      </span>
    </div>
  );
}

export function LeaderboardBoard({
  podium,
  rest,
  standing,
  totalRanked,
}: {
  podium: BoardEntry[];
  rest: BoardEntry[];
  standing: Standing;
  totalRanked: number;
}) {
  const league = getLeagueData(standing.lessonsCompleted);
  const toNext = Math.max(0, league.max - standing.lessonsCompleted);
  const empty = podium.length === 0;
  const rank = totalRanked > 0 ? standing.rank : null;

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[1080px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s5">
        <header>
          <span className="font-mono text-label uppercase text-faint">
            {league.name} league
            {!empty && ` · top ${podium.length + rest.length}`}
          </span>
          <h1 className="text-h1 font-semibold text-ink mt-s2 pb-[3px]">Leaderboard</h1>
          <p className="text-meta text-muted mt-s2 max-w-[56ch]">
            The podium is three plots, not three medals — rank is measured in
            what people built.
          </p>
        </header>

        {empty ? (
          <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s8 text-center">
            <h2 className="text-h3 font-semibold text-ink">No learners found</h2>
            <p className="text-meta text-muted mt-s2">Complete a lesson to get on the board.</p>
            <Link
              href="/roadmap"
              className="inline-flex items-center mt-s5 px-s5 py-s3 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors min-h-[44px]"
            >
              Start day one →
            </Link>
          </section>
        ) : (
          <>
            {/* Podium — 2nd, 1st, 3rd so the champion stands in the middle */}
            <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
              <div className="flex items-end gap-s2">
                <PodiumPlot place={2} entry={podium[1]} />
                <PodiumPlot place={1} entry={podium[0]} />
                <PodiumPlot place={3} entry={podium[2]} />
              </div>
            </section>

            {/* The next seven */}
            {rest.length > 0 && (
              <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
                <div className="grid grid-cols-[2.5rem_1fr_auto] gap-s3 px-s4 py-s3 bg-bg-sunk text-label uppercase text-faint">
                  <span>Rank</span>
                  <span>Learner</span>
                  <span className="text-right">Lessons</span>
                </div>
                {rest.map((e) => (
                  <Row key={e.userId} entry={e} />
                ))}
              </section>
            )}
          </>
        )}

        {/* Your standing */}
        <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
          <h2 className="text-label uppercase text-faint mb-s4">Your standing</h2>

          <div className="flex flex-wrap items-baseline gap-s6">
            <div>
              <div className="font-mono text-h1 text-ink tabular leading-none">
                {rank ? `#${rank}` : "—"}
              </div>
              <div className="text-meta text-muted mt-s2">
                {rank ? `of ${totalRanked} ranked` : "not ranked yet"}
              </div>
            </div>
            <div>
              <div className="font-mono text-h2 text-ink tabular leading-none">{standing.lessonsCompleted}</div>
              <div className="text-label uppercase text-faint mt-s2">Lessons built</div>
            </div>
            <div>
              <div className="text-h2 font-semibold text-ink leading-none">{league.name}</div>
              <div className="text-label uppercase text-faint mt-s2">League</div>
            </div>
          </div>

          <p className="text-meta text-muted mt-s4 pt-s4 border-t border-line">
            {league.next
              ? `${toNext} more ${toNext === 1 ? "lesson" : "lessons"} to ${league.next}.`
              : "Top league — nothing above this."}
            {rank === null && " Finish a lesson to take a place on the board."}
          </p>
        </section>
      </div>
    </div>
  );
}
