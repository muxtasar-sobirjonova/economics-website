const fs = require('fs');

function fixActiveTrack(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  let newContent = content.replace(/let activeTrack = "ENTREPRENEURSHIP_ECONOMICS";/g, 'let activeTrack: Track = Track.ENTREPRENEURSHIP_ECONOMICS;');
  newContent = newContent.replace(/let activeTrack = 'ENTREPRENEURSHIP_ECONOMICS';/g, 'let activeTrack: Track = Track.ENTREPRENEURSHIP_ECONOMICS;');
  if (newContent !== content) {
    fs.writeFileSync(path, newContent, 'utf8');
    console.log('Fixed activeTrack let declaration in ' + path);
  }
}

fixActiveTrack('app/(app)/lessons/[lessonId]/articles/read/page.tsx');
fixActiveTrack('app/(app)/lessons/[lessonId]/concepts/read/page.tsx');

// In app/actions/user.ts, see what line 134 is
if (fs.existsSync('app/actions/user.ts')) {
  let userContent = fs.readFileSync('app/actions/user.ts', 'utf8');
  // It probably calls something with activeTrack
  // e.g. track: activeTrack as Track
  // But maybe it's string. Let's cast it: activeTrack as Track
  // If it's already as Track, maybe it's missing Track import?
  if (!userContent.includes('Track } from')) {
    userContent = 'import { Track } from "@prisma/client";\n' + userContent;
    fs.writeFileSync('app/actions/user.ts', userContent, 'utf8');
  }
}
