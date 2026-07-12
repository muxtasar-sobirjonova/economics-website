const fs = require('fs');

let savedCode = fs.readFileSync('app/saved/page.tsx', 'utf8');

// The wrapper size:
savedCode = savedCode.replace(
  `<div className="relative w-[720px] h-[400px] flex items-center justify-center shrink-0">`,
  `<div className="relative w-[720px] h-[360px] flex items-center justify-center shrink-0">`
);
savedCode = savedCode.replace(
  `<div className="relative w-[520px] h-[280px] flex items-center justify-center shrink-0">`,
  `<div className="relative w-[720px] h-[360px] flex items-center justify-center shrink-0">`
);
savedCode = savedCode.replace(
  `<div className="relative w-[400px] h-[240px] flex items-center justify-center shrink-0">`,
  `<div className="relative w-[720px] h-[360px] flex items-center justify-center shrink-0">`
);

// We need to replace all instances of w-[400px] inside that block with w-[720px]
// Let's just use regex for the cards.
savedCode = savedCode.replace(
  /absolute w-\[400px\] min-h-\[180px\] max-h-\[240px\] rounded-\[12px\] p-\[20px\]/g,
  'absolute w-[720px] min-h-[360px] rounded-[12px] py-[40px] px-[48px]'
);
savedCode = savedCode.replace(
  /absolute w-\[520px\] min-h-\[280px\] py-\[32px\] px-\[36px\]/g,
  'absolute w-[720px] min-h-[360px] rounded-[12px] py-[40px] px-[48px]'
);

// Active card might have different classes (it has shadow, flex-col, z-[10], animClass)
// Let's find the active card:
savedCode = savedCode.replace(
  /absolute w-\[400px\] min-h-\[180px\] max-h-\[240px\] rounded-\[12px\] p-\[20px\] shadow/g,
  'absolute w-[720px] min-h-[360px] rounded-[12px] py-[40px] px-[48px] shadow'
);
savedCode = savedCode.replace(
  /absolute w-\[520px\] min-h-\[280px\] py-\[32px\] px-\[36px\] shadow/g,
  'absolute w-[720px] min-h-[360px] rounded-[12px] py-[40px] px-[48px] shadow'
);

// Also change the text inside the active card to be larger (22px)
savedCode = savedCode.replace(
  /<div className="text-\[16px\] leading-\[1.8\] text-\[#111\] font-sans flex-1 overflow-hidden"/g,
  '<div className="text-[22px] leading-[1.8] text-[#111] font-sans flex-1 overflow-hidden"'
);
savedCode = savedCode.replace(
  /<div className="text-\[15px\] leading-\[1.8\] text-\[#111\] font-sans flex-1 overflow-hidden"/g,
  '<div className="text-[22px] leading-[1.8] text-[#111] font-sans flex-1 overflow-hidden"'
);

// Decrease gaps slightly so it doesn't scroll on short screens
savedCode = savedCode.replace(
  /<div className="mt-\[28px\] flex gap-\[16px\] justify-center shrink-0">/,
  '<div className="mt-[16px] flex gap-[16px] justify-center shrink-0">'
);
savedCode = savedCode.replace(
  /<div className="text-\[14px\] font-\[700\] text-\[#555\] text-center mb-\[20px\]">/,
  '<div className="text-[14px] font-[700] text-[#555] text-center mb-[12px]">'
);

fs.writeFileSync('app/saved/page.tsx', savedCode, 'utf8');
console.log('Saved cards resized correctly.');
