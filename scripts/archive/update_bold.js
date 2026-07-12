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

    // Change button backgrounds from the faint #8278E6 to a very bold, clear, vibrant Indigo #4F46E5
    content = content.replace(/bg-\[#8278E6\]/g, 'bg-[#4F46E5]');
    
    // Also change the text color that we matched previously
    content = content.replace(/text-\[#8278E6\]/g, 'text-[#4F46E5]');

    if (content !== orig) {
      fs.writeFileSync(file, content);
      changedFiles++;
      console.log("Updated", file);
    }
  });
});
console.log("Done updating " + changedFiles + " files.");
