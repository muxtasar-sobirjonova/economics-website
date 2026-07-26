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

// 1. app/(app)/home/page.tsx
replaceFile('app/(app)/home/page.tsx', [
  { from: 'activeTrack as any', to: 'activeTrack as Track' },
  { from: 'userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS"', to: 'userRecord?.activeTrack || Track.ENTREPRENEURSHIP_ECONOMICS' },
  { from: 'activeTrack,', to: 'activeTrack as Track,' } // catch all activeTrack passes
]);

// 2. app/(app)/lessons/[lessonId]/articles/read/page.tsx
replaceFile('app/(app)/lessons/[lessonId]/articles/read/page.tsx', [
  { from: 'as Track | EnumTrackFilter<"Note"> | undefined', to: '' },
  { from: 'track: activeTrack as Track', to: 'track: activeTrack as Track' },
  { from: 'import { getLessonAccessStatus }', to: 'import { Track } from "@prisma/client";\nimport { getLessonAccessStatus }' }
]);

// 3. app/(app)/lessons/[lessonId]/concepts/read/actions.ts
replaceFile('app/(app)/lessons/[lessonId]/concepts/read/actions.ts', [
  { from: 'timestamp: new Date().toISOString()', to: 'timestamp: new Date().toISOString(), track: Track.ENTREPRENEURSHIP_ECONOMICS' },
  { from: 'import { prisma }', to: 'import { Track } from "@prisma/client";\nimport { prisma }' }
]);

// 4. app/(app)/lessons/[lessonId]/concepts/read/page.tsx
replaceFile('app/(app)/lessons/[lessonId]/concepts/read/page.tsx', [
  { from: 'import { getLessonAccessStatus }', to: 'import { Track } from "@prisma/client";\nimport { getLessonAccessStatus }' }
]);

// 5. app/actions/agenda.ts
replaceFile('app/actions/agenda.ts', [
  { from: 'import prisma from "@/lib/prisma";', to: 'import { prisma } from "@/lib/prisma";' }
]);

// 6. app/actions/user.ts
replaceFile('app/actions/user.ts', [
  { from: 'track: activeTrack,', to: 'track: activeTrack as Track,' },
  { from: 'userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS"', to: 'userRecord?.activeTrack || Track.ENTREPRENEURSHIP_ECONOMICS' },
  { from: 'import { prisma }', to: 'import { Track } from "@prisma/client";\nimport { prisma }' }
]);

// 7. add_week2.ts to add_week5_placeholders.ts
const weeks = ['add_week2.ts', 'add_week3_placeholders.ts', 'add_week4_placeholders.ts', 'add_week5_placeholders.ts'];
for (const w of weeks) {
  replaceFile(w, [
    { from: 'timeEstimate: 5', to: 'timeEstimate: 5, track: Track.ENTREPRENEURSHIP_ECONOMICS' },
    { from: 'timeEstimate: 10', to: 'timeEstimate: 10, track: Track.ENTREPRENEURSHIP_ECONOMICS' },
    { from: 'timeEstimate: 15', to: 'timeEstimate: 15, track: Track.ENTREPRENEURSHIP_ECONOMICS' }
  ]);
}
