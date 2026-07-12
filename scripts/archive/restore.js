const fs = require('fs');

function restoreFile(prevFile, targetFile) {
  if (!fs.existsSync(prevFile)) return;
  const content = fs.readFileSync(prevFile, 'utf8');
  const lines = content.split('\n');
  
  let startIndex = -1;
  let endIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(' "use client";')) {
      startIndex = i;
      break;
    }
  }
  
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('The above content shows the entire')) {
      endIndex = i;
      break;
    }
  }
  
  if (startIndex !== -1 && endIndex !== -1) {
    const cleanedLines = lines.slice(startIndex, endIndex).map(line => {
      return line.replace(/^\d+:\s/, '');
    });
    fs.writeFileSync(targetFile, cleanedLines.join('\n'));
    console.log('Restored ' + targetFile);
  }
}

restoreFile('concepts_prev.txt', 'app/lessons/[lessonId]/concepts/page.tsx');
restoreFile('articles_prev.txt', 'app/lessons/[lessonId]/articles/page.tsx');
restoreFile('quizzes_prev.txt', 'app/lessons/[lessonId]/quizzes/page.tsx');
restoreFile('saved_prev.txt', 'app/saved/page.tsx');
