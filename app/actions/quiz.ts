"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma, ItemType } from "@prisma/client";
import { ensureUserProgress } from "@/lib/user-progress";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logQuizAttemptInDb } from "@/lib/db-utils";
import { client } from "@/sanity/client";
import { QUIZZES_QUERY } from "@/sanity/queries";
import { Mistake, SanityQuiz, QuizQuestionSchema } from "@/types";

const RemoveMistakeSchema = z.string().min(1);

export async function removeMistakeAction(quizAttemptId: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  
  const parsed = RemoveMistakeSchema.safeParse(quizAttemptId);
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.flatten().formErrors.join(", ")}`);
  }

  const mistake = await prisma.mistakeReview.findUnique({
    where: { quizAttemptId: parsed.data },
    include: { quizAttempt: true }
  });

  if (!mistake) return;
  if (mistake.quizAttempt.userId !== userId) throw new Error("Unauthorized");

  await prisma.mistakeReview.update({
    where: { id: mistake.id },
    data: {
      reviewed: true,
      reviewedAt: new Date()
    }
  });

  revalidatePath("/quizzes");
}

const MistakeSchema = z.object({
  questionId: z.string().optional(),
  userAnswer: z.string().optional(),
  questionText: z.string().optional(),
  correctAnswer: z.string().optional(),
  explanation: z.string().optional()
});

const MarkQuizDoneSchema = z.object({
  quizId: z.string().min(1),
  score: z.number().int().min(0).max(100),
  mistakes: z.array(MistakeSchema)
});

const ValidateQuizAnswerSchema = z.object({
  lessonId: z.number().int(),
  questionIndex: z.number().int(),
  selectedOptionIndex: z.number().int()
});

// Replaced with SanityQuiz from "@/types"

import { QUIZZES } from "@/lib/data";

export async function validateQuizAnswerAction(lessonId: number, questionIndex: number, selectedOptionIndex: number) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  const parsed = ValidateQuizAnswerSchema.safeParse({ lessonId, questionIndex, selectedOptionIndex });
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.flatten().formErrors.join(", ")}`);
  }

  let sanityData: SanityQuiz[] | null = null;
  try {
    sanityData = await client.fetch(QUIZZES_QUERY);
  } catch (error) {
    console.error("Failed to fetch quizzes from Sanity CMS:", error);
    // Allow fallback to local quizzes, but we log the error rather than silently failing
  }

  const sanityQuiz = sanityData?.find((d) => d.lessonId === lessonId);
  const fallbackQuiz = QUIZZES.find((q) => q.id === 100 + lessonId);
  
  // Use same logic as QuizClient to determine questions array
  const questions = (lessonId === 1 ? fallbackQuiz?.questions : sanityQuiz?.questions) || fallbackQuiz?.questions || [];
  
  const displayQuestions = questions.slice(0, 10);
  const question = displayQuestions[questionIndex];

  if (!question) {
    throw new Error("Question not found");
  }

  let correctOptionIndex: number | undefined;
  // Fallback lookup if correctOption isn't explicitly provided (for mock content)
  if (typeof (question as any).correctOption === 'undefined' && question.correctAnswer !== undefined && question.options) {
    correctOptionIndex = question.options.indexOf(question.correctAnswer.toString());
  } else {
    correctOptionIndex = (question as any).correctOption;
  }

  return {
    isCorrect: selectedOptionIndex === correctOptionIndex,
    correctOptionIndex
  };
}

export async function markQuizDoneAction(quizId: string, score: number, mistakes: Mistake[]) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  
  const parsed = MarkQuizDoneSchema.safeParse({ quizId, score, mistakes });
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.flatten().formErrors.join(", ")}`);
  }

  const passed = parsed.data.score >= 6;
  const xpEarned = passed ? 25 : 0;
  
  // Enforce server time
  const todayDate = new Date();
  todayDate.setUTCHours(0,0,0,0);

  await ensureUserProgress(userId);

  await logQuizAttemptInDb(userId, parsed.data.quizId, parsed.data.mistakes);

  if (passed) {
    const lessonNumber = parseInt(parsed.data.quizId, 10) || 0;
    const actualLessonId = lessonNumber > 100 ? lessonNumber - 100 : lessonNumber;
    
    await prisma.$transaction(async (tx) => {
      await tx.quizResult.upsert({
        where: {
          userId_quizId: {
            userId,
            quizId: parsed.data.quizId,
          },
        },
        update: {
          score: parsed.data.score,
          date: todayDate,
          xpEarned,
          mistakes: parsed.data.mistakes as Prisma.InputJsonValue,
        },
        create: {
          userId,
          quizId: parsed.data.quizId,
          score: parsed.data.score,
          date: todayDate,
          xpEarned,
          mistakes: parsed.data.mistakes as Prisma.InputJsonValue,
        },
      });

      await tx.userProgress.update({
        where: { userId: userId },
        data: { totalXP: { increment: xpEarned } }
      });
      
      await tx.completedLesson.upsert({
        where: { 
          userId_lessonId: { userId: userId, lessonId: String(actualLessonId) } 
        },
        update: {},
        create: {
          userId: userId,
          lessonId: String(actualLessonId),
          title: `Lesson ${actualLessonId}`,
          date: todayDate,
          xpEarned: 0
        }
      });

      const realQuiz = await tx.quiz.findUnique({
        where: { dayOrder: lessonNumber }
      });
      const realLesson = await tx.lesson.findUnique({
        where: { dayOrder: actualLessonId }
      });

      const itemsToTick = [
        { type: ItemType.QUIZ, lessonId: null, quizId: realQuiz?.id || null },
        { type: ItemType.LESSON, lessonId: realLesson?.id || null, quizId: null },
        { type: ItemType.ARTICLE, lessonId: realLesson?.id || null, quizId: null }
      ];

      for (const item of itemsToTick) {
        const existing = await tx.agendaCompletion.findFirst({
          where: { userId: userId, itemType: item.type, lessonId: item.lessonId, quizId: item.quizId, dateString: todayDate }
        });
        if (!existing) {
          await tx.agendaCompletion.create({
            data: { userId: userId, itemType: item.type, lessonId: item.lessonId, quizId: item.quizId, dateString: todayDate }
          });
        }
      }
    });
  } else {
    await ensureUserProgress(session.user.id);
    await prisma.$transaction(async (tx) => {
      await tx.quizResult.upsert({
        where: {
          userId_quizId: {
            userId,
            quizId: parsed.data.quizId,
          },
        },
        update: {
          score: parsed.data.score,
          date: todayDate,
          xpEarned,
          mistakes: parsed.data.mistakes as Prisma.InputJsonValue,
        },
        create: {
          userId,
          quizId: parsed.data.quizId,
          score: parsed.data.score,
          date: todayDate,
          xpEarned,
          mistakes: parsed.data.mistakes as Prisma.InputJsonValue,
        },
      });

      await tx.userProgress.update({
        where: { userId: userId },
        data: { hearts: { decrement: 1 } }
      });
    });
  }

  revalidatePath("/", "layout");
}
