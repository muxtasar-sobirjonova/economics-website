import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  await prisma.lesson.deleteMany({where: {dayOrder: 7}});
  await prisma.quiz.deleteMany({where: {dayOrder: 7}});
  console.log('Deleted day 7');
}

run().finally(() => prisma.$disconnect());
