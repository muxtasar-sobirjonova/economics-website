const fs = require('fs');
const path = require('path');

function lightenHex(hex, percent) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Increase lightness by mixing with white
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  const toHex = (c) => {
    const h = c.toString(16);
    return h.length === 1 ? '0' + h : h;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
        callback(fullPath);
      }
    }
  });
};

let changedFiles = 0;
const dirs = ['app', 'components'];

dirs.forEach(d => {
  walk(path.join(__dirname, d), file => {
    let content = fs.readFileSync(file, 'utf8');
    let orig = content;

    // Find <button ...>...</button> or <button .../>
    // This regex matches a button tag and its attributes. We'll replace bg-[#...] inside it.
    content = content.replace(/<button([^>]*)>/g, (match, p1) => {
      let modifiedAttrs = p1.replace(/bg-\[#([0-9a-fA-F]+)\]/g, (m, hex) => {
        return `bg-[${lightenHex(hex, 20)}]`;
      });
      // Also catch standard tailwind colors if we want, but the prompt says 20% lighter, and we mostly use hex.
      return `<button${modifiedAttrs}>`;
    });

    if (content !== orig) {
      fs.writeFileSync(file, content);
      changedFiles++;
      console.log("Updated", file);
    }
  });
});
console.log("Done updating " + changedFiles + " files.");
