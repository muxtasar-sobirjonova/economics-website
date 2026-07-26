import { Track } from "@prisma/client";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const week6Lessons = [
  { dayOrder: 36, title: "Expected Value in Founder Decisions", tag: "Week 6" },
  { dayOrder: 37, title: "Pivoting", tag: "Week 6" },
  { dayOrder: 38, title: "Learning from Failure", tag: "Week 6" },
  { dayOrder: 39, title: "Staged Investment & Reversibility", tag: "Week 6" },
  { dayOrder: 40, title: "Disruptive vs. Sustaining Innovation", tag: "Week 6" },
  { dayOrder: 41, title: "Innovation Ecosystems", tag: "Week 6" },
];

const week6Quizzes = [
  { dayOrder: 36, title: "Quiz for Day 36", tag: "Week 6" },
  { dayOrder: 37, title: "Quiz for Day 37", tag: "Week 6" },
  { dayOrder: 38, title: "Quiz for Day 38", tag: "Week 6" },
  { dayOrder: 39, title: "Quiz for Day 39", tag: "Week 6" },
  { dayOrder: 40, title: "Quiz for Day 40", tag: "Week 6" },
  { dayOrder: 41, title: "Quiz for Day 41", tag: "Week 6" },
  { dayOrder: 42, title: "Quiz & Review", tag: "Week 6 Review" },
];

async function main() {
  console.log(`Adding placeholders for Week 6...`);

  // 1. Create Lessons
  for (const day of week6Lessons) {
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
  for (const q of week6Quizzes) {
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

  console.log(`Week 6 placeholders added successfully!`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
