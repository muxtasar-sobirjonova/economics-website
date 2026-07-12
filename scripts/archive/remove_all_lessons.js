const fs = require('fs');
const path = require('path');

const files = [
  'app/lessons/[lessonId]/concepts/read/page.tsx',
  'app/lessons/[lessonId]/articles/read/page.tsx',
  'app/lessons/[lessonId]/quizzes/read/page.tsx'
];

files.forEach(relativePath => {
  const file = path.join(__dirname, relativePath);
  if (!fs.existsSync(file)) {
    console.log("Not found:", file);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the start of the All Lessons section
  const searchStr = '<h3 className="text-[#111827] text-[12px] font-bold tracking-widest uppercase mb-4 ml-1">\n                All Lessons\n              </h3>';
  const headerIdx = content.indexOf(searchStr);
  
  if (headerIdx !== -1) {
    // The wrapper div usually starts a bit before this
    const startIdx = content.lastIndexOf('<div className="mt-8">', headerIdx);
    
    if (startIdx !== -1) {
      // Find the end of the file structure
      const endStr = '          </div>\n        </div>\n      </div>\n    </div>\n  );\n}';
      const endIdx = content.indexOf(endStr, startIdx);
      
      if (endIdx !== -1) {
        // Remove the block
        content = content.substring(0, startIdx) + endStr;
        fs.writeFileSync(file, content);
        console.log("Removed All Lessons from", relativePath);
      } else {
        console.log("Could not find end block in", relativePath);
      }
    }
  } else {
    console.log("Could not find All Lessons header in", relativePath);
  }
});
