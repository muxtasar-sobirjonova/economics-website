"use client";

import { useState } from "react";
import { Plot, BADGE, type Metal } from "@/components/leaderboard/Plot";

/**
 * The rating ladder, drawn like the board on /leaderboard.
 *
 * Same treatment, different measure: that board ranks lessons built, this one
 * ranks the Elo from strict multiple choice. There are no leagues here and no
 * weekly promotion, because there is no league table in the database and
 * drawing one would be drawing a lie.
 */

export interface LadderRow {
  userId: string;
  name: string | null;
  rating: number;
  played: number;
  won: number;
  me?: boolean;
}

export interface XpRow {
  userId: string;
  name: string | null;
  totalXP: number;
  rank: number;
  me?: boolean;
}

const initial = (name: string | null) => (name?.trim()?.[0] ?? "?").toUpperCase();
const fmt = (n: number) => n.toLocaleString("en-US");

const PLACE: { metal: Metal; height: number; caption: string }[] = [
  { metal: "silver", height: 96, caption: "Runner up" },
  { metal: "gold", height: 116, caption: "Grand champion" },
  { metal: "bronze", height: 88, caption: "Third place" },
];

function Podium({ rows, unit }: { rows: LadderRow[]; unit: string }) {
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
            <span className="font-reading text-ui sm:text-h3 font-semibold mt-s1 text-ink break-words max-w-full">
              {r.me ? "You" : r.name ?? "Anonymous"}
            </span>
            <span className="font-mono text-meta text-muted mt-s1">
              {fmt(r.rating)} {unit}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Row({
  place, name, value, leader, me,
}: {
  place: number;
  name: string | null;
  value: number;
  leader: number;
  me?: boolean;
}) {
  const pct = leader > 0 ? Math.round((value / leader) * 100) : 0;

  return (
    <div
      className="grid grid-cols-[40px_minmax(0,1fr)_56px] sm:grid-cols-[64px_minmax(0,1fr)_150px_56px] gap-s3 items-center px-s4 sm:px-s5 min-h-[62px] border-t border-line first:border-t-0"
      style={me ? { background: "var(--accent-soft)", boxShadow: "inset 3px 0 0 var(--accent)" } : undefined}
    >
      <span className="font-mono text-ui tabular text-muted">
        {String(place).padStart(2, "0")}
      </span>

      <span
        className="flex items-center gap-s3 min-w-0 font-reading text-h3"
        style={me ? { color: "var(--accent-strong)", fontWeight: 600 } : undefined}
      >
        <span
          className="w-10 h-10 rounded-full grid place-items-center shrink-0 font-sans font-bold text-meta"
          style={
            me
              ? { background: "var(--accent)", color: "var(--on-accent)" }
              : { background: "var(--accent-soft)", color: "var(--accent-strong)" }
          }
          aria-hidden
        >
          {initial(name)}
        </span>
        <span className="truncate">{me ? `You · ${name ?? "Anonymous"}` : name ?? "Anonymous"}</span>
      </span>

      <span className="hidden sm:block h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-sunk)" }} aria-hidden>
        <span
          className="block h-full rounded-full"
          style={{ width: `${Math.max(pct, 6)}%`, background: "var(--accent)", opacity: me ? 1 : 0.55 }}
        />
      </span>

      <span className="font-mono text-ui text-ink tabular text-right">{fmt(value)}</span>
    </div>
  );
}

export function Ladder({
  ladder,
  xp,
  myRating,
}: {
  ladder: LadderRow[];
  xp: XpRow[];
  myRating: number | null;
}) {
  const [tab, setTab] = useState<"rating" | "xp">("rating");

  const rows =
    tab === "rating"
      ? ladder.map((r) => ({ key: r.userId, name: r.name, value: r.rating, me: r.me }))
      : xp.map((r) => ({ key: r.userId, name: r.name, value: r.totalXP, me: r.me }));

  const unit = tab === "rating" ? "rating" : "XP";
  const leader = rows[0]?.value ?? 0;

  return (
    <section id="ladder" className="scroll-mt-s5">
      <div className="flex flex-wrap items-center justify-between gap-s4 mb-s2">
        <h2 className="font-reading text-h2 font-semibold tracking-tight text-ink">Leaderboard</h2>

        <div className="inline-flex gap-[3px] bg-bg-sunk border border-line p-[3px] rounded-md">
          {([["rating", "Rating"], ["xp", "All time XP"]] as const).map(([v, name]) => (
            <button
              key={v}
              type="button"
              onClick={() => setTab(v)}
              aria-pressed={tab === v}
              className="min-h-[40px] px-s4 rounded-sm text-meta font-semibold transition-colors"
              style={
                tab === v
                  ? { background: "var(--accent)", color: "var(--on-accent)" }
                  : { color: "var(--accent-strong)" }
              }
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <p className="font-mono text-label uppercase tracking-[.14em] text-faint">
        Top {rows.length} ·{" "}
        {tab === "rating" ? "rated duels only — strict multiple choice" : "everything on the course"}
      </p>

      {rows.length === 0 ? (
        <p className="text-meta text-muted mt-s4 border border-line rounded-lg bg-surface p-s5">
          Nobody has finished a rated duel yet. Play a strict multiple-choice
          session and you will be the first on the board.
        </p>
      ) : (
        <>
          {rows.length >= 3 && (
            <Podium
              rows={rows.slice(0, 3).map((r) => ({
                userId: r.key, name: r.name, rating: r.value, played: 0, won: 0, me: r.me,
              }))}
              unit={unit}
            />
          )}

          <div className="border border-line rounded-lg bg-surface overflow-hidden mt-s4">
            <div
              className="grid grid-cols-[40px_minmax(0,1fr)_56px] sm:grid-cols-[64px_minmax(0,1fr)_150px_56px] gap-s3 items-center px-s4 sm:px-s5 h-11 font-mono text-label uppercase tracking-[.14em]"
              style={{ background: "var(--bg-sunk)", color: "var(--muted)" }}
            >
              <span>Rank</span>
              <span>Learner</span>
              <span className="sm:col-span-2 text-right">{unit}</span>
            </div>

            {(rows.length >= 3 ? rows.slice(3) : rows).map((r, i) => (
              <Row
                key={r.key}
                place={(rows.length >= 3 ? 4 : 1) + i}
                name={r.name}
                value={r.value}
                leader={leader}
                me={r.me}
              />
            ))}
          </div>
        </>
      )}

      {tab === "rating" && myRating !== null && (
        <div className="mt-s4 rounded-lg p-s4" style={{ background: "var(--accent-soft)" }}>
          <p className="text-ui text-ink max-w-[52ch]">
            Your rating is{" "}
            <b style={{ color: "var(--accent-strong)" }}>{fmt(myRating)}</b>. It moves
            only in a strict multiple-choice session, against someone who sat the
            same ten questions.
          </p>
        </div>
      )}
    </section>
  );
}
