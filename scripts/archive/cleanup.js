const fs = require('fs');

const files = [
  "app/page.tsx",
  "app/articles/page.tsx"
];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, "utf-8");

  // Lingering colors
  content = content.replace(/text-\[#4F46E5\]/gi, 'text-[#5b5fc7]');
  content = content.replace(/bg-\[#4F46E5\]/gi, 'bg-[#5b5fc7]');
  content = content.replace(/border-\[#4F46E5\]/gi, 'border-[#5b5fc7]');
  content = content.replace(/text-\[#111827\]/gi, 'text-[#1a1a2e]');
  content = content.replace(/text-\[#6B7280\]/gi, 'text-[#6b6b8a]');
  content = content.replace(/text-\[#9CA3AF\]/gi, 'text-[#9ca3af]');
  content = content.replace(/bg-\[#EEF2FF\]/gi, 'bg-[#eeedfe]');
  content = content.replace(/border-indigo-100/gi, 'border-[#ececf5]');
  
  fs.writeFileSync(filePath, content, "utf-8");
}
