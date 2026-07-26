const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'roadmap', 'RoadmapMap.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Truncate CHAPTER_DATA
const index = content.indexOf('  {\n    chapterNumber: 2,');
if (index !== -1) {
  content = content.substring(0, index) + '];\n' + content.substring(content.indexOf('const generateChapterCoords = '));
}

// 2. We don't have MOCK_ROADMAP_DATA in RoadmapMap.tsx anymore, the mock data was likely elsewhere, wait, no, I saw it in line 155 in previous logs. Let's look closer.
fs.writeFileSync(filePath, content);
console.log('RoadmapMap.tsx truncated successfully.');
