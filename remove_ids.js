const fs = require('fs');
const path = require('path');

const quizzesDir = path.join(__dirname, 'lib', 'quizzes');
const files = fs.readdirSync(quizzesDir);

for (const file of files) {
  if (file.endsWith('.ts')) {
    const filePath = path.join(quizzesDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/\s*id:\s*['"][^'"]+['"],\n/g, '\n');
    fs.writeFileSync(filePath, content);
  }
}
console.log("Removed id fields from questions");
