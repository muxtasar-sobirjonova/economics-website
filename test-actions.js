const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.findFirst({ where: { email: 'learner@econblog.com' } });
    const userId = user.id;
    const lessonId = "1";
    
    const realLesson = await prisma.lesson.findUnique({
      where: { dayOrder: parseInt(lessonId) }
    });
    const dbLessonId = realLesson?.id || null;
    console.log("Real Lesson ID:", dbLessonId);

    const todayDate = new Date();
    todayDate.setUTCHours(0,0,0,0);
    
    await prisma.agendaCompletion.create({
      data: { userId, itemType: 'ARTICLE', normalizedDate: todayDate, lessonId: dbLessonId }
    });
    console.log("agenda.ts action succeeded!");
    
    try {
      await prisma.quizResult.upsert({
        where: { userId_quizId: { userId, quizId: "1" } },
        update: { score: 10, date: todayDate, xpEarned: 25,  },
        create: { userId, quizId: "1", score: 10, date: todayDate, xpEarned: 25,  }
      });
      console.log("quiz.ts action succeeded!");
    } catch (e) {
      console.error("quiz.ts action failed:", e.message);
    }
    
  } catch(e) {
    console.error("agenda.ts action failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
