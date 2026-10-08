"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  IconCheck, IconArrowRight, IconBulb, IconBook, IconChecklist, IconBookmark,
} from "@tabler/icons-react";
/** One thing to do today. Shaped by the home page's own query. */
export interface AgendaItem {
  id: string;
  itemType: "LESSON" | "QUIZ";
  itemId: string;
  title: string;
  tag: string;
  timeEstimate: number;
  isCompleted: boolean;
  url?: string;
}

/**
 * The dashboard.
 *
 * Three questions in the order a student asks them on opening the app: what is
 * left today, how is the week going, and where else can I go. The quote closes
 * the page rather than opening it — it is the one thing on here that is not a
 * task, and it was taking the top of the screen.
 *
 * Anything that depends on the clock is settled after mount. The server renders
 * in its own timezone, and a greeting that says "Good evening" on a server and
 * "Good afternoon" in Tashkent is a hydration mismatch as well as a lie.
 */

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const JUMP = [
  { name: "Concepts", href: "/lessons/1/concepts", icon: IconBulb },
  { name: "Articles", href: "/lessons/1/articles", icon: IconBook },
  { name: "Quizzes", href: "/lessons/1/quizzes", icon: IconChecklist },
  { name: "My notes", href: "/saved", icon: IconBookmark },
];

