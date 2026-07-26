const fs = require('fs');

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

  // Replace const track = "SOMETHING";
  const newContent = content.replace(/const track = "([A-Z_]+)";/g, 'const track = Track.$1;');
  if (newContent !== content) {
    content = newContent;
    modified = true;
  }
  
  // Replace const track = 'SOMETHING';
  const newContent2 = content.replace(/const track = '([A-Z_]+)';/g, 'const track = Track.$1;');
  if (newContent2 !== content) {
    content = newContent2;
    modified = true;
  }
  
  // check lib/data.ts which might have other usages like `track: string`
  if (file === 'lib/data.ts') {
     content = content.replace(/track: string/g, 'track: Track');
     content = content.replace(/track = "ENTREPRENEURSHIP_ECONOMICS"/g, 'track = Track.ENTREPRENEURSHIP_ECONOMICS');
     modified = true;
  }
  if (file === 'check_dev_econ.ts') {
    content = content.replace(/'DEVELOPMENT_ECONOMICS'/g, 'Track.DEVELOPMENT_ECONOMICS');
    modified = true;
  }

  if (modified) {
    if (!content.includes('Track } from')) {
      content = 'import { Track } from "@prisma/client";\n' + content;
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
