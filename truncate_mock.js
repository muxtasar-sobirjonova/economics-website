const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'mockContent.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Find the start of key '8: {'
const index = content.indexOf('  8: {');
if (index !== -1) {
  const newContent = content.substring(0, index) + '};\n';
  fs.writeFileSync(filePath, newContent);
  console.log('mockContent.ts truncated successfully.');
} else {
  console.log('Could not find key 8 in mockContent.ts');
}
