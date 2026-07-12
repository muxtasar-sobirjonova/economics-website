const fs = require('fs');
let file = fs.readFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\scratch\\economics_website\\app\\page.tsx', 'utf8');
if (file.startsWith('"') && file.endsWith('"')) {
  file = file.substring(1, file.length - 1);
  file = file.replace(/\\n/g, '\n').replace(/\\"/g, '"');
  fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\scratch\\economics_website\\app\\page.tsx', file);
}
