import { Track } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getActiveTrack = cache(async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeTrack: true }
  });
  return user?.activeTrack || Track.ENTREPRENEURSHIP_ECONOMICS;
});

export const getTrackProgress = cache(async (userId: string, track: Track) => {
  let trackProg = await prisma.trackProgress.findUnique({
    where: { userId_track: { userId, track } }
  });

  if (!trackProg) {
    trackProg = await prisma.trackProgress.create({
      data: {
        userId,
        track,
        currentDay: 1
      }
    });
  }

  return trackProg;
});

export const getUserProgress = cache(async (userId: string) => {
  let progress = await prisma.userProgress.findUnique({
    where: { userId }
  });
  
  if (!progress) {
    progress = await prisma.userProgress.create({
      data: {
        userId,
        totalXP: 0,
        hearts: 5,
        streak: 0,
        currentDay: 1,
        lastHeartDecay: new Date(),
      }
    });
  }

  // Regenerate hearts: 1 heart every 4 hours
  if (progress.hearts < 5) {
    const msPerHeart = 4 * 60 * 60 * 1000;
    const elapsedMs = Date.now() - new Date(progress.lastHeartDecay).getTime();
    const heartsToAdd = Math.floor(elapsedMs / msPerHeart);

    if (heartsToAdd > 0) {
      const newHearts = Math.min(5, progress.hearts + heartsToAdd);
      const newDecayTime = newHearts === 5
        ? new Date()
        : new Date(new Date(progress.lastHeartDecay).getTime() + heartsToAdd * msPerHeart);

      progress = await prisma.userProgress.update({
        where: { userId },
        data: {
          hearts: newHearts,
          lastHeartDecay: newDecayTime,
        }
      });
    }
  }

  // Sync active track's currentDay to userProgress.currentDay
  const track = await getActiveTrack(userId);
  const trackProg = await getTrackProgress(userId, track);
  if (progress.currentDay !== trackProg.currentDay) {
    progress = await prisma.userProgress.update({
      where: { userId },
      data: { currentDay: trackProg.currentDay }
    });
  }
  
  return progress;
});

export async function ensureUserProgress(userId: string) {
  let progress = await prisma.userProgress.findUnique({
    where: { userId }
  });
  
  if (!progress) {
    progress = await prisma.userProgress.create({
      data: {
        userId,
        totalXP: 0,
        hearts: 5,
        streak: 0,
        currentDay: 1,
        lastHeartDecay: new Date(),
      }
    });
  }

  // Regenerate hearts: 1 heart every 4 hours
  if (progress.hearts < 5) {
    const msPerHeart = 4 * 60 * 60 * 1000;
    const elapsedMs = Date.now() - new Date(progress.lastHeartDecay).getTime();
    const heartsToAdd = Math.floor(elapsedMs / msPerHeart);

    if (heartsToAdd > 0) {
      const newHearts = Math.min(5, progress.hearts + heartsToAdd);
      const newDecayTime = newHearts === 5
        ? new Date()
        : new Date(new Date(progress.lastHeartDecay).getTime() + heartsToAdd * msPerHeart);

      progress = await prisma.userProgress.update({
        where: { userId },
        data: {
          hearts: newHearts,
          lastHeartDecay: newDecayTime,
        }
      });
    }
  }

  const track = await getActiveTrack(userId);
  const trackProg = await getTrackProgress(userId, track);
  if (progress.currentDay !== trackProg.currentDay) {
    progress = await prisma.userProgress.update({
      where: { userId },
      data: { currentDay: trackProg.currentDay }
    });
  }
  
  return progress;
}

export async function syncCurrentDayToTrackProgress(userId: string, currentDay: number) {
  const track = await getActiveTrack(userId);
  await prisma.trackProgress.upsert({
    where: { userId_track: { userId, track } },
    update: { currentDay },
    create: { userId, track, currentDay }
  });
}

export async function switchActiveTrack(userId: string, track: Track) {
  // Update user's active track
  await prisma.user.update({
    where: { id: userId },
    data: { activeTrack: track }
  });

  // Get/Create progress for this track
  const trackProg = await getTrackProgress(userId, track);

  // Sync back to global UserProgress
  await prisma.userProgress.update({
    where: { userId },
    data: { currentDay: trackProg.currentDay }
  });
}
