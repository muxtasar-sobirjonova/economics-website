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
  content = content.replace(/backgroundColor: "#EEEFF2"/g, 'backgroundColor: "#F8F9FC"');
  content = content.replace(/backgroundColor: "#f9f8ff"/g, 'backgroundColor: "#F8F9FC"');
  if (content !== orig) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log("Updated", file);
  }
});
console.log("Done updating " + changedFiles + " files.");
