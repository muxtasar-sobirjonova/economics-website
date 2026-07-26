import { Track } from "@prisma/client";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const WEEK_2_LESSONS = [
  { dayOrder: 8, title: 'The Concept of Scarcity in Business' },
  { dayOrder: 9, title: 'Choosing What to Build: Trade-Offs' },
  { dayOrder: 10, title: 'Calculating Your Personal Opportunity Cost' },
  { dayOrder: 11, title: 'Capital Scarcity: Budgeting Limited Cash' },
  { dayOrder: 12, title: 'Time Scarcity: The Entrepreneur\'s Only True Asset' },
  { dayOrder: 13, title: 'Sunk Costs vs. Future Costs' },
];

async function main() {
  console.log("Moving Chapter 1 Quiz to Day 7...");
  const oldCh1Quiz = await prisma.quiz.findFirst({ where: { dayOrder: 8 } });
  if (oldCh1Quiz) {
    await prisma.quiz.update({
      where: { id: oldCh1Quiz.id },
      data: { dayOrder: 7, title: 'Chapter 1 Quiz' }
    });
  }

  console.log("Cleaning up Days 8-14...");
  for (let i = 8; i <= 14; i++) {
    const oldQuiz = await prisma.quiz.findFirst({ where: { dayOrder: i }, include: { questions: true } });
    if (oldQuiz) {
      for (const q of oldQuiz.questions) await prisma.quizQuestion.delete({ where: { id: q.id } });
      await prisma.agendaCompletion.deleteMany({ where: { quizId: oldQuiz.id } });
      await prisma.quizAttempt.deleteMany({ where: { quizId: oldQuiz.id } });
      await prisma.quiz.delete({ where: { id: oldQuiz.id } });
    }

    const oldLesson = await prisma.lesson.findFirst({ where: { dayOrder: i }, include: { articles: true, concepts: true } });
    if (oldLesson) {
      for (const article of oldLesson.articles) await prisma.article.delete({ where: { id: article.id } });
      for (const concept of oldLesson.concepts) await prisma.concept.delete({ where: { id: concept.id } });
      await prisma.agendaCompletion.deleteMany({ where: { lessonId: oldLesson.id } });
      await prisma.lesson.delete({ where: { id: oldLesson.id } });
    }
  }

  console.log("Seeding Week 2 Lessons...");
  for (const l of WEEK_2_LESSONS) {
    const lesson = await prisma.lesson.create({
      data: {
        title: l.title,
        tag: 'ECON',
        timeEstimate: 10, track: Track.ENTREPRENEURSHIP_ECONOMICS,
        dayOrder: l.dayOrder,
        conceptText: '<p>Content coming soon...</p>',
        articleTitle: l.title,
        articleText: '<p>Content coming soon...</p>',
      }
    });
    await prisma.concept.create({ data: { lessonId: lesson.id } });
    await prisma.article.create({ data: { lessonId: lesson.id } });

    await prisma.quiz.create({
      data: {
        title: 'Quiz: ' + l.title,
        tag: 'ECON',
        timeEstimate: 5, track: Track.ENTREPRENEURSHIP_ECONOMICS,
        dayOrder: l.dayOrder,
      }
    });
  }

  console.log("Seeding Chapter 2 Quiz...");
  await prisma.quiz.create({
    data: {
      title: 'Chapter 2 Quiz & Review',
      tag: 'ECON',
      timeEstimate: 20, track: Track.ENTREPRENEURSHIP_ECONOMICS,
      dayOrder: 14,
    }
  });

  console.log("Successfully seeded Week 2 placeholders.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
