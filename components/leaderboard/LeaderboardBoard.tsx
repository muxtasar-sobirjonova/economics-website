import React from "react";
import Link from "next/link";
import { Plot, BADGE, type Metal } from "./Plot";
import { getLeagueData } from "@/lib/league";
import type { BoardEntry, Standing } from "@/lib/leaderboard";

function Row({ entry, leaderLessons }: { entry: BoardEntry; leaderLessons: number }) {
  // A bar scaled to the leader shows the gap between places, not just the order.
  const pct = leaderLessons > 0 ? Math.round((entry.lessonsCompleted / leaderLessons) * 100) : 0;

  return (
    <div
      className="grid grid-cols-[40px_minmax(0,1fr)_56px] sm:grid-cols-[64px_minmax(0,1fr)_150px_56px] gap-s3 items-center px-s4 sm:px-s5 min-h-[62px] border-t border-line first:border-t-0"
      style={entry.isYou ? { background: "var(--accent-soft)", boxShadow: "inset 3px 0 0 var(--accent)" } : undefined}
    >
      <span className="font-mono text-ui tabular text-muted">
        {String(entry.rank).padStart(2, "0")}
      </span>

      <span
        className="flex items-center gap-s3 min-w-0 font-reading text-h3"
        style={entry.isYou ? { color: "var(--accent-strong)", fontWeight: 600 } : undefined}
      >
        <span
          className="w-10 h-10 rounded-full grid place-items-center shrink-0 font-sans font-bold text-meta"
          style={
            entry.isYou
              ? { background: "var(--accent)", color: "var(--on-accent)" }
              : { background: "var(--accent-soft)", color: "var(--accent-strong)" }
          }
          aria-hidden
        >
          {(entry.username || "?").charAt(0).toUpperCase()}
        </span>
        <span className="truncate">
          {entry.isYou ? `You · ${entry.username || "Anonymous"}` : entry.username || "Anonymous"}
        </span>
      </span>

      <span className="hidden sm:block h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-sunk)" }} aria-hidden>
        <span
          className="block h-full rounded-full"
          style={{ width: `${Math.max(pct, 6)}%`, background: "var(--accent)", opacity: entry.isYou ? 1 : 0.55 }}
        />
      </span>

      <span className="font-mono text-ui text-ink tabular text-right">
        {entry.lessonsCompleted}
      </span>
    </div>
  );
}

const PLACE: { metal: Metal; height: number; caption: string }[] = [
  { metal: "silver", height: 96, caption: "Runner up" },
  { metal: "gold", height: 116, caption: "Grand champion" },
  { metal: "bronze", height: 88, caption: "Third place" },
];

/** Second, first, third — the shape a podium is. */
function Podium({ rows }: { rows: BoardEntry[] }) {
  const order = [1, 0, 2];

  return (
    <div
      className="border border-line rounded-lg grid grid-cols-3 gap-s2 items-end px-s4 pt-s7 pb-s5 mt-s4"
      style={{ background: "linear-gradient(180deg,#ddd8f1 0%,#f3f1fb 38%,var(--surface) 70%)" }}
    >
      {order.map((i, slot) => {
        const r = rows[i];
        if (!r) return <div key={slot} />;
        const place = PLACE[slot];
        const badge = BADGE[place.metal];

        return (
          <div key={r.userId} className="flex flex-col items-center text-center min-w-0">
            <Plot metal={place.metal} height={place.height} />
            <span
              className="w-9 h-9 rounded-full grid place-items-center font-reading text-ui font-semibold border-[1.5px] -mt-[26px] relative"
              style={{ background: badge.bg, borderColor: badge.edge, color: badge.ink }}
            >
              {i + 1}
            </span>
            <span
              className="font-mono text-label uppercase tracking-[.16em] mt-s3"
              style={{ color: badge.ink }}
            >
              {place.caption}
            </span>
            {/* Smaller on a phone: at 19px in a third of 375px, "Tuychibaeva"
                does not fit and breaks in the middle of itself. */}
            <span className="font-reading text-ui sm:text-h3 font-semibold mt-s1 text-ink break-words max-w-full">
              {r.isYou ? "You" : r.username || "Anonymous"}
            </span>
            <span className="font-mono text-meta text-muted mt-s1">
              {r.lessonsCompleted} lessons
            </span>
          </div>
        );
      })}
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
  const leaderLessons = podium[0]?.lessonsCompleted ?? 0;

  // How far through the current league the learner stands.
  const span = Math.max(1, league.max - league.min);
  const leaguePct = Math.min(100, Math.round(((standing.lessonsCompleted - league.min) / span) * 100));

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[1080px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s5">
        <header>
          {/* The viewer's league used to be badged here, directly above a board
              that is the whole school's top ten. It read as "this is the Bronze
              league table", which it never was: the leader on it can be three
              leagues above you. The badge belongs in Your standing, where it is
              about you, and it is already there. */}
          {!empty && (
            <span className="font-mono text-label uppercase text-faint">
              Top {podium.length + rest.length} · everyone
            </span>
          )}
          <h1 className="font-reading text-h1 font-semibold tracking-tight text-ink mt-s2 leading-[1.1]">
            Leaderboard
          </h1>
          <p className="text-ui text-muted mt-s2 max-w-[56ch]">
            The podium is three plots, not three medals — rank is measured in
            what people built. Everyone is on one board; leagues are a mark of
            how far you have come, not a group you are ranked inside.
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
            <Podium rows={podium} />

            {/* The next seven */}
            {rest.length > 0 && (
              <section className="rounded-lg border border-line bg-surface overflow-hidden mt-s4">
                <div
                  className="grid grid-cols-[40px_minmax(0,1fr)_56px] sm:grid-cols-[64px_minmax(0,1fr)_150px_56px] gap-s3 items-center px-s4 sm:px-s5 h-11 font-mono text-label uppercase tracking-[.14em]"
                  style={{ background: "var(--bg-sunk)", color: "var(--muted)" }}
                >
                  <span>Rank</span>
                  <span>Learner</span>
                  <span className="sm:col-span-2 text-right">Lessons</span>
                </div>
                {rest.map((e) => (
                  <Row key={e.userId} entry={e} leaderLessons={leaderLessons} />
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
              <div className="font-mono text-h1 tabular leading-none text-accent-strong">
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
              <div
                className="inline-flex items-center gap-s2 px-s3 py-1 rounded-full border text-h3 font-semibold leading-none"
                style={{ color: league.ink, background: league.soft, borderColor: league.edge }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: league.ink }} aria-hidden />
                {league.name}
              </div>
              <div className="text-label uppercase text-faint mt-s2">League</div>
            </div>
          </div>

          <div className="mt-s4 pt-s4 border-t border-line">
            <div className="h-2 rounded-full bg-bg-sunk overflow-hidden" aria-hidden>
              <div
                className="h-full rounded-full transition-[width]"
                style={{ width: `${Math.max(leaguePct, 3)}%`, background: league.ink }}
              />
            </div>
            <p className="text-meta text-muted mt-s3">
              {league.next
                ? `${toNext} more ${toNext === 1 ? "lesson" : "lessons"} to ${league.next}.`
                : "Top league — nothing above this."}
              {rank === null && " Finish a lesson to take a place on the board."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
