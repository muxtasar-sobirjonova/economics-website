"use client";

import React, { useRef } from "react";



export default function MagazineArticle({
  title,
  contentHtml,
  lessonId,
}: {
  title: string;
  contentHtml: string;
  lessonId?: number;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      // scroll tracking logic removed since scrollProgress is unused
    }
  };

  const cleanContentHtml = contentHtml;

  return (
    <div
      className="flex-1 overflow-y-auto bg-transparent relative"
      ref={scrollContainerRef}
      onScroll={handleScroll}
    >
      <div className="w-full max-w-[1100px] mx-auto px-8 md:px-12 pt-10 pb-[80px]">
        <div className="text-center mb-16 pt-8">
          <h1
            className={`text-[44px] md:text-[52px] font-black text-[var(--text)] leading-[1.1] uppercase tracking-tight`}
          >
            {title}
          </h1>
          <div className="text-center text-faint font-sans font-[500] text-[13px] mt-6 tracking-wide uppercase">
            ESTIMATED READING TIME (10-20 MIN) • DAY 0{lessonId || 1}
          </div>
        </div>

        <div className="flex flex-col">
          <div 
            className="prose prose-lg max-w-[800px] mx-auto w-full prose-h2:text-[var(--text)] prose-h2:uppercase prose-h2:tracking-tight prose-h2:font-bold prose-h2:mt-12 prose-p:text-[18px] prose-p:leading-[1.8] prose-p:text-ink"
            dangerouslySetInnerHTML={{ __html: cleanContentHtml }}
          />
        </div>
      </div>
    </div>
  );
}
