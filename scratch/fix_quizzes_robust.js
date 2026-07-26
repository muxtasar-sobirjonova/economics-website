const fs = require('fs');
const path = require('path');

const files = [
  'lib/quizzes/lesson8.ts',
  'lib/quizzes/lesson9.ts',
  'lib/quizzes/lesson10.ts',
  'lib/quizzes/lesson11.ts',
  'lib/quizzes/lesson12.ts',
  'lib/quizzes/lesson13.ts',
  'lib/quizzes/chapter2.ts'
];

for (let file of files) {
  const filePath = path.join('C:\\Users\\user\\.gemini\\antigravity-ide\\scratch\\economics_website', file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipped ${file} (does not exist)`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace text: with questionText:
  content = content.replace(/text:\s*(['"`])/g, 'questionText: $1');

  // Add type: 'multiple-choice' and temporary _key
  content = content.replace(/\{(\s+)questionText:/g, '{\n$1_key: \'q\',\n$1type: \'multiple-choice\',\n$1questionText:');

  // Replace correctAnswerIndex or correctAnswer followed by number with the actual option string
  const optionBlockRegex = /options:\s*\[([\s\S]*?)\]\s*,\s*(correctAnswerIndex|correctAnswer):\s*(\d+)/g;
  content = content.replace(optionBlockRegex, (match, optionsText, keyName, indexStr) => {
    const index = parseInt(indexStr, 10);
    const options = [];
    // Split on commas while keeping quoted strings
    const items = optionsText.split(/,\s*\n|\n/);
    for (let item of items) {
      let trimmed = item.trim();
      if (!trimmed) continue;
      if (trimmed.endsWith(',')) {
        trimmed = trimmed.substring(0, trimmed.length - 1).trim();
      }
      trimmed = trimmed.replace(/^['"`]|['"`]$/g, '');
      options.push(trimmed);
    }
    const correctOption = options[index];
    if (correctOption) {
      const escaped = correctOption.replace(/"/g, '\\"');
      return `options: [${optionsText}],\n    correctAnswer: "${escaped}"`;
    }
    return match;
  });

  // Assign correct unique _key values (e.g. q1, q2, q3...)
  let keyIndex = 1;
  content = content.replace(/_key:\s*'q'/g, () => `_key: 'q${keyIndex++}'`);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Refactored ${file}`);
}
