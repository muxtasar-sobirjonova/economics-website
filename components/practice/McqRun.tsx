"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { startDuelAction, submitDuelAction } from "@/app/actions/duel";
import type { StartedDuel, DuelOutcome } from "@/lib/duel/engine";
import type { SubmittedAnswer } from "@/lib/duel/grading";
import { DuelBoard } from "@/components/duel/DuelBoard";
import { DuelResult } from "@/components/duel/DuelResult";
import { isRated, type Setup } from "@/lib/practice/session";

/**
 * A multiple-choice session.
 *
 * The board and the result screen are the duel's own — this is the same engine
 * it always was, reached from the practice page instead of from a page of its
 * own. What the setup decides is whether the run is rated, and that is settled
 * on the server; nothing here is trusted with it.
 */

type Phase =
  | { name: "loading" }
  | { name: "playing"; duel: StartedDuel }
  | { name: "grading" }
  | { name: "done"; outcome: DuelOutcome; duel: StartedDuel }
  | { name: "error"; message: string };

export function McqRun({ setup, onLeave }: { setup: Setup; onLeave: () => void }) {
  const [phase, setPhase] = useState<Phase>({ name: "loading" });
  const router = useRouter();
  const started = useRef(false);

  const begin = useCallback(async () => {
    setPhase({ name: "loading" });
    const res = await startDuelAction(undefined, undefined, setup);
    if (!res.ok) return setPhase({ name: "error", message: res.error });
    if (res.data.questions.length === 0) {
      return setPhase({
        name: "error",
        message: "No questions left in the bank for that topic.",
      });
    }
    setPhase({ name: "playing", duel: res.data });
  }, [setup]);

  // Once. React runs effects twice in development, and a second call would
  // deal a second set.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void begin();
  }, [begin]);

  const finish = useCallback(
    async (duel: StartedDuel, answers: SubmittedAnswer[]) => {
      setPhase({ name: "grading" });
      const res = await submitDuelAction(duel.runId, answers);
      if (!res.ok) return setPhase({ name: "error", message: res.error });
      setPhase({ name: "done", outcome: res.data, duel });
      router.refresh();
    },
    [router]
  );

  if (phase.name === "playing") {
    return <DuelBoard duel={phase.duel} onFinish={finish} />;
  }

  if (phase.name === "done") {
    return (
      <div className="flex flex-col gap-s4">
        <DuelResult
          outcome={phase.outcome}
          duel={phase.duel}
          onAgain={() => {
            started.current = true;
            void begin();
          }}
          onRematch={() => {
            started.current = true;
            void begin();
          }}
        />
        <button
          type="button"
          onClick={onLeave}
          className="self-start min-h-[48px] px-s5 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors"
        >
          Back to practice
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-surface p-s6 flex flex-col items-start gap-s4">
      {phase.name === "error" ? (
        <>
          <p className="text-ui text-ink max-w-[52ch]">{phase.message}</p>
          <div className="flex flex-wrap gap-s3">
            <button
              type="button"
              onClick={() => {
                started.current = true;
                void begin();
              }}
              className="min-h-[48px] px-s5 rounded-md text-ui font-semibold"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              Try again
            </button>
            <button
              type="button"
              onClick={onLeave}
              className="min-h-[48px] px-s5 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors"
            >
              Change the setup
            </button>
          </div>
        </>
      ) : (
        <p className="text-ui text-muted">
          {phase.name === "grading"
            ? "Marking…"
            : isRated(setup)
              ? "Dealing ten questions…"
              : "Dealing…"}
        </p>
      )}
    </div>
  );
}
