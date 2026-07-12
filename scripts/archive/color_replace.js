const fs = require('fs');
const path = require('path');

const colorMap = {
  '#4F46E5': '#5c162f',
  '#3730A3': '#420d20',
  '#4338CA': '#4f1127',
  '#EEF2FF': '#fce8f0',
  '#2d2f7e': '#380a1c',
  '#3d3f9e': '#4a102b',
  '#a5b4fc': '#963860',
  '#5b5fc7': '#5c162f',
  '#4547a8': '#420d20',
  '#eeedfe': '#fce8f0',
  '#c5c3f5': '#e6a1bc',
  '#556bfc': '#6e1b39',
};

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walkDir(file));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walkDir('./');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const [oldColor, newColor] of Object.entries(colorMap)) {
    // case insensitive replace
    const regex = new RegExp(oldColor, 'gi');
    content = content.replace(regex, newColor);
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
