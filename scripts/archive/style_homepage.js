const fs = require('fs');

let code = fs.readFileSync('app/page.tsx', 'utf8');

// 1. This Week Card border/shadow
code = code.replace(
  /style={{ borderRadius: "16px", padding: "24px", border: "1px solid #EBEBEB", boxShadow: "0 1px 3px rgba\(0,0,0,0\.06\)" }}/g,
  'style={{ borderRadius: "24px", padding: "24px", border: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.04)" }}'
);

// 2. Action buttons (Continue Learning and Review Mistakes)
// First button (Continue Learning) is already bg-[#7B6FE7] text-[#ffffff].
// Second button (Review Mistakes) needs to be bg-[#F3F0FF] text-[#7B6FE7]
code = code.replace(
  /<button\n                  className="bg-\[#7B6FE7\] text-\[#ffffff\] font-\[500\] text-\[13px\] tracking-wide py-\[12px\] px-\[28px\] rounded-\[14px\] hover:opacity-90 hover:scale-105 transition-all flex items-center gap-2 group active:scale-95 border border-transparent"\n                  \n                >\n                  Review Mistakes\n                <\/button>/g,
  `<button
                  className="bg-[#F3F0FF] text-[#7B6FE7] font-[600] text-[13px] tracking-wide py-[12px] px-[28px] rounded-[14px] hover:opacity-90 hover:scale-105 transition-all flex items-center gap-2 group active:scale-95 border border-transparent"
                  
                >
                  Review Mistakes
                </button>`
);

// 3. "0 of 7 days" badge
code = code.replace(
  /className="bg-\[#f0eaff\] text-\[#5c5c8a\] px-\[12px\] py-\[4px\] rounded-full text-\[13px\] font-\[600\]"/g,
  'className="bg-[#F3F0FF] text-[#7B6FE7] px-[12px] py-[4px] rounded-full text-[13px] font-[700]"'
);

// 4. Day circles styling
code = code.replace(
  /"bg-\[#f8f7ff\] border-\[1\.5px\] border-dashed border-\[#d1ccfa\]"/g,
  '"bg-transparent border-[1.5px] border-dashed border-[#C7D2FE]"'
);
code = code.replace(
  /"bg-\[#ffeceb\] text-\[#f87171\]"/g,
  '"bg-[#FEF2F2] text-[#FCA5A5]"'
);
code = code.replace(
  /"bg-\[#f0edff\] border-\[2px\] border-\[#6b5fe4\]"/g,
  '"bg-[#F3F0FF] border-[2px] border-[#7B6FE7]"'
);

// 5. Analytics Bar (if any)
code = code.replace(
  /className="w-full bg-white rounded-\[24px\] border-\[1px\] border-\[#EBEBEB\] p-6 px-8 flex items-center justify-between"/g,
  'className="w-full bg-white rounded-[24px] border-none shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-6 px-8 flex items-center justify-between"'
);

fs.writeFileSync('app/page.tsx', code, 'utf8');
console.log('Homepage styling applied.');
