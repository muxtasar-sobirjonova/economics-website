const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Deleting quizzes > day 7");
  await prisma.quiz.deleteMany({
    where: { dayOrder: { gt: 7 } }
  });
  
  console.log("Deleting lessons > day 7");
  await prisma.lesson.deleteMany({
    where: { dayOrder: { gt: 7 } }
  });

  console.log("Done.");
  await prisma.$disconnect();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
