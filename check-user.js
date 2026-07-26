const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const users = await prisma.user.findMany({
    include: {
      completedLessons: true,
      quizResults: true
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.dir(users, { depth: null });
  await prisma.$disconnect();
}
test();
