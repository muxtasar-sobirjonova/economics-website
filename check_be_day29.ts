import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lesson = await prisma.lesson.findUnique({
    where: {
      track_dayOrder: {
        track: "BEHAVIORAL_ECONOMICS",
        dayOrder: 29
      }
    }
  });
  console.log(lesson?.articleText?.substring(0, 500));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
