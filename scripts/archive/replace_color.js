const fs = require('fs');
const path = require('path');

const NEW_COLOR = '#7B6FE7';

// The colors we want to replace with the new purple
const OLD_COLORS = [
  '#3D52A0', // The primary blue we used everywhere
  'blue-600', // Tailwind default blue sometimes used
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (let file of list) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  }
  return results;
}

const files = walk(__dirname);

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Replace bg-[#3D52A0], text-[#3D52A0], border-[#3D52A0]
  newContent = newContent.replace(/bg-\[\#3D52A0\]/gi, `bg-[${NEW_COLOR}]`);
  newContent = newContent.replace(/text-\[\#3D52A0\]/gi, `text-[${NEW_COLOR}]`);
  newContent = newContent.replace(/border-\[\#3D52A0\]/gi, `border-[${NEW_COLOR}]`);
  newContent = newContent.replace(/fill-\[\#3D52A0\]/gi, `fill-[${NEW_COLOR}]`);
  
  // Replace Tailwind blue-600
  newContent = newContent.replace(/bg-blue-600/gi, `bg-[${NEW_COLOR}]`);
  newContent = newContent.replace(/text-blue-600/gi, `text-[${NEW_COLOR}]`);
  newContent = newContent.replace(/border-blue-600/gi, `border-[${NEW_COLOR}]`);

  // Replace hex codes in arbitrary JS strings/objects
  newContent = newContent.replace(/#3D52A0/gi, NEW_COLOR);

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log(`Updated: ${path.relative(__dirname, file)}`);
  }
}

console.log(`Successfully updated ${changedFiles} files to the new purple color: ${NEW_COLOR}`);
