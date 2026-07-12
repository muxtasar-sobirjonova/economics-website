const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
        callback(fullPath);
      }
    }
  });
};

let changedFiles = 0;
const dirs = ['app', 'components'];

dirs.forEach(d => {
  walk(path.join(__dirname, d), file => {
    let content = fs.readFileSync(file, 'utf8');
    let orig = content;

    // Change button backgrounds from #6B5FE4 to #8278E6
    content = content.replace(/bg-\[#6B5FE4\]/g, 'bg-[#8278E6]');
    
    // Also change the eyebrow text color in the roadmap card which I set to #6B5FE4
    content = content.replace(/text-\[#6B5FE4\]/g, 'text-[#8278E6]');

    if (content !== orig) {
      fs.writeFileSync(file, content);
      changedFiles++;
      console.log("Updated", file);
    }
  });
});
console.log("Done updating " + changedFiles + " files.");