function greet(hour: number) {
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Dashboard({
  userName,
  items,
  completedDates,
  quote,
}: {
  userName: string;
  items: AgendaItem[];
  /** Every date this learner finished something, as YYYY-MM-DD. */
  completedDates: string[];
  /** Closes the page. It is the one thing here that is not a task, and it
      used to be taking the top of the screen. */
  quote?: React.ReactNode;
}) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const done = items.filter((i) => i.isCompleted).length;
  const total = items.length;
  const allDone = total > 0 && done === total;
  const minutesLeft = items.reduce((n, i) => n + (i.isCompleted ? 0 : i.timeEstimate || 0), 0);
  const next = items.find((i) => !i.isCompleted);

  const week = useMemo(() => {
    if (!now) return null;
    const jsDay = now.getDay();
    const todayIndex = jsDay === 0 ? 6 : jsDay - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - todayIndex);

    const dates = DAYS.map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    });

    const set = new Set(completedDates);
    return { todayIndex, dates, hit: dates.map((d) => set.has(d)) };
  }, [now, completedDates]);

  const daysThisWeek = week ? week.hit.filter(Boolean).length : 0;

  return (
    <div className="theme-v2 min-h-screen w-full bg-bg bg-sky">
      <div className="w-full max-w-[1040px] mx-auto px-s4 md:px-s6 pt-s5 md:pt-s7 pb-s8">
        {/* ── Greeting ────────────────────────────────────────────────── */}
        <header className="flex justify-between items-end gap-s5 flex-wrap mb-s6">
          <div className="min-w-0">
            <h1 className="font-reading text-h1 font-semibold tracking-tight text-ink leading-[1.1] break-words">
              {now ? `${greet(now.getHours())}, ${userName || "Student"}` : userName || "Student"}
            </h1>
            <p className="text-ui text-muted mt-s2">
              {now && (
                <>
                  {now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                  {" · "}
                </>
              )}
              {allDone
                ? "nothing left for today"
                : `${total - done} ${total - done === 1 ? "task" : "tasks"} left, up to ${minutesLeft} minutes`}
            </p>
          </div>

          <div className="flex gap-s3 flex-wrap">
            <Link
              href={next?.url ?? "/roadmap"}
              className="inline-flex items-center gap-s2 min-h-[44px] px-s5 rounded-md text-ui font-semibold transition-colors"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              Continue learning
              <IconArrowRight size={16} stroke={2.4} />
            </Link>
            <Link
              href="/saved"
              className="inline-flex items-center min-h-[44px] px-s5 rounded-md border border-line bg-surface text-ui font-semibold transition-colors hover:bg-bg-sunk"
              style={{ color: "var(--accent-strong)" }}
            >
              Review notes
            </Link>
          </div>
        </header>

        <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-s4 items-start">
          {/* ── Today ─────────────────────────────────────────────────── */}
          <section className="border border-line rounded-lg bg-surface p-s5">
            <div className="flex justify-between items-baseline gap-s3">
              <h2 className="font-reading text-h2 font-semibold tracking-tight text-ink">
                Today&apos;s agenda
              </h2>
              <span
                className="text-meta font-semibold rounded-sm px-s2 py-0.5 whitespace-nowrap"
                style={
                  allDone
                    ? { background: "var(--success-soft)", color: "var(--success)" }
                    : { background: "var(--accent-soft)", color: "var(--accent-strong)" }
                }
              >
                {allDone ? "Completed" : `Up to ${minutesLeft} min left`}
              </span>
            </div>

            <div className="flex justify-between text-meta text-muted mt-s4 mb-s2">
              <span>Progress</span>
              <b className="text-ink font-bold">
                {done} of {total} done
              </b>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-sunk)" }}>
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{
                  width: total ? `${(done / total) * 100}%` : "0%",
                  background: "var(--success)",
                }}
              />
            </div>

            <div className="grid gap-s3 mt-s4">
              {items.length === 0 && (
                <p className="text-meta text-muted py-s4">Nothing scheduled for today.</p>
              )}

              {items.map((item) => {
                const isNext = item.id === next?.id;

                return (
                  <Link
                    key={item.id}
                    href={item.url ?? "/roadmap"}
                    className="grid grid-cols-[26px_minmax(0,1fr)_auto] gap-s3 items-center border rounded-md px-s4 py-s3 transition-colors hover:bg-bg-sunk"
                    style={{
                      borderColor: isNext ? "var(--accent)" : "var(--border)",
                      boxShadow: isNext ? "0 0 0 3px var(--accent-soft)" : undefined,
                    }}
                  >
                    {/* A state, not a switch: a task is finished by doing it,
                        and a box that ticks without that would be a lie. */}
                    <span
                      className="w-[26px] h-[26px] rounded-full grid place-items-center border-[1.5px] shrink-0"
                      style={
                        item.isCompleted
                          ? { background: "var(--success)", borderColor: "var(--success)", color: "#fff" }
                          : { borderColor: "var(--border-strong)", color: "transparent" }
                      }
                      aria-hidden
                    >
                      <IconCheck size={15} stroke={3} />
                    </span>

                    <span className="min-w-0">
                      <small className="block font-mono text-label uppercase tracking-[.1em]" style={{ color: "var(--accent-strong)" }}>
                        {item.tag}
                      </small>
                      <b
                        className="block font-semibold leading-snug truncate text-ui"
                        style={
                          item.isCompleted
                            ? { color: "var(--muted)", textDecoration: "line-through", textDecorationColor: "var(--border-strong)" }
                            : { color: "var(--text)" }
                        }
                      >
                        {item.title}
                      </b>
                    </span>

                    <span className="font-mono text-meta text-muted whitespace-nowrap">
                      5–{item.timeEstimate} min
                    </span>
                  </Link>
                );
              })}
            </div>

            {allDone && (
              <p className="mt-s4 text-center font-semibold" style={{ color: "var(--success)" }}>
                You are done for today. Well done.
              </p>
            )}
          </section>

          {/* ── This week, and where else to go ───────────────────────── */}
          <div className="grid gap-s4">
            <section className="border border-line rounded-lg bg-surface p-s5">
              <div className="flex justify-between items-baseline gap-s3 mb-s3">
                <h2 className="font-reading text-h2 font-semibold tracking-tight text-ink">This week</h2>
                <span
                  className="text-meta font-semibold rounded-sm px-s2 py-0.5 whitespace-nowrap"
                  style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}
                >
                  {daysThisWeek} of 7 days
                </span>
              </div>

              <div className="grid grid-cols-7 gap-s2">
                {DAYS.map((d, i) => {
                  const on = week?.hit[i] ?? false;
                  const today = week?.todayIndex === i;

                  return (
                    <span key={i} className="flex flex-col items-center gap-s2">
                      <span
                        className="font-mono text-meta"
                        style={{ color: today ? "var(--accent-strong)" : "var(--muted)" }}
                      >
                        {d}
                      </span>
                      <span
                        className="w-[34px] h-[34px] rounded-full grid place-items-center"
                        style={
                          on
                            ? { background: "var(--success)", border: "1.5px solid var(--success)", color: "#fff" }
                            : today
                              ? { border: "2px solid var(--accent)", color: "transparent" }
                              : { border: "1.5px dashed var(--border-strong)", color: "transparent" }
                        }
                        aria-hidden
                      >
                        <IconCheck size={16} stroke={3} />
                      </span>
                    </span>
                  );
                })}
              </div>

              {!allDone && (
                <div className="mt-s5 pt-s4 border-t border-line text-center">
                  <Link
                    href={next?.url ?? "/roadmap"}
                    className="inline-flex items-center justify-center min-h-[44px] text-ui font-semibold"
                    style={{ color: "var(--accent-strong)" }}
                  >
                    Study today to build your streak →
                  </Link>
                </div>
              )}
            </section>

            <section className="border border-line rounded-lg bg-surface p-s5">
              <h2 className="font-reading text-h2 font-semibold tracking-tight text-ink mb-s3">
                Jump to
              </h2>
              <div className="grid grid-cols-2 gap-s3">
                {JUMP.map(({ name, href, icon: Icon }) => (
                  <Link
                    key={name}
                    href={href}
                    className="flex items-center gap-s3 border border-line rounded-md px-s3 py-s3 min-h-[44px] text-ui font-semibold text-ink transition-colors hover:bg-bg-sunk"
                  >
                    <span
                      className="w-[30px] h-[30px] rounded-md grid place-items-center shrink-0"
                      style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}
                      aria-hidden
                    >
                      <Icon size={17} stroke={2} />
                    </span>
                    <span className="truncate">{name}</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>

        {quote && (
          <figure className="mt-s4 border border-line rounded-lg p-s5 flex gap-s4 items-start" style={{ background: "var(--bg-sunk)" }}>
            {quote}
          </figure>
        )}
      </div>
    </div>
  );
}
