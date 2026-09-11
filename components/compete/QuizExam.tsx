"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  answerExamAction,
  flagExamAction,
  submitExamAction,
} from "@/app/actions/compete";
import type { ExamSession } from "@/lib/compete/examService";
import { useFocusGuard } from "@/components/compete/FocusGuard";
import { useArena, useLeaveWarning, StrikeModal, PausedModal } from "@/components/compete/Arena";
import { Navigator } from "@/components/compete/Navigator";
import { Standings } from "@/components/compete/Standings";

/**
 * A multiple choice exam.
 *
 * The fast quiz asks one question at a time against its own clock and takes
 * the first answer it gets. This is the other shape: one clock for the paper,
 * every question reachable, and an answer that can be changed right up until
 * it is handed in — which is what a written exam has always allowed, and what
 * anyone who has sat one expects.
 *
 * Nothing here is ever told whether an answer is right. The grading happens on
 * the server as each choice arrives, and the reply says only how many are
 * answered: a response that differed between right and wrong would be an
 * answer key delivered one request at a time.
 */

function clock(msLeft: number): string {
  const total = Math.max(0, Math.floor(msLeft / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function QuizExam({ session, meId }: { session: ExamSession; meId: string }) {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(session.questions.map((q) => [q.id, q.chosen]))
  );
  const [flags, setFlags] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(session.questions.map((q) => [q.id, q.flagged]))
  );
  const [seen, setSeen] = useState<Set<string>>(
    () => new Set(session.questions.length > 0 ? [session.questions[0].id] : [])
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [handingIn, setHandingIn] = useState(false);

  const deadline = session.deadline ? new Date(session.deadline).getTime() : null;
  const [now, setNow] = useState<number | null>(null);

  useArena(!session.submitted);
  useLeaveWarning(!session.submitted);

  const guard = useFocusGuard({
    competitionId: session.competitionId,
    policy: session.focusPolicy,
    initialLocked: session.locked,
    active: !session.submitted,
  });

  const question = session.questions[index];
  const total = session.questions.length;
  const answered = useMemo(
    () => session.questions.filter((q) => chosen[q.id] != null).length,
    [chosen, session.questions]
  );

  const goTo = useCallback(
    (next: number) => {
      const target = Math.min(Math.max(next, 0), session.questions.length - 1);
      const id = session.questions[target]?.id;
      if (id) setSeen((s) => (s.has(id) ? s : new Set(s).add(id)));
      setIndex(target);
    },
    [session.questions]
  );

  /** Optimistic: the tile turns green before the round trip, and rolls back if it fails. */
  const pick = useCallback(
    (questionId: string, option: string | null) => {
      const previous = chosen[questionId] ?? null;
      setChosen((c) => ({ ...c, [questionId]: option }));
      setSaving(true);

      void (async () => {
        const res = await answerExamAction(session.competitionId, questionId, option);
        setSaving(false);
        if (res.ok) return setError(null);
        setChosen((c) => ({ ...c, [questionId]: previous }));
        setError(res.error);
      })();
    },
    [chosen, session.competitionId]
  );

  const toggleFlag = useCallback(
    (questionId: string) => {
      const next = !flags[questionId];
      setFlags((f) => ({ ...f, [questionId]: next }));
      void flagExamAction(session.competitionId, questionId, next);
    },
    [flags, session.competitionId]
  );

  const handIn = useCallback(async () => {
    if (handingIn) return;
    setHandingIn(true);
    const res = await submitExamAction(session.competitionId);
    if (!res.ok) {
      setHandingIn(false);
      return setError(res.error);
    }
    router.refresh();
  }, [handingIn, router, session.competitionId]);

  // The clock, started here rather than in render: reading it twice across a
  // server and a client is a hydration mismatch a second wide.
  useEffect(() => {
    if (!deadline || session.submitted) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [deadline, session.submitted]);

  // Time up hands the paper in rather than discarding it.
  useEffect(() => {
    if (!deadline || session.submitted || guard.locked || handingIn || now === null) return;
    if (now >= deadline) void handIn();
  }, [now, deadline, session.submitted, guard.locked, handingIn, handIn]);

  /**
   * Keys. A to F pick an option, arrows move, F marks for review.
   *
   * `f` is both the sixth option and the flag, so the flag takes it only when
   * there is no sixth option to take — a paper with six answers has no spare
   * letter, and the button is still there.
   */
  useEffect(() => {
    if (session.submitted || guard.locked || !question) return;

    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();
      const at = "abcdef".indexOf(key);

      if (e.key === "ArrowRight") goTo(index + 1);
      else if (e.key === "ArrowLeft") goTo(index - 1);
      else if (at >= 0 && at < question.options.length) pick(question.id, question.options[at]);
      else if (key === "f") toggleFlag(question.id);
      else return;

      e.preventDefault();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [session.submitted, guard.locked, question, index, goTo, pick, toggleFlag]);

  const table = (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="px-s4 py-s3 border-b border-line bg-bg-sunk">
        <h2 className="text-label uppercase text-faint">
          In the room · marks open when the host ends it
        </h2>
      </div>
      <Standings rows={session.standings} meId={meId} questionCount={total} compact />
    </section>
  );

  if (guard.locked) {
    return (
      <>
        <div className="flex flex-col gap-s4 arena-blur" aria-hidden>
          {table}
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

  if (session.submitted) {
    return (
      <div className="flex flex-col gap-s4">
        <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s6 text-center">
          <h2 className="text-h3 font-semibold text-ink">Handed in</h2>
          <p className="text-meta text-muted mt-s3 max-w-[46ch] mx-auto">
            {answered} of {total} answered. Right and wrong open when the host
            ends the competition — showing them now would show them to the room.
          </p>
        </section>
        {table}
      </div>
    );
  }

  if (!question) return null;

  const left = deadline && now !== null ? deadline - now : null;
  const urgent = left !== null && left <= 60_000;
  const soon = left !== null && left <= 5 * 60_000;
  const clockColour = urgent ? "var(--danger)" : soon ? "var(--reward)" : "var(--text)";
  const mine = chosen[question.id] ?? null;

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

      <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s4 flex flex-wrap items-center gap-s4">
        <div className="flex-1 min-w-0">
          <span className="font-mono text-label uppercase text-faint">
            {answered} of {total} answered
          </span>
          <Navigator
            tiles={session.questions.map((q) => ({
              id: q.id,
              answered: chosen[q.id] != null,
              flagged: flags[q.id] === true,
            }))}
            index={index}
            seen={seen}
            onGo={goTo}
          />
        </div>

        {session.focusPolicy !== "NONE" && (
          <div className="text-right shrink-0">
            <span className="block font-mono text-label uppercase text-faint">Watched</span>
            <span
              className="block font-mono text-meta tabular"
              style={{ color: guard.remaining === 0 ? "var(--danger)" : "var(--muted)" }}
            >
              {session.focusPolicy === "WARN"
                ? `${guard.strikes} recorded`
                : `${guard.remaining >= 0 ? guard.remaining : session.focusRemaining} left`}
            </span>
          </div>
        )}

        {deadline && (
          <div className="text-right shrink-0">
            <span className="block font-mono text-label uppercase text-faint">Left</span>
            <span
              className={`block font-mono text-h2 tabular leading-none ${urgent ? "animate-timerpulse" : ""}`}
              style={{ color: clockColour }}
            >
              {left === null ? "—:——" : clock(left)}
            </span>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
        <div className="flex items-center justify-between gap-s3 px-s5 py-s3 border-b border-line bg-bg-sunk">
          <span className="font-mono text-label uppercase text-faint truncate">
            {question.topic} · {index + 1} of {total}
          </span>
          <span className="text-label uppercase text-faint shrink-0">
            {saving ? "Saving…" : mine != null ? "Saved" : "Not answered"}
          </span>
        </div>

        <div className="p-s5">
          <h2 className="text-h3 font-semibold text-ink">{question.questionText}</h2>

          <div className="grid gap-s3 mt-s5">
            {question.options.map((option, i) => {
              const picked = mine === option;
              return (
                <button
                  key={option}
                  onClick={() => pick(question.id, picked ? null : option)}
                  aria-pressed={picked}
                  aria-keyshortcuts={String.fromCharCode(65 + i)}
                  className={`flex items-center gap-s3 text-left px-s4 py-s3 min-h-[52px] rounded-md border text-ui transition-all duration-150 ${
                    picked
                      ? "border-accent bg-accent-soft text-accent-strong font-semibold"
                      : "border-line bg-raised text-ink hover:border-accent hover:bg-accent-soft"
                  }`}
                >
                  <span
                    aria-hidden
                    className="w-7 h-7 shrink-0 rounded-sm grid place-items-center font-mono text-label border"
                    style={{
                      borderColor: picked ? "var(--accent)" : "var(--border)",
                      color: picked ? "var(--accent-strong)" : "var(--faint)",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="min-w-0">{option}</span>
                </button>
              );
            })}
          </div>

          {error && (
            <p className="text-meta mt-s4" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}

          <p className="text-meta text-faint mt-s5">
            {mine != null
              ? "Change it as often as you like until you hand in."
              : "Right and wrong stay hidden until the host ends it."}
          </p>
          <p className="text-label uppercase text-faint mt-s2 hidden md:block">
            A–{String.fromCharCode(64 + Math.min(question.options.length, 6))} answer · ← → move ·
            F marks for review
          </p>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-s3">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="inline-flex items-center min-h-[48px] px-s5 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors disabled:opacity-40"
        >
          Back
        </button>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index === total - 1}
          className="inline-flex items-center min-h-[48px] px-s5 rounded-md border border-line text-ui text-ink hover:border-accent transition-colors disabled:opacity-40"
        >
          Next
        </button>
        <button
          onClick={() => toggleFlag(question.id)}
          aria-pressed={flags[question.id] === true}
          className="inline-flex items-center min-h-[48px] px-s4 rounded-md border text-ui transition-colors"
          style={
            flags[question.id]
              ? { borderColor: "var(--reward)", color: "var(--reward)" }
              : { borderColor: "var(--border)", color: "var(--muted)" }
          }
        >
          {flags[question.id] ? "Marked" : "Mark for review"}
        </button>

        <span className="flex-1" />

        {confirming ? (
          <div className="flex flex-wrap gap-s2 items-center">
            <span className="text-meta text-muted">
              {answered === total ? "All answered." : `${total - answered} still blank.`}
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
              Keep going
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="inline-flex items-center min-h-[48px] px-s6 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors"
          >
            Hand it in
          </button>
        )}
      </div>

      {table}
    </div>
  );
}
