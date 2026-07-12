const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cl = await prisma.completedLesson.findFirst({ where: { date: '2026-07-06' } });
  if (cl) {
    await prisma.completedLesson.update({
      where: { id: cl.id },
      data: { date: '2026-07-05' }
    });
    console.log('Moved completed lesson from 07-06 to 07-05 to match Monday offset in UI');
  }

  const qr = await prisma.quizResult.findFirst({ where: { score: 6 } });
  if (qr) {
    await prisma.quizResult.update({
      where: { id: qr.id },
      data: { date: '2026-07-05' }
    });
  }
}

main().finally(() => prisma.$disconnect());
