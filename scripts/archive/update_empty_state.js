const fs = require('fs');

// 1. Update globals.css
let css = fs.readFileSync('app/globals.css', 'utf8');
if (!css.includes('@keyframes float')) {
    css += `
@keyframes float {
  0%, 100% { transform: rotate(-1deg) translateY(0px); }
  50% { transform: rotate(-1deg) translateY(-8px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
`;
    fs.writeFileSync('app/globals.css', css, 'utf8');
}

// 2. Update page.tsx
let page = fs.readFileSync('app/saved/page.tsx', 'utf8');

const targetStr = `      {!activeLessonId ? (
        <div className="flex-1 flex items-center justify-center text-center text-[#666]">
           {lessonIds.length === 0 ? "You haven't saved any notes yet." : "Select a day to review your notes."}
        </div>
      ) : reviewQueue.length === 0 && knewIt.length === 0 ? (`

const newStr = `      {!activeLessonId ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] shrink-0">
           {/* Card Stack */}
           <div className="relative w-[280px] h-[180px] mb-[20px]">
              {/* Card 3 */}
              <div className="absolute top-[20px] left-[40px] w-[240px] h-[140px] bg-[#E8D6FF] rounded-[12px] opacity-40 shadow-[2px_2px_8px_rgba(0,0,0,0.08)]" style={{ transform: 'rotate(6deg)' }} />
              {/* Card 2 */}
              <div className="absolute top-[10px] left-[20px] w-[240px] h-[140px] bg-[#D6E8FF] rounded-[12px] opacity-60 shadow-[2px_2px_8px_rgba(0,0,0,0.1)]" style={{ transform: 'rotate(3deg)' }} />
              {/* Card 1 */}
              <div className="absolute top-0 left-0 w-[240px] h-[140px] bg-[#FFF9C4] rounded-[12px] shadow-[4px_4px_16px_rgba(0,0,0,0.12)] p-[16px] flex flex-col justify-between animate-float" style={{ transform: 'rotate(-1deg)' }}>
                  <div>
                    <div className="h-[10px] bg-[rgba(0,0,0,0.08)] rounded-[4px] mb-[8px] w-full" />
                    <div className="h-[10px] bg-[rgba(0,0,0,0.08)] rounded-[4px] mb-[8px] w-full" />
                    <div className="h-[10px] bg-[rgba(0,0,0,0.08)] rounded-[4px] mb-[8px] w-[60%]" />
                  </div>
                  <div className="text-[10px] text-[#888]">Lesson 1 · Concepts</div>
              </div>
           </div>

           {/* Instructions */}
           <div className="mb-[16px]">
              <h2 className="text-[20px] font-[800] text-[#111111] text-center mb-[8px]">Review your notes</h2>
              <p className="text-[14px] text-[#666666] text-center leading-[1.6] max-w-[320px] mx-auto">Pick a day above to start reviewing your saved insights.</p>
           </div>

           {/* 3 Steps */}
           <div className="flex gap-[10px] justify-center mb-[16px]">
              <div className="bg-white border border-[#EBEBEB] rounded-[10px] px-[14px] py-[8px] flex items-center gap-[8px] text-[12px] text-[#444]">
                 <div className="w-[22px] h-[22px] rounded-full bg-[#3D52A0] text-white flex items-center justify-center font-[800] text-[11px]">1</div>
                 Pick a day
              </div>
              <div className="bg-white border border-[#EBEBEB] rounded-[10px] px-[14px] py-[8px] flex items-center gap-[8px] text-[12px] text-[#444]">
                 <div className="w-[22px] h-[22px] rounded-full bg-[#3D52A0] text-white flex items-center justify-center font-[800] text-[11px]">2</div>
                 Read each card
              </div>
              <div className="bg-white border border-[#EBEBEB] rounded-[10px] px-[14px] py-[8px] flex items-center gap-[8px] text-[12px] text-[#444]">
                 <div className="w-[22px] h-[22px] rounded-full bg-[#3D52A0] text-white flex items-center justify-center font-[800] text-[11px]">3</div>
                 Sort by memory
              </div>
           </div>

           {/* Swipe Hint */}
           <div className="flex items-center gap-[20px] justify-center">
               <div className="text-[13px] font-[700] text-[#22C55E]">← Memorized</div>
               <div className="w-[1px] h-[24px] bg-[#EBEBEB]" />
               <div className="text-[13px] font-[700] text-[#EF4444]">Review Again →</div>
           </div>
        </div>
      ) : reviewQueue.length === 0 && knewIt.length === 0 ? (`

if (page.includes(targetStr)) {
    page = page.replace(targetStr, newStr);
    fs.writeFileSync('app/saved/page.tsx', page, 'utf8');
    console.log('Updated empty state in page.tsx');
} else {
    console.log('Could not find target string in page.tsx');
}
