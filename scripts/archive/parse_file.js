const fs = require('fs');
let file = fs.readFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\scratch\\economics_website\\page_restored.tsx', 'utf8');
if (file.startsWith('"') && file.endsWith('"')) {
  file = JSON.parse(file);
}
fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\scratch\\economics_website\\app\\page.tsx', file, 'utf8');
