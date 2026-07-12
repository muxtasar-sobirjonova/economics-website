const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function replaceColors(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Generic blacks/grays -> navy
  content = content.replace(/(bg|text|border)-\[\#(0f172a|111827|1a1a2e|111111|2a2318|2c2c38|374151|4b5563|1f2937|302b5e)\]/gi, '$1-navy');
  
  // Generic light grays -> teal
  content = content.replace(/(bg|text|border)-\[\#(6b7280|888888)\]/gi, '$1-teal');
  
  // Purples/light purples -> sky-blue or teal
  content = content.replace(/(bg|text|border)-\[\#(EAE5F4|f3f0ff|e0deff|faf5ff|e9d5ff)\]/gi, '$1-[rgba(200,217,230,0.4)]');
  content = content.replace(/(bg|text|border)-\[\#(A898D4|c4b5fd|7e22ce)\]/gi, '$1-teal');
  
  // Amber/Gold -> teal
  content = content.replace(/(bg|text|border)-\[\#(f59e0b|fbbf24)\]/gi, '$1-teal');

  // Red/Green -> leave as is or map to navy/teal if specified. The user only specified purple/gold/black/white.
  // Actually they said "Replace the entire color system ... Apply to ALL pages". Let's convert them to teal for links and navy for buttons, or just leave semantic reds/greens if they are for quiz errors. Let's leave red/green alone for semantic purposes unless specifically requested.

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

walkDir('./app', replaceColors);
walkDir('./components', replaceColors);
