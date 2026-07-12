import { prisma } from "@/lib/prisma";
import { ensureUserProgress } from "@/lib/user-progress";
import { cache } from "react";

export const getLessonAccessStatus = cache(async (userId: string, targetLessonId: number) => {
  let completedLessonIds: number[] = [];
  let isUnlocked = false;

  try {
    const [user, targetLesson, progress] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          completedLessons: { select: { lessonId: true } },
        },
      }),
      prisma.lesson.findUnique({
        where: { dayOrder: targetLessonId },
        select: { dayOrder: true },
      }),
      ensureUserProgress(userId)
    ]);

    completedLessonIds = (user?.completedLessons ?? []).map((l) => {
      const id = parseInt(l.lessonId, 10) || 0;
      return id > 100 ? id - 100 : id;
    });
    
    const currentDay = progress?.currentDay ?? 1;
    
    // Strict sequential unlocking: Must have completed the previous lesson
    const hasCompletedPreviousLesson = completedLessonIds.includes(targetLessonId - 1);

    isUnlocked = Boolean(targetLesson) && (
      targetLessonId === 1 || 
      hasCompletedPreviousLesson
    );
  } catch (error) {
    console.error("Failed to fetch lesson access status:", error);
    throw new Error("Failed to verify lesson access.");
  }

  return {
    isUnlocked,
    completedLessonIds,
  };
});
