const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.userProgress.updateMany({ data: { totalXP: 150, streak: 1 } });
  
  // also add xpEarned: 150 to the completed lesson
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const cl = await prisma.completedLesson.findFirst({ where: { date: yesterday } });
  if (cl) {
    await prisma.completedLesson.update({
      where: { id: cl.id },
      data: { xpEarned: 150 }
    });
  }
  
  console.log('Updated user XP to 150 (15 minutes) and streak to 1');
}
main().finally(() => prisma.$disconnect());
