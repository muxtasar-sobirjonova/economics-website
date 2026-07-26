const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { dayOrder: 'asc' }
  });
  
  lessons.forEach(l => {
    const week = Math.floor((l.dayOrder - 1) / 7) + 1;
    console.log(`Week ${week} - Day ${l.dayOrder}: ${l.title}`);
  });
  
  await prisma.$disconnect();
}

run();
