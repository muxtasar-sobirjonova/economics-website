import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AgendaService } from '../services/agendaService';
import { prisma } from '../lib/prisma';

// Mock prisma
vi.mock('../lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    lesson: { findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}));

describe('AgendaService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws an error if lesson is not found', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ activeTrack: 'ENTREPRENEURSHIP_ECONOMICS' });
    (prisma.lesson.findUnique as any).mockResolvedValue(null);

    await expect(AgendaService.markItemDone('user-1', '999', 'ARTICLE'))
      .rejects.toThrow('Lesson not found');
  });

  it('marks an item as done if lesson exists', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ activeTrack: 'ENTREPRENEURSHIP_ECONOMICS' });
    (prisma.lesson.findUnique as any).mockResolvedValue({ id: 'lesson-1', dayOrder: 1 });
    (prisma.$transaction as any).mockImplementation(async (callback: any) => {
      // simulate transaction callback
      return true;
    });

    const result = await AgendaService.markItemDone('user-1', '1', 'ARTICLE');
    expect(result).toBe(true);
    expect(prisma.lesson.findUnique).toHaveBeenCalledWith({ where: { track_dayOrder: { track: 'ENTREPRENEURSHIP_ECONOMICS', dayOrder: 1 } } });
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});
