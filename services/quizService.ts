import { prisma } from "@/lib/prisma";
import { Mistake } from "@/types";
import { Prisma, ItemType } from "@prisma/client";
import { ensureUserProgress } from "@/lib/user-progress";
import { logQuizAttemptInDb } from "@/lib/db-utils";

export class QuizService {
  static async processQuizAttempt(userId: string, quizId: string, score: number, mistakes: Mistake[], actualLessonId: number) {
    const passed = score >= 6;
    const xpEarned = score * 2;
    
    const todayDate = new Date();
    todayDate.setUTCHours(0,0,0,0);

    await ensureUserProgress(userId);

    const userRecord = await prisma.user.findUnique({ where: { id: userId }, select: { activeTrack: true } });
    const track = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

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

    const validQuestionTexts = realQuiz.questions.map(q => q.questionText);
    const validMistakes = mistakes.filter(m => m.questionText && validQuestionTexts.includes(m.questionText));

    await logQuizAttemptInDb(userId, quizId, validMistakes);

    const existingResult = await prisma.quizResult.findUnique({
      where: { userId_quizId_track: { userId, quizId, track } }
    });
    const alreadySolved = existingResult && existingResult.score >= 6;

    if (passed) {
      const finalScore = alreadySolved ? existingResult.score : score;
      const finalXpEarned = alreadySolved ? existingResult.xpEarned : xpEarned;
      const finalDate = alreadySolved ? existingResult.date : todayDate;
      const xpToIncrement = alreadySolved 
        ? 0 
        : (existingResult ? finalXpEarned - existingResult.xpEarned : finalXpEarned);

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

        // Increment track-specific XP
        await tx.trackProgress.upsert({
          where: { userId_track: { userId, track } },
          update: { xp: { increment: xpToIncrement } },
          create: { userId, track, xp: xpToIncrement }
        });

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
          await tx.userProgress.update({
            where: { userId },
            data: { totalXP: { increment: xpToIncrement } }
          });
        }
        
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

        await tx.dailyCompletion.upsert({
          where: { userId_normalizedDate: { userId, normalizedDate: todayDate } },
          update: {},
          create: { userId, normalizedDate: todayDate }
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
      const finalScore = alreadySolved ? existingResult.score : score;
      const finalDate = alreadySolved ? existingResult.date : todayDate;
      const finalXpEarned = alreadySolved ? existingResult.xpEarned : 0;

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

        await tx.userProgress.update({
          where: { userId },
          data: {
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
        xpEarned: 0,
        redirectUrl: `/lessons/${actualLessonId}` 
      };
    }
  }
}
