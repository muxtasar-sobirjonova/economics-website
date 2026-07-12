const fs = require('fs');

const filePath = 'C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// The string "\\n" was literally inserted into the file.
content = content.replaceAll('\\n      </div>\\n', '\n      </div>\n');
content = content.replaceAll('\\n', '\n');

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Fixed backslashes!");
