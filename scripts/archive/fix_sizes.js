const fs = require('fs');

// 1. REVERT QUIZZES PAGE
let quizCode = fs.readFileSync('app/lessons/[lessonId]/quizzes/read/page.tsx', 'utf8');

quizCode = quizCode.replace(
  `           <div className={\`max-w-[900px] w-full mx-auto flex flex-col flex-1 min-h-0 \${cardAnimClass}\`}>
             {/* Card */}
             <div className="bg-[linear-gradient(135deg,#EEF3FF,#F8F9FC)] border border-[#C7D7FF] rounded-[20px] px-[40px] py-[60px] shadow-[0_4px_20px_rgba(61,82,160,0.08)] shrink-0 min-h-[240px] flex flex-col justify-center">
               <div className="flex justify-between items-center">
                  <div className="bg-[#3D52A0] text-white text-[12px] font-[700] px-[14px] py-[6px] rounded-[20px]">
                     QUESTION {currentQuestionIndex + 1} OF 10
                  </div>
                  <div className="text-[13px] text-[#888]">
                     ⚡ Medium
                  </div>
               </div>
               <h2 className="text-[22px] font-[700] text-[#111111] leading-[1.6] mt-[24px]">
                  {currentQuestion?.questionText || currentQuestion?.question}
               </h2>
             </div>`,
  `           <div className={\`max-w-[720px] w-full mx-auto flex flex-col flex-1 min-h-0 \${cardAnimClass}\`}>
             {/* Card */}
             <div className="bg-[linear-gradient(135deg,#EEF3FF,#F8F9FC)] border border-[#C7D7FF] rounded-[20px] px-[24px] py-[20px] shadow-[0_4px_20px_rgba(61,82,160,0.08)] shrink-0">
               <div className="flex justify-between items-center">
                  <div className="bg-[#3D52A0] text-white text-[10px] font-[700] px-[12px] py-[4px] rounded-[20px]">
                     QUESTION {currentQuestionIndex + 1} OF 10
                  </div>
                  <div className="text-[11px] text-[#888]">
                     ⚡ Medium
                  </div>
               </div>
               <h2 className="text-[16px] font-[700] text-[#111111] leading-[1.6] mt-[14px]">
                  {currentQuestion?.questionText || currentQuestion?.question}
               </h2>
             </div>`
);

fs.writeFileSync('app/lessons/[lessonId]/quizzes/read/page.tsx', quizCode, 'utf8');


// 2. UPDATE SAVED PAGE
let savedCode = fs.readFileSync('app/saved/page.tsx', 'utf8');

// Update the wrapper
savedCode = savedCode.replace(
  `<div className="relative w-[520px] h-[280px] flex items-center justify-center shrink-0">`,
  `<div className="relative w-[720px] h-[400px] flex items-center justify-center shrink-0">`
);

// Update active card and slideUnder card sizes
// w-[520px] min-h-[280px] max-h-[240px] ? Wait, earlier I replaced it with `w-[520px] min-h-[280px] py-[32px] px-[36px]`
savedCode = savedCode.replaceAll(
  `w-[520px] min-h-[280px] py-[32px] px-[36px]`,
  `w-[720px] min-h-[400px] py-[40px] px-[48px]`
);

// Update font size inside active card
savedCode = savedCode.replace(
  `<div className="text-[16px] leading-[1.8] text-[#111] font-sans flex-1 overflow-hidden" dangerouslySetInnerHTML={{ __html: activeCard.content }} />`,
  `<div className="text-[22px] leading-[1.8] text-[#111] font-sans flex-1 overflow-hidden" dangerouslySetInnerHTML={{ __html: activeCard.content }} />`
);

fs.writeFileSync('app/saved/page.tsx', savedCode, 'utf8');
console.log('Fixed saved cards and reverted quizzes.');
