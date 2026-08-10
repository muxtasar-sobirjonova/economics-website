import { prisma } from "@/lib/prisma";

export class XpService {
  static async awardXp(userId: string, xpAmount: number) {
    if (xpAmount <= 0) return null;

    return await prisma.userProgress.update({
      where: { userId },
      data: { totalXP: { increment: xpAmount } }
    });
  }
}
