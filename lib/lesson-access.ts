import { prisma } from "@/lib/prisma";
import { ensureUserProgress } from "@/lib/user-progress";
import { getLessons, getQuizzes } from "@/lib/data";
import { cache } from "react";

/** QuizResult.quizId is stored as `100 + dayOrder`. */
export const quizIdToDayOrder = (quizId: string) => {
  const parsed = parseInt(quizId, 10);
  if (isNaN(parsed)) return null;
  return parsed > 100 ? parsed - 100 : parsed;
};

export const getLessonAccessStatus = cache(async (userId: string, targetLessonId: number) => {
  let completedLessonIds: number[] = [];
  let completedQuizDayOrders: number[] = [];
  let isUnlocked = false;

  try {
    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { activeTrack: true }
    });
    const track = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

    const [user, , trackProgress] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          completedLessons: {
            where: { track },
            select: { lessonId: true }
          },
          quizResults: {
            where: { track },
            select: { quizId: true }
          },
        },
      }),
      ensureUserProgress(userId),
      prisma.trackProgress.findUnique({ where: { userId_track: { userId, track } } })
    ]);

    completedLessonIds = (user?.completedLessons ?? []).map((l) => {
      const id = parseInt(l.lessonId, 10) || 0;
      return id > 100 ? id - 100 : id;
    });

    completedQuizDayOrders = (user?.quizResults ?? [])
      .map((q) => quizIdToDayOrder(q.quizId))
      .filter((d): d is number => d !== null);

    const [trackLessons, trackQuizzes] = await Promise.all([
      getLessons(track),
      getQuizzes(track)
    ]);

    const lessonDays = trackLessons.map((l) => l.dayOrder);
    const quizDays = trackQuizzes.map((q) => q.dayOrder);

    // Chapter-review days (7, 14, 21…) have a Quiz but no Lesson, so the
    // ordered curriculum is the union of both.
    const allDays = Array.from(new Set([...lessonDays, ...quizDays])).sort((a, b) => a - b);
    const targetIndex = allDays.indexOf(targetLessonId);

    const isDayCompleted = (day: number) =>
      lessonDays.includes(day)
        ? completedLessonIds.includes(day)
        : completedQuizDayOrders.includes(day);

    let hasCompletedPreviousDay = false;
    if (targetIndex > 0) {
      hasCompletedPreviousDay = isDayCompleted(allDays[targetIndex - 1]);
    }

    isUnlocked = targetIndex >= 0 && (
      targetIndex === 0 ||
      hasCompletedPreviousDay ||
      // Already-finished days stay open for review, and anyone who has already
      // progressed past this day keeps their access.
      isDayCompleted(targetLessonId) ||
      targetLessonId <= (trackProgress?.currentDay ?? 1)
    );
  } catch (error) {
    console.error("Failed to fetch lesson access status:", error);
    throw new Error("Failed to verify lesson access.");
  }

  return {
    isUnlocked,
    completedLessonIds,
    completedQuizDayOrders,
  };
});
