import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { dayOrder: 'asc' },
    select: {
      dayOrder: true,
      title: true,
      tag: true,
      conceptSummary: true,
      articleTitle: true,
    }
  });

  const quizzes = await prisma.quiz.findMany({
    orderBy: { dayOrder: 'asc' },
    select: {
      dayOrder: true,
      title: true,
      questions: {
        select: {
          id: true
        }
      }
    }
  });

  console.log("=== SEEDED LESSONS ===");
  lessons.forEach(l => {
    console.log(`Day ${l.dayOrder}: ${l.title} [Tag: ${l.tag}]`);
    console.log(`  Concept Summary: ${l.conceptSummary ? l.conceptSummary.substring(0, 60) + '...' : 'NONE'}`);
    console.log(`  Article Title: ${l.articleTitle || 'NONE'}`);
  });

  console.log("\n=== SEEDED QUIZZES ===");
  quizzes.forEach(q => {
    console.log(`Day ${q.dayOrder}: ${q.title} (${q.questions.length} questions)`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
