const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'prisma', 'seed.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove imports
content = content.replace(/import \{ LESSON_8_QUESTIONS \} from '\.\.\/lib\/quizzes\/lesson8';[\s\S]*?import \{ LESSON_28_QUESTIONS \} from '\.\.\/lib\/quizzes\/lesson28';\n/g, '');

// 2. Truncate questionsByLesson
const index = content.indexOf('  8: LESSON_8_QUESTIONS,');
if (index !== -1) {
  content = content.substring(0, index) + '};\n\nconst prisma = new PrismaClient();' + content.substring(content.indexOf('const LESSONS: Prisma.LessonCreateInput[] = [') - 1);
}

// 3. Truncate LESSONS
const index2 = content.indexOf('  { title: \'Information Asymmetry and Market Gaps\'');
if (index2 !== -1) {
  content = content.substring(0, index2) + '];\n\nconst QUIZZES: Prisma.QuizCreateInput[] = [' + content.substring(content.indexOf('  { title: \'Quiz: What Is Entrepreneurship Economics?\''));
}

// 4. Truncate QUIZZES
const index3 = content.indexOf('  { title: \'Quiz: Information Asymmetry and Market Gaps\'');
if (index3 !== -1) {
  content = content.substring(0, index3) + '];\n\nasync function main() {' + content.substring(content.indexOf('  console.log(\'Deleting existing records...\');'));
}

fs.writeFileSync(filePath, content);
console.log('seed.ts truncated successfully.');
