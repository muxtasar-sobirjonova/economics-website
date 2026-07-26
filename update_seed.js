const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'prisma', 'seed.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Append imports
const imports = `
import { LESSON_8_QUESTIONS } from '../lib/quizzes/lesson8';
import { LESSON_9_QUESTIONS } from '../lib/quizzes/lesson9';
import { LESSON_10_QUESTIONS } from '../lib/quizzes/lesson10';
import { LESSON_11_QUESTIONS } from '../lib/quizzes/lesson11';
import { LESSON_12_QUESTIONS } from '../lib/quizzes/lesson12';
import { LESSON_13_QUESTIONS } from '../lib/quizzes/lesson13';
import { CHAPTER_2_QUIZ_QUESTIONS } from '../lib/quizzes/chapter2';
`;

content = imports + content;

// Replace lessons and quizzes arrays
content = content.replace(/const LESSONS: Prisma\.LessonCreateInput\[\] = \[[\s\S]*?\];/m, `const LESSONS: Prisma.LessonCreateInput[] = [
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
];`);

content = content.replace(/const QUIZZES: Prisma\.QuizCreateInput\[\] = \[[\s\S]*?\];/m, `const QUIZZES: Prisma.QuizCreateInput[] = [
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
];`);

content = content.replace(/const questionsByLesson = \{[\s\S]*?\};\n\nconst prisma = new PrismaClient\(\);/m, `const questionsByLesson = {
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

const prisma = new PrismaClient();`);

fs.writeFileSync(filePath, content);
console.log('seed.ts updated successfully.');
