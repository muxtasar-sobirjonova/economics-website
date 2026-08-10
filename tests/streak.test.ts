import { describe, it, expect, vi } from 'vitest';
import { Track } from '@prisma/client';
import { touchStreak } from '../lib/streak';

function makeDb(progress: { streak: number; lastActive: Date | null } | null) {
  return {
    trackProgress: {
      findUnique: vi.fn().mockResolvedValue(progress),
      upsert: vi.fn(),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

describe('touchStreak', () => {
  it('starts a streak at 1 for a brand new track', async () => {
    const db = makeDb(null);
    await expect(touchStreak(db, 'user-1', Track.ENTREPRENEURSHIP_ECONOMICS)).resolves.toBe(1);
  });

  it('extends the streak when the last activity was yesterday', async () => {
    const db = makeDb({ streak: 4, lastActive: daysAgo(1) });
    await expect(touchStreak(db, 'user-1', Track.ENTREPRENEURSHIP_ECONOMICS)).resolves.toBe(5);
  });

  it('does not double count a second activity on the same day', async () => {
    const db = makeDb({ streak: 4, lastActive: daysAgo(0) });
    await expect(touchStreak(db, 'user-1', Track.ENTREPRENEURSHIP_ECONOMICS)).resolves.toBe(4);
  });

  it('resets to 1 after a missed day', async () => {
    const db = makeDb({ streak: 9, lastActive: daysAgo(3) });
    await expect(touchStreak(db, 'user-1', Track.ENTREPRENEURSHIP_ECONOMICS)).resolves.toBe(1);
  });
});
