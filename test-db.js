const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const quizzes = await prisma.quiz.findMany();
  console.log(quizzes);
  const lessons = await prisma.lesson.findMany();
  console.log(lessons);
  await prisma.$disconnect();
}
test();
