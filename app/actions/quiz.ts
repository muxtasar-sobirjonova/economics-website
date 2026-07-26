"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Mistake } from "@/types";
import { ActionError, ActionResponse, catchActionError } from "@/lib/errors";
import { invalidateUserCache } from "@/lib/data";

const RemoveMistakeSchema = z.string().min(1);

export async function removeMistakeAction(quizAttemptId: string): Promise<ActionResponse<void>> {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new ActionError("Unauthorized", "UNAUTHORIZED");
    }
    const userId = session.user.id;
    
    const parsed = RemoveMistakeSchema.safeParse(quizAttemptId);
    if (!parsed.success) {
      throw new ActionError(`Invalid input: ${parsed.error.flatten().formErrors.join(", ")}`);
    }

    const mistake = await prisma.mistakeReview.findUnique({
      where: { quizAttemptId: parsed.data },
      include: { quizAttempt: true }
    });

    if (!mistake) return { success: true, data: undefined };
    if (mistake.quizAttempt.userId !== userId) throw new ActionError("Unauthorized", "UNAUTHORIZED");

    await prisma.mistakeReview.update({
      where: { id: mistake.id },
      data: {
        reviewed: true,
        reviewedAt: new Date()
      }
    });

    revalidatePath("/quizzes");
    return { success: true, data: undefined };
  } catch (error) {
    return catchActionError(error);
  }
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

export async function validateQuizAnswerAction(lessonId: number, questionIndex: number, selectedOptionIndex: number): Promise<ActionResponse<{ isCorrect: boolean, correctOptionIndex: number }>> {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new ActionError("Unauthorized", "UNAUTHORIZED");
    }
    const userId = session.user.id;

    const parsed = ValidateQuizAnswerSchema.safeParse({ lessonId, questionIndex, selectedOptionIndex });
    if (!parsed.success) {
      throw new ActionError(`Invalid input: ${parsed.error.flatten().formErrors.join(", ")}`);
    }

    const { getLessonAccessStatus } = await import("@/lib/lesson-access");
    const access = await getLessonAccessStatus(userId, parsed.data.lessonId);
    if (!access.isUnlocked) {
      throw new ActionError("Lesson is locked or invalid");
    }

    const userRecord = await prisma.user.findUnique({ where: { id: userId }, select: { activeTrack: true } });
    const track = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

    // Find the quiz for this lesson
    const quiz = await prisma.quiz.findUnique({
      where: { track_dayOrder: { track, dayOrder: parsed.data.lessonId } },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!quiz) {
      throw new ActionError("Quiz not found");
    }

    const questions = quiz.questions;
    if (parsed.data.questionIndex < 0 || parsed.data.questionIndex >= questions.length) {
      throw new ActionError("Question index out of bounds");
    }
    const question = questions[parsed.data.questionIndex];

    let correctOptionIndex: number | undefined;
    if (question.correctAnswer && question.options) {
      correctOptionIndex = question.options.indexOf(question.correctAnswer);
    }

    if (correctOptionIndex === -1 || correctOptionIndex === undefined) {
      // Edge case if data is misconfigured
      throw new ActionError("Correct answer could not be verified.");
    }

    return {
      success: true,
      data: {
        isCorrect: parsed.data.selectedOptionIndex === correctOptionIndex,
        correctOptionIndex
      }
    };
  } catch (error) {
    return catchActionError(error);
  }
}

export async function markQuizDoneAction(quizId: string, score: number, mistakes: Mistake[]): Promise<ActionResponse<any>> {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new ActionError("Unauthorized", "UNAUTHORIZED");
    }
    const userId = session.user.id;
    
    const parsed = MarkQuizDoneSchema.safeParse({ quizId, score, mistakes });
    if (!parsed.success) {
      throw new ActionError(`Invalid input: ${parsed.error.flatten().formErrors.join(", ")}`, "BAD_REQUEST");
    }

    const lessonNumber = parseInt(parsed.data.quizId, 10);
    if (isNaN(lessonNumber)) {
      throw new ActionError("Invalid quizId", "BAD_REQUEST");
    }
    const actualLessonId = lessonNumber > 100 ? lessonNumber - 100 : lessonNumber;

    const { QuizService } = await import("@/services/quizService");
    
    const result = await QuizService.processQuizAttempt(
      userId,
      parsed.data.quizId,
      parsed.data.score,
      parsed.data.mistakes,
      actualLessonId
    );

    await invalidateUserCache(userId, "ENTREPRENEURSHIP_ECONOMICS");
    revalidatePath("/", "layout");
    return { success: true, data: result };
  } catch (error) {
    return catchActionError(error);
  }
}
