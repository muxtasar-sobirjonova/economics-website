"use server";

import { auth } from "@/auth";
import { Track } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ensureUserProgress } from "@/lib/user-progress";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionError, ActionResponse, catchActionError } from "@/lib/errors";

const SetDailyTimeGoalSchema = z.number().int().min(1).max(1440);

export async function setDailyTimeGoalAction(minutes: number): Promise<ActionResponse<void>> {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new ActionError("Unauthorized", "UNAUTHORIZED");
    }
    const userId = session.user.id;
    
    const parsed = SetDailyTimeGoalSchema.safeParse(minutes);
    if (!parsed.success) {
      throw new ActionError(`Invalid input: ${parsed.error.flatten().formErrors.join(", ")}`);
    }

    await ensureUserProgress(userId);
    await prisma.userProgress.update({
      where: { userId },
      data: { dailyTimeGoal: parsed.data }
    });

    revalidatePath("/", "layout");
    return { success: true, data: undefined };
  } catch (error) {
    return catchActionError(error);
  }
}

const XpActionSchema = z.enum(["DAILY_LOGIN"]);
type XpActionType = z.infer<typeof XpActionSchema>;

const XP_MAP: Record<XpActionType, number> = {
  DAILY_LOGIN: 5,
};

import { ratelimit } from "@/lib/ratelimit";

export async function addXpAction(actionType: XpActionType): Promise<ActionResponse<void>> {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new ActionError("Unauthorized", "UNAUTHORIZED");
    }
    const userId = session.user.id;

    const { success } = await ratelimit.limit(`xp_${userId}`);
    if (!success) {
      throw new ActionError("Too many XP requests. Please slow down.");
    }

    const parsed = XpActionSchema.safeParse(actionType);
    if (!parsed.success) {
      throw new ActionError(`Invalid action type: ${parsed.error.flatten().formErrors.join(", ")}`);
    }

    if (parsed.data !== "DAILY_LOGIN") {
      throw new ActionError("Only DAILY_LOGIN XP can be claimed via client action.");
    }

    const xpToAdd = XP_MAP[parsed.data];

    await prisma.userProgress.upsert({
      where: { userId },
      update: { totalXP: { increment: xpToAdd } },
      create: {
        userId,
        totalXP: xpToAdd,
        streak: 0,
        currentDay: 1,
        hearts: 5,
        dailyTimeGoal: 60,
      }
    });

    revalidatePath("/", "layout");
    return { success: true, data: undefined };
  } catch (error) {
    return catchActionError(error);
  }
}

export async function deleteAccountAction(): Promise<ActionResponse<void>> {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new ActionError("Unauthorized", "UNAUTHORIZED");
    }
    const userId = session.user.id;

    await prisma.$transaction(async (tx) => {
      await tx.note.deleteMany({ where: { userId } });
      await tx.bookmark.deleteMany({ where: { userId } });
      await tx.quizResult.deleteMany({ where: { userId } });
      await tx.mistakeReview.deleteMany({ where: { userId } });
      await tx.quizAttempt.deleteMany({ where: { userId } });
      await tx.agendaCompletion.deleteMany({ where: { userId } });
      await tx.completedLesson.deleteMany({ where: { userId } });
      await tx.dailyCompletion.deleteMany({ where: { userId } });
      await tx.userProgress.deleteMany({ where: { userId } });
      
      await tx.session.deleteMany({ where: { userId } });
      await tx.account.deleteMany({ where: { userId } });

      await tx.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() }
      });
    });
    return { success: true, data: undefined };
  } catch (error) {
    return catchActionError(error);
  }
}

export async function switchTrackAction(track: string): Promise<ActionResponse<void>> {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new ActionError("Unauthorized", "UNAUTHORIZED");
    }
    const userId = session.user.id;
    
    const { switchActiveTrack } = await import("@/lib/user-progress");
    await switchActiveTrack(userId, track as Track);
    
    revalidatePath("/", "layout");
    return { success: true, data: undefined };
  } catch (error) {
    return catchActionError(error);
  }
}
