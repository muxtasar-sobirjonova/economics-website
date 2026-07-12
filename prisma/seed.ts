/**
 * Seed script — populates the database with:
 *  - A default "mock" user
 *  - All 7 lessons from lib/data.ts
 *  - All 7 matching quizzes
 *  - Two sample incorrect quiz attempts (so Review Mistakes is visible on first load)
 */

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const LESSONS: Prisma.LessonCreateInput[] = [
  { title: 'What Is Entrepreneurship Economics?', tag: 'ECON', timeEstimate: 10, dayOrder: 1 },
  { title: 'Why Do Entrepreneurs Exist?', tag: 'ECON', timeEstimate: 10, dayOrder: 2 },
  { title: 'Why Customers Buy', tag: 'ECON', timeEstimate: 10, dayOrder: 3 },
  { title: 'How Businesses Create and Capture Value', tag: 'ECON', timeEstimate: 10, dayOrder: 4 },
  { title: 'Profit, Incentives, and Decision-Making', tag: 'ECON', timeEstimate: 10, dayOrder: 5 },
  { title: "Why Some Businesses Scale While Others Don't", tag: 'ECON', timeEstimate: 10, dayOrder: 6 },
];

const QUIZZES: Prisma.QuizCreateInput[] = [
  { title: 'Quiz: What Is Entrepreneurship Economics?', tag: 'ECON', timeEstimate: 5, dayOrder: 1 },
  { title: 'Quiz: Why Do Entrepreneurs Exist?', tag: 'ECON', timeEstimate: 5, dayOrder: 2 },
  { title: 'Quiz: Why Customers Buy', tag: 'ECON', timeEstimate: 5, dayOrder: 3 },
  { title: 'Quiz: How Businesses Create and Capture Value', tag: 'ECON', timeEstimate: 5, dayOrder: 4 },
  { title: 'Quiz: Profit, Incentives, and Decision-Making', tag: 'ECON', timeEstimate: 5, dayOrder: 5 },
  { title: "Quiz: Why Some Businesses Scale While Others Don't", tag: 'ECON', timeEstimate: 5, dayOrder: 6 },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Upsert default user
  const user = await prisma.user.upsert({
    where: { email: 'learner@econblog.com' },
    update: {},
    create: {
      email: 'learner@econblog.com',
      name: 'Learner',
      progress: {
        create: {
          currentDay: 1,
          streak: 0,
        },
      },
    },
  });
  console.log(`✅ User: ${user.email}`);

  // Upsert lessons
  for (const lesson of LESSONS) {
    await prisma.lesson.upsert({
      where: { dayOrder: lesson.dayOrder },
      update: lesson,
      create: lesson,
    });
  }
  console.log(`✅ ${LESSONS.length} lessons seeded`);

  // Upsert quizzes
  for (const quiz of QUIZZES) {
    await prisma.quiz.upsert({
      where: { dayOrder: quiz.dayOrder },
      update: quiz,
      create: quiz,
    });
  }
  console.log(`✅ ${QUIZZES.length} quizzes seeded`);

  // Seed two sample incorrect quiz attempts + unreviewed mistakes
  const existingAttempts = await prisma.quizAttempt.count({ where: { userId: user.id } });
  if (existingAttempts === 0) {
    const attempt1 = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: 'quiz-1',
        questionId: 'q1',
        questionText: 'You are entering a market that is already "fully saturated". How do you find a competitive advantage?',
        isCorrect: false,
        userAnswer: 'By trying to outperform incumbents on product quality across every feature.',
        correctAnswer: 'By identifying a non-monetary resource (like time) that customers are currently "spending" or wasting that competitors have not bothered to optimize.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      },
    });
    await prisma.mistakeReview.create({
      data: { userId: user.id, quizAttemptId: attempt1.id, reviewed: false },
    });

    const attempt2 = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: 'quiz-1',
        questionId: 'q3',
        questionText: 'You must perform the same production task in both a high-labor-cost environment and a low-labor-cost environment. What is the logical economic decision?',
        isCorrect: false,
        userAnswer: 'Use the same production method in both to ensure brand consistency.',
        correctAnswer: 'Change your production process—using more machinery where labor is expensive and more labor where wages are low—to reach the same goal.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
    });
    await prisma.mistakeReview.create({
      data: { userId: user.id, quizAttemptId: attempt2.id, reviewed: false },
    });
    console.log('✅ 2 sample mistakes seeded');
  } else {
    console.log('ℹ️  Quiz attempts already exist, skipping sample mistakes');
  }

  console.log('🎉 Seeding complete!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
