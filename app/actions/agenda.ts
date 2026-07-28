"use server";
import { Track } from "@prisma/client";

import { auth } from "@/auth";
import { ensureUserProgress } from "@/lib/user-progress";
import { revalidatePath } from "next/cache";
import { getLessonAccessStatus } from "@/lib/lesson-access";

import { AgendaService } from "@/services/agendaService";
import { ActionError, ActionResponse, catchActionError } from "@/lib/errors";
import { invalidateUserCache } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export async function markArticleDoneAction(lessonId: string): Promise<ActionResponse<void>> {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new ActionError("Unauthorized", "UNAUTHORIZED");
    }
    const userId = session.user.id;
    
    await ensureUserProgress(userId);

    
    const access = await getLessonAccessStatus(userId, parseInt(lessonId, 10));
    if (!access.isUnlocked) {
      throw new ActionError("Lesson is locked", "FORBIDDEN");
    }

    await AgendaService.markItemDone(userId, lessonId, "ARTICLE");

    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { activeTrack: true }
    });
    const activeTrack = userRecord?.activeTrack || Track.ENTREPRENEURSHIP_ECONOMICS;

    await invalidateUserCache(userId, activeTrack);
    revalidatePath("/", "layout");
    
    return { success: true, data: undefined };
  } catch (error) {
    return catchActionError(error);
  }
}
