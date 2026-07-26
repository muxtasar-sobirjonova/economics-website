import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lessons = await prisma.lesson.findMany({
    where: { track: 'DEVELOPMENT_ECONOMICS', dayOrder: { in: [1, 2, 3] } },
    select: { dayOrder: true, title: true, conceptTakeaways: true, articleTakeaways: true },
    orderBy: { dayOrder: 'asc' }
  });
  
  console.log(JSON.stringify(lessons, null, 2));
}

main().finally(async () => {
  await prisma.$disconnect();
});
