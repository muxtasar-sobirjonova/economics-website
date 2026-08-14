"use client";

import React, { useState } from "react";

export const ArticleSummary = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex-1 bg-surface p-5 md:p-8 flex flex-col gap-4 items-start border border-line border-l-4 border-l-brand-primary rounded-2xl shadow-sm">
      <p
        className="text-ink text-[15px] leading-[1.7] font-normal"
        style={isExpanded ? {} : { display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}
      >
        {text}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-transparent border-none font-semibold text-accent hover:opacity-80 transition-opacity text-[15px] p-0 cursor-pointer"
      >
        {isExpanded ? "Show less" : "Read more..."}
      </button>
    </div>
  );
};
