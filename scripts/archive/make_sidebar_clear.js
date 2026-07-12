const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, 'components', 'Sidebar.tsx');
let content = fs.readFileSync(sidebarPath, 'utf8');

// Change section headers (DASHBOARD, LEARN) to be very clear (bright white/slate)
content = content.replace(/text-\[#888888\]/g, 'text-[#E5E7EB]');

// Change inactive nav items to be pure white for maximum clarity
content = content.replace(/text-\[#B4C2D6\]/g, 'text-[#FFFFFF]');
content = content.replace(/text-\[#8F9FB5\]/g, 'text-[#FFFFFF]'); // Dark mode icon

fs.writeFileSync(sidebarPath, content);
console.log("Updated Sidebar.tsx");
