import { Track } from "@prisma/client";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const week4Lessons = [
  { dayOrder: 22, title: "Network Effects as Opportunity", tag: "Week 4" },
  { dayOrder: 23, title: "Value Proposition Design", tag: "Week 4" },
  { dayOrder: 24, title: "Cost-Plus vs. Value-Based Pricing", tag: "Week 4" },
  { dayOrder: 25, title: "Fixed vs. Variable Costs", tag: "Week 4" },
  { dayOrder: 26, title: "Unit Economics", tag: "Week 4" },
  { dayOrder: 27, title: "Break-Even Analysis", tag: "Week 4" },
];

const week4Quizzes = [
  { dayOrder: 22, title: "Quiz for Day 22", tag: "Week 4" },
  { dayOrder: 23, title: "Quiz for Day 23", tag: "Week 4" },
  { dayOrder: 24, title: "Quiz for Day 24", tag: "Week 4" },
  { dayOrder: 25, title: "Quiz for Day 25", tag: "Week 4" },
  { dayOrder: 26, title: "Quiz for Day 26", tag: "Week 4" },
  { dayOrder: 27, title: "Quiz for Day 27", tag: "Week 4" },
  { dayOrder: 28, title: "Quiz & Review", tag: "Week 4 Review" },
];

async function main() {
  console.log(`Adding placeholders for Week 4...`);

  // 1. Create Lessons
  for (const day of week4Lessons) {
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
  for (const q of week4Quizzes) {
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

  console.log(`Week 4 placeholders added successfully!`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
