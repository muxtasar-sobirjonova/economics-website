const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove imports from LESSON_8_QUESTIONS to end of block
content = content.replace(/import \{ LESSON_8_QUESTIONS \} from '.\/quizzes\/lesson8';[\s\S]*?import \{ LESSON_28_QUESTIONS \} from '.\/quizzes\/lesson28';\n/g, '');

// 2. Truncate LESSON_CONCEPTS from key 8
const index = content.indexOf('  8: "Information asymmetry:');
if (index !== -1) {
  content = content.substring(0, index) + '};\n' + content.substring(content.indexOf('import { prisma } from "@/lib/prisma";'));
}

// 3. Truncate questionsByLesson from key 8
const index2 = content.indexOf('  8: LESSON_8_QUESTIONS,');
if (index2 !== -1) {
  content = content.substring(0, index2) + '};\n';
}

fs.writeFileSync(filePath, content);
console.log('data.ts truncated successfully.');
