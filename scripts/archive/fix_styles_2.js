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
  // Roadmap Chapter 1
  {
    regex: /text-\[11px\] font-bold text-\[#FFFFFF\] uppercase tracking-\[0\.15em\] mb-1\.5 drop-shadow-sm/g,
    replace: "text-[13px] font-bold tracking-[0.08em] text-[#111111] uppercase mb-1.5"
  },
  // ReviewMistakesCard: Your Answer, Correct Answer, Explanation
  {
    regex: /text-\[11px\] font-black uppercase tracking-wider/g,
    replace: "text-[13px] font-bold tracking-[0.08em] text-[#111111] uppercase"
  },
  // Sidebar items
  {
    regex: /pl-\[12px\] text-\[11px\] tracking-\[0\.15em\] uppercase text-\[#B4C2D6\] opacity-80 mb-\[12px\] font-extrabold/g,
    replace: "pl-[12px] text-[13px] font-bold tracking-[0.08em] text-[#111111] uppercase mb-[12px]"
  },
  // TodayAgendaCard tag
  {
    regex: /ml-2 text-\[11px\] font-semibold uppercase tracking-wide/g,
    replace: "ml-2 text-[13px] font-bold tracking-[0.08em] text-[#111111] uppercase"
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
  if (content !== orig) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log("Updated", file);
  }
});

console.log("Done updating " + changedFiles + " files.");
