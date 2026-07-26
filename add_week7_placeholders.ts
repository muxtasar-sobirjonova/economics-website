import { Track } from "@prisma/client";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const week7Lessons = [
  { dayOrder: 43, title: "Diffusion of Innovation", tag: "Week 7" },
  { dayOrder: 44, title: "Economies of Scale", tag: "Week 7" },
  { dayOrder: 45, title: "Organizational Scaling & Hiring Economics", tag: "Week 7" },
  { dayOrder: 46, title: "Supply Chain Economics at Scale", tag: "Week 7" },
  { dayOrder: 47, title: "Growth vs. Profitability Tradeoff", tag: "Week 7" },
  { dayOrder: 48, title: "Internationalization Strategy", tag: "Week 7" },
];

const week7Quizzes = [
  { dayOrder: 43, title: "Quiz for Day 43", tag: "Week 7" },
  { dayOrder: 44, title: "Quiz for Day 44", tag: "Week 7" },
  { dayOrder: 45, title: "Quiz for Day 45", tag: "Week 7" },
  { dayOrder: 46, title: "Quiz for Day 46", tag: "Week 7" },
  { dayOrder: 47, title: "Quiz for Day 47", tag: "Week 7" },
  { dayOrder: 48, title: "Quiz for Day 48", tag: "Week 7" },
  { dayOrder: 49, title: "Quiz & Review", tag: "Week 7 Review" },
];

async function main() {
  console.log(`Adding placeholders for Week 7...`);

  // 1. Create Lessons
  for (const day of week7Lessons) {
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
  for (const q of week7Quizzes) {
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

  console.log(`Week 7 placeholders added successfully!`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
