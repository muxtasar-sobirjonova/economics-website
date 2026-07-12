const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components/marketing');
const files = fs.readdirSync(dir);

for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix 'use client' position
  if (content.includes("'use client';")) {
    content = content.replace(/'use client';\s*/g, '');
    content = "'use client';\n" + content;
  }

  // Fix ConceptsMockup inline style
  if (file === 'ConceptsMockup.tsx') {
    content = content.replace(/style={{ width: "260px", minHeight: "220px" }}/g, 'className="block shrink-0 w-[260px] min-h-[220px]"');
    // It might already have className="block shrink-0". Let's handle it safely.
    content = content.replace(/className="block shrink-0"\s*className="block shrink-0 w-\[260px\] min-h-\[220px\]"/g, 'className="block shrink-0 w-[260px] min-h-[220px]"');
    content = content.replace(/className="block shrink-0"\s*style={{ width: "260px", minHeight: "220px" }}/g, 'className="block shrink-0 w-[260px] min-h-[220px]"');
  }

  // Add comment in FeatureCard
  if (file === 'FeatureCard.tsx') {
    content = content.replace(/style={{\s*background: useMotionTemplate`/g, 'style={{\n          /* Dynamic radial gradient based on mouse position (runtime value) */\n          background: useMotionTemplate`');
  }

  // Fix aria-labels in DashboardMockup
  if (file === 'DashboardMockup.tsx') {
    // The buttons have <IconLock /> or similar inside.
    content = content.replace(/<button([^>]+)><IconLock/g, '<button aria-label="Lock feature"$1><IconLock');
    content = content.replace(/<button([^>]+)><IconChevronLeft/g, '<button aria-label="Go back"$1><IconChevronLeft');
    content = content.replace(/<button([^>]+)><IconChevronRight/g, '<button aria-label="Go forward"$1><IconChevronRight');
    content = content.replace(/<button([^>]+)><IconMenu2/g, '<button aria-label="Open menu"$1><IconMenu2');
  }

  fs.writeFileSync(filePath, content);
}

console.log('Fixed audit issues in components');
