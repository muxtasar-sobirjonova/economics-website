import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuizService } from '../services/quizService';
import { prisma } from '../lib/prisma';
import { ensureUserProgress } from '../lib/user-progress';
import { logQuizAttemptInDb } from '../lib/db-utils';

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

describe('QuizService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws if lesson or quiz not found', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ activeTrack: 'ENTREPRENEURSHIP_ECONOMICS' });
    (prisma.quiz.findUnique as any).mockResolvedValue(null);
    (prisma.lesson.findUnique as any).mockResolvedValue(null);

    await expect(QuizService.processQuizAttempt('user-1', 'quiz-1', 10, [], 1))
      .rejects.toThrow('Lesson or Quiz not found');
  });
});
