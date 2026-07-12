"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { splitTitle } from "@/lib/roadmap-utils";
import { LockedNode, ActiveNode, CompletedNode } from "./Nodes";
import { Lesson } from "@prisma/client";

const nodeCoords = [
  { x: 100, y: 70 },
  { x: 260, y: 175 },
  { x: 380, y: 280 },
  { x: 240, y: 385 },
  { x: 100, y: 490 },
  { x: 300, y: 595 },
  { x: 380, y: 700 },
];
const chapterQuizCoord = { x: 380, y: 700 };

export const RoadmapMap = ({
  completedLessonIds,
  completedQuizIds,
  lessons,
}: {
  completedLessonIds: number[];
  completedQuizIds: number[];
  lessons: Lesson[];
}) => {
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allCompletedLessonIds = completedLessonIds;
    
  const allCompletedQuizIds = completedQuizIds;

  return (
    <svg
      viewBox="0 0 460 815"
      className="w-full max-w-[460px] shrink-0 overflow-visible"
    >
      <style>
        {`
          @keyframes dashspin {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -40; }
          }
        `}
      </style>

      <path
        d="M 100 106 C 100 122.5, 260 122.5, 260 139 C 260 227.5, 380 227.5, 380 244 C 380 332.5, 240 332.5, 240 349 C 240 437.5, 100 437.5, 100 454 C 100 542.5, 300 542.5, 300 559 C 300 647.5, 380 647.5, 380 664"
        fill="none"
        stroke="#c4b5fd"
        strokeWidth="2"
        strokeDasharray="8 6"
        className="stroke-linecap-round opacity-100"
      />

      {/* Dynamic Nodes */}
      {lessons.map((lesson, index) => {
        const { x, y } = nodeCoords[index];
        const [line1, line2] = splitTitle(lesson.title);

        const isCompleted = allCompletedLessonIds.includes(lesson.dayOrder);

        const isLessonUnlocked = (idx: number) => {
          if (idx === 0) return true;
          const prevLesson = lessons[idx - 1];
          return allCompletedLessonIds.includes(prevLesson.dayOrder);
        };

        const isUnlocked = isLessonUnlocked(index);
        const isActive = !isCompleted && isUnlocked;

        return (
          <React.Fragment key={lesson.id}>
            {isCompleted && (
              <CompletedNode
                x={x}
                y={y}
                line1={line1}
                line2={line2}
                onClick={() => router.push(`/lessons/${lesson.dayOrder}/concepts`)}
              />
            )}
            {isActive && (
              <ActiveNode
                x={x}
                y={y}
                line1={line1}
                line2={line2}
                onClick={() => router.push(`/lessons/${lesson.dayOrder}/concepts`)}
              />
            )}
            {!isCompleted && !isActive && (
              <LockedNode x={x} y={y} line1={line1} line2={line2} />
            )}
          </React.Fragment>
        );
      })}

      {/* Node 8 (QUIZ) */}
      {(() => {
        const { x, y } = chapterQuizCoord;
        const lastLesson = lessons[lessons.length - 1];
        const isAllLessonsDone = lastLesson ? allCompletedLessonIds.includes(lastLesson.dayOrder) : false;
        const isQuizDone = allCompletedQuizIds.includes(108);
        const isQuizActive = isAllLessonsDone && !isQuizDone;

        if (isQuizDone) {
          return (
            <g
              key="quiz"
              transform={`translate(${x}, ${y})`}
              onClick={() => router.push("/lessons/1/quizzes")}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push("/lessons/1/quizzes");
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Chapter 1 Quiz: Completed"
              className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-4 focus:ring-green-300 rounded-full"
            >
              <circle r="36" fill="#22c55e" />
              <polyline
                points="-10,-2 -2,6 10,-8"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                y="54"
                fontSize="13"
                fill="#0096a5"
                fontWeight="500"
                textAnchor="middle"
              >
                <tspan x="0" dy="0">
                  Chapter 1 Quiz
                </tspan>
              </text>
            </g>
          );
        } else if (isQuizActive) {
          return (
            <g
              key="quiz"
              transform={`translate(${x}, ${y})`}
              onClick={() => router.push("/lessons/1/quizzes")}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push("/lessons/1/quizzes");
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Chapter 1 Quiz: Unlocked and active"
              className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-4 focus:ring-pink-300 rounded-full"
            >
              <circle
                r="46"
                fill="none"
                stroke="#F7C8D3"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                style={{ animation: "dashspin 2s linear infinite" }}
              />
              <circle r="36" fill="#0096a5" />
              <polygon
                points="0,-12 3,-4 12,-4 5,2 8,10 0,6 -8,10 -5,2 -12,-4 -3,-4"
                fill="white"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              <g transform="translate(0, -60)">
                <rect
                  x="-56"
                  y="-14"
                  width="112"
                  height="26"
                  rx="12"
                  fill="white"
                  stroke="#F7C8D3"
                  strokeWidth="1"
                />
                <text
                  y="4"
                  fontSize="11"
                  fill="#0096a5"
                  fontWeight="500"
                  textAnchor="middle"
                >
                  START QUIZ!
                </text>
              </g>

              <text
                y="54"
                fontSize="13"
                fill="#0096a5"
                fontWeight="500"
                textAnchor="middle"
              >
                <tspan x="0" dy="0">
                  Chapter 1 Quiz
                </tspan>
              </text>
            </g>
          );
        } else {
          return (
            <g
              transform={`translate(${x}, ${y})`}
              key="quiz"
              className="opacity-80"
              aria-label="Chapter 1 Quiz: Locked"
            >
              <circle
                r="36"
                fill="#ececf5"
                stroke="#d4d4e8"
                strokeWidth="1.5"
              />
              <rect
                x="-8"
                y="-4"
                width="16"
                height="12"
                rx="2"
                fill="#9ca3af"
              />
              <path
                d="M-4,-4 v-4 a4,4 0 0,1 8,0 v4"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
              />
              <text
                y="54"
                fontSize="13"
                fill="#6b7280"
                fontWeight="500"
                textAnchor="middle"
              >
                <tspan x="0" dy="0">
                  Chapter 1 Quiz
                </tspan>
              </text>
            </g>
          );
        }
      })()}

      {/* Banner */}
      <g transform="translate(230, 775)">
        <rect
          x="-130"
          y="-20"
          width="260"
          height="40"
          rx="12"
          fill="#f9fafb"
          stroke="#d4d4e8"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <rect
          x="-80"
          y="-4"
          width="12"
          height="10"
          rx="2"
          fill="#9ca3af"
        />
        <path
          d="M-78,-4 v-3 a4,4 0 0,1 8,0 v3"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="1.5"
        />
        <text
          x="-60"
          y="4"
          fontSize="13"
          fill="#9ca3af"
          fontWeight="500"
          alignmentBaseline="middle"
        >
          CHAPTER 2 COMING SOON
        </text>
      </g>
    </svg>
  );
};
