import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const track = "BEHAVIORAL_ECONOMICS";
  const lessons = await prisma.lesson.findMany({
    where: { track },
    select: { dayOrder: true, title: true, articleText: true, conceptText: true },
    orderBy: { dayOrder: 'asc' }
  });
  
  const emptyLessons = [];
  for (const l of lessons) {
    if (!l.articleText || l.articleText.length < 50 || !l.conceptText || l.conceptText.length < 50) {
      emptyLessons.push(l.dayOrder);
    }
  }
  
  console.log("Empty or partial lessons in BE: " + emptyLessons.join(", "));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
