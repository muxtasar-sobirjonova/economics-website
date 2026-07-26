const fs = require('fs');

function replaceFile(path, replacements) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  let original = content;
  for (const { from, to } of replacements) {
    if (typeof from === 'string') {
      content = content.split(from).join(to);
    } else {
      content = content.replace(from, to);
    }
  }
  if (content !== original) {
    if (content.includes('Track.') && !content.includes('Track } from')) {
      content = 'import { Track } from "@prisma/client";\n' + content;
    }
    fs.writeFileSync(path, content, 'utf8');
    console.log(`Updated ${path}`);
  }
}

// 1. app/(app)/home/actions.ts
replaceFile('app/(app)/home/actions.ts', [
  { from: 'color: "#F8F9FC"', to: 'color: "#F8F9FC", track: Track.ENTREPRENEURSHIP_ECONOMICS' }
]);

// 2. app/(app)/home/page.tsx
replaceFile('app/(app)/home/page.tsx', [
  { from: 'activeTrack as any', to: 'activeTrack as Track' },
  { from: 'const activeTrack = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";', to: 'const activeTrack = userRecord?.activeTrack || Track.ENTREPRENEURSHIP_ECONOMICS;' }
]);

// 3. app/(app)/lessons/[lessonId]/articles/read/page.tsx
replaceFile('app/(app)/lessons/[lessonId]/articles/read/page.tsx', [
  { from: 'const activeTrack = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";', to: 'const activeTrack = userRecord?.activeTrack || Track.ENTREPRENEURSHIP_ECONOMICS;' },
  { from: 'track: activeTrack', to: 'track: activeTrack as Track' }
]);

// 4. app/(app)/lessons/[lessonId]/concepts/read/actions.ts
replaceFile('app/(app)/lessons/[lessonId]/concepts/read/actions.ts', [
  { from: 'timestamp: new Date().toISOString()', to: 'timestamp: new Date().toISOString(), track: Track.ENTREPRENEURSHIP_ECONOMICS' }
]);

// 5. app/(app)/lessons/[lessonId]/concepts/read/page.tsx
replaceFile('app/(app)/lessons/[lessonId]/concepts/read/page.tsx', [
  { from: 'const activeTrack = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";', to: 'const activeTrack = userRecord?.activeTrack || Track.ENTREPRENEURSHIP_ECONOMICS;' },
  { from: 'track: activeTrack', to: 'track: activeTrack as Track' }
]);

// 6. app/actions/agenda.ts
replaceFile('app/actions/agenda.ts', [
  { from: 'const activeTrack = userRecord?.activeTrack || Track.ENTREPRENEURSHIP_ECONOMICS;', to: 'const activeTrack = userRecord?.activeTrack || Track.ENTREPRENEURSHIP_ECONOMICS;' }, // Make sure prisma is there
  { from: 'import { invalidateUserCache } from "@/lib/data";', to: 'import { invalidateUserCache } from "@/lib/data";\nimport prisma from "@/lib/prisma";' }
]);

// 7. lib/db-utils.ts
replaceFile('lib/db-utils.ts', [
  { from: 'reviewed: false', to: 'reviewed: false, track: Track.ENTREPRENEURSHIP_ECONOMICS' }
]);

// 8. lib/user-progress.ts
replaceFile('lib/user-progress.ts', [
  { from: '|| "ENTREPRENEURSHIP_ECONOMICS"', to: '|| Track.ENTREPRENEURSHIP_ECONOMICS' },
  { from: 'activeTrack: string', to: 'activeTrack: Track' },
  { from: 'track: string', to: 'track: Track' },
  { from: 'track === "ENTREPRENEURSHIP_ECONOMICS"', to: 'track === Track.ENTREPRENEURSHIP_ECONOMICS' }
]);

// 9. add_week[678]_placeholders.ts
const weeks = ['add_week6_placeholders.ts', 'add_week7_placeholders.ts', 'add_week8_placeholders.ts'];
for (const w of weeks) {
  replaceFile(w, [
    { from: 'timeEstimate: 5', to: 'timeEstimate: 5, track: Track.ENTREPRENEURSHIP_ECONOMICS' },
    { from: 'timeEstimate: 10', to: 'timeEstimate: 10, track: Track.ENTREPRENEURSHIP_ECONOMICS' },
    { from: 'timeEstimate: 15', to: 'timeEstimate: 15, track: Track.ENTREPRENEURSHIP_ECONOMICS' }
  ]);
}
