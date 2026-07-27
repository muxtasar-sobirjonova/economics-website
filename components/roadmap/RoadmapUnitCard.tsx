import React from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type RoadmapUnitCardProps = {
  chapterNumber: number;
  title: string;
  description: string;
  bgClass?: string;
  btnClass?: string;
  startHref?: string;
  disabled?: boolean;
};

export const RoadmapUnitCard = ({
  chapterNumber,
  title,
  description,
  bgClass = "bg-primary-100",
  btnClass = "bg-primary-500",
  startHref,
  disabled = false,
}: RoadmapUnitCardProps) => {
  return (
    <div 
      className={`w-full max-w-[520px] rounded-3xl px-6 py-6 mt-10 mb-6 relative shrink-0 font-sans shadow-sm border-none ${bgClass} ${disabled ? "opacity-60" : ""}`}
    >
      <div className="pl-2 pr-32">
        <div className="text-[12px] font-bold tracking-widest text-[#3a2072] uppercase mb-2 opacity-80">
          CHAPTER {chapterNumber}
        </div>
        <div className="font-extrabold text-xl mb-3 text-gray-900 leading-[1.25]">
          {title}
        </div>
        <div className="text-[14px] text-[#222222] font-medium leading-[1.5]">
          {description}
        </div>
      </div>
      
      {startHref && !disabled ? (
        <Link href={startHref} className={`absolute top-6 right-6 ${disabled ? "pointer-events-none" : ""}`}>
          <Button 
            disabled={disabled}
            className={`rounded-[14px] flex items-center gap-2 group text-white border-none shadow-sm px-4 py-2 font-bold transition-all hover:brightness-110 hover:-translate-y-[2px] ${btnClass}`}
          >
            {disabled ? "Locked" : "Start"}
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
        </Link>
      ) : (
        <div className="absolute top-6 right-6">
          <Button 
            disabled={true}
            className={`rounded-[14px] flex items-center gap-2 group text-white border-none shadow-sm px-4 py-2 font-bold transition-all hover:brightness-110 hover:-translate-y-[2px] ${btnClass}`}
          >
            Locked
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
      )}
    </div>
  );
};
