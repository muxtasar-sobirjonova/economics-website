"use server";
import { ItemType } from "@prisma/client";

import { auth } from "@/auth";
import { ensureUserProgress } from "@/lib/user-progress";
import { revalidatePath } from "next/cache";
import { getLessonAccessStatus } from "@/lib/lesson-access";

import { AgendaService } from "@/services/agendaService";
import { ActionError, ActionResponse, catchActionError } from "@/lib/errors";
import { invalidateUserCache } from "@/lib/data";

/**
 * Ticks one item of today's agenda.
 * "LESSON" is the Concepts row, "ARTICLE" is the Reading row.
 */
export async function markLessonItemDoneAction(
  lessonId: string,
  itemType: ItemType = ItemType.ARTICLE
): Promise<ActionResponse<void>> {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new ActionError("Unauthorized", "UNAUTHORIZED");
    }
    const userId = session.user.id;

    if (itemType !== ItemType.LESSON && itemType !== ItemType.ARTICLE) {
      throw new ActionError("Unsupported agenda item type", "BAD_REQUEST");
    }

    await ensureUserProgress(userId);

    const access = await getLessonAccessStatus(userId, parseInt(lessonId, 10));
    if (!access.isUnlocked) {
      throw new ActionError("Lesson is locked", "FORBIDDEN");
    }

    await AgendaService.markItemDone(userId, lessonId, itemType);

    await invalidateUserCache(userId);
    revalidatePath("/", "layout");

    return { success: true, data: undefined };
  } catch (error) {
    return catchActionError(error);
  }
}

export async function markArticleDoneAction(lessonId: string): Promise<ActionResponse<void>> {
  return markLessonItemDoneAction(lessonId, ItemType.ARTICLE);
}

export async function markConceptDoneAction(lessonId: string): Promise<ActionResponse<void>> {
  return markLessonItemDoneAction(lessonId, ItemType.LESSON);
}
