"use server";

import { auth } from "@/auth";
import {
  nextProblem,
  answerPractice,
  type NextResult,
  type PracticeResult,
} from "@/lib/compete/practiceService";
import type { Outcome } from "@/lib/compete/service";

/**
 * Practice, from the browser.
 *
 * Both of these re-read the session rather than taking a user id from the
 * caller. That matters more here than anywhere else in the module: these are
 * the two endpoints that hand back worked solutions, and a server action is a
 * public URL.
 */

async function requireUser(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function nextProblemAction(topic?: string | null): Promise<NextResult | null> {
  const userId = await requireUser();
  if (!userId) return null;
  return nextProblem(userId, typeof topic === "string" ? topic : null);
}

export async function answerPracticeAction(
  problemId: string,
  text: string,
  ms: number
): Promise<Outcome<PracticeResult>> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Sign in first." };
  if (typeof problemId !== "string" || !problemId) {
    return { ok: false, error: "That problem is not available." };
  }
  return answerPractice(userId, problemId, text, ms);
}
