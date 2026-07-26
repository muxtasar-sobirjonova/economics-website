import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const l = await prisma.lesson.findUnique({
    where: { track_dayOrder: { track: 'DEVELOPMENT_ECONOMICS', dayOrder: 22 } }
  });
  console.log(l);
}

main().finally(async () => {
  await prisma.$disconnect();
});
