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

  // Fix the syntax error from the previous script
  content = content.replace(/className="content-page min-h-screen" style=\{\{ backgroundColor: "#F8F9FC" \}\} w-full/g, 'className="content-page min-h-screen w-full');
  
  // Also we want to ensure style={{ backgroundColor: "#F8F9FC" }} is properly applied, but we can just append it at the end of the div declaration safely
  // Wait, the previous script resulted in: `<div className="content-page min-h-screen" style={{ backgroundColor: "#F8F9FC" }} w-full font-sans flex flex-col p-0">`
  // We can just replace that entire chunk with proper JSX
  content = content.replace(/<div className="content-page min-h-screen" style=\{\{ backgroundColor: "#F8F9FC" \}\} w-full([^"]*)">/g, '<div className="content-page min-h-screen w-full$1" style={{ backgroundColor: "#F8F9FC" }}>');
  
  content = content.replace(/className="content-page min-h-screen" style=\{\{ backgroundColor: "#F8F9FC" \}\} flex-1([^"]*)">/g, 'className="content-page min-h-screen flex-1$1" style={{ backgroundColor: "#F8F9FC" }}>');


  if (content !== orig) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log("Updated", file);
  }
});
console.log("Done updating " + changedFiles + " files.");
