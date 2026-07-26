import { Track } from "@prisma/client";
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
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
import { DEV_ECON_CHAP1_QUESTIONS } from '../lib/quizzes/devEcon_chap1';
import { DEV_ECON_CHAP2_QUESTIONS } from '../lib/quizzes/devEcon_chap2';
import { DEV_ECON_CHAP3_QUESTIONS } from '../lib/quizzes/devEcon_chap3';
import { DEV_ECON_CHAP4_QUESTIONS } from '../lib/quizzes/devEcon_chap4';
import { DEV_ECON_CHAP5_QUESTIONS } from '../lib/quizzes/devEcon_chap5';
import { DEV_ECON_CHAP6_QUESTIONS } from '../lib/quizzes/devEcon_chap6';
import { DEV_ECON_CHAP7_QUESTIONS } from '../lib/quizzes/devEcon_chap7';
import { DEV_ECON_CHAP8_QUESTIONS } from '../lib/quizzes/devEcon_chap8';
import { DEV_ECON_LESSON1_QUESTIONS } from '../lib/quizzes/devEcon_lesson1';
import { DEV_ECON_LESSON2_QUESTIONS } from '../lib/quizzes/devEcon_lesson2';
import { DEV_ECON_LESSON3_QUESTIONS } from '../lib/quizzes/devEcon_lesson3';

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

const devQuestionsByLesson: { [key: number]: any[] } = {
  1: DEV_ECON_LESSON1_QUESTIONS,
  2: DEV_ECON_LESSON2_QUESTIONS,
  3: DEV_ECON_LESSON3_QUESTIONS,
  7: DEV_ECON_CHAP1_QUESTIONS,
  14: DEV_ECON_CHAP2_QUESTIONS,
  21: DEV_ECON_CHAP3_QUESTIONS,
  28: DEV_ECON_CHAP4_QUESTIONS,
  35: DEV_ECON_CHAP5_QUESTIONS,
  42: DEV_ECON_CHAP6_QUESTIONS,
  49: DEV_ECON_CHAP7_QUESTIONS,
  56: DEV_ECON_CHAP8_QUESTIONS,
};

