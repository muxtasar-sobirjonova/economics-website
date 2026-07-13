"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ensureUserProgress } from "@/lib/user-progress";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SetDailyTimeGoalSchema = z.number().int().min(1).max(1440);

export async function setDailyTimeGoalAction(minutes: number): Promise<void> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  
  const parsed = SetDailyTimeGoalSchema.safeParse(minutes);
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.flatten().formErrors.join(", ")}`);
  }

  await ensureUserProgress(userId);
  await prisma.userProgress.update({
    where: { userId },
    data: { dailyTimeGoal: parsed.data }
  });

  revalidatePath("/", "layout");
}

const XpActionSchema = z.enum(["READ_ARTICLE", "READ_CONCEPT", "COMPLETE_QUIZ", "DAILY_LOGIN"]);
type XpActionType = z.infer<typeof XpActionSchema>;

const XP_MAP: Record<XpActionType, number> = {
  READ_ARTICLE: 10,
  READ_CONCEPT: 10,
  COMPLETE_QUIZ: 25,
  DAILY_LOGIN: 5,
};

export async function addXpAction(actionType: XpActionType): Promise<void> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  
  const parsed = XpActionSchema.safeParse(actionType);
  if (!parsed.success) {
    throw new Error(`Invalid action type: ${parsed.error.flatten().formErrors.join(", ")}`);
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
}

export async function deleteAccountAction(): Promise<void> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  await prisma.$transaction(async (tx) => {
    // Delete data heavily associated with the user
    await tx.note.deleteMany({ where: { userId } });
    await tx.bookmark.deleteMany({ where: { userId } });
    await tx.quizResult.deleteMany({ where: { userId } });
    await tx.mistakeReview.deleteMany({ where: { quizAttempt: { userId } } });
    await tx.quizAttempt.deleteMany({ where: { userId } });
    await tx.agendaCompletion.deleteMany({ where: { userId } });
    await tx.completedLesson.deleteMany({ where: { userId } });

    // Soft delete the user record itself
    await tx.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() }
    });
  });
}
