"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma, ItemType } from "@prisma/client";
import { ensureUserProgress } from "@/lib/user-progress";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function markArticleDoneAction(lessonId: string): Promise<void> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  
  // Use UTC server time to prevent client spoofing
  const todayDate = new Date();
  todayDate.setUTCHours(0,0,0,0);

  await ensureUserProgress(userId);

  // Find real Lesson ID if possible, otherwise skip foreign key link
  const realLesson = await prisma.lesson.findUnique({
    where: { dayOrder: parseInt(lessonId) }
  });
  const dbLessonId = realLesson?.id || null;

  // Tick off Article
  const existingArticle = await prisma.agendaCompletion.findFirst({
    where: { userId, lessonId: dbLessonId, dateString: todayDate, itemType: ItemType.ARTICLE }
  });
  if (!existingArticle) {
    await prisma.agendaCompletion.create({
      data: { userId, itemType: ItemType.ARTICLE, dateString: todayDate, lessonId: dbLessonId }
    });
  }

  // Tick off Concept
  const existingConcept = await prisma.agendaCompletion.findFirst({
    where: { userId, lessonId: dbLessonId, dateString: todayDate, itemType: ItemType.LESSON }
  });
  if (!existingConcept) {
    await prisma.agendaCompletion.create({
      data: { userId, itemType: ItemType.LESSON, dateString: todayDate, lessonId: dbLessonId }
    });
  }

  // Optionally grant XP for reading
  await prisma.userProgress.update({
    where: { userId },
    data: { totalXP: { increment: 10 } }
  });

  revalidatePath("/", "layout");
}
