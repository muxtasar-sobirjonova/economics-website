const fs = require('fs');
let content = fs.readFileSync('app/saved/page.tsx', 'utf8');

// Find the last instance of {/* Action Buttons */} and just replace everything after it
const splitPos = content.lastIndexOf(`{/* Action Buttons */}`);
if (splitPos !== -1) {
    const start = content.slice(0, splitPos);
    const end = `          {/* Action Buttons */}
          <div className="mt-[28px] flex gap-[16px] justify-center shrink-0">
             <button onClick={() => confirmAction('reviewAgain')} className="bg-[#FEF2F2] border-2 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-[12px] px-[32px] py-[14px] font-[700] text-[14px] transition-colors min-w-[160px]">
               ↻ Review Again
             </button>
             <button onClick={() => confirmAction('knewIt')} className="bg-[#F0FDF4] border-2 border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E] hover:text-white rounded-[12px] px-[32px] py-[14px] font-[700] text-[14px] transition-colors min-w-[160px]">
               ✓ Memorized
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
`;
    fs.writeFileSync('app/saved/page.tsx', start + end, 'utf8');
    console.log('Fixed syntax at end of file.');
} else {
    console.log('Could not find Action Buttons');
}
