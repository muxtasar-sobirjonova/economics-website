const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'app/lessons/[lessonId]/concepts/page.tsx');
let content = fs.readFileSync(file, 'utf8');

const replacements = {
  '#f8f9fe': '#F8F7FF',
  '#7c6fe4': '#7B68EE',
  '#685cd6': '#6D5BE5',
  '#eef0f7': '#E8E5F7',
  '#2d2a3f': '#24203F',
  '#4b4474': '#55526D',
  '#a09eb0': '#8C88A8',
  '#7cd1c0': '#29C97A',
  '#F3F2FF': '#F3F0FF',
  '#E0DDFF': '#E8E5F7',
};

for (const [oldColor, newColor] of Object.entries(replacements)) {
  const regex = new RegExp(oldColor, 'gi');
  content = content.replace(regex, newColor);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Done!');
