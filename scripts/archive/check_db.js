const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const u = await prisma.userProgress.findFirst();
  console.log(u);
  const currentDay = u ? u.currentDay : 1;
  const lessons = await prisma.lesson.findMany({where:{dayOrder:{gte:currentDay}}});
  const quizzes = await prisma.quiz.findMany({where:{dayOrder:{gte:currentDay}}});
  console.log('Lessons:', lessons.length, 'Quizzes:', quizzes.length);
}

check().finally(() => prisma.$disconnect());
