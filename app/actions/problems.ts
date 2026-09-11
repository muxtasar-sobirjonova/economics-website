"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  saveProblem,
  retireProblem,
  createProblemCompetition,
  saveProblemDraft,
  submitProblems,
  gradeNextBatch,
  markingProgress,
  overrideMark,
  type ProblemSetupInput,
  type MarkingProgress,
} from "@/lib/compete/problemService";
import {
  reportAway,
  unlockPlayer,
  type FocusState,
} from "@/lib/compete/focusService";
import type { ProblemInput } from "@/lib/compete/problem";
import type { Outcome } from "@/lib/compete/service";

/**
 * Every one of these re-reads the session rather than trusting an id from the
 * caller, and every permission and ownership check lives in the service — a
 * server action is a public endpoint, and these ones hand out marks.
 */

async function requireUser() {
  const session = await auth();
  return session?.user?.id
    ? { id: session.user.id, email: session.user.email ?? null }
    : null;
}

const str = (v: unknown) => (typeof v === "string" ? v : "");

export async function saveProblemAction(
  input: ProblemInput & { id?: string }
): Promise<Outcome<{ id: string }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await saveProblem(user.id, user.email, input);
  if (result.ok) revalidatePath("/compete/problems");
  return result;
}

export async function retireProblemAction(id: string, active: boolean): Promise<Outcome<null>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await retireProblem(user.id, user.email, str(id), active === true);
  if (result.ok) revalidatePath("/compete/problems");
  return result;
}

export async function createProblemCompetitionAction(
  input: ProblemSetupInput
): Promise<Outcome<{ code: string }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await createProblemCompetition(user.id, user.email, input);
  if (result.ok) revalidatePath("/compete");
  return result;
}

/**
 * Called as the student types, so it stays as small as it can be: no
 * revalidation, no marking, one upsert.
 */
export async function saveDraftAction(
  competitionId: string,
  problemId: string,
  text: string
): Promise<Outcome<{ savedAt: number }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  return saveProblemDraft(user.id, str(competitionId), str(problemId), str(text));
}

export async function submitProblemsAction(
  competitionId: string
): Promise<Outcome<{ pending: number }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await submitProblems(user.id, str(competitionId));
  if (result.ok) revalidatePath("/compete");
  return result;
}

/** One batch. The host's screen calls it again until nothing is pending. */
export async function gradeBatchAction(
  competitionId: string
): Promise<Outcome<{ graded: number; pending: number; stalled: boolean }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  return gradeNextBatch(user.id, str(competitionId));
}

export async function markingProgressAction(
  competitionId: string
): Promise<Outcome<MarkingProgress>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const progress = await markingProgress(user.id, str(competitionId));
  return progress ? { ok: true, data: progress } : { ok: false, error: "Not your competition." };
}

export async function overrideMarkAction(
  competitionId: string,
  answerId: string,
  points: number,
  feedback: string | null
): Promise<Outcome<{ points: number }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await overrideMark(user.id, str(competitionId), str(answerId), points, feedback);
  if (result.ok) revalidatePath("/compete");
  return result;
}

/**
 * "I left the page."
 *
 * Called by the page itself, so the duration is the page's word. The server
 * stamps the time, clamps the duration and decides what it means — see
 * lib/compete/focusService.ts for what this can and cannot be trusted to know.
 */
export async function reportAwayAction(
  competitionId: string,
  ms: number
): Promise<Outcome<FocusState>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  return reportAway(user.id, str(competitionId), ms);
}

/** The host letting a frozen paper carry on. */
export async function unlockPlayerAction(
  competitionId: string,
  playerId: string
): Promise<Outcome<null>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await unlockPlayer(user.id, str(competitionId), str(playerId));
  if (result.ok) revalidatePath("/compete");
  return result;
}
