import { BrowserChrome } from './BrowserChrome';

export const NotesMockup = () => (
  <div className="w-full shrink-0 bg-white rounded-3xl border border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden text-left h-[480px]">
    <BrowserChrome />
    <div className="flex flex-col items-center justify-center flex-1 shrink-0 p-8">
       {/* Card Stack */}
       <div className="relative w-[280px] h-[180px] mb-5 mx-auto scale-90">
          {/* Card 3 */}
          <div className="absolute top-5 left-10 w-[240px] h-[140px] bg-[#E8D6FF] rounded-xl opacity-40 shadow-[2px_2px_8px_rgba(0,0,0,0.08)] rotate-6" />
          {/* Card 2 */}
          <div className="absolute top-2.5 left-5 w-[240px] h-[140px] bg-[#D6E8FF] rounded-xl opacity-60 shadow-[2px_2px_8px_rgba(0,0,0,0.1)] rotate-3" />
          {/* Card 1 */}
          <div className="absolute top-0 left-0 w-[240px] h-[140px] bg-[#FFF9C4] rounded-xl shadow-[4px_4px_16px_rgba(0,0,0,0.12)] p-4 flex flex-col justify-between -rotate-1">
              <div>
                <div className="h-2.5 bg-[rgba(0,0,0,0.08)] rounded mb-2 w-full" />
                <div className="h-2.5 bg-[rgba(0,0,0,0.08)] rounded mb-2 w-full" />
                <div className="h-2.5 bg-[rgba(0,0,0,0.08)] rounded mb-2 w-[60%]" />
              </div>
              <div className="text-[10px] text-gray-400">Lesson 1 · Concepts</div>
          </div>
       </div>

       {/* Instructions */}
       <div className="mb-4">
          <h2 className="text-xl font-[800] text-gray-900 text-center mb-2">Review your notes</h2>
          <p className="text-sm text-gray-500 text-center leading-[1.6] max-w-[320px] mx-auto">Pick a day above to start reviewing your saved insights.</p>
       </div>

       {/* 3 Steps */}
       <div className="flex gap-2.5 justify-center mb-4 scale-90">
          <div className="bg-white border border-[#EBEBEB] rounded-[10px] px-3.5 py-2 flex items-center gap-2 text-xs text-gray-600 shadow-sm">
             <div className="w-[22px] h-[22px] rounded-full bg-[#3D52A0] text-white flex items-center justify-center font-[800] text-[11px]">1</div>
             Pick a day
          </div>
          <div className="bg-white border border-[#EBEBEB] rounded-[10px] px-3.5 py-2 flex items-center gap-2 text-xs text-gray-600 shadow-sm">
             <div className="w-[22px] h-[22px] rounded-full bg-[#3D52A0] text-white flex items-center justify-center font-[800] text-[11px]">2</div>
             Read each card
          </div>
          <div className="bg-white border border-[#EBEBEB] rounded-[10px] px-3.5 py-2 flex items-center gap-2 text-xs text-gray-600 shadow-sm">
             <div className="w-[22px] h-[22px] rounded-full bg-[#3D52A0] text-white flex items-center justify-center font-[800] text-[11px]">3</div>
             Sort by memory
          </div>
       </div>

       {/* Swipe Hint */}
       <div className="flex items-center gap-5 justify-center scale-90">
           <div className="text-[13px] font-[700] text-green-500">← Memorized</div>
           <div className="w-[1px] h-6 bg-[#EBEBEB]" />
           <div className="text-[13px] font-[700] text-red-500">Review Again →</div>
       </div>
    </div>
  </div>
);