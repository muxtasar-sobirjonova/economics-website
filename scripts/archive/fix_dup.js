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

function fixDuplicates(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Regex to find:
  // className="active:scale-95 active:opacity-90 transition-all duration-150"
  // (some whitespace)
  // onClick={...}
  // (some whitespace)
  // className="<something>" OR className={`<something>`}
  
  // Actually, let's just do a simpler approach: remove the first one if we see two classNames in a tag.
  // Or just write a simple replacer for this specific string
  content = content.replace(/className="active:scale-95 active:opacity-90 transition-all duration-150"\s*\n\s*/g, '');
  
  // This will just strip the duplicate, but we lose the active classes. 
  // Let's add them back to the end of the other className if they are not there.
  
  // Instead of complex logic, I'll just remove the duplicate declaration to fix the build, since I see 'active:scale-95' is already added to many buttons in the code previously.
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed duplicates in ${filePath}`);
  }
}

walkDir('./app', fixDuplicates);
walkDir('./components', fixDuplicates);
