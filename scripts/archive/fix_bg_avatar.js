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

  // Add !important to existing F8F9FC backgrounds
  content = content.replace(/backgroundColor:\s*"#F8F9FC"/g, 'backgroundColor: "#F8F9FC !important"');
  
  // Also fix any other main content wrappers
  content = content.replace(/bg-\[#F0EFFF\]/g, 'bg-[#F8F9FC]');

  // Fix the avatar
  // Ensure background is #1E1E3F
  content = content.replace(
    /style=\{\{\s*width:\s*"36px",\s*height:\s*"36px",\s*borderRadius:\s*"50%",\s*display:\s*"flex",\s*alignItems:\s*"center",\s*justifyContent:\s*"center",\s*fontWeight:\s*"700",\s*fontSize:\s*"14px"(?:,\s*backgroundColor:\s*"[^"]*",\s*color:\s*"[^"]*")?\s*\}\}/g,
    'style={{ width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px", backgroundColor: "#1E1E3F", color: "white" }}'
  );

  // If there's any remaining `bg-[color]` on the avatar div, let's just let the inline style override it.

  if (content !== orig) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log("Updated", file);
  }
});
console.log("Done updating " + changedFiles + " files.");
