const fs = require('fs');
const glob = require('glob');

const files = glob.sync('**/*.tsx', { ignore: ['node_modules/**', '.next/**'] });
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add active:scale-95 and active:opacity-90 to existing classNames in <button>
  content = content.replace(/<button([^>]*)className=["']([^"']*)["']([^>]*)>/g, (match, before, classNames, after) => {
    let newClasses = classNames;
    if (!newClasses.includes('active:scale-95')) {
      newClasses += ' active:scale-95';
    }
    if (!newClasses.includes('active:opacity-90')) {
      newClasses += ' active:opacity-90';
    }
    // Make sure we have a transform-allowing transition
    if (!newClasses.includes('transition-all') && !newClasses.includes('transition-transform')) {
      if (newClasses.includes('transition-colors')) {
        newClasses = newClasses.replace('transition-colors', 'transition-all');
      } else if (!newClasses.includes('transition-')) {
        newClasses += ' transition-all duration-150';
      }
    }
    return `<button${before}className="${newClasses.trim()}"${after}>`;
  });

  // Handle <button> without className
  content = content.replace(/<button([^>]*)>/g, (match, attrs) => {
    if (attrs.includes('className=')) return match;
    return `<button className="active:scale-95 active:opacity-90 transition-all duration-150"${attrs}>`;
  });

  if (content !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, content);
    changedCount++;
    console.log('Updated', file);
  }
});

console.log('Total files updated:', changedCount);
