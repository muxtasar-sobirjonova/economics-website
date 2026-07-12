const fs = require('fs');
const parser = require('@babel/parser');

const code = fs.readFileSync('C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx', 'utf-8');

try {
  parser.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript'
    ]
  });
  console.log('Successfully parsed!');
} catch (e) {
  console.error('Syntax Error at line', e.loc.line, 'col', e.loc.column);
  console.error(e.message);
}
