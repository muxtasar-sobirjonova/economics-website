"use client";

import React from "react";
import Link from "next/link";
import BookmarkButton from "@/components/BookmarkButton";
import { Lightbulb, FileText, HelpCircle, Clock } from "lucide-react";

interface LessonCardProps {
  lessonId: number;
  lessonNumber: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  section: "Concepts" | "Articles" | "Quizzes";
  href: string;
  metadata?: React.ReactNode;
}

const SECTION_CONFIG = {
  Concepts: {
    accentColor: "#4f46e5",
    borderClass: "border-l-indigo-600",
    hoverBorderClass: "hover:border-l-indigo-400",
    activeBg: "shadow-[0_8px_30px_rgba(79,70,229,0.12)]",
    iconBg: "bg-indigo-50",
    iconStroke: "#4f46e5",
  },
  Articles: {
    accentColor: "#16a34a",
    borderClass: "border-l-emerald-600",
    hoverBorderClass: "hover:border-l-emerald-400",
    activeBg: "shadow-[0_8px_30px_rgba(22,163,74,0.12)]",
    iconBg: "bg-emerald-50",
    iconStroke: "#16a34a",
  },
  Quizzes: {
    accentColor: "#2563eb",
    borderClass: "border-l-blue-600",
    hoverBorderClass: "hover:border-l-blue-400",
    activeBg: "shadow-[0_8px_30px_rgba(37,99,235,0.12)]",
    iconBg: "bg-blue-50",
    iconStroke: "#2563eb",
  },
};

// Section icons have been replaced by lucide-react icons

export default function LessonCard({
  lessonId,
  lessonNumber,
  title,
  description,
  isActive,
  isCompleted,
  section,
  href,
  metadata,
}: LessonCardProps) {
  const config = SECTION_CONFIG[section];

  let statusText = "NOT STARTED";
  let statusDotColor = "#D1D5DB";
  let statusTextColor = "rgba(17,24,39,0.45)";

  if (isCompleted) {
    statusText = "COMPLETED";
    statusDotColor = config.accentColor;
    statusTextColor = "#111827";
  } else if (isActive) {
    statusText = "IN PROGRESS";
    statusDotColor = "#F59E0B";
    statusTextColor = "#111827";
  }

  return (
    <Link href={href} className="block shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" style={{ width: "260px", minHeight: "220px" }}>
      <div
        data-active={isActive}
        className={`relative w-full h-full min-h-[220px] p-6 rounded-[20px] cursor-pointer bg-white flex flex-col
          border-y border-r border-gray-100 border-l-[5px] transition-all duration-200 ease-out
          ${isActive
            ? `${config.borderClass} ${config.activeBg} -translate-y-1`
            : `border-l-gray-100 hover:${config.borderClass} hover:shadow-[0_8px_30px_rgba(0,0,0,0.09)] hover:-translate-y-1`
          }`}
      >
        {/* Completed checkmark badge */}
        {isCompleted && (
          <div
            className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
            style={{ backgroundColor: config.accentColor }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        )}

        <div className="relative z-10 flex flex-col h-full">
          {/* Header: badge + bookmark */}
          <div className="flex items-start justify-between mb-4">
            <span
              className="text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-lg"
              style={{ color: config.accentColor, backgroundColor: `${config.accentColor}14` }}
            >
              LESSON {lessonNumber}
            </span>
            <div onClick={(e) => e.preventDefault()} className="z-30 relative -mt-1 -mr-1">
              <BookmarkButton
                variant="light"
                slug={`lesson-${lessonId}-${section.toLowerCase()}`}
                initialIsSaved={false}
              />
            </div>
          </div>

          {/* Icon thumbnail area */}
          <div className="mb-4">
            {section === "Concepts" && <Lightbulb size={24} className="text-gray-600" />}
            {section === "Articles" && <FileText size={24} className="text-gray-600" />}
            {section === "Quizzes" && <HelpCircle size={24} className="text-gray-600" />}
          </div>

          {/* Title */}
          <h4 className="font-bold text-[15px] leading-tight mb-2 text-[#111827] line-clamp-2">
            {title}
          </h4>

          {section === "Concepts" || section === "Articles" ? (
            <div className="flex flex-col gap-1 mb-2">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Clock size={14} />
                <span className="text-xs font-medium">5-10 mins read</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusText === "COMPLETED" ? config.accentColor : statusText === "IN PROGRESS" ? "#F59E0B" : "#D1D5DB" }} />
                <span className="text-xs text-gray-500 font-medium">
                  {statusText === "COMPLETED" ? "Completed" : statusText === "IN PROGRESS" ? "In Progress" : "Not Started"}
                </span>
              </div>
            </div>
          ) : section === "Quizzes" ? (
            <div className="mb-2 text-xs text-gray-500 font-medium">
              10 questions
            </div>
          ) : null}

          {/* Metadata slot (read time, difficulty, etc.) */}
          {metadata && <div className="mb-3">{metadata}</div>}

          {/* Progress indicator at bottom */}
          <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-100">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusDotColor }} />
            <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: statusTextColor }}>
              {statusText}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
