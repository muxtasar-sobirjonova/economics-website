import { Track } from "@prisma/client";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const week3Days = [
  { dayOrder: 15, title: "Knightian Risk vs. Uncertainty", tag: "Week 3" },
  { dayOrder: 16, title: "Barriers to Entry", tag: "Week 3" },
  { dayOrder: 17, title: "Information Asymmetry", tag: "Week 3" },
  { dayOrder: 18, title: "Arbitrage", tag: "Week 3" },
  { dayOrder: 19, title: "Market Gaps & Unmet Needs", tag: "Week 3" },
  { dayOrder: 20, title: "First-Mover Advantage", tag: "Week 3" },
  { dayOrder: 21, title: "Quiz & Review", tag: "Week 3 Review" },
];

async function main() {
  console.log(`Adding placeholders for Week 3...`);

  for (const day of week3Days) {
    // 1. Find or create lesson
    let lesson = await prisma.lesson.findFirst({
      where: { dayOrder: day.dayOrder },
    });

    if (!lesson) {
      lesson = await prisma.lesson.create({
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
        data: {
          title: day.title,
          tag: day.tag,
        }
      });
      console.log(`Updated lesson for day ${day.dayOrder}`);
    }

    // Create quiz placeholder if not exists
    let quiz = await prisma.quiz.findFirst({
      where: { dayOrder: day.dayOrder },
    });

    if (!quiz) {
      await prisma.quiz.create({
        data: {
          dayOrder: day.dayOrder,
          title: `Quiz for Day ${day.dayOrder}`,
          tag: day.tag,
          timeEstimate: 10, track: Track.ENTREPRENEURSHIP_ECONOMICS
        }
      });
      console.log(`Created quiz for day ${day.dayOrder}`);
    }
  }

  console.log(`Week 3 placeholders added successfully!`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
