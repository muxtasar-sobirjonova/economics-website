const fs = require('fs');

let pageCode = fs.readFileSync('app/saved/page.tsx', 'utf8');

// 1. Header margin
pageCode = pageCode.replace(
  `<div className="mb-10 shrink-0">`,
  `<div className="mb-[8px] shrink-0">`
);

// 2. Main review container
pageCode = pageCode.replace(
  `<div className="relative flex flex-col items-center justify-center h-[calc(100vh-200px)] w-full max-w-[800px] mx-auto">`,
  `<div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-160px)] w-full max-w-[800px] mx-auto">`
);

// 3. Counter styling
pageCode = pageCode.replace(
  `<div className="text-[13px] font-[700] text-[#555] text-center mb-[12px]">`,
  `<div className="text-[14px] font-[700] text-[#555] text-center mb-[20px]">`
);

// 4. Ghost and Active Cards sizing
// First change the wrapper width
pageCode = pageCode.replace(
  `<div className="relative w-[400px] h-[240px] flex items-center justify-center shrink-0">`,
  `<div className="relative w-[520px] h-[280px] flex items-center justify-center shrink-0">`
);

// Update all card sizing instances
pageCode = pageCode.replaceAll(
  `w-[400px] min-h-[180px] max-h-[240px] p-[20px]`,
  `w-[520px] min-h-[280px] py-[32px] px-[36px]`
);

// Active card text font size
pageCode = pageCode.replace(
  `<div className="text-[15px] leading-[1.8] text-[#111] font-sans flex-1 overflow-hidden" dangerouslySetInnerHTML={{ __html: activeCard.content }} />`,
  `<div className="text-[16px] leading-[1.8] text-[#111] font-sans flex-1 overflow-hidden" dangerouslySetInnerHTML={{ __html: activeCard.content }} />`
);

// Ghost card transforms
pageCode = pageCode.replace(
  `transform: 'translateY(16px) scale(0.94)'`,
  `transform: 'translateY(20px) scale(0.94)'`
);
pageCode = pageCode.replace(
  `transform: 'translateY(8px) scale(0.97)'`,
  `transform: 'translateY(10px) scale(0.97)'`
);

// 5. Left/Right Pile sizing
pageCode = pageCode.replaceAll(
  `w-[80px] h-[100px]`,
  `w-[100px] h-[130px]`
);
pageCode = pageCode.replaceAll(
  `shadow-[2px_2px_8px_rgba(0,0,0,0.1)]`,
  `shadow-[2px_2px_8px_rgba(0,0,0,0.12)]`
);

// 6. Action buttons margin
pageCode = pageCode.replace(
  `<div className="mt-[20px] flex gap-[16px] justify-center shrink-0">`,
  `<div className="mt-[28px] flex gap-[16px] justify-center shrink-0">`
);

// Re-write the file
fs.writeFileSync('app/saved/page.tsx', pageCode, 'utf8');
console.log('Saved page sizes adjusted.');
