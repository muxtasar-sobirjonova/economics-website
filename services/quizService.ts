import { prisma } from "@/lib/prisma";
import { Mistake } from "@/types";
import { ItemType, Track } from "@prisma/client";
import { ensureUserProgress } from "@/lib/user-progress";
import { logQuizAttemptInDb } from "@/lib/db-utils";
import { touchStreak } from "@/lib/streak";

/** The client only ever serves the first 10 questions of a quiz. */
export const MAX_SERVED_QUESTIONS = 10;

export class QuizService {
  static async processQuizAttempt(userId: string, quizId: string, score: number, mistakes: Mistake[], actualLessonId: number) {
    const xpEarned = score; // 1 XP per correct answer

    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);

    await ensureUserProgress(userId);

    const userRecord = await prisma.user.findUnique({ where: { id: userId }, select: { activeTrack: true } });
    if (!userRecord) {
      throw new Error("User record not found");
    }
    const track: Track = userRecord.activeTrack || Track.ENTREPRENEURSHIP_ECONOMICS;

    const realQuiz = await prisma.quiz.findUnique({
      where: { track_dayOrder: { track, dayOrder: actualLessonId } },
      include: { questions: true }
    });

    // Chapter-review days (7, 14, 21…) have a Quiz but no Lesson — that is valid.
    const realLesson = await prisma.lesson.findUnique({
      where: { track_dayOrder: { track, dayOrder: actualLessonId } }
    });

    if (!realQuiz) {
      throw new Error("Quiz not found");
    }

    const expectedQuizIdStr = String(100 + actualLessonId);
    if (realQuiz.id !== quizId && quizId !== expectedQuizIdStr) {
      throw new Error("Invalid quizId for the active track.");
    }

    // Pass if the score is >= 80% of the questions the user was actually asked.
    const servedQuestions = Math.min(realQuiz.questions.length, MAX_SERVED_QUESTIONS);
    const passingScore = Math.max(1, Math.ceil(servedQuestions * 0.8));
    const passed = score >= passingScore;

    const validQuestionTexts = realQuiz.questions.map(q => q.questionText);
    const validMistakes = mistakes.filter(m => m.questionText && validQuestionTexts.includes(m.questionText));

    await logQuizAttemptInDb(userId, quizId, validMistakes, track);

    // XP is granted for every attempt, but the stored `xpEarned` reflects THIS
    // attempt only — otherwise "XP this week" keeps re-counting older attempts
    // every time the row's date is bumped to today.
    const xpToIncrement = xpEarned;
    const finalScore = score; // Always keep the latest score
    const finalDate = todayDate;

    await prisma.$transaction(async (tx) => {
      await tx.quizResult.upsert({
        where: { userId_quizId_track: { userId, quizId, track } },
        update: {
          score: finalScore,
          date: finalDate,
          xpEarned: xpToIncrement,
        },
        create: {
          userId,
          quizId,
          score: finalScore,
          date: finalDate,
          xpEarned: xpToIncrement,
          track,
        },
      });

      if (xpToIncrement > 0) {
        await tx.trackProgress.upsert({
          where: { userId_track: { userId, track } },
          update: { xp: { increment: xpToIncrement } },
          create: { userId, track, xp: xpToIncrement }
        });

        await tx.userProgress.update({
          where: { userId },
          data: { totalXP: { increment: xpToIncrement } }
        });
      }

      if (passed) {
        // Advance the day counter when the user clears the day they are on.
        const trackProgress = await tx.trackProgress.findUnique({ where: { userId_track: { userId, track } } });
        const currentDay = trackProgress?.currentDay ?? 1;

        if (actualLessonId >= currentDay) {
          const nextDay = actualLessonId + 1;
          await tx.trackProgress.upsert({
            where: { userId_track: { userId, track } },
            update: { currentDay: nextDay },
            create: { userId, track, currentDay: nextDay }
          });
          await tx.userProgress.update({
            where: { userId },
            data: { currentDay: nextDay }
          });
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
            title: realLesson?.title || realQuiz.title,
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
      } else {
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
      }

      // Tick today's agenda. `lessonId`/`quizId` are foreign keys, so they must
      // hold real record ids — never the day number.
      const itemsToTick: { type: ItemType; lessonId: string | null; quizId: string | null }[] = [
        { type: ItemType.QUIZ, lessonId: null, quizId: realQuiz.id }
      ];

      if (passed && realLesson) {
        itemsToTick.push(
          { type: ItemType.LESSON, lessonId: realLesson.id, quizId: null },
          { type: ItemType.ARTICLE, lessonId: realLesson.id, quizId: null }
        );
      }

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

      await touchStreak(tx, userId, track);
    }, {
      maxWait: 5000,
      timeout: 15000
    });

    if (passed) {
      return { success: true, passed: true, xpEarned: xpToIncrement };
    }

    return {
      success: true,
      passed: false,
      xpEarned: xpToIncrement,
      redirectUrl: `/lessons/${actualLessonId}`
    };
  }
}
