const fs = require('fs');
const glob = require('glob'); // Not available? We can just use readdirSync or hardcoded list
const execSync = require('child_process').execSync;

const filesToFix = [
  'add_be_day29.ts', 'add_be_day30.ts', 'add_be_day31.ts', 'add_be_day32.ts', 'add_be_day33.ts', 'add_be_day34.ts',
  'add_dev_econ_day10.ts', 'add_dev_econ_day11.ts', 'add_dev_econ_day12.ts', 'add_dev_econ_day13.ts',
  'add_dev_econ_day15.ts', 'add_dev_econ_day16.ts', 'add_dev_econ_day17.ts', 'add_dev_econ_day18.ts',
  'add_dev_econ_day19.ts', 'add_dev_econ_day20.ts', 'add_dev_econ_day4.ts', 'add_dev_econ_day5.ts',
  'add_dev_econ_day6.ts', 'add_dev_econ_day7.ts', 'add_dev_econ_day9.ts', 'add_week2.ts',
  'add_week3_placeholders.ts', 'add_week4_placeholders.ts', 'add_week5_placeholders.ts', 'add_week6_placeholders.ts',
  'add_week7_placeholders.ts', 'add_week8_placeholders.ts',
  'app/actions/agenda.ts',
  'check_dev_econ.ts',
  'lib/data.ts',
  'prisma/seed.ts'
];

for (const file of filesToFix) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  let modified = false;

  // Add import if we're going to use Track
  if (content.includes('Track.') || content.match(/track:\s*"[A-Z_]+"/)) {
    if (!content.includes('Track } from')) {
      content = 'import { Track } from "@prisma/client";\n' + content;
      modified = true;
    }
  }

  // Replace track: "SOMETHING" with track: Track.SOMETHING
  const newContent = content.replace(/track:\s*"([A-Z_]+)"/g, 'track: Track.$1');
  if (newContent !== content) {
    content = newContent;
    modified = true;
  }
  
  // Replace activeTrack || "SOMETHING" with activeTrack || Track.SOMETHING
  const newContent2 = content.replace(/\|\|\s*"([A-Z_]+)"/g, '|| Track.$1');
  if (newContent2 !== content) {
    content = newContent2;
    modified = true;
  }
  
  // Replace === "SOMETHING" with === Track.SOMETHING
  const newContent3 = content.replace(/===\s*"([A-Z_]+)"/g, '=== Track.$1');
  if (newContent3 !== content) {
    content = newContent3;
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}

// Special fix for seed.ts which has missing track properties
let seedContent = fs.readFileSync('prisma/seed.ts', 'utf8');
// It creates lessons, quizzes, mistake reviews without track
// e.g. { title: "...", tag: "...", timeEstimate: ..., dayOrder: ... }
seedContent = seedContent.replace(/dayOrder:\s*\d+/g, '$&,\n    track: Track.ENTREPRENEURSHIP_ECONOMICS');
// MistakeReview missing track
seedContent = seedContent.replace(/quizAttemptId:\s*[a-zA-Z0-9_\.]+,/g, '$& track: Track.ENTREPRENEURSHIP_ECONOMICS,');

if (!seedContent.includes('Track } from')) {
  seedContent = 'import { Track } from "@prisma/client";\n' + seedContent;
}

fs.writeFileSync('prisma/seed.ts', seedContent, 'utf8');
console.log('Special fixes applied to seed.ts');

