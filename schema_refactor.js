const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${filePath} - not found`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  for (const { from, to } of replacements) {
    if (typeof from === 'string') {
      newContent = newContent.split(from).join(to);
    } else {
      newContent = newContent.replace(from, to);
    }
  }
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

// 1. prisma/schema.prisma
replaceInFile('prisma/schema.prisma', [
  { from: 'dateString DateTime', to: 'normalizedDate DateTime' },
  { from: 'dateString  DateTime', to: 'normalizedDate  DateTime' },
  { from: '@@unique([userId, dateString])', to: '@@unique([userId, normalizedDate])' },
  { from: '@@index([dateString])', to: '@@index([normalizedDate])' },
  { from: '@@index([userId, dateString])', to: '@@index([userId, normalizedDate])' },
  { from: /mistakes\s+Json\s+@default\("\[\]"\)/, to: '' }
]);

// 2. services/quizService.ts
replaceInFile('services/quizService.ts', [
  { from: 'userId_dateString', to: 'userId_normalizedDate' },
  { from: 'dateString: todayDate', to: 'normalizedDate: todayDate' },
  { from: /mistakes:\s*validMistakes\s*as\s*unknown\s*as\s*Prisma\.InputJsonValue,/g, to: '' }
]);

// 3. services/agendaService.ts
replaceInFile('services/agendaService.ts', [
  { from: 'dateString: todayDate', to: 'normalizedDate: todayDate' }
]);

// 4. lib/data.ts
replaceInFile('lib/data.ts', [
  { from: 'dateString:', to: 'normalizedDate:' },
  { from: 'dateString: { gte: thirtyDaysAgo }', to: 'normalizedDate: { gte: thirtyDaysAgo }' },
  { from: 'dateString: true', to: 'normalizedDate: true' }
]);

// 5. app/(app)/home/page.tsx
replaceInFile('app/(app)/home/page.tsx', [
  { from: 'dc: { dateString: Date }', to: 'dc: { normalizedDate: Date }' },
  { from: 'dc.dateString.toISOString()', to: 'dc.normalizedDate.toISOString()' }
]);

// 6. components/WeekProgress.tsx
replaceInFile('components/WeekProgress.tsx', [
  { from: 'dateString', to: 'normalizedDateStr' } // To prevent conflicts with normal date rendering, we change the local variable to normalizedDateStr
]);

// 7. test-actions.js
replaceInFile('test-actions.js', [
  { from: 'dateString: todayDate', to: 'normalizedDate: todayDate' },
  { from: 'mistakes: []', to: '' },
  { from: ', mistakes: []', to: '' }
]);

console.log('Regex replacements done.');
