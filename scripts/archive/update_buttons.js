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

    // 1. Change button colors globally
    // We match <button ...>...</button>
    content = content.replace(/<button([^>]*)>/g, (match, attrs) => {
      // Replace background
      let newAttrs = attrs;
      
      // Remove existing bg colors (Tailwind format like bg-[#HEX] or bg-blue-500)
      newAttrs = newAttrs.replace(/bg-\[#[0-9a-fA-F]+\]/g, 'bg-[#3D52A0]');
      newAttrs = newAttrs.replace(/bg-[a-z]+-[0-9]+/g, 'bg-[#3D52A0]'); // like bg-blue-500
      
      // If there was no background class replaced but it has className, we'll try to inject it.
      if (attrs === newAttrs && newAttrs.includes('className="')) {
         newAttrs = newAttrs.replace(/className="/, 'className="bg-[#3D52A0] text-[#ffffff] ');
      }

      // Replace text colors
      newAttrs = newAttrs.replace(/text-\[#[0-9a-fA-F]+\]/g, 'text-[#ffffff]');
      newAttrs = newAttrs.replace(/text-[a-z]+-[0-9]+/g, 'text-[#ffffff]');
      newAttrs = newAttrs.replace(/text-white/g, 'text-[#ffffff]');

      return `<button${newAttrs}>`;
    });

    // 2. Fix the Roadmap Hero Card specifically if this is roadmap/page.tsx
    if (file.endsWith(path.join('roadmap', 'page.tsx'))) {
      content = content.replace(/backgroundColor: "#B8CCFF"/g, 'backgroundColor: "#3D52A0"');
      content = content.replace(/text-\[#2563EB\]/g, 'text-[rgba(255,255,255,0.7)]'); // Eyebrow color replacement
      content = content.replace(/text-\[#111111\]/g, 'text-[#ffffff]'); // Title color
      content = content.replace(/text-\[#444444\]/g, 'text-[#ffffff]'); // Description color
    }

    if (content !== orig) {
      fs.writeFileSync(file, content);
      changedFiles++;
      console.log("Updated", file);
    }
  });
});
console.log("Done updating " + changedFiles + " files.");
