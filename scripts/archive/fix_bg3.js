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

  // Add the style correctly to any stripped content-page wrapper
  content = content.replace(/className="content-page  min-h-screen/g, 'className="content-page min-h-screen" style={{ backgroundColor: "#F8F9FC" }}');

  if (content !== orig) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log("Updated", file);
  }
});
console.log("Done updating " + changedFiles + " files.");
