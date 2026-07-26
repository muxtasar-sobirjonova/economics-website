import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const track = "BEHAVIORAL_ECONOMICS";
  const quizzes = await prisma.quiz.findMany({
    where: { track },
    select: { dayOrder: true },
    orderBy: { dayOrder: 'asc' }
  });
  
  console.log("Behavioral Economics has quizzes for days:");
  console.log(quizzes.map(q => q.dayOrder).join(', '));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
