const fs = require('fs');

let pageCode = fs.readFileSync('app/saved/page.tsx', 'utf8');

// 1. Filter out empty and 'New Note...' notes
pageCode = pageCode.replace(
  `const notes = notesByLesson[id] || [];`,
  `const rawNotes = notesByLesson[id] || [];\n    const notes = rawNotes.filter((n: any) => {\n      const txt = (n.content || '').replace(/<[^>]*>?/gm, '').trim();\n      return txt !== '' && txt !== 'New Note...';\n    });`
);

// 2. Main Interface layout: flex column, centered, height calc(100vh - 200px)
pageCode = pageCode.replace(
  `<div className="relative flex-1 flex flex-col items-center justify-center min-h-[500px]">`,
  `<div className="relative flex flex-col items-center justify-center h-[calc(100vh-200px)] w-full max-w-[800px] mx-auto">`
);

// 3. Counter spacing
pageCode = pageCode.replace(
  `<div className="text-[13px] font-[700] text-[#555] text-center mb-[16px] absolute top-0">`,
  `<div className="text-[13px] font-[700] text-[#555] text-center mb-[12px]">`
);

// 4. Stack wrapper height and card sizes
pageCode = pageCode.replace(
  `<div className="relative w-[400px] h-[360px] flex items-center justify-center">`,
  `<div className="relative w-[400px] h-[240px] flex items-center justify-center shrink-0">`
);

// Update ALL ghost and active cards sizes: min-h-[220px] -> min-h-[180px] max-h-[240px]
// Update padding: p-[28px] -> p-[20px]
pageCode = pageCode.replaceAll(`min-h-[220px]`, `min-h-[180px] max-h-[240px]`);
pageCode = pageCode.replaceAll(`p-[28px]`, `p-[20px]`);

// 5. Action Buttons styling and spacing
pageCode = pageCode.replace(
  `<div className="mt-[32px] flex gap-[16px] justify-center absolute bottom-10">`,
  `<div className="mt-[20px] flex gap-[16px] justify-center shrink-0">`
);

pageCode = pageCode.replace(
  `className="bg-[#FEF2F2] border-2 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-[12px] px-[32px] py-[14px] font-[700] text-[14px] transition-colors"`,
  `className="bg-[#FEF2F2] border-2 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-[12px] px-[32px] py-[14px] font-[700] text-[14px] transition-colors min-w-[160px]"`
);

pageCode = pageCode.replace(
  `className="bg-[#F0FDF4] border-2 border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E] hover:text-white rounded-[12px] px-[32px] py-[14px] font-[700] text-[14px] transition-colors"`,
  `className="bg-[#F0FDF4] border-2 border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E] hover:text-white rounded-[12px] px-[32px] py-[14px] font-[700] text-[14px] transition-colors min-w-[160px]"`
);

// Re-write the file
fs.writeFileSync('app/saved/page.tsx', pageCode, 'utf8');
console.log('Saved page buttons and sizes fixed.');
