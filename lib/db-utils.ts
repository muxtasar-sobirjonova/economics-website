import { Track } from "@prisma/client";
import { prisma } from "./prisma";

export async function logQuizAttemptInDb(
  userId: string,
  quizId: string,
  mistakes: { questionId?: string; questionText?: string; userAnswer?: string; correctAnswer?: string }[],
  track: Track = Track.ENTREPRENEURSHIP_ECONOMICS
) {
  // Use a transaction to ensure atomic inserts for attempts and reviews
  return prisma.$transaction(async (tx) => {
    const createdAttempts = [];
    for (const m of mistakes) {
      const attempt = await tx.quizAttempt.create({
        data: {
          userId,
          quizId,
          questionId: m.questionId || "unknown",
          questionText: m.questionText || "Question text not provided",
          userAnswer: m.userAnswer || "",
          correctAnswer: m.correctAnswer || "Unknown",
          isCorrect: false,
        },
      });
      await tx.mistakeReview.create({
        data: {
          userId,
          quizAttemptId: attempt.id,
          reviewed: false, track,
        },
      });
      createdAttempts.push(attempt);
    }
    return createdAttempts;
  });
}

export async function getUnreviewedMistakesFromDb(userId: string, sinceDate: Date, track: Track = Track.ENTREPRENEURSHIP_ECONOMICS) {
  return prisma.mistakeReview.findMany({
    where: {
      userId,
      reviewed: false, track,
      quizAttempt: {
        timestamp: {
          gte: sinceDate,
        },
      },
    },
    include: {
      quizAttempt: true,
    },
    orderBy: {
      quizAttempt: {
        timestamp: "desc",
      },
    },
  });
}
