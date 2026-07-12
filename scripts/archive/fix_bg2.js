const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else {
      if (fullPath.endsWith('.tsx')) {
        callback(fullPath);
      }
    }
  });
};

let changedFiles = 0;
walk(path.join(__dirname, 'app'), file => {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;

  // Fix the invalid React !important styles
  content = content.replace(/backgroundColor:\s*"#F8F9FC !important"/g, 'backgroundColor: "#F8F9FC"');
  
  // For read pages, replace the tailwind class with inline style for absolute certainty
  content = content.replace(/bg-\[#F8F9FC\]/g, ''); // Remove the tailwind class
  // Instead of risking messing up classNames, just remove it and let the layout wrapper handle it,
  // OR add style={{ backgroundColor: "#F8F9FC" }}

  if (content !== orig) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log("Updated", file);
  }
});
console.log("Done updating " + changedFiles + " files.");