const LESSONS: Prisma.LessonCreateInput[] = [
  { title: 'What Is Entrepreneurship Economics?', tag: 'ECON', timeEstimate: 10, dayOrder: 1,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Why Do Entrepreneurs Exist?', tag: 'ECON', timeEstimate: 10, dayOrder: 2,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Why Customers Buy', tag: 'ECON', timeEstimate: 10, dayOrder: 3,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'How Businesses Create and Capture Value', tag: 'ECON', timeEstimate: 10, dayOrder: 4,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Profit, Incentives, and Decision-Making', tag: 'ECON', timeEstimate: 10, dayOrder: 5,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Some Businesses Scale While Others Don't", tag: 'ECON', timeEstimate: 10, dayOrder: 6,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'The Concept of Scarcity in Business', tag: 'ECON', timeEstimate: 10, dayOrder: 8,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Choosing What to Build: Trade-Offs', tag: 'ECON', timeEstimate: 10, dayOrder: 9,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Calculating Your Personal Opportunity Cost', tag: 'ECON', timeEstimate: 10, dayOrder: 10,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Capital Scarcity: Budgeting Limited Cash', tag: 'ECON', timeEstimate: 10, dayOrder: 11,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Time Scarcity: The Entrepreneur's Only True Asset", tag: 'ECON', timeEstimate: 10, dayOrder: 12,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Sunk Costs vs. Future Costs', tag: 'ECON', timeEstimate: 10, dayOrder: 13,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
];

const QUIZZES: Prisma.QuizCreateInput[] = [
  { title: 'Quiz: What Is Entrepreneurship Economics?', tag: 'ECON', timeEstimate: 5, dayOrder: 1,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Quiz: Why Do Entrepreneurs Exist?', tag: 'ECON', timeEstimate: 5, dayOrder: 2,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Quiz: Why Customers Buy', tag: 'ECON', timeEstimate: 5, dayOrder: 3,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Quiz: How Businesses Create and Capture Value', tag: 'ECON', timeEstimate: 5, dayOrder: 4,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Quiz: Profit, Incentives, and Decision-Making', tag: 'ECON', timeEstimate: 5, dayOrder: 5,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Quiz: Why Some Businesses Scale While Others Don't", tag: 'ECON', timeEstimate: 5, dayOrder: 6,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Chapter 1 Review Quiz', tag: 'ECON', timeEstimate: 15, dayOrder: 7,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Quiz: The Concept of Scarcity in Business', tag: 'ECON', timeEstimate: 5, dayOrder: 8,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Quiz: Choosing What to Build: Trade-Offs', tag: 'ECON', timeEstimate: 5, dayOrder: 9,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Quiz: Calculating Your Personal Opportunity Cost', tag: 'ECON', timeEstimate: 5, dayOrder: 10,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Quiz: Capital Scarcity: Budgeting Limited Cash', tag: 'ECON', timeEstimate: 5, dayOrder: 11,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Quiz: Time Scarcity: The Entrepreneur's Only True Asset", tag: 'ECON', timeEstimate: 5, dayOrder: 12,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Quiz: Sunk Costs vs. Future Costs', tag: 'ECON', timeEstimate: 5, dayOrder: 13,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Chapter 2 Review Quiz', tag: 'ECON', timeEstimate: 15, dayOrder: 14,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
];

const DEV_ECON_LESSONS: Prisma.LessonCreateInput[] = [
  { title: "Growth Isn't Always Development", tag: 'ECON', timeEstimate: 10, dayOrder: 1,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Can Money Measure a Country's Success?", tag: 'ECON', timeEstimate: 10, dayOrder: 2,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "A Better Way to Measure Progress", tag: 'ECON', timeEstimate: 10, dayOrder: 3,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "What Does It Mean to Be Poor?", tag: 'ECON', timeEstimate: 10, dayOrder: 4,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How the Modern World Became Rich", tag: 'ECON', timeEstimate: 10, dayOrder: 5,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How Countries Move from Poverty to Prosperity", tag: 'ECON', timeEstimate: 10, dayOrder: 6,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How Economies Grow Over Time", tag: 'ECON', timeEstimate: 10, dayOrder: 8,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why More Investment Isn't Always Enough", tag: 'ECON', timeEstimate: 10, dayOrder: 9,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Can Poor Countries Catch Up?", tag: 'ECON', timeEstimate: 10, dayOrder: 10,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Some Countries Never Catch Up", tag: 'ECON', timeEstimate: 10, dayOrder: 11,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Innovation Creates Long-Term Growth", tag: 'ECON', timeEstimate: 10, dayOrder: 12,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "The Hidden Engine of Economic Growth", tag: 'ECON', timeEstimate: 10, dayOrder: 13,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How Unequal Is Too Unequal?", tag: 'ECON', timeEstimate: 10, dayOrder: 15,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Some People Stay Poor for Generations", tag: 'ECON', timeEstimate: 10, dayOrder: 16,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Can Growth Make Inequality Worse?", tag: 'ECON', timeEstimate: 10, dayOrder: 17,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Can Cash Really Reduce Poverty?", tag: 'ECON', timeEstimate: 10, dayOrder: 18,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Where You Live Matters", tag: 'ECON', timeEstimate: 10, dayOrder: 19,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Looking Beyond Income to Measure Poverty", tag: 'ECON', timeEstimate: 10, dayOrder: 20,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Education Is a Country's Greatest Investment", tag: 'ECON', timeEstimate: 10, dayOrder: 22,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How Better Health Builds Stronger Economies", tag: 'ECON', timeEstimate: 10, dayOrder: 23,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Population Changes Matter", tag: 'ECON', timeEstimate: 10, dayOrder: 24,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "When a Young Population Becomes an Economic Advantage", tag: 'ECON', timeEstimate: 10, dayOrder: 25,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Talented People Leave Their Home Countries", tag: 'ECON', timeEstimate: 10, dayOrder: 26,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Skills Can Matter More Than a University Degree", tag: 'ECON', timeEstimate: 10, dayOrder: 27,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Ownership Creates Opportunity", tag: 'ECON', timeEstimate: 10, dayOrder: 29,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Trust and Rules Build Wealth", tag: 'ECON', timeEstimate: 10, dayOrder: 30,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How Corruption Slows Economic Progress", tag: 'ECON', timeEstimate: 10, dayOrder: 31,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Can Institutions Matter More Than Geography?", tag: 'ECON', timeEstimate: 10, dayOrder: 32,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How Countries Transform Their Governments", tag: 'ECON', timeEstimate: 10, dayOrder: 33,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Stable Money Matters for Growth", tag: 'ECON', timeEstimate: 10, dayOrder: 34,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How Countries Find Their Place in the World Economy", tag: 'ECON', timeEstimate: 10, dayOrder: 36,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How Exports Can Transform an Economy", tag: 'ECON', timeEstimate: 10, dayOrder: 37,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Foreign Companies Invest in Some Countries", tag: 'ECON', timeEstimate: 10, dayOrder: 38,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Natural Resources Can Be a Blessing or a Curse", tag: 'ECON', timeEstimate: 10, dayOrder: 39,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Should Countries Open Their Economies?", tag: 'ECON', timeEstimate: 10, dayOrder: 40,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How Countries Grow Together Through Trade", tag: 'ECON', timeEstimate: 10, dayOrder: 41,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "From Fishing Village to Technology Hub", tag: 'ECON', timeEstimate: 10, dayOrder: 43,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Cities Become Engines of Growth", tag: 'ECON', timeEstimate: 10, dayOrder: 44,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "The Economy You Don't Always See", tag: 'ECON', timeEstimate: 10, dayOrder: 45,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Some Workers Are Left Behind", tag: 'ECON', timeEstimate: 10, dayOrder: 46,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How Manufacturing Creates Prosperity", tag: 'ECON', timeEstimate: 10, dayOrder: 47,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How Services Drive Modern Economies", tag: 'ECON', timeEstimate: 10, dayOrder: 48,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Can Foreign Aid Really Change Countries?", tag: 'ECON', timeEstimate: 10, dayOrder: 50,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How People Abroad Support Their Home Economies", tag: 'ECON', timeEstimate: 10, dayOrder: 51,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Can Small Loans Change People's Lives?", tag: 'ECON', timeEstimate: 10, dayOrder: 52,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How Mobile Money Brings Banking to Everyone", tag: 'ECON', timeEstimate: 10, dayOrder: 53,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "Why Countries Fall Into Debt Crises", tag: 'ECON', timeEstimate: 10, dayOrder: 54,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: "How Uzbekistan Is Building Its Future", tag: 'ECON', timeEstimate: 10, dayOrder: 55,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
];

const DEV_ECON_QUIZZES: Prisma.QuizCreateInput[] = [
  { title: 'Quiz: Growth Isn\'t Always Development', tag: 'ECON', timeEstimate: 10, dayOrder: 1,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Quiz: Can Money Measure a Country\'s Success?', tag: 'ECON', timeEstimate: 10, dayOrder: 2,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Quiz: A Better Way to Measure Progress', tag: 'ECON', timeEstimate: 10, dayOrder: 3,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Chapter 1 Quiz', tag: 'ECON', timeEstimate: 15, dayOrder: 7,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Chapter 2 Quiz', tag: 'ECON', timeEstimate: 15, dayOrder: 14,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Chapter 3 Quiz', tag: 'ECON', timeEstimate: 15, dayOrder: 21,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Chapter 4 Quiz', tag: 'ECON', timeEstimate: 15, dayOrder: 28,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Chapter 5 Quiz', tag: 'ECON', timeEstimate: 15, dayOrder: 35,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Chapter 6 Quiz', tag: 'ECON', timeEstimate: 15, dayOrder: 42,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Chapter 7 Quiz', tag: 'ECON', timeEstimate: 15, dayOrder: 49,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
  { title: 'Final Quiz + Capstone Review', tag: 'ECON', timeEstimate: 15, dayOrder: 56,
    track: Track.ENTREPRENEURSHIP_ECONOMICS },
];

async function main() {
  console.log('Starting seed...');

  // Upsert user
  const hashedPassword = await bcrypt.hash('password', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });
  console.log(`✅ User: ${user.email}`);

  // Fetch Mock Content
  const { MOCK_CONTENT, DEV_MOCK_CONTENT } = require('../lib/mockContent');

  // --- ENTREPRENEURSHIP ECONOMICS ---
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
      where: { track_dayOrder: { track: Track.ENTREPRENEURSHIP_ECONOMICS, dayOrder: lesson.dayOrder } },
      update: lessonData,
      create: { ...lessonData, track: Track.ENTREPRENEURSHIP_ECONOMICS },
    });
  }
  console.log(`✅ ${LESSONS.length} Entrepreneurship lessons seeded`);

  for (const quiz of QUIZZES) {
    const createdQuiz = await prisma.quiz.upsert({
      where: { track_dayOrder: { track: Track.ENTREPRENEURSHIP_ECONOMICS, dayOrder: quiz.dayOrder } },
      update: quiz,
      create: { ...quiz, track: Track.ENTREPRENEURSHIP_ECONOMICS },
    });
    
    const questions = questionsByLesson[quiz.dayOrder];
    if (questions && questions.length > 0) {
      await prisma.quizQuestion.deleteMany({
        where: { quizId: createdQuiz.id }
      });
      
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
  console.log(`✅ ${QUIZZES.length} Entrepreneurship quizzes seeded`);

  // --- DEVELOPMENT ECONOMICS ---
  for (const lesson of DEV_ECON_LESSONS) {
    const mockContent = DEV_MOCK_CONTENT[lesson.dayOrder];
    
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
      where: { track_dayOrder: { track: Track.DEVELOPMENT_ECONOMICS, dayOrder: lesson.dayOrder } },
      update: lessonData,
      create: { ...lessonData, track: Track.DEVELOPMENT_ECONOMICS },
    });
  }
  console.log(`✅ ${DEV_ECON_LESSONS.length} Development Economics lessons seeded`);

  for (const quiz of DEV_ECON_QUIZZES) {
    const createdQuiz = await prisma.quiz.upsert({
      where: { track_dayOrder: { track: Track.DEVELOPMENT_ECONOMICS, dayOrder: quiz.dayOrder } },
      update: quiz,
      create: { ...quiz, track: Track.DEVELOPMENT_ECONOMICS },
    });
    
    const questions = devQuestionsByLesson[quiz.dayOrder];
    if (questions && questions.length > 0) {
      await prisma.quizQuestion.deleteMany({
        where: { quizId: createdQuiz.id }
      });
      
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
  console.log(`✅ ${DEV_ECON_QUIZZES.length} Development Economics quizzes seeded`);

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
      data: { userId: user.id, quizAttemptId: attempt1.id, track: Track.ENTREPRENEURSHIP_ECONOMICS, reviewed: false },
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
      data: { userId: user.id, quizAttemptId: attempt2.id, track: Track.ENTREPRENEURSHIP_ECONOMICS, reviewed: false },
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
