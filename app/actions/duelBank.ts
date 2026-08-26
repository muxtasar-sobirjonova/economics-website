"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

/**
 * Retire a question, or bring it back.
 *
 * Nothing is deleted: the counters are the only record of how a question
 * behaved, and they are the evidence for retiring it in the first place.
 */
export async function setQuestionActiveAction(
  id: string,
  active: boolean
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return { ok: false, error: "Not allowed." };
  if (typeof id !== "string" || !id) return { ok: false, error: "Missing question." };

  try {
    await prisma.duelQuestion.update({ where: { id }, data: { active: Boolean(active) } });
    revalidatePath("/duel/bank");
    return { ok: true };
  } catch (e) {
    console.error("setQuestionActive failed", e);
    return { ok: false, error: "Could not update that question." };
  }
}
