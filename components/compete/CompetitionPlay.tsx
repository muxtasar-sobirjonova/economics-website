"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { answerCompetitionAction, standingsAction } from "@/app/actions/compete";
import type { PlaySession } from "@/lib/compete/service";
import type { Ranked } from "@/lib/compete/scoring";
import { Standings } from "@/components/compete/Standings";
import { useFocusGuard } from "@/components/compete/FocusGuard";
import { useArena, useLeaveWarning, StrikeModal, PausedModal } from "@/components/compete/Arena";

/** Others are answering while you are; the table keeps up without a socket. */
const POLL_MS = 4000;
const LOCK_MS = 240;

export function CompetitionPlay({ session, meId }: { session: PlaySession; meId: string }) {
  const router = useRouter();

  const remaining = session.questions.filter((q) => !session.answeredIds.includes(q.id));
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState(session.secondsPerQuestion);
  const [locked, setLocked] = useState<string | null>(null);
  const [standings, setStandings] = useState<Ranked[]>(session.standings);
  const [done, setDone] = useState(session.finished || remaining.length === 0);

  const lockedRef = useRef(false);

  useArena(!done);
  useLeaveWarning(!done);

  const guard = useFocusGuard({
    competitionId: session.competitionId,
    policy: session.focusPolicy,
    initialLocked: session.locked,
    active: !done,
  });

  const question = remaining[index];
  const total = session.questions.length;
  const answeredSoFar = session.answeredIds.length + index;

  const send = useCallback(
    async (questionId: string, chosen: string | null) => {
      const res = await answerCompetitionAction(session.competitionId, questionId, chosen);
      if (res.ok) {
        setStandings(res.data.standings);
        if (res.data.finished) {
          setDone(true);
          router.refresh();
          return;
        }
      }
      setIndex((i) => i + 1);
      setLeft(session.secondsPerQuestion);
      setLocked(null);
      lockedRef.current = false;
    },
    [router, session.competitionId, session.secondsPerQuestion]
  );

  const choose = (option: string | null) => {
    if (lockedRef.current || !question) return;
    lockedRef.current = true;
    setLocked(option);
    setTimeout(() => void send(question.id, option), option === null ? 0 : LOCK_MS);
  };

  // One interval per question; running out submits nothing rather than a guess.
  useEffect(() => {
    if (done || !question || guard.locked) return;
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          if (!lockedRef.current) {
            lockedRef.current = true;
            void send(question.id, null);
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [done, question, send, guard.locked]);

  /**
   * A letter picks an option.
   *
   * The room is timed to the second, and reaching for a mouse costs more of
   * that than reading the option does. The letters are drawn on the buttons so
   * this is discoverable rather than folklore.
   */
  useEffect(() => {
    if (done || !question || guard.locked) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const at = "abcdef".indexOf(e.key.toLowerCase());
      if (at < 0 || at >= question.options.length) return;
      e.preventDefault();
      choose(question.options[at]);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // `choose` is recreated every render and guards itself against a second
    // press, so it is deliberately not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, question, guard.locked]);

  // Everyone else's progress, whether or not you are answering.
  useEffect(() => {
    const id = setInterval(async () => {
      const res = await standingsAction(session.competitionId);
      if (res.ok) setStandings(res.data);
    }, POLL_MS);
    return () => clearInterval(id);
  }, [session.competitionId]);

  const table = (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="flex items-center justify-between gap-s3 px-s4 py-s3 border-b border-line bg-bg-sunk">
        <h2 className="text-label uppercase text-faint">Standings</h2>
        <span className="flex items-center gap-s2">
          <span
            className="w-[7px] h-[7px] rounded-full animate-ringpulse"
            style={{ background: "var(--success)" }}
            aria-hidden
          />
          <span className="text-label uppercase text-faint">live</span>
        </span>
      </div>
      <Standings rows={standings} meId={meId} questionCount={total} compact />
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
          answered={session.answeredIds.length}
          total={total}
        />
      </>
    );
  }

  if (done || !question) {
    return (
      <div className="flex flex-col gap-s4">
        <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s6 text-center">
          <h2 className="text-h3 font-semibold text-ink">You are through all {total}</h2>
          <p className="text-meta text-muted mt-s2 max-w-[46ch] mx-auto">
            The table below keeps moving while others finish. Answers open when
            the host ends it — showing them now would show them to the room.
          </p>
        </section>
        {table}
      </div>
    );
  }

  const urgent = left <= 5;
  // A per-question clock is short enough that a third of it is the warning.
  const soon = left <= Math.max(8, Math.round(session.secondsPerQuestion / 3));
  const clockColour = urgent ? "var(--danger)" : soon ? "var(--reward)" : "var(--muted)";

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

      <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
        <div className="flex items-center justify-between gap-s3 px-s5 py-s3 border-b border-line bg-bg-sunk">
          <span className="font-mono text-label uppercase text-faint">
            {question.topic} · {answeredSoFar + 1} of {total}
          </span>
          <span
            className={`font-mono text-meta tabular ${urgent ? "animate-timerpulse" : ""}`}
            style={{ color: clockColour }}
          >
            {left}s
          </span>
        </div>

        <div className="h-1 bg-bg-sunk" aria-hidden>
          <div
            className="h-full transition-[width] duration-1000 ease-linear"
            style={{
              width: `${(left / session.secondsPerQuestion) * 100}%`,
              background: urgent ? "var(--danger)" : soon ? "var(--reward)" : "var(--accent)",
            }}
          />
        </div>

        <div className="p-s5">
          <h2 className="text-h3 font-semibold text-ink">{question.questionText}</h2>

          <div className="grid gap-s3 mt-s5">
            {question.options.map((option, i) => {
              const chosen = locked === option;
              return (
                <button
                  key={option}
                  onClick={() => choose(option)}
                  disabled={locked !== null}
                  aria-pressed={chosen}
                  aria-keyshortcuts={String.fromCharCode(65 + i)}
                  className={`flex items-center gap-s3 text-left px-s4 py-s3 min-h-[52px] rounded-md border text-ui transition-all duration-150 ${
                    chosen
                      ? "border-accent bg-accent-soft text-accent-strong font-semibold"
                      : "border-line bg-raised text-ink hover:border-accent hover:bg-accent-soft"
                  }`}
                  style={{ opacity: locked !== null && !chosen ? 0.35 : 1 }}
                >
                  <span
                    aria-hidden
                    className="w-7 h-7 shrink-0 rounded-sm grid place-items-center font-mono text-label border"
                    style={{
                      borderColor: chosen ? "var(--accent)" : "var(--border)",
                      color: chosen ? "var(--accent-strong)" : "var(--faint)",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="min-w-0">{option}</span>
                </button>
              );
            })}
          </div>

          <p className="text-meta text-faint mt-s5">
            {locked ? "Locked in." : "Right or wrong stays hidden until the host ends it."}
          </p>
        </div>
      </section>

      {table}
    </div>
  );
}
