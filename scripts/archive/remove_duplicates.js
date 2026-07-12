const fs = require('fs');

let content = fs.readFileSync('C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx', 'utf-8');

// I will find the unwanted duplicate blocks and remove them.
// The unwanted block starts with `\n        {/* FIXED RIGHT PANEL */}` or `{/* FIXED RIGHT PANEL */}`
// and continues with `<div style={{\n          width: marginOpen ? '30%' : '0',`
// It ends after the `{/* FIXED PURPLE TAB */}` block, which ends with `NOTES\n          </div>\n        </div>`.

const unwantedRegex = /\s*\{\/\* FIXED RIGHT PANEL \*\/}\s*<div style=\{\{\s*width: marginOpen \? '30%' : '0',[\s\S]*?\{\/\* FIXED PURPLE TAB \*\/\}[\s\S]*?NOTES\s*<\/div>\s*<\/div>/g;

content = content.replace(unwantedRegex, '');

fs.writeFileSync('C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx', content, 'utf-8');
console.log('REMOVED DUPLICATES');
