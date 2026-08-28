"use server";

import { revalidatePath } from "next/cache";
import { StaffPermission } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { actorFor } from "@/lib/staff";
import { can } from "@/lib/permissions";
import { buildQuestions } from "@/lib/duel/questionImport";

/**
 * Retire a question, or bring it back.
 *
 * Nothing is deleted: the counters are the only record of how a question
 * behaved, and they are the evidence for retiring it in the first place.
 */
async function mayManageQuestions(
  userId: string | null | undefined,
  email: string | null | undefined
) {
  if (!userId) return false;
  return can(await actorFor(userId, email), StaffPermission.MANAGE_QUESTIONS);
}

export async function setQuestionActiveAction(
  id: string,
  active: boolean
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!(await mayManageQuestions(session?.user?.id, session?.user?.email))) {
    return { ok: false, error: "Not allowed." };
  }
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

export interface QuestionDraft {
  id?: string;
  topic: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

/**
 * Add or correct one question.
 *
 * Validated through the same code the bulk importer uses, so a question typed
 * into a form and one loaded from a spreadsheet cannot end up held to
 * different standards.
 */
export async function saveQuestionAction(
  draft: QuestionDraft
): Promise<{ ok: boolean; error?: string; id?: string }> {
  const session = await auth();
  if (!(await mayManageQuestions(session?.user?.id, session?.user?.email))) {
    return { ok: false, error: "Not allowed." };
  }

  const { questions, issues } = buildQuestions([
    {
      topic: draft?.topic,
      questiontext: draft?.questionText,
      options: Array.isArray(draft?.options) ? draft.options : [],
      correctanswer: draft?.correctAnswer,
      explanation: draft?.explanation,
    },
  ]);

  if (issues.length > 0 || questions.length === 0) {
    return { ok: false, error: issues[0]?.problem ?? "That question is not usable." };
  }
  const q = questions[0];

  try {
    if (draft.id) {
      // Editing keeps the row it is on: the counters on it are the evidence
      // that sent someone here to correct it.
      await prisma.duelQuestion.update({
        where: { id: draft.id },
        data: {
          topic: q.topic,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation ?? undefined,
        },
      });
      revalidatePath("/duel/bank");
      return { ok: true, id: draft.id };
    }

    await prisma.duelQuestion.upsert({
      where: { id: q.id },
      create: { ...q, explanation: q.explanation ?? undefined },
      update: {
        topic: q.topic,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation ?? undefined,
      },
    });
    revalidatePath("/duel/bank");
    return { ok: true, id: q.id };
  } catch (e) {
    console.error("saveQuestion failed", e);
    return { ok: false, error: "Could not save that question." };
  }
}
