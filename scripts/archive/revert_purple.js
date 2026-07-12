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

    // Change button backgrounds from #3D52A0 to #6B5FE4
    content = content.replace(/bg-\[#3D52A0\]/g, 'bg-[#6B5FE4]');
    
    // Check if it's the Sidebar and update its background color to the original purple #51487F
    if (file.endsWith('Sidebar.tsx')) {
      content = content.replace(/style=\{\{\s*backgroundColor:\s*"#[0-9A-Fa-f]+"\s*\}\}/g, 'style={{ backgroundColor: "#51487F" }}');
      content = content.replace(/bg-\[#[0-9A-Fa-f]+\]/g, 'bg-[#51487F]'); 
      // Ensure the sidebar gets exactly #51487F
    }

    if (content !== orig) {
      fs.writeFileSync(file, content);
      changedFiles++;
      console.log("Updated", file);
    }
  });
});
console.log("Done updating " + changedFiles + " files.");
