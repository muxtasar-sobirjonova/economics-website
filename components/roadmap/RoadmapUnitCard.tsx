import React from "react";
import { Button } from "@/components/ui/Button";

export const RoadmapUnitCard = () => {
  return (
    <div className="w-full max-w-[520px] rounded-3xl px-8 py-8 mt-10 mb-6 relative shrink-0 font-sans bg-[#d2aefd] shadow-sm border-none">
      <div className="pl-4">
        <div className="text-[13px] font-bold tracking-widest text-[#3a2072] uppercase mb-2">
          CHAPTER 1
        </div>
        <div className="font-extrabold text-2xl mb-4 text-gray-900 leading-[1.2] max-w-[70%]">
          Foundations of Entrepreneurship Economics
        </div>
        <div className="text-sm text-[#222222] font-medium leading-[1.6] pr-2">
          Understand what entrepreneurship economics is, why
          entrepreneurs exist, and how businesses create, deliver, and
          capture value in the economy.
        </div>
      </div>
      <Button className="absolute top-8 right-8 bg-[#816de5] hover:bg-[#816de5]/90 rounded-[14px] flex items-center gap-2 group">
        Start reading
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:translate-x-1"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
};
