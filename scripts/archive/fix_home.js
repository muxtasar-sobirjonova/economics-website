const fs = require('fs');
const path = require('path');

const applyReplacements = (file, replacements) => {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;
  
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }

  if (content !== orig) {
    fs.writeFileSync(file, content);
    console.log("Updated", file);
  }
};

const pageFile = path.join(__dirname, 'app/page.tsx');
applyReplacements(pageFile, [
  // Imports
  { search: /import \{(.*?)\} from "@tabler\/icons-react";/s, replace: 'import { $1 } from "@tabler/icons-react";\nimport { Lightbulb, Globe, BookOpen, Brain } from "lucide-react";' },
  // Buttons
  { search: /className="bg-\[#6B5FE4\] hover:opacity-90 text-white border-none font-bold rounded-\[8px\] transition-all shadow-sm active:scale-95"/g, replace: 'className="bg-[#1E1E3F] text-white font-[500] text-[13px] tracking-wide py-[12px] px-[28px] rounded-[14px] hover:opacity-90 hover:scale-105 transition-all flex items-center gap-2 group active:scale-95 border border-transparent"' },
  { search: /style=\{\{ padding: "14px 28px", fontSize: "15px" \}\}/g, replace: '' },
  // Emojis to Lucide
  { search: /💡 Concepts/, replace: '<Lightbulb size={16} color="#444444" /> Concepts' },
  { search: /🌍 Real-World Examples/, replace: '<Globe size={16} color="#444444" /> Real-World Examples' },
  { search: /📖 Articles/, replace: '<BookOpen size={16} color="#444444" /> Articles' },
  { search: /✍️ Quizzes/, replace: '<Brain size={16} color="#444444" /> Quizzes' },
  // Analytics Section Label
  { search: /<h3 className="text-\[#1A1A3E\] font-black tracking-tight text-\[22px\]">/, replace: '<h3 className="text-[#111111] font-[700] text-[13px] tracking-[0.08em] uppercase">' },
  // Borders
  { search: /border: "1px solid #e2e0f0"/g, replace: 'border: "1px solid #EBEBEB"' },
  { search: /border border-\[rgba\(0,0,0,0\.08\)\]/g, replace: 'border-[1px] border-[#EBEBEB]' },
]);

const todayAgendaFile = path.join(__dirname, 'components/TodayAgendaCard.tsx');
applyReplacements(todayAgendaFile, [
  // Border
  { search: /border: "1px solid #e2e0f0"/g, replace: 'border: "1px solid #EBEBEB"' },
  // Heading
  { search: /<h2\s*className="text-\[#1A1A3E\] tracking-tight"\s*style=\{\{ fontSize: "24px", fontWeight: 900 \}\}/g, replace: '<h2 className="text-[#111111] font-[700] text-[18px] tracking-tight"' },
]);

const reviewMistakesFile = path.join(__dirname, 'components/ReviewMistakesCard.tsx');
applyReplacements(reviewMistakesFile, [
  // Border
  { search: /border: "1px solid #e2e0f0"/g, replace: 'border: "1px solid #EBEBEB"' },
  // Heading
  { search: /<h2\s*className="text-\[#2D3A47\] tracking-tight mb-2"\s*style=\{\{ fontSize: "24px", fontWeight: 900 \}\}/g, replace: '<h2 className="text-[#111111] font-[700] text-[18px] tracking-tight mb-2"' },
  { search: /<h2 className="text-\[#2D3A47\] font-black text-\[22px\] tracking-tight">/g, replace: '<h2 className="text-[#111111] font-[700] text-[18px] tracking-tight">' },
]);
