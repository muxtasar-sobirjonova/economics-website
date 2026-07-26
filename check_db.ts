import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lessons = await prisma.lesson.findMany({
    where: { track: 'DEVELOPMENT_ECONOMICS' },
    select: { dayOrder: true, title: true },
    orderBy: { dayOrder: 'asc' }
  });
  console.log('Existing Dev Econ lessons:', lessons.map(l => l.dayOrder));
  
  const quizzes = await prisma.quiz.findMany({
    where: { track: 'DEVELOPMENT_ECONOMICS' },
    select: { dayOrder: true, title: true },
    orderBy: { dayOrder: 'asc' }
  });
  console.log('Existing Dev Econ quizzes:', quizzes.map(q => q.dayOrder));
}

main().finally(async () => {
  await prisma.$disconnect();
});
