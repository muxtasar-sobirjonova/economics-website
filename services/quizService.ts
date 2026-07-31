import { prisma } from "@/lib/prisma";
import { Mistake } from "@/types";
import { ItemType } from "@prisma/client";
import { ensureUserProgress } from "@/lib/user-progress";
import { logQuizAttemptInDb } from "@/lib/db-utils";

export class QuizService {
  static async processQuizAttempt(userId: string, quizId: string, score: number, mistakes: Mistake[], actualLessonId: number) {
    const xpEarned = score; // 1 XP per correct answer
    
    const todayDate = new Date();
    todayDate.setUTCHours(0,0,0,0);

    await ensureUserProgress(userId);

    const userRecord = await prisma.user.findUnique({ where: { id: userId }, select: { activeTrack: true } });
    if (!userRecord) {
      throw new Error("User record not found");
    }
    const track = userRecord.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

    const realQuiz = await prisma.quiz.findUnique({
      where: { track_dayOrder: { track, dayOrder: actualLessonId } },
      include: { questions: true }
    });
    const realLesson = await prisma.lesson.findUnique({
      where: { track_dayOrder: { track, dayOrder: actualLessonId } }
    });

    if (!realQuiz || !realLesson) {
      throw new Error("Lesson or Quiz not found");
    }

    const expectedQuizIdStr = String(100 + actualLessonId);
    if (realQuiz.id !== quizId && quizId !== expectedQuizIdStr) {
      throw new Error("Invalid quizId for the active track.");
    }
    
    // Pass if score is >= 80% of total questions, or at least 1 if empty
    const totalQuestions = realQuiz.questions.length;
    const passingScore = Math.max(1, Math.ceil(totalQuestions * 0.8));
    const passed = score >= passingScore;

    const validQuestionTexts = realQuiz.questions.map(q => q.questionText);
    const validMistakes = mistakes.filter(m => m.questionText && validQuestionTexts.includes(m.questionText));

    await logQuizAttemptInDb(userId, quizId, validMistakes);

    const existingResult = await prisma.quizResult.findUnique({
      where: { userId_quizId_track: { userId, quizId, track } }
    });

    const xpToIncrement = xpEarned; // Grant XP for every attempt!
    const finalXpEarned = (existingResult ? existingResult.xpEarned : 0) + xpEarned;
    const finalScore = score; // Always keep the latest score as per user request
    const finalDate = todayDate;

    if (passed) {
      await prisma.$transaction(async (tx) => {
        await tx.quizResult.upsert({
          where: { userId_quizId_track: { userId, quizId, track } },
          update: {
            score: finalScore,
            date: finalDate,
            xpEarned: finalXpEarned,
          },
          create: {
            userId,
            quizId,
            score: finalScore,
            date: finalDate,
            xpEarned: finalXpEarned,
            track,
          },
        });

        if (xpToIncrement > 0) {
          // Increment track-specific XP
          await tx.trackProgress.upsert({
            where: { userId_track: { userId, track } },
            update: { xp: { increment: xpToIncrement } },
            create: { userId, track, xp: xpToIncrement }
          });
        }

        const userProgress = await tx.userProgress.findUnique({ where: { userId } });
        if (userProgress && actualLessonId === userProgress.currentDay) {
          const nextDay = userProgress.currentDay + 1;
          await tx.userProgress.update({
            where: { userId },
            data: { 
              totalXP: { increment: xpToIncrement },
              currentDay: nextDay
            }
          });

          // Sync currentDay to trackProgress
          await tx.trackProgress.upsert({
            where: { userId_track: { userId, track } },
            update: { currentDay: nextDay },
            create: { userId, track, currentDay: nextDay }
          });
        } else {
          if (xpToIncrement > 0) {
            await tx.userProgress.update({
              where: { userId },
              data: { totalXP: { increment: xpToIncrement } }
            });

            await tx.trackProgress.upsert({
              where: { userId_track: { userId, track } },
              update: { xp: { increment: xpToIncrement } },
              create: { userId, track, xp: xpToIncrement }
            });
          }
        }
        
        const existingCompletedLesson = await tx.completedLesson.findUnique({
          where: { userId_lessonId_track: { userId, lessonId: String(actualLessonId), track } }
        });

        await tx.completedLesson.upsert({
          where: { userId_lessonId_track: { userId, lessonId: String(actualLessonId), track } },
          update: { date: todayDate },
          create: {
            userId,
            lessonId: String(actualLessonId),
            title: `Lesson ${actualLessonId}`,
            date: todayDate,
            xpEarned: 0,
            track,
          }
        });

        if (!existingCompletedLesson) {
          await tx.user.update({
            where: { id: userId },
            data: {
              lessonsCompleted: { increment: 1 },
              lastLessonCompletedAt: todayDate
            }
          });
        }

        await tx.dailyCompletion.upsert({
          where: { userId_normalizedDate_track: { userId, normalizedDate: todayDate, track } },
          update: {},
          create: { userId, normalizedDate: todayDate, track }
        });

        const itemsToTick = [
          { type: ItemType.QUIZ, lessonId: null, quizId: realQuiz.id },
          { type: ItemType.LESSON, lessonId: realLesson.id, quizId: null },
          { type: ItemType.ARTICLE, lessonId: realLesson.id, quizId: null }
        ];

        for (const item of itemsToTick) {
          const existing = await tx.agendaCompletion.findFirst({
            where: { userId, itemType: item.type, lessonId: item.lessonId, quizId: item.quizId, normalizedDate: todayDate }
          });
          if (!existing) {
            await tx.agendaCompletion.create({
              data: { userId, itemType: item.type, lessonId: item.lessonId, quizId: item.quizId, normalizedDate: todayDate }
            });
          }
        }
      }, {
        maxWait: 5000,
        timeout: 15000
      });

      return { success: true, passed: true };
    } else {
      await prisma.$transaction(async (tx) => {
        await tx.quizResult.upsert({
          where: { userId_quizId_track: { userId, quizId, track } },
          update: {
            score: finalScore,
            date: finalDate,
            xpEarned: finalXpEarned,
          },
          create: {
            userId,
            quizId,
            score: finalScore,
            date: finalDate,
            xpEarned: finalXpEarned,
            track,
          },
        });

        const currentProgress = await tx.userProgress.findUnique({ where: { userId } });
        const currentHearts = currentProgress?.hearts ?? 5;
        const newDecayTime = currentHearts === 5 ? new Date() : (currentProgress?.lastHeartDecay ?? new Date());

        if (xpToIncrement > 0) {
          await tx.trackProgress.upsert({
            where: { userId_track: { userId, track } },
            update: { xp: { increment: xpToIncrement } },
            create: { userId, track, xp: xpToIncrement }
          });
        }

        await tx.userProgress.update({
          where: { userId },
          data: {
            totalXP: { increment: xpToIncrement },
            hearts: { decrement: 1 },
            lastHeartDecay: newDecayTime
          }
        });

        const existing = await tx.agendaCompletion.findFirst({
          where: { userId, itemType: "QUIZ", lessonId: String(actualLessonId), quizId, normalizedDate: todayDate }
        });
        
        if (!existing) {
          await tx.agendaCompletion.create({
            data: { userId, itemType: "QUIZ", lessonId: String(actualLessonId), quizId, normalizedDate: todayDate }
          });
        }
      });

      return { 
        success: true, 
        passed: false, 
        xpEarned: xpToIncrement,
        redirectUrl: `/lessons/${actualLessonId}` 
      };
    }
  }
}
