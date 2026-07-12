"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconLock, IconCompass } from "@tabler/icons-react";

export const LearningPathSlider = ({
  currentLessonId,
  completedLessonIds,
  routeSuffix = "concepts",
  completedQuizLessonIds,
  lessons,
}: {
  currentLessonId: number;
  completedLessonIds: number[];
  routeSuffix?: "concepts" | "articles" | "quizzes";
  completedQuizLessonIds?: number[];
  lessons: { id: string | number; title: string }[];
}) => {
  const router = useRouter();

  return (
    <div className="relative pt-1 overflow-hidden">
      <div className="flex justify-start relative z-10 gap-5 overflow-x-auto pb-5 scrollbar-hide snap-x w-full">
        {lessons.map((lesson) => {
          const isCompleted = routeSuffix === "quizzes" && completedQuizLessonIds
            ? completedQuizLessonIds.includes(Number(lesson.id))
            : completedLessonIds.includes(Number(lesson.id));
          const isUnlocked = lesson.id === 1 || completedLessonIds.includes(Number(lesson.id) - 1);
          
          let status: "Completed" | "In Progress" | "Locked" = "Locked";
          if (isCompleted) {
            status = "Completed";
          } else if (isUnlocked) {
            status = "In Progress";
          }

          const isCurrent = lesson.id === currentLessonId;

          return (
            <div
              key={lesson.id}
              onClick={() => {
                if (status !== "Locked") {
                  router.push(`/lessons/${lesson.id}/${routeSuffix}`);
                }
              }}
              className={`flex-shrink-0 w-[280px] flex flex-col items-start p-5 rounded-[20px] transition-all h-[140px] relative overflow-hidden ${
                status === "Locked" ? "cursor-not-allowed opacity-80" : "cursor-pointer"
              } ${
                isCurrent ? "ring-2 ring-brand-primary ring-offset-2" : ""
              } ${
                status === "In Progress"
                  ? "bg-gradient-to-br from-[#E2D4FD] to-[#C6D2FE] border-[2px] border-transparent shadow-[0_8px_20px_rgba(123,104,238,0.2)] hover:-translate-y-0.5"
                  : status === "Completed"
                  ? "bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] border-[2px] border-white shadow-sm hover:-translate-y-0.5"
                  : "bg-gradient-to-br from-[#EBEBEB] to-[#F5F5F5] border-[2px] border-white shadow-sm"
              }`}
            >
              {/* Background Icon */}
              {status === "In Progress" && (
                <IconCompass
                  size={110}
                  stroke={1.5}
                  className="absolute -right-6 top-1/2 -translate-y-1/2 text-[#4F46E5] opacity-[0.08] pointer-events-none"
                />
              )}
              {status === "Completed" && (
                <IconCheck
                  size={90}
                  stroke={2}
                  className="absolute -right-4 bottom-[-10px] text-[#3B82F6] opacity-20 pointer-events-none"
                />
              )}
              {status === "Locked" && (
                <IconLock
                  size={90}
                  stroke={2}
                  className="absolute -right-4 bottom-[-10px] text-[#B8B5CC] opacity-30 pointer-events-none"
                />
              )}

              <div
                className={`text-[11px] font-bold tracking-[0.08em] uppercase mb-2 relative z-10 ${
                  status === "In Progress"
                    ? "text-[#3B3073]"
                    : status === "Completed"
                    ? "text-[#1E3A8A]"
                    : "text-gray-500"
                }`}
              >
                LESSON {lesson.id}
              </div>
              <h4
                className={`font-bold text-[15px] leading-snug mb-auto line-clamp-2 relative z-10 text-gray-900`}
              >
                {lesson.title}
              </h4>

              <div className="mt-5 w-full relative z-10">
                {status === "Completed" && (
                  <span className="bg-white/60 border border-white text-[#3B82F6] px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1.5 w-fit shadow-sm">
                    Completed <IconCheck size={12} stroke={3} />
                  </span>
                )}

                {status === "Locked" && (
                  <span className="bg-white/60 border border-white text-gray-400 px-3 py-1.5 rounded-full text-[13px] font-bold tracking-wide flex items-center gap-1.5 w-fit shadow-sm">
                    Locked <IconLock size={12} stroke={2.5} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
