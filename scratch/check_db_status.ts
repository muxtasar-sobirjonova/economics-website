import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { dayOrder: 'asc' }
  });

  const quizzes = await prisma.quiz.findMany({
    orderBy: { dayOrder: 'asc' },
    include: { _count: { select: { questions: true } } }
  });

  console.log("=== LESSONS IN DB ===");
  for (const l of lessons) {
    const hasContent = l.conceptText && l.conceptText.length > 50;
    console.log(`Day ${l.dayOrder}: ${l.title} (${l.tag}) - Content Populated: ${!!hasContent}`);
  }

  console.log("\n=== QUIZZES IN DB ===");
  for (const q of quizzes) {
    console.log(`Day ${q.dayOrder}: ${q.title} (${q.tag}) - Questions Count: ${q._count.questions}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
