const fs = require('fs');

let savedCode = fs.readFileSync('app/saved/page.tsx', 'utf8');

// The wrapper size:
savedCode = savedCode.replace(
  /w-\[720px\] h-\[360px\] flex items-center justify-center shrink-0/g,
  'w-[460px] h-[240px] flex items-center justify-center shrink-0'
);

// All instances of w-[720px] min-h-[360px] inside that block
savedCode = savedCode.replace(
  /w-\[720px\] min-h-\[360px\] rounded-\[12px\] py-\[40px\] px-\[48px\]/g,
  'w-[460px] min-h-[240px] rounded-[12px] p-[28px]'
);

// Active card text
savedCode = savedCode.replace(
  /<div className="text-\[22px\] leading-\[1.8\] text-\[#111\] font-sans flex-1 overflow-hidden"/g,
  '<div className="text-[16px] leading-[1.8] text-[#111] font-sans flex-1 overflow-hidden"'
);

// Make sure the main container width accommodates the piles:
// The container was max-w-[800px]. Let's make it max-w-[900px] to ensure plenty of room for piles
savedCode = savedCode.replace(
  /max-w-\[800px\] mx-auto/g,
  'max-w-[900px] mx-auto'
);

fs.writeFileSync('app/saved/page.tsx', savedCode, 'utf8');
console.log('Saved cards resized to 460x240.');
