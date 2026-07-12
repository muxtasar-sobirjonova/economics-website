const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function processSidebar(content) {
  // Sidebar background -> #2F4156 (navy)
  content = content.replace(/bg-\[\#3D2B7A\]/g, 'bg-navy');
  content = content.replace(/text-\[\#3D2B7A\]/g, 'text-navy');
  
  // Active nav item
  content = content.replace(/bg-\[\#4a3594\] text-\[\#ffffff\]/g, 'bg-[rgba(200,217,230,0.12)] border-l-[2.5px] border-sky-blue text-white');
  
  // Inactive nav items
  content = content.replace(/text-\[rgba\(255,255,255,0\.65\)\]/g, 'text-sky-blue opacity-65');
  content = content.replace(/text-\[rgba\(255,255,255,0\.50\)\]/g, 'text-sky-blue opacity-65');
  content = content.replace(/hover:bg-\[rgba\(255,255,255,0\.08\)\]/g, 'hover:bg-[rgba(200,217,230,0.12)]');
  
  // Section labels (DASHBOARD, LEARN) -> #567C8D (teal)
  content = content.replace(/text-\[rgba\(255,255,255,0\.45\)\]/g, 'text-teal');
  
  // Logo box background -> #567C8D, text #FFFFFF
  content = content.replace(/bg-gradient-to-br from-\[\#00c6ff\] to-\[\#0072ff\]/g, 'bg-teal');
  
  // Logo/brand name text -> #C8D9E6 (sky-blue)
  content = content.replace(/text-white text-\[18px\]/g, 'text-sky-blue text-[18px]');
  
  // Dark mode toggle background -> #567C8D, dot #F5EFEB
  content = content.replace(/bg-\[\#2B1E5A\]/g, 'bg-teal');
  content = content.replace(/bg-\[\#ffffff\]/g, 'bg-beige'); // dot
  
  // Dropdown pill
  content = content.replace(/text-\[14px\] font-semibold text-white/g, 'text-[14px] font-semibold text-sky-blue');
  content = content.replace(/text-\[rgba\(255,255,255,0\.6\)\]/g, 'text-sky-blue');
  return content;
}

function processAgendaCard(content) {
  // Completion badge
  content = content.replace(/bg-\[\#F8FAFC\] text-\[\#6b6b8a\] border-\[\#E5E7EB\]/g, 'bg-sky-blue text-navy border-sky-blue');
  content = content.replace(/bg-\[\#ecfdf5\] text-\[\#059669\] border-\[\#d1fae5\]/g, 'bg-sky-blue text-navy border-sky-blue');
  
  // Left border accents - replace purple/amber logic
  content = content.replace(/const accentColor = isLesson \? '\#7c3aed' : '\#d97706';/g, "const accentColor = isLesson ? 'var(--navy)' : 'var(--navy)';");
  content = content.replace(/const badgeBg = isLesson \? '\#f5f3ff' : '\#fffbeb';/g, "const badgeBg = isLesson ? 'rgba(47,65,86,0.1)' : 'rgba(86,124,141,0.15)';");
  content = content.replace(/const badgeText = isLesson \? '\#7c3aed' : '\#b45309';/g, "const badgeText = 'var(--navy)';");
  content = content.replace(/borderColor: isLesson \? '\#ddd6fe' : '\#fde68a'/g, "borderColor: 'transparent'");
  
  // Completion circle
  content = content.replace(/border-\[\#cbd5e1\]/g, 'border-sky-blue border-[1.5px]');
  content = content.replace(/bg-\[\#6c5ce7\] border-\[\#6c5ce7\] shadow-\[0_0_0_3px_rgba\(108,92,231,0\.18\)\]/g, 'bg-teal border-teal shadow-[0_0_0_3px_rgba(86,124,141,0.18)]');
  
  // Time meta
  content = content.replace(/bg-\[\#F8FAFC\]/g, 'bg-beige'); // or transparent
  return content;
}

function processMistakesCard(content) {
  content = content.replace(/bg-\[\#6c5ce7\]/g, 'bg-navy');
  content = content.replace(/hover:bg-\[\#5f4bc9\]/g, 'hover:bg-teal');
  return content;
}

function processPage(content) {
  // Primary buttons (Continue Learning) -> Navy bg, Beige text
  content = content.replace(/bg-\[\#6c5ce7\] hover:bg-\[\#5f4bc9\] text-white/g, 'bg-navy hover:bg-teal text-beige border-none');
  
  // Secondary buttons (Review Mistakes) -> transparent bg, 1.5px solid navy border, navy text
  content = content.replace(/bg-transparent text-\[\#6c5ce7\] border-\[2px\] border-\[\#e0deff\]/g, 'bg-transparent text-navy border-[1.5px] border-navy');
  
  // Weekly Streak day boxes
  content = content.replace(/bg-white border-\[2px\] border-\[\#6c5ce7\]/g, 'bg-[rgba(86,124,141,0.1)] border-[1.5px] border-teal');
  content = content.replace(/bg-transparent border-\[2px\] border-\[\#F0F1F3\]/g, 'bg-transparent border-[1.5px] border-sky-blue');
  content = content.replace(/bg-\[\#6c5ce7\]/g, 'bg-[rgba(86,124,141,0.1)] border-[1.5px] border-teal');
  
  // "Study today to build your streak ->"
  content = content.replace(/text-\[\#6c5ce7\]/g, 'text-teal');
  
  // Streak badge X of 7 days
  content = content.replace(/bg-\[\#f4f3fb\] text-\[\#6c5ce7\]/g, 'bg-sky-blue text-navy');
  return content;
}

function replaceColors(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Specific components
  if (filePath.includes('Sidebar.tsx')) content = processSidebar(content);
  if (filePath.includes('TodayAgendaCard.tsx')) content = processAgendaCard(content);
  if (filePath.includes('ReviewMistakesCard.tsx')) content = processMistakesCard(content);
  if (filePath.includes('app\\page.tsx') || filePath.includes('app/page.tsx')) content = processPage(content);

  // Generic color replacements
  
  // Backgrounds
  content = content.replace(/bg-\[\#F5F4FF\]/gi, 'bg-beige');
  content = content.replace(/bg-\[\#F8FAFC\]/gi, 'bg-beige');
  content = content.replace(/bg-\[\#f8f8ff\]/gi, 'bg-beige');
  content = content.replace(/bg-\[\#FAF6EF\]/gi, 'bg-beige');
  
  // Purples -> Navy/Teal
  content = content.replace(/bg-\[\#6A56A6\]/gi, 'bg-navy');
  content = content.replace(/text-\[\#6A56A6\]/gi, 'text-teal');
  content = content.replace(/hover:bg-\[\#403366\]/gi, 'hover:bg-teal');
  content = content.replace(/text-\[\#403366\]/gi, 'text-teal');
  content = content.replace(/hover:text-\[\#A898D4\]/gi, 'hover:text-teal');
  content = content.replace(/bg-\[\#6c5ce7\]/gi, 'bg-navy');
  content = content.replace(/hover:bg-\[\#5f4bc9\]/gi, 'hover:bg-teal');
  content = content.replace(/text-\[\#6c5ce7\]/gi, 'text-teal');
  content = content.replace(/border-\[\#6c5ce7\]/gi, 'border-teal');
  
  // Primary Text (Dark blues/blacks)
  content = content.replace(/text-\[\#1a1a2e\]/gi, 'text-navy');
  content = content.replace(/text-\[\#111111\]/gi, 'text-navy');
  content = content.replace(/text-gray-900/gi, 'text-navy');
  content = content.replace(/text-slate-700/gi, 'text-navy');
  content = content.replace(/text-\[\#4a4a68\]/gi, 'text-navy');
  content = content.replace(/text-\[\#2a2318\]/gi, 'text-navy');
  content = content.replace(/bg-\[\#1a1a12\]/gi, 'bg-navy');

  // Secondary/Muted Text
  content = content.replace(/text-\[\#6b6b8a\]/gi, 'text-teal');
  content = content.replace(/text-\[\#9ca3af\]/gi, 'text-teal');
  content = content.replace(/text-gray-500/gi, 'text-teal');
  
  // Borders
  content = content.replace(/border-\[\#E5E7EB\]/gi, 'border-sky-blue');
  content = content.replace(/border-\[\#F0F1F3\]/gi, 'border-sky-blue');
  content = content.replace(/border-\[\#e0deff\]/gi, 'border-sky-blue');
  content = content.replace(/border-\[\#cbd5e1\]/gi, 'border-sky-blue');
  content = content.replace(/border-\[\#e0d8cc\]/gi, 'border-sky-blue');

  // Card Borders & Divider specific rules
  // Let's replace any border that is F0F1F3 or e0d8cc or e0deff to be sky-blue and 0.5px.
  // Actually, we already set them to border-sky-blue.
  
  // Pure white pages -> beige
  // If the component uses 'bg-white', we only keep it for cards.
  // I will not blind-replace bg-white unless it is heavily on main layouts.

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

walkDir('./app', replaceColors);
walkDir('./components', replaceColors);
