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

  // Replace M avatar in Roadmap
  content = content.replace(
    /<div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: "#4ebdd5" }}>\s*M\s*<\/div>/g,
    '<div style={{ width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px", backgroundColor: "#4ebdd5", color: "white" }}>M</div>'
  );

  // Replace M avatar in Concepts
  content = content.replace(
    /<div className="w-9 h-9 bg-\[#EFF6FF\] text-\[#2563EB\] border border-\[#3B82F6\] rounded-full flex items-center justify-center font-bold text-\[14px\] shadow-sm cursor-pointer hover:bg-\[#3B82F6\] hover:text-white transition-all">\s*M\s*<\/div>/g,
    '<div className="bg-[#2563EB] text-white shadow-sm cursor-pointer hover:opacity-90 transition-all" style={{ width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" }}>M</div>'
  );

  // Replace M avatar in Articles
  content = content.replace(
    /<div className="w-9 h-9 bg-\[#F3F0FF\] text-\[#8B5CF6\] border border-\[#8B5CF6\] rounded-full flex items-center justify-center font-bold text-\[14px\] shadow-sm cursor-pointer hover:bg-\[#8B5CF6\] hover:text-white transition-all">\s*M\s*<\/div>/g,
    '<div className="bg-[#8B5CF6] text-white shadow-sm cursor-pointer hover:opacity-90 transition-all" style={{ width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" }}>M</div>'
  );

  // Replace M avatar in Quizzes
  content = content.replace(
    /<div className="w-9 h-9 bg-\[#F0FDF4\] text-\[#16A34A\] border border-\[#22C55E\] rounded-full flex items-center justify-center font-bold text-\[14px\] shadow-sm cursor-pointer hover:bg-\[#22C55E\] hover:text-white transition-all">\s*M\s*<\/div>/g,
    '<div className="bg-[#16A34A] text-white shadow-sm cursor-pointer hover:opacity-90 transition-all" style={{ width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" }}>M</div>'
  );

  if (content !== orig) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log("Updated avatar in", file);
  }
});
console.log("Done updating " + changedFiles + " files.");
