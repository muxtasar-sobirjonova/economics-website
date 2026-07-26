import { Track } from "@prisma/client";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const week5Lessons = [
  { dayOrder: 29, title: "Platform Business Models", tag: "Week 5" },
  { dayOrder: 30, title: "Bootstrapping", tag: "Week 5" },
  { dayOrder: 31, title: "Debt vs. Equity Financing", tag: "Week 5" },
  { dayOrder: 32, title: "Venture Capital Model", tag: "Week 5" },
  { dayOrder: 33, title: "Angel Investing", tag: "Week 5" },
  { dayOrder: 34, title: "Valuation & Overvaluation Risk", tag: "Week 5" },
];

const week5Quizzes = [
  { dayOrder: 29, title: "Quiz for Day 29", tag: "Week 5" },
  { dayOrder: 30, title: "Quiz for Day 30", tag: "Week 5" },
  { dayOrder: 31, title: "Quiz for Day 31", tag: "Week 5" },
  { dayOrder: 32, title: "Quiz for Day 32", tag: "Week 5" },
  { dayOrder: 33, title: "Quiz for Day 33", tag: "Week 5" },
  { dayOrder: 34, title: "Quiz for Day 34", tag: "Week 5" },
  { dayOrder: 35, title: "Quiz & Review", tag: "Week 5 Review" },
];

async function main() {
  console.log(`Adding placeholders for Week 5...`);

  // 1. Create Lessons
  for (const day of week5Lessons) {
    let lesson = await prisma.lesson.findFirst({
      where: { dayOrder: day.dayOrder },
    });

    if (!lesson) {
      await prisma.lesson.create({
        data: {
          dayOrder: day.dayOrder,
          title: day.title,
          conceptText: null,
          conceptSummary: null,
          conceptTakeaways: Prisma.DbNull,
          articleTitle: null,
          articleText: null,
          articleSummary: null,
          articleTakeaways: Prisma.DbNull,
          tag: day.tag,
          timeEstimate: 10, track: Track.ENTREPRENEURSHIP_ECONOMICS
        }
      });
      console.log(`Created lesson for day ${day.dayOrder}`);
    } else {
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { title: day.title, tag: day.tag }
      });
      console.log(`Updated lesson for day ${day.dayOrder}`);
    }
  }

  // 2. Create Quizzes
  for (const q of week5Quizzes) {
    let quiz = await prisma.quiz.findFirst({
      where: { dayOrder: q.dayOrder },
    });

    if (!quiz) {
      await prisma.quiz.create({
        data: {
          dayOrder: q.dayOrder,
          title: q.title,
          tag: q.tag,
          timeEstimate: 10, track: Track.ENTREPRENEURSHIP_ECONOMICS
        }
      });
      console.log(`Created quiz for day ${q.dayOrder}`);
    } else {
       await prisma.quiz.update({
         where: { id: quiz.id },
         data: { title: q.title, tag: q.tag }
       });
       console.log(`Updated quiz for day ${q.dayOrder}`);
    }
  }

  console.log(`Week 5 placeholders added successfully!`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
