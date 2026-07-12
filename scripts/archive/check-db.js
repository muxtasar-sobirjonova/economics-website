const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) return console.log("No user");
  
  const completed = await prisma.completedLesson.findMany({ where: { userId: user.id } });
  const quizzes = await prisma.quizResult.findMany({ where: { userId: user.id } });
  const daily = await prisma.dailyCompletion.findMany({ where: { userId: user.id } });
  const progress = await prisma.userProgress.findUnique({ where: { userId: user.id } });
  
  console.log("Completed Lessons:", completed.map(c => ({ id: c.id, date: c.date, xp: c.xpEarned })));
  console.log("Quizzes:", quizzes.map(q => ({ id: q.id, score: q.score, date: q.date })));
  console.log("Daily Completions:", daily.map(d => ({ date: d.dateString })));
  console.log("Progress:", progress);
}

main().finally(() => prisma.$disconnect());
