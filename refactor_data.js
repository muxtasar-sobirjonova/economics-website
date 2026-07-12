const fs = require('fs');
const path = require('path');

const dataTsPath = path.join(__dirname, 'lib', 'data.ts');
const quizzesDir = path.join(__dirname, 'lib', 'quizzes');

let dataTsContent = fs.readFileSync(dataTsPath, 'utf8');

const regex = /export const (LESSON_\d+_QUESTIONS|CHAPTER_1_QUIZ_QUESTIONS):\s*Question\[\]\s*=\s*\[([\s\S]*?)\];/g;

let match;
let importsToAdd = [];

while ((match = regex.exec(dataTsContent)) !== null) {
  const varName = match[1];
  const fullBlock = match[0];
  
  let fileName;
  if (varName === 'CHAPTER_1_QUIZ_QUESTIONS') {
    fileName = 'chapter1.ts';
  } else {
    const num = varName.match(/\d+/)[0];
    fileName = `lesson${num}.ts`;
  }
  
  const newFileContent = `import { Question } from '../types';\n\n${fullBlock}\n`;
  fs.writeFileSync(path.join(quizzesDir, fileName), newFileContent);
  
  importsToAdd.push(`import { ${varName} } from './quizzes/${fileName.replace('.ts', '')}';`);
  
  dataTsContent = dataTsContent.replace(fullBlock, '');
}

// Insert imports right after the first imports
const importInsertIndex = dataTsContent.indexOf('export const getLessons');
if (importsToAdd.length > 0) {
  dataTsContent = dataTsContent.slice(0, importInsertIndex) + importsToAdd.join('\n') + '\n\n' + dataTsContent.slice(importInsertIndex);
}

fs.writeFileSync(dataTsPath, dataTsContent);
console.log('Refactoring complete 2!');
