import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const track = "DEVELOPMENT_ECONOMICS";
  const lessons = await prisma.lesson.findMany({
    where: { track },
    select: { dayOrder: true, title: true, articleText: true, conceptText: true },
    orderBy: { dayOrder: 'asc' }
  });
  
  const populatedLessons = [];
  const emptyLessons = [];
  
  for (const l of lessons) {
    if (l.title === "Placeholder Lesson" || !l.articleText || l.articleText.length < 50 || !l.conceptText || l.conceptText.length < 50) {
      emptyLessons.push(l.dayOrder);
    } else {
      populatedLessons.push(l.dayOrder);
    }
  }
  
  console.log("Development Economics has " + populatedLessons.length + " fully populated lessons:");
  console.log("Fully populated days: " + populatedLessons.join(", "));
  console.log("Empty or placeholder days: " + emptyLessons.join(", "));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
