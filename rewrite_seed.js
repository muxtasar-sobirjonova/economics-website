const fs = require('fs');
const path = require('path');

const content = `/**
 * Seed script — populates the database with:
 *  - A default "mock" user
 *  - All 14 lessons from lib/data.ts
 *  - All 14 matching quizzes
 *  - Two sample incorrect quiz attempts (so Review Mistakes is visible on first load)
 */
import { PrismaClient, Prisma } from '@prisma/client';
import { LESSON_1_QUESTIONS } from '../lib/quizzes/lesson1';
import { LESSON_2_QUESTIONS } from '../lib/quizzes/lesson2';
import { LESSON_3_QUESTIONS } from '../lib/quizzes/lesson3';
import { LESSON_4_QUESTIONS } from '../lib/quizzes/lesson4';
import { LESSON_5_QUESTIONS } from '../lib/quizzes/lesson5';
import { LESSON_6_QUESTIONS } from '../lib/quizzes/lesson6';
import { CHAPTER_1_QUIZ_QUESTIONS } from '../lib/quizzes/chapter1';
import { LESSON_8_QUESTIONS } from '../lib/quizzes/lesson8';
import { LESSON_9_QUESTIONS } from '../lib/quizzes/lesson9';
import { LESSON_10_QUESTIONS } from '../lib/quizzes/lesson10';
import { LESSON_11_QUESTIONS } from '../lib/quizzes/lesson11';
import { LESSON_12_QUESTIONS } from '../lib/quizzes/lesson12';
import { LESSON_13_QUESTIONS } from '../lib/quizzes/lesson13';
import { CHAPTER_2_QUIZ_QUESTIONS } from '../lib/quizzes/chapter2';

const prisma = new PrismaClient();

const questionsByLesson: { [key: number]: any[] } = {
  1: LESSON_1_QUESTIONS,
  2: LESSON_2_QUESTIONS,
  3: LESSON_3_QUESTIONS,
  4: LESSON_4_QUESTIONS,
  5: LESSON_5_QUESTIONS,
  6: LESSON_6_QUESTIONS,
  7: CHAPTER_1_QUIZ_QUESTIONS,
  8: LESSON_8_QUESTIONS,
  9: LESSON_9_QUESTIONS,
  10: LESSON_10_QUESTIONS,
  11: LESSON_11_QUESTIONS,
  12: LESSON_12_QUESTIONS,
  13: LESSON_13_QUESTIONS,
  14: CHAPTER_2_QUIZ_QUESTIONS,
};

const LESSONS: Prisma.LessonCreateInput[] = [
  { title: 'What Is Entrepreneurship Economics?', tag: 'ECON', timeEstimate: 10, dayOrder: 1 },
  { title: 'Why Do Entrepreneurs Exist?', tag: 'ECON', timeEstimate: 10, dayOrder: 2 },
  { title: 'Why Customers Buy', tag: 'ECON', timeEstimate: 10, dayOrder: 3 },
  { title: 'How Businesses Create and Capture Value', tag: 'ECON', timeEstimate: 10, dayOrder: 4 },
  { title: 'Profit, Incentives, and Decision-Making', tag: 'ECON', timeEstimate: 10, dayOrder: 5 },
  { title: "Why Some Businesses Scale While Others Don't", tag: 'ECON', timeEstimate: 10, dayOrder: 6 },
  { title: 'The Concept of Scarcity in Business', tag: 'ECON', timeEstimate: 10, dayOrder: 8 },
  { title: 'Choosing What to Build: Trade-Offs', tag: 'ECON', timeEstimate: 10, dayOrder: 9 },
  { title: 'Calculating Your Personal Opportunity Cost', tag: 'ECON', timeEstimate: 10, dayOrder: 10 },
  { title: 'Capital Scarcity: Budgeting Limited Cash', tag: 'ECON', timeEstimate: 10, dayOrder: 11 },
  { title: "Time Scarcity: The Entrepreneur's Only True Asset", tag: 'ECON', timeEstimate: 10, dayOrder: 12 },
  { title: 'Sunk Costs vs. Future Costs', tag: 'ECON', timeEstimate: 10, dayOrder: 13 },
];

const QUIZZES: Prisma.QuizCreateInput[] = [
  { title: 'Quiz: What Is Entrepreneurship Economics?', tag: 'ECON', timeEstimate: 5, dayOrder: 1 },
  { title: 'Quiz: Why Do Entrepreneurs Exist?', tag: 'ECON', timeEstimate: 5, dayOrder: 2 },
  { title: 'Quiz: Why Customers Buy', tag: 'ECON', timeEstimate: 5, dayOrder: 3 },
  { title: 'Quiz: How Businesses Create and Capture Value', tag: 'ECON', timeEstimate: 5, dayOrder: 4 },
  { title: 'Quiz: Profit, Incentives, and Decision-Making', tag: 'ECON', timeEstimate: 5, dayOrder: 5 },
  { title: "Quiz: Why Some Businesses Scale While Others Don't", tag: 'ECON', timeEstimate: 5, dayOrder: 6 },
  { title: 'Chapter 1 Review Quiz', tag: 'ECON', timeEstimate: 15, dayOrder: 7 },
  { title: 'Quiz: The Concept of Scarcity in Business', tag: 'ECON', timeEstimate: 5, dayOrder: 8 },
  { title: 'Quiz: Choosing What to Build: Trade-Offs', tag: 'ECON', timeEstimate: 5, dayOrder: 9 },
  { title: 'Quiz: Calculating Your Personal Opportunity Cost', tag: 'ECON', timeEstimate: 5, dayOrder: 10 },
  { title: 'Quiz: Capital Scarcity: Budgeting Limited Cash', tag: 'ECON', timeEstimate: 5, dayOrder: 11 },
  { title: "Quiz: Time Scarcity: The Entrepreneur's Only True Asset", tag: 'ECON', timeEstimate: 5, dayOrder: 12 },
  { title: 'Quiz: Sunk Costs vs. Future Costs', tag: 'ECON', timeEstimate: 5, dayOrder: 13 },
  { title: 'Chapter 2 Review Quiz', tag: 'ECON', timeEstimate: 15, dayOrder: 14 },
];

async function main() {
  console.log('Starting seed...');

  // Upsert user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password', // in a real app, hash this!
      role: 'USER',
    },
  });
  console.log(\`✅ User: \${user.email}\`);

  // Upsert lessons
  const { MOCK_CONTENT } = require('../lib/mockContent');

  for (const lesson of LESSONS) {
    const mockContent = MOCK_CONTENT[lesson.dayOrder];
    
    let lessonData = { ...lesson };
    if (mockContent) {
      lessonData = {
        ...lessonData,
        conceptText: mockContent.concept?.text,
        conceptSummary: mockContent.concept?.summary,
        conceptTakeaways: mockContent.concept?.takeaways ? (mockContent.concept.takeaways as Prisma.InputJsonValue) : Prisma.JsonNull,
        articleTitle: mockContent.article?.title,
        articleText: mockContent.article?.text,
        articleSummary: mockContent.article?.summary,
        articleTakeaways: mockContent.article?.takeaways ? (mockContent.article.takeaways as Prisma.InputJsonValue) : Prisma.JsonNull,
      };
    }

    await prisma.lesson.upsert({
      where: { dayOrder: lesson.dayOrder },
      update: lessonData,
      create: lessonData,
    });
  }
  console.log(\`✅ \${LESSONS.length} lessons seeded\`);

  // Upsert quizzes
  for (const quiz of QUIZZES) {
    const createdQuiz = await prisma.quiz.upsert({
      where: { dayOrder: quiz.dayOrder },
      update: quiz,
      create: quiz,
    });
    
    // Find matching questions from data
    const questions = questionsByLesson[quiz.dayOrder];
    if (questions && questions.length > 0) {
      // Clear existing questions for this quiz
      await prisma.quizQuestion.deleteMany({
        where: { quizId: createdQuiz.id }
      });
      
      // Create new questions
      const questionsData = questions.map((q: any, index: number) => ({
        quizId: createdQuiz.id,
        questionText: q.questionText || q.text,
        options: q.options,
        correctAnswer: typeof q.correctAnswer === 'number' ? q.options[q.correctAnswer] : String(q.correctAnswer),
        explanation: q.explanation || null,
        order: index
      }));
      
      await prisma.quizQuestion.createMany({
        data: questionsData
      });
    }
  }
  console.log(\`✅ \${QUIZZES.length} quizzes seeded\`);

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
`;

fs.writeFileSync(path.join(__dirname, 'prisma', 'seed.ts'), content);
console.log('Rewrote seed.ts directly.');
