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

  // Generic replace for the M avatar div that might have been missed
  content = content.replace(
    /<div className="w-9 h-9[^>]+>\s*M\s*<\/div>/g,
    '<div className="bg-[#111827] text-white shadow-sm cursor-pointer hover:opacity-90 transition-all" style={{ width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" }}>M</div>'
  );

  if (content !== orig) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log("Updated avatar generic in", file);
  }
});
console.log("Done updating generic " + changedFiles + " files.");
