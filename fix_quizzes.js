const fs = require('fs');
const glob = require('fs').readdirSync('lib/quizzes').filter(f => f.startsWith('lesson') && f.endsWith('.ts')).map(f => 'lib/quizzes/' + f);

for (let file of glob) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace `id: "..."` or `id: '...'` with `_key: '...', type: 'multiple-choice'`
  content = content.replace(/id:\s*(['"].*?['"])/g, '_key: $1,\n    type: \'multiple-choice\'');
  
  // Replace `text: "..."` with `questionText: "..."`
  content = content.replace(/text:\s*(['"`].*?['"`])/g, 'questionText: $1');
  
  // Replace `correctAnswer: <number>` with the actual string from `options: [ ... ]`
  const regex = /options:\s*\[\s*([\s\S]*?)\s*\],\s*correctAnswer:\s*(\d)/g;
  content = content.replace(regex, (match, optsString, numStr) => {
      const opts = optsString.split(',\n').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      const idx = parseInt(numStr, 10);
      let ans = opts[idx];
      if (ans) {
         return `options: [\n      ${optsString.trim()}\n    ],\n    correctAnswer: "${ans.replace(/"/g, '\\"')}"`;
      }
      return match;
  });

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}
