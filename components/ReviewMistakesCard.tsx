"use client";

import { useState, useTransition, useOptimistic } from "react";
import {
  IconX,
  IconCheck,
  IconChevronRight,
  IconChevronLeft,
} from "@tabler/icons-react";
import { removeMistakeAction } from "@/app/actions/quiz";
import { motion, AnimatePresence } from "framer-motion";

export interface Mistake {
  id: string; // quizAttemptId
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string | null;
  timestamp: string;
}

interface ReviewMistakesCardProps {
  initialMistakes: Mistake[];
}

export default function ReviewMistakesCard({
  initialMistakes,
}: ReviewMistakesCardProps) {
  const [optimisticMistakes, removeOptimisticMistake] = useOptimistic(
    initialMistakes,
    (state, mistakeId: string) => state.filter((m) => m.id !== mistakeId)
  );

  const [reviewing, setReviewing] = useState(initialMistakes.length > 0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [justReviewedAll, setJustReviewedAll] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleMarkReviewed = (mistakeId: string) => {
    startTransition(async () => {
      removeOptimisticMistake(mistakeId);
      
      const remaining = optimisticMistakes.filter(m => m.id !== mistakeId);
      if (remaining.length === 0) setJustReviewedAll(true);
      
      setCurrentIndex((prev) => {
        const remainingCount = Math.max(1, remaining.length);
        if (prev >= remainingCount) return Math.max(0, remainingCount - 1);
        return prev;
      });

      try {
        await removeMistakeAction(mistakeId);
      } catch (err) {
        console.error(err);
      }
    });
  };

  const count = optimisticMistakes.length;

  // ── Review modal (inline) ─────────────────────────────────────────────
  if (reviewing && optimisticMistakes.length > 0) {
    const current = optimisticMistakes[currentIndex];
    const total = optimisticMistakes.length;

    return (
      <motion.div
        id="review-mistakes"
        className="bg-white flex flex-col h-[450px]"
        style={{
          borderRadius: "24px",
          padding: "40px",
          flex: "1",
          border: "none",
          boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-900 font-[800] text-xl tracking-tight leading-none">
            Reviewing Mistakes
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-[13px] font-bold">
              {currentIndex + 1} / {total}
            </span>
            <button
              onClick={() => {
                setReviewing(false);
                setCurrentIndex(0);
              }}
              className="w-8 h-8 rounded-full bg-[#F3F0FF] flex items-center justify-center hover:bg-[#E0D7FF] transition-all"
              aria-label="Close review"
            >
              <IconX size={15} className="text-brand-primary" stroke={3} />
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-6">
          {optimisticMistakes.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full flex-1 transition-all duration-300"
              style={{
                backgroundColor: i <= currentIndex ? "#7B6FE7" : "#E5E7EB",
              }}
            />
          ))}
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col overflow-y-auto pr-2 -mr-2">
          <p className="text-slate-900 font-bold text-base leading-relaxed mb-6">
            {current.questionText}
          </p>

          {/* Wrong answer */}
          <div className="rounded-2xl border-[1.5px] border-[#fecaca] bg-[#fff5f5] p-4 mb-3">
            <div className="flex items-start gap-3">
               <div className="w-6 h-6 rounded-full bg-[#fee2e2] flex items-center justify-center shrink-0 mt-0.5">
                 <IconX size={13} className="text-red-600" stroke={3} />
               </div>
               <div>
                 <p className="text-xs font-bold tracking-[0.08em] uppercase text-red-600 mb-1">
                   Your Answer
                 </p>
                 <p className="text-slate-900 text-sm leading-relaxed font-medium">
                   {current.userAnswer}
                 </p>
               </div>
             </div>
           </div>

          {/* Correct answer */}
          <div className="rounded-2xl border-[1.5px] border-[#bbf7d0] bg-green-50 p-4 mb-4">
             <div className="flex items-start gap-3">
               <div className="w-6 h-6 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0 mt-0.5">
                 <IconCheck size={13} className="text-green-600" stroke={3} />
               </div>
               <div>
                 <p className="text-xs font-bold tracking-[0.08em] uppercase text-green-600 mb-1">
                   Correct Answer
                 </p>
                 <p className="text-slate-900 text-sm leading-relaxed font-medium">
                   {current.correctAnswer}
                 </p>
               </div>
             </div>
           </div>

          {/* Explanation */}
          {current.explanation && (
            <div className="rounded-2xl bg-gray-50 border-[1.5px] border-gray-200 p-4 mb-4">
              <p className="text-xs font-bold tracking-[0.08em] uppercase text-gray-500 mb-1">
                💡 Explanation
              </p>
              <p className="text-slate-900 text-sm leading-relaxed">
                {current.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Navigation + mark done */}
        {/* Navigation + mark done */}
        <div className="flex items-center gap-3 mt-auto pt-4 relative z-10 bg-white">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="w-11 h-11 rounded-[14px] border-[1.5px] border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <IconChevronLeft size={20} className="text-gray-500" stroke={2.5} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMarkReviewed(current.id)}
            disabled={isPending}
            className="flex-1 bg-brand-primary hover:bg-[#6859e0] text-white font-[500] text-[15px] rounded-[14px] py-3 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_4px_14px_rgba(123,111,231,0.25)]"
          >
            {isPending ? (
              "Marking…"
            ) : (
              <>
                Mark as Reviewed <IconCheck size={18} stroke={3} />
              </>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              setCurrentIndex((i) => Math.min(optimisticMistakes.length - 1, i + 1))
            }
            disabled={currentIndex === optimisticMistakes.length - 1}
            className="w-11 h-11 rounded-[14px] border-[1.5px] border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <IconChevronRight size={20} className="text-gray-500" stroke={2.5} />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ── All caught up ─────────────────────────────────────────────────────
  if (count === 0) {
    return (
      <div
        id="review-mistakes"
        className="bg-gray-50 flex items-center justify-center border-[1.5px] border-gray-200 h-[450px]"
        style={{
          borderRadius: "16px",
          padding: "16px",
          flex: "1",
        }}
      >
        <div className="flex flex-col items-center text-center">
          <h3 className="text-slate-900 font-[700] text-base tracking-tight mb-1">
            {justReviewedAll ? "All done! 🎉" : "No Mistakes to Review"}
          </h3>
          <p className="text-gray-500 text-[13px] leading-relaxed">
            {justReviewedAll
              ? "Great work reviewing all your mistakes."
              : "You're all caught up for today."}
          </p>
        </div>
      </div>
    );
  }

  // ── Has mistakes — summary view ───────────────────────────────────────
  return (
    <div
      id="review-mistakes"
      className="bg-white flex flex-col h-[450px]"
      style={{
        borderRadius: "24px",
        padding: "40px",
        flex: "1",
        border: "none",
        boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-gray-900 font-[800] text-xl tracking-tight leading-none">
          Yesterday's Mistakes
        </h2>
        <div className="text-[13px] font-[600] text-red-500 bg-red-50 px-3 py-1 rounded-full leading-none">
          {count} mistake{count !== 1 ? "s" : ""} to review
        </div>
      </div>

      {/* Mistake list preview as full cards */}
      <div className="flex flex-col gap-4 flex-1">
        {optimisticMistakes.slice(0, 2).map((m) => (
          <div
            key={m.id}
            className="flex flex-col border-[1.5px] border-gray-100 rounded-[20px] p-4 bg-[#FAFAFA]"
          >
            <p className="text-sm font-[700] text-slate-900 mb-3 line-clamp-2 leading-snug">
              {m.questionText}
            </p>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2 bg-[#fff5f5] p-2.5 rounded-xl">
                 <IconX size={14} className="text-red-600 mt-0.5 shrink-0" stroke={3} />
                 <span className="text-[13px] text-red-600 font-medium line-clamp-1">{m.userAnswer}</span>
              </div>
              <div className="flex items-start gap-2 bg-green-50 p-2.5 rounded-xl">
                 <IconCheck size={14} className="text-green-600 mt-0.5 shrink-0" stroke={3} />
                 <span className="text-[13px] text-green-600 font-medium line-clamp-1">{m.correctAnswer}</span>
              </div>
            </div>
          </div>
        ))}
        {count > 2 && (
          <div className="text-center w-full mt-2">
            <span className="text-gray-500 text-[13px] font-bold">
              +{count - 2} more to review
            </span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-6 pt-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          id="review-now-btn"
          onClick={() => {
            setReviewing(true);
            setCurrentIndex(0);
          }}
          className="w-full bg-white border-[2px] border-brand-primary text-brand-primary hover:bg-[#F3F0FF] font-[500] text-[15px] rounded-[14px] py-3.5 transition-colors flex items-center justify-center gap-2"
        >
          Review All Mistakes
        </motion.button>
      </div>
    </div>
  );
}
