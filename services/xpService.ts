import { prisma } from "@/lib/prisma";

export class XpService {
  static async awardXp(userId: string, xpAmount: number, source: string) {
    if (xpAmount <= 0) return null;

    // Enforce server time
    const todayDate = new Date();
    todayDate.setUTCHours(0,0,0,0);

    return await prisma.$transaction(async (tx) => {
      // 1. Update total XP
      const userProgress = await tx.userProgress.update({
        where: { userId },
        data: { totalXP: { increment: xpAmount } }
      });

      return userProgress;
    });
  }
}
