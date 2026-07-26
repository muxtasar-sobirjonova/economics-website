const fs = require('fs');
const path = './prisma/schema.prisma';
let content = fs.readFileSync(path, 'utf8');

// Insert enum Track
if (!content.includes('enum Track {')) {
  content = content.replace(
    'enum ItemType {\n  LESSON\n  QUIZ\n  ARTICLE\n}',
    'enum ItemType {\n  LESSON\n  QUIZ\n  ARTICLE\n}\n\nenum Track {\n  ENTREPRENEURSHIP_ECONOMICS\n  DEVELOPMENT_ECONOMICS\n  BEHAVIORAL_ECONOMICS\n}'
  );
}

// Replace User.activeTrack
content = content.replace(/activeTrack\s+String\?/g, 'activeTrack      Track?');

// Replace TrackProgress.track
// Be careful not to replace track variables, just the field definition
content = content.replace(/track\s+String\s*$/gm, 'track      Track');

// Replace track String @default("...")
content = content.replace(/track\s+String\s+@default\("ENTREPRENEURSHIP_ECONOMICS"\)/g, 'track    Track');

fs.writeFileSync(path, content);
console.log('schema.prisma updated.');
