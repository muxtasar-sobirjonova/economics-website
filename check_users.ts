import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      completedLessons: true,
      quizResults: true,
      agendaHistory: {
        include: {
          lesson: { select: { dayOrder: true } },
          quiz: { select: { dayOrder: true } },
        }
      }
    }
  });
  console.dir(users, { depth: null });
}

main().finally(() => prisma.$disconnect());
