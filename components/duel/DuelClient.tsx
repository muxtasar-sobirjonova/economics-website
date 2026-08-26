"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { startDuelAction, submitDuelAction } from "@/app/actions/duel";
import type { StartedDuel, DuelOutcome } from "@/lib/duel/engine";
import type { SubmittedAnswer } from "@/lib/duel/grading";
import { DuelBoard } from "@/components/duel/DuelBoard";
import { DuelResult } from "@/components/duel/DuelResult";

type Phase =
  | { name: "idle" }
  | { name: "loading" }
  | { name: "playing"; duel: StartedDuel }
  | { name: "grading" }
  | { name: "done"; outcome: DuelOutcome; duel: StartedDuel }
  | { name: "error"; message: string };

export function DuelClient({
  rating,
  played,
  faceRunId,
  livePlayers = 0,
  waitingSets = 0,
}: {
  rating: number;
  played: number;
  faceRunId?: string;
  livePlayers?: number;
  waitingSets?: number;
}) {
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const router = useRouter();

  const begin = async (challenge?: string) => {
    setPhase({ name: "loading" });
    const res = await startDuelAction(challenge);
    if (!res.ok) return setPhase({ name: "error", message: res.error });
    if (res.data.questions.length === 0) {
      return setPhase({ name: "error", message: "No questions in the bank yet." });
    }
    setPhase({ name: "playing", duel: res.data });
  };

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

  // A shared link lands the player straight into the set rather than on a
  // button they then have to find.
  useEffect(() => {
    if (faceRunId) void begin(faceRunId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faceRunId]);

  if (phase.name === "playing") {
    return <DuelBoard duel={phase.duel} onFinish={finish} />;
  }
  if (phase.name === "done") {
    return <DuelResult outcome={phase.outcome} duel={phase.duel} onAgain={() => begin()} />;
  }

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s6 text-center">
      {phase.name === "error" ? (
        <>
          <h2 className="text-h3 font-semibold text-ink">That did not work</h2>
          <p className="text-meta text-muted mt-s2 max-w-[46ch] mx-auto">{phase.message}</p>
        </>
      ) : (
        <>
          <h2 className="text-h2 font-semibold text-ink">Ten questions. One opponent.</h2>

          {/* Whether anyone is about is the thing that decides "now or later". */}
          {livePlayers > 0 ? (
            <p className="flex items-center justify-center gap-s2 text-meta mt-s3">
              <span
                className="w-[7px] h-[7px] rounded-full animate-ringpulse"
                style={{ background: "var(--success)" }}
                aria-hidden
              />
              <span className="text-ink">
                {livePlayers === 1
                  ? "Someone is playing right now — start and you face them."
                  : `${livePlayers} people are playing right now — start and you face one of them.`}
              </span>
            </p>
          ) : waitingSets > 0 ? (
            <p className="text-meta text-muted mt-s3">
              {waitingSets === 1
                ? "One run is waiting for a challenger. Start and it is yours."
                : `${waitingSets} runs are waiting for a challenger.`}
            </p>
          ) : null}

          <p className="text-meta text-muted mt-s3 max-w-[52ch] mx-auto">
            {played === 0
              ? "Everyone starts at 1000. Your first ten duels move your rating twice as fast, so the ladder finds you quickly."
              : "Score decides it. If you tie on score, the faster run wins."}
          </p>
        </>
      )}

      <button
        onClick={() => begin()}
        disabled={phase.name === "loading" || phase.name === "grading"}
        className="mt-s5 inline-flex items-center justify-center min-h-[48px] px-s6 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors disabled:opacity-60"
      >
        {phase.name === "loading" ? "Dealing…" : phase.name === "error" ? "Try again" : "Start a duel"}
      </button>

      <p className="font-mono text-label uppercase text-faint mt-s4">
        Your rating {rating} · {played} played
      </p>
    </section>
  );
}
