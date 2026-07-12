"use client";

import React, { useState } from "react";
import { X as XIcon, StickyNote } from "lucide-react";

interface QuizPageLayoutProps {
  quizContent: React.ReactNode;
  notesContent: React.ReactNode;
}

export default function QuizPageLayout({ quizContent, notesContent }: QuizPageLayoutProps) {
  const [marginOpen, setMarginOpen] = useState(false);

  return (
    <div className="flex-1 flex relative w-full h-[calc(100vh-56px)] overflow-hidden">
      {/* Main Content */}
      <div 
        className="flex-1 flex flex-col transition-all duration-300 relative h-full overflow-y-auto"
        style={{ marginRight: marginOpen ? '340px' : '0' }}
      >
        <div className="w-full max-w-[720px] mx-auto px-8 pt-8 pb-10">
          {quizContent}
        </div>
      </div>

      {/* Collapsible Notes Panel */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-[340px] bg-[#F8F9FC] border-l border-[#EBEBEB] shadow-[-4px_0_12px_rgba(0,0,0,0.06)] z-[40] transition-transform duration-300 ease-in-out"
        style={{ transform: marginOpen ? 'translateX(0)' : 'translateX(340px)' }}
      >
        <button 
          onClick={() => setMarginOpen(!marginOpen)}
          className="absolute left-[-28px] top-10 w-7 h-[80px] bg-brand-primary rounded-l-[8px] cursor-pointer flex flex-col items-center justify-center gap-1 text-white hover:bg-[#5A4FBD] transition-colors shadow-[-2px_0_8px_rgba(0,0,0,0.1)] border-none"
        >
          {marginOpen ? (
            <XIcon size={16} />
          ) : (
            <>
              <StickyNote size={14} />
              <span className="text-[10px] font-[700] tracking-[0.15em] mt-1" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>NOTES</span>
            </>
          )}
        </button>

        <div className="w-full h-full overflow-y-auto px-5 pt-6">
          {notesContent}
        </div>
      </div>
    </div>
  );
}
