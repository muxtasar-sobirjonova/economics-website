import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Fetching all users...");
  const users = await prisma.user.findMany({ select: { id: true } });
  
  for (const user of users) {
    const userId = user.id;
    const quizResults = await prisma.quizResult.findMany({ where: { userId } });
    
    let totalXp = 0;
    const trackXpMap = {};
    
    for (const qr of quizResults) {
      totalXp += qr.xpEarned;
      if (!trackXpMap[qr.track]) {
        trackXpMap[qr.track] = 0;
      }
      trackXpMap[qr.track] += qr.xpEarned;
    }
    
    console.log("User " + userId + " has " + totalXp + " XP from quizzes.");
    
    const userProgress = await prisma.userProgress.findUnique({ where: { userId } });
    if (userProgress) {
      await prisma.userProgress.update({
        where: { userId },
        data: { totalXP: totalXp }
      });
    }
    
    const trackProgresses = await prisma.trackProgress.findMany({ where: { userId } });
    for (const tp of trackProgresses) {
      const correctTrackXp = trackXpMap[tp.track] || 0;
      await prisma.trackProgress.update({
        where: { userId_track: { userId: tp.userId, track: tp.track } },
        data: { xp: correctTrackXp }
      });
    }
  }
  
  console.log("Done resetting XP.");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
