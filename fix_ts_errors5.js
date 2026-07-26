const fs = require('fs');

function ensureImport(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  if (!content.includes('import { Track } from "@prisma/client"')) {
    content = 'import { Track } from "@prisma/client";\n' + content;
    fs.writeFileSync(path, content, 'utf8');
    console.log(`Added Track import to ${path}`);
  }
}

function fixPlaceholders() {
  const weeks = ['add_week2.ts', 'add_week3_placeholders.ts', 'add_week4_placeholders.ts', 'add_week5_placeholders.ts'];
  for (const w of weeks) {
    if (!fs.existsSync(w)) continue;
    let content = fs.readFileSync(w, 'utf8');
    content = content.replace(/timeEstimate: 20,/g, 'timeEstimate: 20, track: Track.ENTREPRENEURSHIP_ECONOMICS,');
    fs.writeFileSync(w, content, 'utf8');
    console.log(`Fixed placeholders in ${w}`);
  }
}

function fixHomePage() {
  const path = 'app/(app)/home/page.tsx';
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/activeTrack\?: string/g, 'activeTrack?: Track');
  content = content.replace(/activeTrack = "ENTREPRENEURSHIP_ECONOMICS"/g, 'activeTrack = Track.ENTREPRENEURSHIP_ECONOMICS');
  fs.writeFileSync(path, content, 'utf8');
}

ensureImport('app/(app)/home/page.tsx');
ensureImport('app/(app)/lessons/[lessonId]/articles/read/page.tsx');
ensureImport('app/(app)/lessons/[lessonId]/concepts/read/actions.ts');
ensureImport('app/(app)/lessons/[lessonId]/concepts/read/page.tsx');
ensureImport('app/actions/user.ts');
fixPlaceholders();
fixHomePage();
