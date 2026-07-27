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


  
  return progress;
}

export async function syncCurrentDayToTrackProgress(userId: string, currentDay: number) {
  const track = await getActiveTrack(userId);
  
  await prisma.$transaction([
    prisma.trackProgress.upsert({
      where: { userId_track: { userId, track } },
      update: { currentDay },
      create: { userId, track, currentDay }
    }),
    prisma.userProgress.update({
      where: { userId },
      data: { currentDay }
    })
  ]);
}

export async function switchActiveTrack(userId: string, track: Track) {
  await prisma.$transaction(async (tx) => {
    // Update user's active track
    await tx.user.update({
      where: { id: userId },
      data: { activeTrack: track }
    });

    // Get/Create progress for this track
    const trackProg = await tx.trackProgress.upsert({
      where: { userId_track: { userId, track } },
      update: {},
      create: { userId, track, currentDay: 1 }
    });

    // Sync back to global UserProgress
    await tx.userProgress.update({
      where: { userId },
      data: { currentDay: trackProg.currentDay }
    });
  });
}
