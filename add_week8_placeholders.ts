import { Track } from "@prisma/client";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const week8Lessons = [
  { dayOrder: 50, title: "Institutions & Entrepreneurship Rates", tag: "Week 8" },
  { dayOrder: 51, title: "Ease of Doing Business & Regulation", tag: "Week 8" },
  { dayOrder: 52, title: "Access to Capital & Ecosystem Density", tag: "Week 8" },
  { dayOrder: 53, title: "Government-Backed Innovation Zones", tag: "Week 8" },
  { dayOrder: 54, title: "Regional Ecosystem Building", tag: "Week 8" },
  { dayOrder: 55, title: "Comparing Entrepreneurial Ecosystems", tag: "Week 8" },
];

const week8Quizzes = [
  { dayOrder: 50, title: "Quiz for Day 50", tag: "Week 8" },
  { dayOrder: 51, title: "Quiz for Day 51", tag: "Week 8" },
  { dayOrder: 52, title: "Quiz for Day 52", tag: "Week 8" },
  { dayOrder: 53, title: "Quiz for Day 53", tag: "Week 8" },
  { dayOrder: 54, title: "Quiz for Day 54", tag: "Week 8" },
  { dayOrder: 55, title: "Quiz for Day 55", tag: "Week 8" },
  { dayOrder: 56, title: "Final Quiz & Capstone Review", tag: "Week 8 Review" },
];

async function main() {
  console.log(`Adding placeholders for Week 8...`);

  // 1. Create Lessons
  for (const day of week8Lessons) {
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
  for (const q of week8Quizzes) {
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

  console.log(`Week 8 placeholders added successfully!`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
