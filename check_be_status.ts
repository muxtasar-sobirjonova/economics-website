import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const track = "BEHAVIORAL_ECONOMICS";
  const lessons = await prisma.lesson.findMany({
    where: { track },
    select: { dayOrder: true, title: true },
    orderBy: { dayOrder: 'asc' }
  });
  
  console.log("Behavioral Economics has " + lessons.length + " lessons populated:");
  for (const l of lessons) {
    if (l.title === "Placeholder Lesson") {
      console.log("Day " + l.dayOrder + " is a placeholder.");
    } else {
      console.log("Day " + l.dayOrder + " is done: " + l.title);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
