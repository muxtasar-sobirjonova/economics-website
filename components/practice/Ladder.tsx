"use client";

import { useState } from "react";

/**
 * The rating ladder, as a board.
 *
 * This is the duel ladder — the same Elo it always was — brought onto the
 * practice page now that the duel page is gone. The podium and the "you" row
 * are the mockup's; the numbers under them are not invented. There are no
 * leagues and no weekly promotion here, because there is no league table in
 * the database and drawing one would be drawing a lie.
 */

export interface LadderRow {
  userId: string;
  name: string | null;
  rating: number;
  played: number;
  won: number;
  /** This viewer. */
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

function Avatar({ name, big = false, lead = false }: { name: string | null; big?: boolean; lead?: boolean }) {
  return (
    <span
      className="rounded-full grid place-items-center font-extrabold shrink-0 border-[3px] border-white"
      style={{
        width: big ? 70 : 56,
        height: big ? 70 : 56,
        fontSize: big ? 26 : 20,
        background: lead ? "var(--accent)" : "var(--accent-soft)",
        color: lead ? "var(--on-accent)" : "var(--accent-strong)",
        boxShadow: "var(--sh1)",
      }}
      aria-hidden
    >
      {initial(name)}
    </span>
  );
}

function Podium({ rows }: { rows: LadderRow[] }) {
  // Second, first, third — the shape a podium is.
  const order = [1, 0, 2].filter((i) => rows[i]);
  const height = [120, 86, 62];
  const fill = ["var(--accent)", "#9a8fd6", "var(--accent-soft)"];

  return (
    <div
      className="mx-s5 rounded-lg p-s5 pb-0 grid grid-cols-3 gap-s3 items-end"
      style={{ background: "linear-gradient(180deg, var(--accent-soft), transparent)" }}
    >
      {order.map((i) => {
        const r = rows[i];
        const place = i + 1;
        return (
          <div key={r.userId} className="flex flex-col items-center text-center min-w-0">
            {place === 1 && (
              <svg width="26" height="20" viewBox="0 0 26 20" fill="currentColor" className="mb-1" style={{ color: "var(--accent)" }} aria-hidden>
                <path d="M2 5l6 5 5-8 5 8 6-5-2 13H4z" />
              </svg>
            )}
            <Avatar name={r.name} big={place === 1} lead={place === 1} />
            <span className="font-bold mt-s2 text-meta text-ink truncate max-w-full">
              {r.me ? "You" : r.name ?? "Anonymous"}
            </span>
            <span className="text-meta font-extrabold mb-s2" style={{ color: "var(--accent)" }}>
              {fmt(r.rating)}
            </span>
            <span
              className="w-full rounded-t-lg grid place-items-start justify-center pt-s2 text-h2 font-extrabold text-white"
              style={{
                height: height[place - 1],
                background: fill[place - 1],
                color: place === 3 ? "var(--accent-strong)" : "#fff",
              }}
            >
              {place}
            </span>
          </div>
        );
      })}
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

  const rows = tab === "rating" ? ladder : [];
  const top = rows.slice(0, 3);
  const rest = rows.slice(3, 10);

  return (
    <section className="rounded-lg border border-line overflow-hidden">
      <div className="p-s5 pb-0 flex flex-wrap items-start justify-between gap-s4">
        <div className="flex items-center gap-s3">
          <svg className="w-[52px] h-[52px] shrink-0" viewBox="0 0 52 52" aria-hidden>
            <path d="M26 3l20 12v22L26 49 6 37V15z" fill="var(--accent)" />
            <path d="M26 3l20 12-20 11L6 15z" fill="#9a8fd6" />
            <path d="M26 26v23L6 37V15z" fill="var(--accent-strong)" />
          </svg>
          <div>
            <h2 className="text-h3 font-extrabold text-ink tracking-tight">
              {tab === "rating" ? "The ladder" : "Experience"}
            </h2>
            <small className="text-meta text-muted block">
              {tab === "rating"
                ? "Rated duels only — strict multiple choice."
                : "Everything you have earned on the course."}
            </small>
          </div>
        </div>

        <div className="inline-flex gap-[3px] bg-bg-sunk p-[3px] rounded-lg">
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

      {tab === "rating" ? (
        ladder.length === 0 ? (
          <p className="text-meta text-muted p-s5">
            Nobody has finished a rated duel yet. Play a strict multiple-choice
            session and you will be the first on the board.
          </p>
        ) : (
          <>
            {top.length === 3 && <Podium rows={top} />}
            <ul className="list-none m-0 p-0 pt-s2">
              {(top.length === 3 ? rest : rows).map((r, i) => {
                const place = (top.length === 3 ? 4 : 1) + i;
                return (
                  <li
                    key={r.userId}
                    className="grid grid-cols-[34px_1fr_auto] sm:grid-cols-[48px_1fr_90px_110px] gap-s3 items-center px-s4 sm:px-s5 py-s3 border-b border-line"
                    style={r.me ? { background: "var(--accent-soft)", boxShadow: "inset 4px 0 0 var(--accent)" } : undefined}
                  >
                    <span className="font-extrabold text-muted text-center text-meta">{place}</span>
                    <span className="flex items-center gap-s3 font-semibold min-w-0 text-ui text-ink">
                      <span
                        className="w-9 h-9 rounded-full grid place-items-center text-meta font-extrabold shrink-0"
                        style={{
                          background: r.me ? "var(--accent)" : "var(--accent-soft)",
                          color: r.me ? "var(--on-accent)" : "var(--accent-strong)",
                        }}
                        aria-hidden
                      >
                        {initial(r.name)}
                      </span>
                      <span className="truncate">
                        {r.name ?? "Anonymous"}
                        {r.me && (
                          <b
                            className="text-label rounded px-1.5 py-[1px] ml-1.5 align-middle"
                            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
                          >
                            YOU
                          </b>
                        )}
                      </span>
                    </span>
                    <span className="hidden sm:block text-meta text-muted text-right tabular">
                      {r.played} played
                    </span>
                    <span className="text-ui font-extrabold text-ink text-right tabular">
                      {fmt(r.rating)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )
      ) : xp.length === 0 ? (
        <p className="text-meta text-muted p-s5">Nothing on the board yet.</p>
      ) : (
        <ul className="list-none m-0 p-0 pt-s2">
          {xp.slice(0, 10).map((r) => (
            <li
              key={r.userId}
              className="grid grid-cols-[34px_1fr_auto] sm:grid-cols-[48px_1fr_110px] gap-s3 items-center px-s4 sm:px-s5 py-s3 border-b border-line"
              style={r.me ? { background: "var(--accent-soft)", boxShadow: "inset 4px 0 0 var(--accent)" } : undefined}
            >
              <span className="font-extrabold text-muted text-center text-meta">{r.rank}</span>
              <span className="flex items-center gap-s3 font-semibold min-w-0 text-ui text-ink">
                <span
                  className="w-9 h-9 rounded-full grid place-items-center text-meta font-extrabold shrink-0"
                  style={{
                    background: r.me ? "var(--accent)" : "var(--accent-soft)",
                    color: r.me ? "var(--on-accent)" : "var(--accent-strong)",
                  }}
                  aria-hidden
                >
                  {initial(r.name)}
                </span>
                <span className="truncate">{r.name ?? "Anonymous"}</span>
              </span>
              <span className="text-ui font-extrabold text-ink text-right tabular">
                {fmt(r.totalXP)} XP
              </span>
            </li>
          ))}
        </ul>
      )}

      {tab === "rating" && myRating !== null && (
        <div className="m-s5 rounded-lg p-s4 flex flex-wrap gap-s4 items-center justify-between" style={{ background: "var(--accent-soft)" }}>
          <p className="text-ui text-ink max-w-[46ch]">
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
