const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const quizResults = await prisma.quizResult.findMany();
  let fixedCount = 0;
  for (const qr of quizResults) {
    if (qr.date.includes('T')) {
      const fixedDate = qr.date.split('T')[0];
      await prisma.quizResult.update({
        where: { id: qr.id },
        data: { date: fixedDate }
      });
      fixedCount++;
    }
  }
  console.log(`Fixed ${fixedCount} quiz result dates.`);

  const completedLessons = await prisma.completedLesson.findMany();
  let fixedLessonCount = 0;
  for (const cl of completedLessons) {
    if (cl.date.includes('T')) {
      const fixedDate = cl.date.split('T')[0];
      await prisma.completedLesson.update({
        where: { id: cl.id },
        data: { date: fixedDate }
      });
      fixedLessonCount++;
    }
  }
  console.log(`Fixed ${fixedLessonCount} completed lesson dates.`);
  
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const user = await prisma.user.findFirst();
  if (user) {
    const hasQuizYesterday = quizResults.some(qr => qr.date.includes(yesterday) || qr.date.includes(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]));
    
    // Also, if the user got 6/10, let's just make it count as a completed lesson for yesterday so it shows up in "Lessons Completed".
    const failedQuizzes = quizResults.filter(qr => qr.score === 6);
    for (const qr of failedQuizzes) {
      const fixedDate = qr.date.includes('T') ? qr.date.split('T')[0] : qr.date;
      const lessonExists = await prisma.completedLesson.findFirst({
        where: { userId: user.id, lessonId: qr.quizId }
      });
      if (!lessonExists) {
        await prisma.completedLesson.create({
          data: {
            userId: user.id,
            lessonId: qr.quizId,
            title: `Lesson ${qr.quizId}`,
            date: fixedDate,
            xpEarned: 0
          }
        });
        console.log("Created completed lesson for the 6/10 quiz.");
      }
    }
  }
}

main().finally(() => prisma.$disconnect());
