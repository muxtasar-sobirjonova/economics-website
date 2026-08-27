"use server";

import { auth } from "@/auth";
import {
  startDuel,
  submitDuel,
  answerDaily,
  type StartedDuel,
  type DuelOutcome,
  type DailyState,
} from "@/lib/duel/engine";
import type { SubmittedAnswer } from "@/lib/duel/grading";

/**
 * The only two doors into the duel engine.
 *
 * Both re-read the session rather than taking a user id from the caller: a
 * server action is a public endpoint, and an id in its arguments is an id the
 * client chooses.
 */

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function startDuelAction(
  faceRunId?: string,
  rematchUserId?: string
): Promise<ActionResult<StartedDuel>> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Sign in to play." };

  try {
    // An unusable challenge id is ignored by the engine, not rejected here —
    // a stale link should still get the player a duel.
    return {
      ok: true,
      data: await startDuel(session.user.id, {
        faceRunId: typeof faceRunId === "string" && faceRunId ? faceRunId : undefined,
        rematchUserId:
          typeof rematchUserId === "string" && rematchUserId ? rematchUserId : undefined,
      }),
    };
  } catch (e) {
    console.error("startDuel failed", e);
    const message = e instanceof Error ? e.message : "Could not start a duel.";
    return { ok: false, error: message };
  }
}

export async function submitDuelAction(
  runId: string,
  answers: SubmittedAnswer[]
): Promise<ActionResult<DuelOutcome>> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Sign in to play." };

  if (typeof runId !== "string" || !runId) {
    return { ok: false, error: "Missing duel." };
  }

  try {
    // The engine checks that the run belongs to this player before grading.
    return { ok: true, data: await submitDuel(session.user.id, runId, answers ?? []) };
  } catch (e) {
    console.error("submitDuel failed", e);
    return { ok: false, error: "Could not submit that duel." };
  }
}

export async function answerDailyAction(
  chosen: string | null,
  ms: number
): Promise<ActionResult<DailyState>> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Sign in to play." };

  try {
    return { ok: true, data: await answerDaily(session.user.id, chosen, ms) };
  } catch (e) {
    console.error("answerDaily failed", e);
    return { ok: false, error: "Could not record that answer." };
  }
}
