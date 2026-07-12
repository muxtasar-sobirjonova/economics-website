const fs = require('fs');

const filePath = "app/page.tsx";
let content = fs.readFileSync(filePath, "utf-8");

// 1. Page Background
content = content.replace('bg-[#F8F7FF]', 'bg-[#f8f8ff]');

// 2. Headings & Text
content = content.replace(/text-\[#111827\]/g, 'text-[#1a1a2e]');
content = content.replace(/text-\[#6B7280\]/g, 'text-[#6b6b8a]');
content = content.replace(/text-\[#9CA3AF\]/g, 'text-[#9ca3af]');

// 3. Hero buttons
content = content.replace('bg-[#4F46E5] hover:bg-indigo-700', 'bg-[#5b5fc7] hover:bg-[#4547a8]');
content = content.replace('border-[#4F46E5] text-[#4F46E5] hover:bg-indigo-50', 'border-[#5b5fc7] text-[#5b5fc7] hover:bg-[#eeedfe]');

// 4. Streak tracker
// filled days
content = content.replace(/bg-\[#4F46E5\]/g, 'bg-[#5b5fc7]');
// today outline (assume border-indigo-200 or border-[#4F46E5])
content = content.replace(/border-indigo-200 text-indigo-500 bg-indigo-50/g, 'border-[#5b5fc7] text-[#5b5fc7] bg-transparent');
content = content.replace(/border-indigo-200/g, 'border-[#5b5fc7]');
// future days
content = content.replace(/bg-gray-100 text-gray-400/g, 'bg-[#ececf5] text-[#9ca3af]');

// 5. Cards & Borders
content = content.replace(/border-gray-200/g, 'border-[#ececf5]');
content = content.replace(/border-\[#E5E7EB\]/g, 'border-[#ececf5]');

// 6. Agenda tags
content = content.replace(/bg-indigo-50 text-indigo-700/g, 'bg-[#eeedfe] text-[#5b5fc7]');
content = content.replace(/bg-fuchsia-50 text-fuchsia-700/g, 'bg-[#fce7f3] text-[#9333ea]');
content = content.replace(/bg-emerald-50 text-emerald-700/g, 'bg-[#dcfce7] text-[#16a34a]');

// Replace progress bar background if it's indigo
content = content.replace(/bg-indigo-600/g, 'bg-[#5b5fc7]');

fs.writeFileSync(filePath, content, "utf-8");
