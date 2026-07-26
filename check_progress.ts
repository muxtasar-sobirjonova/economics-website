import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'learner@econblog.com' } });
  if (!user) {
    console.log("User not found");
    return;
  }

  const cls = await prisma.completedLesson.findMany({ where: { userId: user.id } });
  const qrs = await prisma.quizResult.findMany({ where: { userId: user.id } });

  console.log("Completed Lessons:");
  console.dir(cls, { depth: null });
  console.log("Quiz Results:");
  console.dir(qrs, { depth: null });
}

main().finally(() => prisma.$disconnect());
