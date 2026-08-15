import React from "react";
import { Note } from "./NotesReviewClient";
import { Lesson } from "@prisma/client";

interface ReviewCardProps {
  activeCard: Note;
  lesson?: Lesson;
  isDragging: boolean;
  dragX: number;
  dragStyle: React.CSSProperties;
  animClass: string;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerCancel: (e: React.PointerEvent) => void;
}

export function ReviewCard({
  activeCard,
  lesson,
  isDragging,
  dragX,
  dragStyle,
  animClass,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel
}: ReviewCardProps) {
  const showKnewIt = dragX < -50;
  const showReview = dragX > 50;

  return (
    <div 
      className={`absolute w-[460px] min-h-[240px] rounded-xl p-7 shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex flex-col z-[10] ${animClass}`}
      style={{ 
        backgroundColor: activeCard.color || '#FFF9C4', 
        cursor: isDragging ? 'grabbing' : 'grab',
        ...dragStyle
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {/* KNEW IT overlay */}
      <div className={`absolute inset-0 bg-[rgba(34,197,94,0.12)] rounded-xl flex items-center justify-center transition-opacity duration-200 pointer-events-none ${showKnewIt ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-green-500 text-xl font-[900] px-4 py-2 rotate-[-15deg]">✓ MEMORIZED</div>
      </div>

      {/* REVIEW overlay */}
      <div className={`absolute inset-0 bg-[rgba(239,68,68,0.12)] rounded-xl flex items-center justify-center transition-opacity duration-200 pointer-events-none ${showReview ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-red-500 text-xl font-[900] px-4 py-2 rotate-[15deg]">↻ REVIEW</div>
      </div>

      <div className="text-base leading-[1.8] text-gray-900 font-sans flex-1 overflow-hidden" dangerouslySetInnerHTML={{ __html: activeCard.content }} />
      
      <div className="mt-6 flex justify-between items-center shrink-0">
        <span className="text-[11px] text-gray-400">Lesson {lesson?.id} · {lesson?.title}</span>
      </div>
    </div>
  );
}
