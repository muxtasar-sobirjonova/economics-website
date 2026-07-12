const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cl = await prisma.completedLesson.findFirst({ where: { date: '2026-07-06' } });
  if (cl) {
    await prisma.completedLesson.update({
      where: { id: cl.id },
      data: { xpEarned: 150 }
    });
    console.log('Fixed xpEarned in CompletedLesson to 150');
  }
}

main().finally(() => prisma.$disconnect());
