const fs = require('fs');
const path = require('path');

const sidebarPath = 'C:\\\\Users\\\\user\\\\.gemini\\\\antigravity-ide\\\\scratch\\\\economics_website\\\\components\\\\Sidebar.tsx';
const layoutPath = 'C:\\\\Users\\\\user\\\\.gemini\\\\antigravity-ide\\\\scratch\\\\economics_website\\\\app\\\\layout.tsx';

// Sidebar replacements
let sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');
const sidebarReplacements = {
    'bg-[#2D2B55]': 'bg-[#4b4474]',
    'bg-[#6B5FE4]': 'bg-[#7c6fe4]',
    'text-[#6B5FE4]': 'text-[#7c6fe4]',
    'border-[#6B5FE4]': 'border-[#7c6fe4]',
    'rgba(107,95,228,0.25)': 'rgba(124,111,228,0.25)', // For the active nav item bg
};
for (const [oldVal, newVal] of Object.entries(sidebarReplacements)) {
    sidebarContent = sidebarContent.split(oldVal).join(newVal);
}
fs.writeFileSync(sidebarPath, sidebarContent, 'utf-8');

// Layout replacements
let layoutContent = fs.readFileSync(layoutPath, 'utf-8');
const layoutReplacements = {
    'bg-[#FFF7E6]': 'bg-[#f8f9fe]',
    'text-[#0096a5]': 'text-[#2d2a3f]',
};
for (const [oldVal, newVal] of Object.entries(layoutReplacements)) {
    layoutContent = layoutContent.split(oldVal).join(newVal);
}
fs.writeFileSync(layoutPath, layoutContent, 'utf-8');

console.log("Updated Layout and Sidebar!");
