const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else {
      if (fullPath.endsWith('.tsx')) {
        callback(fullPath);
      }
    }
  });
};

const regexes = [
  // SECTION LABELS
  // Match "pl-[2px] text-[11px] tracking-[0.15em] uppercase text-[#1A1A2E] font-bold whitespace-nowrap"
  {
    regex: /pl-\[2px\] text-\[11px\] tracking-\[0\.15em\] uppercase text-\[#1A1A2E\] font-bold whitespace-nowrap/g,
    replace: "text-[13px] font-bold tracking-[0.08em] text-[#111111] uppercase"
  },
  // Match "text-[12px] font-medium text-[#111111] tracking-[0.08em] uppercase"
  {
    regex: /text-\[12px\] font-medium text-\[#111111\] tracking-\[0\.08em\] uppercase/g,
    replace: "text-[13px] font-bold tracking-[0.08em] text-[#111111] uppercase"
  },
  // Match "text-[12px] font-medium text-[#1F2937] tracking-[0.08em] uppercase"
  {
    regex: /text-\[12px\] font-medium text-\[#1F2937\] tracking-\[0\.08em\] uppercase/g,
    replace: "text-[13px] font-bold tracking-[0.08em] text-[#111111] uppercase"
  },
  
  // HERO CARDS
  // Eyebrow: text-[11px] font-bold text-[#111111] uppercase tracking-[0.15em] mb-1.5 drop-shadow-sm
  {
    regex: /text-\[11px\] font-bold text-\[#111111\] uppercase tracking-\[0\.15em\]/g,
    replace: "text-[11px] font-bold tracking-[0.08em] uppercase text-[#111111]"
  },
  // Title: text-[#1F2937] text-[26px] font-bold mb-2 leading-tight whitespace-nowrap
  {
    regex: /text-\[#1F2937\] text-\[26px\] font-bold mb-2 leading-tight/g,
    replace: "text-[#111111] text-[26px] font-bold mb-2 leading-tight whitespace-nowrap" // making sure whitespace-nowrap is there
  },
  // Title (Quizzes): text-[#1F2937] text-[26px] font-bold mb-2 leading-tight whitespace-nowrap
  {
    regex: /text-\[#111111\] text-\[26px\] font-bold mb-2 leading-tight whitespace-nowrap whitespace-nowrap/g,
    replace: "text-[#111111] text-[26px] font-bold mb-2 leading-tight whitespace-nowrap"
  },

  // LEARNING PATH CARDS
  // Eyebrow label: text-[11px] font-bold uppercase tracking-wider mb-2
  {
    regex: /text-\[11px\] font-bold uppercase tracking-wider/g,
    replace: "text-[11px] font-bold tracking-[0.08em] uppercase"
  },
  // Title text color inside line-clamp-2
  {
    regex: /\$\{status === "Locked" \? "text-\[#6B7280\]" : "text-\[#1F2937\]"\}/g,
    replace: "text-[#111111]"
  },
  // Locked label: text-[#6B7280] px-3 py-1.5 rounded-full text-[11px]
  {
    regex: /text-\[#6B7280\] px-3 py-1\.5 rounded-full text-\[11px\]/g,
    replace: "text-[#888888] px-3 py-1.5 rounded-full text-[13px]"
  },
  // Height: h-[170px]
  {
    regex: /h-\[170px\]/g,
    replace: "h-[140px]"
  }
];

let changedFiles = 0;
walk(path.join(__dirname, 'app'), file => {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;
  regexes.forEach(r => {
    content = content.replace(r.regex, r.replace);
  });
  if (content !== orig) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log("Updated", file);
  }
});

walk(path.join(__dirname, 'components'), file => {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;
  regexes.forEach(r => {
    content = content.replace(r.regex, r.replace);
  });
  // Today's Agenda label in components
  content = content.replace(/font-\[700\] mb-4" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#94a3b8" }}/g, 'font-bold tracking-[0.08em] text-[#111111] uppercase mb-4" style={{ fontSize: "13px" }}');
  if (content !== orig) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log("Updated", file);
  }
});

console.log("Done updating " + changedFiles + " files.");
