import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { dayOrder: 'asc' },
    select: {
      dayOrder: true,
      title: true,
      conceptText: true,
    }
  });

  console.log("=== SEEDED DAYS ===");
  lessons.forEach(l => {
    const status = l.conceptText ? "FULL CONTENT" : "PLACEHOLDER";
    console.log(`Day ${String(l.dayOrder).padStart(2, '0')}: ${l.title.padEnd(35, ' ')} -> ${status}`);
  });
}

main().finally(() => prisma.$disconnect());
