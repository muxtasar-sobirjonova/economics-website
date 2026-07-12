const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('app', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace indigo buttons
    content = content.replace(/bg-\[#4F46E5\] hover:bg-\[#4F46E5\]/g, 'bg-[#7B6FE7] hover:bg-[#7B6FE7]/90');
    content = content.replace(/bg-\[#4F46E5\]/g, 'bg-[#7B6FE7]');
    content = content.replace(/hover:bg-\[#4F46E5\]/g, 'hover:bg-[#7B6FE7]/90');
    
    // Replace blue buttons
    content = content.replace(/bg-\[#3D52A0\] hover:bg-\[#2e3e78\]/g, 'bg-[#7B6FE7] hover:bg-[#7B6FE7]/90');
    
    // Sometimes hover state is defined separately, but only for buttons?
    // Let's specifically target hover:bg-[#2e3e78] and bg-[#3D52A0] only if they are together.
    
    // Wait, in quizzes/read/page.tsx:
    // <Link href="/quizzes" className="px-6 py-3 bg-[#3D52A0] hover:bg-[#2e3e78] ...">
    // <button className="animate-fadeUp bg-[#3D52A0] hover:bg-[#2e3e78] ...">
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
