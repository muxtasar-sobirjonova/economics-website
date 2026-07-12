import { prisma } from "@/lib/prisma";
import { cache } from "react";

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
      }
    });
  }
  
  return progress;
});

export async function ensureUserProgress(userId: string) {
  // Alias for backward compatibility if used in mutations
  return getUserProgress(userId);
}
