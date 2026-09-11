"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveDraftAction, submitProblemsAction, setFlagAction } from "@/app/actions/problems";
import type { ProblemSession } from "@/lib/compete/problemService";
import { Rich } from "@/components/compete/Rich";
import { useFocusGuard } from "@/components/compete/FocusGuard";
import { useArena, useLeaveWarning, StrikeModal, PausedModal } from "@/components/compete/Arena";
import { Navigator } from "@/components/compete/Navigator";

/**
 * Answering a paper.
 *
 * Paced as a paper is: one clock for the whole set, every problem reachable at
 * any time, and an answer that can be changed until it is handed in. A problem
 * is not a twenty second question and pretending otherwise would mean marking
 * people on how fast they can read.
 *
 * Nothing here is told whether an answer is right. The marks exist on the
 * server the moment a paper is handed in, and are shown when the host ends the
 * room — a student who finishes early is still sitting among people writing.
 */

const SAVE_DEBOUNCE_MS = 700;

function clock(msLeft: number): string {
  const total = Math.max(0, Math.floor(msLeft / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function ProblemPlay({ session }: { session: ProblemSession }) {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(session.problems.map((p) => [p.id, p.draft]))
  );
  const [flags, setFlags] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(session.problems.map((p) => [p.id, p.flagged]))
  );
  /** Which have been on screen. Kept here rather than stored: it is only worth
      anything during the sitting, and a column for it would be a column to
      migrate. */
  const [seen, setSeen] = useState<Set<string>>(
    () => new Set(session.problems.length > 0 ? [session.problems[0].id] : [])
  );
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [handingIn, setHandingIn] = useState(false);

  const deadline = session.deadline ? new Date(session.deadline).getTime() : null;
  /**
   * Null until the browser has it.
   *
   * Reading the clock during render would read it twice — once on the server
   * and once when React takes over — and a second between the two is a
   * hydration mismatch that throws the whole tree away and rebuilds it.
   */
  const [now, setNow] = useState<number | null>(null);

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const submittedRef = useRef(false);

  useArena(!session.submitted);
  useLeaveWarning(!session.submitted);

  const guard = useFocusGuard({
    competitionId: session.competitionId,
    policy: session.focusPolicy,
    initialLocked: session.locked,
    active: !session.submitted,
  });

  /** Pasting is the short road from a model's answer to this box. */
  const watched = session.focusPolicy !== "NONE";
  const refusePaste = (e: React.ClipboardEvent) => {
    if (!watched) return;
    e.preventDefault();
    setError("Pasting is off in this room. Type your answer.");
  };

  const problem = session.problems[index];
  const total = session.problems.length;
  const answered = useMemo(
    () => session.problems.filter((p) => (drafts[p.id] ?? "").trim() !== "").length,
    [drafts, session.problems]
  );

  const push = useCallback(
    async (problemId: string, text: string) => {
      setSaving(true);
      const res = await saveDraftAction(session.competitionId, problemId, text);
      setSaving(false);
      if (res.ok) {
        setSavedAt(res.data.savedAt);
        setError(null);
      } else {
        setError(res.error);
      }
    },
    [session.competitionId]
  );

  /** Typing saves itself. One timer per problem, so moving on does not cancel a save. */
  const edit = (problemId: string, text: string) => {
    setDrafts((d) => ({ ...d, [problemId]: text }));
    clearTimeout(timers.current[problemId]);
    timers.current[problemId] = setTimeout(() => void push(problemId, text), SAVE_DEBOUNCE_MS);
  };

  const goTo = useCallback(
    (next: number) => {
      const target = Math.min(Math.max(next, 0), session.problems.length - 1);
      const id = session.problems[target]?.id;
      if (id) setSeen((s) => (s.has(id) ? s : new Set(s).add(id)));
      setIndex(target);
    },
    [session.problems]
  );

  const toggleFlag = useCallback(
    (problemId: string) => {
      const next = !flags[problemId];
      setFlags((f) => ({ ...f, [problemId]: next }));
      void setFlagAction(session.competitionId, problemId, next);
    },
    [flags, session.competitionId]
  );

  /** Everything outstanding, now — before handing in, and before leaving a box. */
  const flush = useCallback(async () => {
    const pending = Object.keys(timers.current);
    for (const id of pending) clearTimeout(timers.current[id]);
    timers.current = {};
    await Promise.all(pending.map((id) => push(id, drafts[id] ?? "")));
  }, [drafts, push]);

  const handIn = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setHandingIn(true);
    await flush();
    const res = await submitProblemsAction(session.competitionId);
    if (!res.ok) {
      submittedRef.current = false;
      setHandingIn(false);
      return setError(res.error);
    }
    router.refresh();
  }, [flush, router, session.competitionId]);

  // The clock. Started here rather than in render, and only while there is one
  // to tick.
  useEffect(() => {
    if (!deadline || session.submitted) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [deadline, session.submitted]);

  // Time up hands the paper in rather than discarding it: a student who wrote
  // for an hour and lost it to a clock will not sit another one.
  useEffect(() => {
    if (!deadline || session.submitted || submittedRef.current || now === null) return;
    // A frozen paper is handed in by the host ending the room, not by its own
    // clock: submitting it here would take the decision away from them.
    if (guard.locked) return;
    if (now >= deadline) void handIn();
  }, [now, deadline, session.submitted, handIn, guard.locked]);

  /**
   * Keys, but never while someone is writing.
   *
   * The answer box is a text field: an arrow key belongs to the cursor and an
   * `f` belongs to the word being typed. Shortcuts only apply when the focus
   * is somewhere else, which is exactly when they are wanted.
   */
  useEffect(() => {
    if (session.submitted || guard.locked) return;

    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing =
        el &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "ArrowRight") { void flush(); goTo(index + 1); }
      else if (e.key === "ArrowLeft") { void flush(); goTo(index - 1); }
      else if (e.key.toLowerCase() === "f" && problem) toggleFlag(problem.id);
      else return;

      e.preventDefault();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [session.submitted, guard.locked, index, problem, goTo, toggleFlag, flush]);

  // A closed laptop should not cost the last paragraph.
  useEffect(() => {
    const save = () => {
      for (const [id, timer] of Object.entries(timers.current)) {
        clearTimeout(timer);
        void push(id, drafts[id] ?? "");
      }
    };
    window.addEventListener("pagehide", save);
    return () => window.removeEventListener("pagehide", save);
  }, [drafts, push]);

  if (session.submitted) {
    return (
      <div className="flex flex-col gap-s4">
        <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s6 text-center">
          <h2 className="text-h3 font-semibold text-ink">Handed in</h2>
          <p className="text-meta text-muted mt-s3 max-w-[46ch] mx-auto">
            {answered} of {total} answered. Marks and the worked solutions open
            when the host ends the competition.
          </p>
        </section>
        <RoomProgress room={session.room} total={total} />
      </div>
    );
  }

  if (guard.locked) {
    return (
      <>
        <div className="flex flex-col gap-s4 arena-blur" aria-hidden>
          <RoomProgress room={session.room} total={total} />
        </div>
        <PausedModal
          reason={session.lockReason}
          byHost={session.lockedByHost}
          answered={answered}
          total={total}
        />
      </>
    );
  }

  if (!problem) return null;

  const left = deadline && now !== null ? deadline - now : null;
  const urgent = left !== null && left <= 60_000;
  const soon = left !== null && left <= 5 * 60_000;
  // Amber with five minutes left, red with one. A clock that only changes as
  // it expires tells you something you can no longer act on.
  const clockColour = urgent ? "var(--danger)" : soon ? "var(--reward)" : "var(--text)";
  const draft = drafts[problem.id] ?? "";
  const isLong = problem.answerKind === "OPEN";

  return (
    <div className="flex flex-col gap-s4">
      {guard.notice && (
        <StrikeModal
          notice={guard.notice}
          strikes={guard.strikes}
          remaining={guard.remaining}
          onDismiss={guard.dismiss}
        />
      )}

      {/* Where you are, and how long is left. */}
      <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s4 flex flex-wrap items-center gap-s4">
        <div className="flex-1 min-w-0">
          <span className="font-mono text-label uppercase text-faint">
            {answered} of {total} answered
          </span>
          <Navigator
            tiles={session.problems.map((p) => ({
              id: p.id,
              answered: (drafts[p.id] ?? "").trim() !== "",
              flagged: flags[p.id] === true,
            }))}
            index={index}
            seen={seen}
            onGo={goTo}
            noun="Problem"
          />
        </div>

        {/* Being watched is a deterrent only if it is visible. Shown as a count
            of what is left rather than of what is used: the number that
            matters to someone deciding whether to look away. */}
        {session.focusPolicy !== "NONE" && (
          <div className="text-right shrink-0">
            <span className="block font-mono text-label uppercase text-faint">
              Watched
            </span>
            <span
              className="block font-mono text-meta tabular"
              style={{
                color:
                  guard.remaining === 0 ? "var(--danger)" : "var(--muted)",
              }}
            >
              {session.focusPolicy === "WARN"
                ? `${guard.strikes} recorded`
                : guard.remaining >= 0
                  ? `${guard.remaining} left`
                  : `${session.focusRemaining} left`}
            </span>
          </div>
        )}

        {deadline && (
          <div className="text-right shrink-0">
            <span className="block font-mono text-label uppercase text-faint">Left</span>
            <span
              className={`block font-mono text-h2 tabular leading-none ${urgent ? "animate-timerpulse" : ""}`}
              // --text, not --ink: the Tailwind class is text-ink and the variable is not.
              style={{ color: clockColour }}
            >
              {left === null ? "—:——" : clock(left)}
            </span>
          </div>
        )}
      </section>

      {/* The problem. */}
      <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
        <div className="flex items-center justify-between gap-s3 px-s5 py-s3 border-b border-line bg-bg-sunk">
          <span className="font-mono text-label uppercase text-faint truncate">
            {problem.topic} · {index + 1} of {total}
          </span>
          <span className="font-mono text-label uppercase text-faint shrink-0">
            {problem.maxPoints} {problem.maxPoints === 1 ? "mark" : "marks"}
          </span>
        </div>

        <div className="p-s5 flex flex-col gap-s4">
          <h2 className="text-h3 font-semibold text-ink">{problem.title}</h2>

          <div onCopy={(e) => watched && e.preventDefault()}>
            <Rich source={problem.statement} />
          </div>

          {problem.imageUrl && (
            // A scanned diagram has no dimensions to give next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={problem.imageUrl}
              alt={`Figure for ${problem.title}`}
              loading="lazy"
              className="max-w-full h-auto rounded-md border border-line bg-white"
            />
          )}

          <label className="flex flex-col gap-s2">
            <span className="text-label uppercase text-faint">
              Your answer{problem.answerHint ? ` · ${problem.answerHint}` : ""}
            </span>

            {isLong ? (
              <textarea
                value={draft}
                onChange={(e) => edit(problem.id, e.target.value)}
                onBlur={() => void flush()}
                onPaste={refusePaste}
                rows={8}
                maxLength={4000}
                placeholder="Show your working."
                className="bg-raised border border-line rounded-md px-s3 py-s3 text-ui text-ink placeholder:text-faint leading-relaxed resize-y min-h-[160px]"
              />
            ) : (
              <input
                value={draft}
                onChange={(e) => edit(problem.id, e.target.value)}
                onBlur={() => void flush()}
                onPaste={refusePaste}
                inputMode={problem.answerKind === "NUMERIC" ? "decimal" : "text"}
                autoComplete="off"
                maxLength={200}
                placeholder={problem.answerKind === "NUMERIC" ? "A number" : "A word or a phrase"}
                className="bg-raised border border-line rounded-md px-s4 py-s3 text-h3 text-ink placeholder:text-faint placeholder:text-ui min-h-[56px]"
              />
            )}

            <span className="flex items-center justify-between gap-s3 min-h-[20px]">
              <span className="text-label uppercase text-faint">
                {saving ? "Saving…" : savedAt ? "Saved" : "Saves as you type"}
              </span>
              {isLong && (
                <span className="font-mono text-label text-faint tabular">
                  {draft.length}/4000
                </span>
              )}
            </span>
          </label>

          {error && (
            <p className="text-meta" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}

          {/* Discoverable rather than folklore. Hidden where there is no
              keyboard to press. */}
          <p className="text-label uppercase text-faint hidden md:block">
            ← → move · F marks for review
          </p>
        </div>
      </section>

      {/* Moving, and handing in. */}
      <div className="flex flex-wrap items-center gap-s3">
        <button
          onClick={() => { void flush(); goTo(index - 1); }}
          disabled={index === 0}
          className="inline-flex items-center min-h-[48px] px-s5 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors disabled:opacity-40"
        >
          Back
        </button>
        <button
          onClick={() => { void flush(); goTo(index + 1); }}
          disabled={index === total - 1}
          className="inline-flex items-center min-h-[48px] px-s5 rounded-md border border-line text-ui text-ink hover:border-accent transition-colors disabled:opacity-40"
        >
          Next
        </button>
        <button
          onClick={() => toggleFlag(problem.id)}
          aria-pressed={flags[problem.id] === true}
          className="inline-flex items-center min-h-[48px] px-s4 rounded-md border text-ui transition-colors"
          style={
            flags[problem.id]
              ? { borderColor: "var(--reward)", color: "var(--reward)" }
              : { borderColor: "var(--border)", color: "var(--muted)" }
          }
        >
          {flags[problem.id] ? "Marked" : "Mark for review"}
        </button>
        <span className="flex-1" />
        {confirming ? (
          <div className="flex flex-wrap gap-s2 items-center">
            <span className="text-meta text-muted">
              {answered === total
                ? "All answered."
                : `${total - answered} still blank.`}
            </span>
            <button
              onClick={() => void handIn()}
              disabled={handingIn}
              className="inline-flex items-center min-h-[48px] px-s5 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors disabled:opacity-60"
            >
              {handingIn ? "Handing in…" : "Yes, hand it in"}
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="inline-flex items-center min-h-[48px] px-s4 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors"
            >
              Keep writing
            </button>
          </div>
        ) : (
          <button
            onClick={() => { void flush(); setConfirming(true); }}
            className="inline-flex items-center min-h-[48px] px-s6 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors"
          >
            Hand it in
          </button>
        )}
      </div>

      <RoomProgress room={session.room} total={total} />
    </div>
  );
}

/**
 * Who else is in, and how far along.
 *
 * Deliberately not a scoreboard. Half these problems are marked by a key the
 * moment a paper is handed in, so a live score column would tell the room
 * which answers were right while they are still writing them.
 */
function RoomProgress({
  room,
  total,
}: {
  room: ProblemSession["room"];
  total: number;
}) {
  if (room.length === 0) return null;

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="px-s4 py-s3 border-b border-line bg-bg-sunk">
        <h2 className="text-label uppercase text-faint">
          In the room · {room.length} · marks open when the host ends it
        </h2>
      </div>
      <ul className="list-none m-0 p-0">
        {room.map((p) => (
          <li
            key={p.userId}
            className="grid grid-cols-[1fr_auto] gap-s3 items-center px-s4 py-s2 border-t border-line first:border-t-0"
          >
            <span className="text-ui text-ink truncate">{p.name || "Anonymous"}</span>
            <span className="font-mono text-label uppercase text-faint shrink-0">
              {p.submitted ? "handed in" : `${p.answered}/${total}`}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
