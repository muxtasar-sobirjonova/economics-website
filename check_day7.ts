import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const quiz = await prisma.quiz.findFirst({
    where: { dayOrder: 7, track: "BEHAVIORAL_ECONOMICS" },
    include: { questions: true }
  });
  if (quiz) {
    console.log("Day 7 questions count: " + quiz.questions.length);
  } else {
    console.log("Day 7 quiz not found!");
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
