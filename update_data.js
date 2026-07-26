const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Append imports
const imports = `
import { LESSON_8_QUESTIONS } from './quizzes/lesson8';
import { LESSON_9_QUESTIONS } from './quizzes/lesson9';
import { LESSON_10_QUESTIONS } from './quizzes/lesson10';
import { LESSON_11_QUESTIONS } from './quizzes/lesson11';
import { LESSON_12_QUESTIONS } from './quizzes/lesson12';
import { LESSON_13_QUESTIONS } from './quizzes/lesson13';
import { CHAPTER_2_QUIZ_QUESTIONS } from './quizzes/chapter2';
`;

content = imports + content;

// Append concepts
const concepts = `
  8: "Understand the fundamental economic problem of having seemingly unlimited human wants in a world of limited resources.",
  9: "Learn what a trade-off is and how to weigh the expected value and opportunity cost of each choice.",
  10: "Discover Opportunity Cost, the potential benefit you lose when you choose one alternative over another.",
  11: "Understand Capital Scarcity and how budgeting forces prioritization and extends a startup's runway.",
  12: "Explore Time Scarcity, the entrepreneur's only true asset, and how delegation reclaims it.",
  13: "Learn about Sunk Costs, the fallacy of letting unrecoverable past costs influence your future decision-making.",
`;

content = content.replace('};\nimport { prisma }', concepts + '};\nimport { prisma }');

fs.writeFileSync(filePath, content);
console.log('data.ts updated successfully.');
