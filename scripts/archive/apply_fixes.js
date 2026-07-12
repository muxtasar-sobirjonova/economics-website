const fs = require('fs');

let content = fs.readFileSync('app/(marketing)/page.tsx', 'utf-8');

// 1 & 2. Fix header background and z-index
content = content.replace('bg-white/90 backdrop-blur-md border-b border-gray-200', 'bg-white shadow-sm border-b border-gray-200 z-[100]');

// 3. Fix Mockup screenshots cropped (constrain mockup images)
content = content.replace('h-[520px]', 'h-auto max-h-[520px]');

// 4. Remove ghost text bleeding behind card in Notes mockup
content = content.replace('<div className="absolute left-[20px] top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center opacity-50">\\n        <div className="text-[#22C55E] font-[700] text-[10px]">✓ Memorized</div>\\n      </div>', '');
content = content.replace('<div className="absolute right-[20px] top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center opacity-50">\\n        <div className="text-[#EF4444] font-[700] text-[10px]">↻ Review Again</div>\\n      </div>', '');

// 5. Stray floating "(" character in sidebar
content = content.replace('<div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#7B6FE7] text-white font-bold text-lg flex items-center justify-center mb-8 shadow-sm">T</div>', '<div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#7B6FE7] text-white font-bold text-lg flex items-center justify-center mb-8 shadow-sm"><IconBook size={20} /></div>');

// 6. Two different "completed" indicators (Concepts Mockup)
content = content.replace('backgroundColor: "#4f46e5"', 'backgroundColor: "#15803D"');
content = content.replace('color: "#4f46e5"', 'color: "#15803D"');
content = content.replace('border-l-indigo-600', 'border-l-green-700');

// 7. Standardize progress iconography
content = content.replace('<IconTrophy size={28} />', '<IconCheck size={28} />');
content = content.replace('<button className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ml-3 cursor-pointer border-[#E5E7EB] border-[1.5px] hover:border-[#5C4DE3] hover:bg-[#F3F0FF]"></button>', '<button className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ml-3 cursor-pointer border-[#E5E7EB] border-[1.5px] hover:border-[#5C4DE3] hover:bg-[#F3F0FF]"><IconLock size={16} className="text-gray-400" /></button>');

// 8. Mismatched icon styles in the "Why Choose" grid
// Keep as is

// 9. Unexplained shaded card in the 3-card grid
content = content.replace('bgClass="bg-orange-50"', 'bgClass="bg-purple-50"');
content = content.replace('bgClass="bg-blue-50"', 'bgClass="bg-purple-50"');
content = content.replace('colorClass="text-orange-500"', 'colorClass="text-[#7B6FE7]"');
content = content.replace('colorClass="text-blue-500"', 'colorClass="text-[#7B6FE7]"');
content = content.replace('colorClass="text-purple-500"', 'colorClass="text-[#7B6FE7]"');

// 10. Generic placeholder-style graphic on Notes page
content = content.replace('<NotesMockup />', '<FlashcardMockup />');

// 11. Quizzes page has no visual at all
const quiz_mockup_replace = `<div className="flex items-start gap-5 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm w-full cursor-pointer">
                 <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                   <IconBulb size={28} />
                 </div>
                 <div>
                   <h4 className="font-bold text-[#1A1A3E] text-lg mb-2">Targeted Mistake Review</h4>
                   <p className="text-gray-600 leading-relaxed">Unlike standard quizzes, we isolate your knowledge gaps to help you focus on what matters.</p>
                 </div>
              </div>`;

const new_quiz_mockup = `<div className="bg-[#F8F9FC] rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex flex-col h-[400px] w-full shrink-0 relative">
    <BrowserChrome />
    <div className="p-6 flex-1 flex flex-col items-center justify-center bg-gray-50 gap-4">
      <div className="text-[#362A5C] font-bold text-lg">Quiz: Value Creation</div>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full max-w-sm text-left">
        <p className="font-semibold text-[#111111] mb-4">Which of the following best describes value creation?</p>
        <div className="flex flex-col gap-2">
          <div className="px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-gray-300"></div> Solving a problem for customers</div>
          <div className="px-4 py-3 border-2 border-[#15803D] rounded-lg text-sm text-[#15803D] bg-green-50 font-medium flex items-center gap-2"><IconCheck size={16} /> Increasing the willingness to pay</div>
          <div className="px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-gray-300"></div> Lowering production costs</div>
        </div>
      </div>
    </div>
</div>`;

content = content.replace(quiz_mockup_replace, new_quiz_mockup);

// 12. Three different CTA labels
content = content.replace(/>Sign Up</g, '>Start learning today<');
content = content.replace(/Get started for free/g, 'Start learning today');

// 13. Redundant stat repetition
content = content.replace('New content added monthly: 30 concepts, 30 articles, and 300 quizzes.', 'Constantly updated with fresh case studies and interactive lessons.');

// 14. Tagline mismatch between hero and footer
content = content.replace('Learn entrepreneurial economics, one concept at a time.', 'Master Entrepreneurial Economics, One Concept at a Time.');

// 15. "MY NOTES" vs "Notes" naming inconsistency
content = content.replace('label: "My Notes"', 'label: "Notes"');
content = content.replace('uppercase tracking-wider ', '');

fs.writeFileSync('app/(marketing)/page.tsx', content, 'utf-8');
console.log("Applied fixes successfully.");
