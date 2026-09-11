"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  createCompetition,
  joinCompetition,
  startCompetition,
  endCompetition,
  answerCompetition,
  getStandings,
  type Outcome,
} from "@/lib/compete/service";
import { answerExam, flagExam, submitExam } from "@/lib/compete/examService";
import type { Ranked } from "@/lib/compete/scoring";
import type { SetupInput } from "@/lib/compete/setup";

/**
 * Every one of these re-reads the session rather than trusting an id from the
 * caller, and every permission and ownership check lives in the service — a
 * server action is a public endpoint.
 */

async function requireUser() {
  const session = await auth();
  return session?.user?.id
    ? { id: session.user.id, email: session.user.email ?? null }
    : null;
}

export async function createCompetitionAction(input: SetupInput): Promise<Outcome<{ code: string }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await createCompetition(user.id, user.email, input);
  if (result.ok) revalidatePath("/compete");
  return result;
}

export async function joinCompetitionAction(code: string): Promise<Outcome<{ code: string }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await joinCompetition(user.id, typeof code === "string" ? code : "");
  if (result.ok) revalidatePath(`/compete/${result.data.code}`);
  return result;
}

export async function startCompetitionAction(id: string): Promise<Outcome<null>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await startCompetition(user.id, typeof id === "string" ? id : "");
  revalidatePath("/compete");
  return result;
}

export async function endCompetitionAction(id: string): Promise<Outcome<null>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await endCompetition(user.id, typeof id === "string" ? id : "");
  revalidatePath("/compete");
  return result;
}

export async function answerCompetitionAction(
  competitionId: string,
  questionId: string,
  chosen: string | null
): Promise<Outcome<{ standings: Ranked[]; answered: number; finished: boolean }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  return answerCompetition(
    user.id,
    typeof competitionId === "string" ? competitionId : "",
    typeof questionId === "string" ? questionId : "",
    typeof chosen === "string" ? chosen : null
  );
}

/** Polled while a competition runs, so it stays deliberately cheap. */
export async function standingsAction(competitionId: string): Promise<Outcome<Ranked[]>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  try {
    return { ok: true, data: await getStandings(typeof competitionId === "string" ? competitionId : "") };
  } catch (e) {
    console.error("standings failed", e);
    return { ok: false, error: "Could not read the standings." };
  }
}

/* ── Exam mode ─────────────────────────────────────────────────────────────
   A quiz room with one clock for the whole paper. Same room, same bank; the
   difference is that an answer can be changed until it is handed in. */

export async function answerExamAction(
  competitionId: string,
  questionId: string,
  chosen: string | null
): Promise<Outcome<{ answered: number }>> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Sign in first." };

  return answerExam(session.user.id, String(competitionId), String(questionId), chosen);
}

export async function flagExamAction(
  competitionId: string,
  questionId: string,
  flagged: boolean
): Promise<Outcome<null>> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Sign in first." };

  return flagExam(session.user.id, String(competitionId), String(questionId), flagged === true);
}

export async function submitExamAction(competitionId: string): Promise<Outcome<null>> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Sign in first." };

  const result = await submitExam(session.user.id, String(competitionId));
  if (result.ok) revalidatePath("/compete");
  return result;
}
