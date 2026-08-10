/* eslint-disable @typescript-eslint/no-explicit-any -- Prisma mocks are cast to any so the tests only have to stub the fields they use. */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuizService } from '../services/quizService';
import { prisma } from '../lib/prisma';

vi.mock('../lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    quiz: { findUnique: vi.fn() },
    lesson: { findUnique: vi.fn() },
    quizResult: { findUnique: vi.fn(), upsert: vi.fn() },
    $transaction: vi.fn(),
  },
}));

vi.mock('../lib/user-progress', () => ({
  ensureUserProgress: vi.fn(),
}));

vi.mock('../lib/db-utils', () => ({
  logQuizAttemptInDb: vi.fn(),
}));

function makeTx() {
  return {
    quizResult: { upsert: vi.fn() },
    trackProgress: { upsert: vi.fn(), findUnique: vi.fn().mockResolvedValue({ currentDay: 7 }) },
    userProgress: { update: vi.fn(), findUnique: vi.fn().mockResolvedValue({ hearts: 5, lastHeartDecay: new Date() }) },
    completedLesson: { findUnique: vi.fn().mockResolvedValue(null), upsert: vi.fn() },
    user: { update: vi.fn() },
    dailyCompletion: { upsert: vi.fn() },
    agendaCompletion: { findFirst: vi.fn().mockResolvedValue(null), create: vi.fn() },
  };
}

const tenQuestions = Array.from({ length: 10 }, (_, i) => ({ questionText: `Q${i}` }));

describe('QuizService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws if the quiz does not exist', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ activeTrack: 'ENTREPRENEURSHIP_ECONOMICS' });
    (prisma.quiz.findUnique as any).mockResolvedValue(null);
    (prisma.lesson.findUnique as any).mockResolvedValue(null);

    await expect(QuizService.processQuizAttempt('user-1', 'quiz-1', 10, [], 1))
      .rejects.toThrow('Quiz not found');
  });

  it('accepts a chapter-review day that has a quiz but no lesson', async () => {
    const tx = makeTx();
    (prisma.user.findUnique as any).mockResolvedValue({ activeTrack: 'ENTREPRENEURSHIP_ECONOMICS' });
    (prisma.quiz.findUnique as any).mockResolvedValue({ id: 'quiz-cuid', title: 'Chapter 1 Review Quiz', questions: tenQuestions });
    (prisma.lesson.findUnique as any).mockResolvedValue(null);
    (prisma.$transaction as any).mockImplementation(async (cb: any) => cb(tx));

    const result = await QuizService.processQuizAttempt('user-1', '107', 9, [], 7);

    expect(result.passed).toBe(true);
    // The day must be recorded so the roadmap can unlock the next chapter.
    expect(tx.completedLesson.upsert).toHaveBeenCalled();
    // Agenda ticks must use the real quiz id, never the day number.
    expect(tx.agendaCompletion.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ quizId: 'quiz-cuid', lessonId: null }) })
    );
  });

  it('passes on 8/10 even when the quiz holds 20 questions in the database', async () => {
    const tx = makeTx();
    (prisma.user.findUnique as any).mockResolvedValue({ activeTrack: 'ENTREPRENEURSHIP_ECONOMICS' });
    (prisma.quiz.findUnique as any).mockResolvedValue({
      id: 'quiz-cuid',
      title: 'Chapter 1 Review Quiz',
      questions: Array.from({ length: 20 }, (_, i) => ({ questionText: `Q${i}` })),
    });
    (prisma.lesson.findUnique as any).mockResolvedValue(null);
    (prisma.$transaction as any).mockImplementation(async (cb: any) => cb(tx));

    const result = await QuizService.processQuizAttempt('user-1', '107', 8, [], 7);

    expect(result.passed).toBe(true);
  });

  it('still records XP and the quiz result when the attempt fails', async () => {
    const tx = makeTx();
    (prisma.user.findUnique as any).mockResolvedValue({ activeTrack: 'ENTREPRENEURSHIP_ECONOMICS' });
    (prisma.quiz.findUnique as any).mockResolvedValue({ id: 'quiz-cuid', title: 'Quiz', questions: tenQuestions });
    (prisma.lesson.findUnique as any).mockResolvedValue({ id: 'lesson-cuid', title: 'Lesson 1' });
    (prisma.$transaction as any).mockImplementation(async (cb: any) => cb(tx));

    const result = await QuizService.processQuizAttempt('user-1', '101', 4, [], 1);

    expect(result.passed).toBe(false);
    expect(tx.quizResult.upsert).toHaveBeenCalled();
    expect(tx.trackProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ update: { xp: { increment: 4 } } })
    );
    expect(tx.completedLesson.upsert).not.toHaveBeenCalled();
  });

  it('increments track XP exactly once per attempt', async () => {
    const tx = makeTx();
    tx.trackProgress.findUnique.mockResolvedValue({ currentDay: 5 });
    (prisma.user.findUnique as any).mockResolvedValue({ activeTrack: 'ENTREPRENEURSHIP_ECONOMICS' });
    (prisma.quiz.findUnique as any).mockResolvedValue({ id: 'quiz-cuid', title: 'Quiz', questions: tenQuestions });
    (prisma.lesson.findUnique as any).mockResolvedValue({ id: 'lesson-cuid', title: 'Lesson 1' });
    (prisma.$transaction as any).mockImplementation(async (cb: any) => cb(tx));

    // Retaking an older day (1) while the user is already on day 5.
    await QuizService.processQuizAttempt('user-1', '101', 10, [], 1);

    const xpCalls = tx.trackProgress.upsert.mock.calls.filter(
      ([arg]: any[]) => arg?.update?.xp?.increment
    );
    expect(xpCalls).toHaveLength(1);
  });
});
