"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  createCompetition,
  joinCompetition,
  startCompetition,
  endCompetition,
  type Outcome,
} from "@/lib/compete/service";
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
