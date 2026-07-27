"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { splitTitle } from "@/lib/roadmap-utils";
import { LockedNode, ActiveNode, CompletedNode } from "./Nodes";
import { Lesson } from "@prisma/client";
import { RoadmapUnitCard } from "./RoadmapUnitCard";

const TRACK_CHAPTERS: Record<string, {
  chapterNumber: number;
  title: string;
  description: string;
  bgClass: string;
  btnClass: string;
}[]> = {
  ENTREPRENEURSHIP_ECONOMICS: [
    {
      chapterNumber: 1,
      title: "Foundations of Entrepreneurship Economics",
      description: "Understand what entrepreneurship economics is, why entrepreneurs exist, and how businesses create, deliver, and capture value in the economy.",
      bgClass: "bg-gradient-to-b from-[#B8A4FF] to-[#F1EAFF]",
      btnClass: "bg-[#7C3AED] hover:bg-[#6D28D9] text-white",
    },
    {
      chapterNumber: 2,
      title: "Scarcity, Trade-Offs & Opportunity Cost",
      description: "Learn how entrepreneurs make decisions when resources are limited, evaluate trade-offs, allocate time and money effectively, and use opportunity cost to make smarter business decisions.",
      bgClass: "bg-gradient-to-b from-[#6EC1FF] to-[#E8F3FF]",
      btnClass: "bg-[#2589FE] hover:bg-[#1D6ED8] text-white",
    },
    {
      chapterNumber: 3,
      title: "Risk, Uncertainty & Market Opportunities",
      description: "Discover how entrepreneurs make decisions under uncertainty, identify overlooked opportunities, overcome market barriers, and gain competitive advantages by solving real economic problems.",
      bgClass: "bg-gradient-to-b from-[#6EE7B7] to-[#ECFDF5]",
      btnClass: "bg-[#10B981] hover:bg-[#059669] text-white",
    },
    {
      chapterNumber: 4,
      title: "Creating Value & Building Profitable Businesses",
      description: "Learn how entrepreneurs create value for customers, develop effective pricing strategies, understand cost structures, and measure whether a business model can become sustainably profitable.",
      bgClass: "bg-gradient-to-b from-[#F9A8D4] to-[#FDF2F8]",
      btnClass: "bg-[#EC4899] hover:bg-[#DB2777] text-white",
    },
    {
      chapterNumber: 5,
      title: "Business Models & Entrepreneurial Finance",
      description: "Understand how entrepreneurs design scalable business models, choose the right sources of funding, evaluate investment opportunities, and balance growth with long-term financial sustainability.",
      bgClass: "bg-gradient-to-b from-[#FDBA74] to-[#FFF7ED]",
      btnClass: "bg-[#F97316] hover:bg-[#EA580C] text-white",
    },
    {
      chapterNumber: 6,
      title: "Uncertainty, Pivots & Failure",
      description: "Learn how entrepreneurs make high-stakes decisions with incomplete information, adapt through strategic pivots, learn from setbacks, manage uncertainty, and use innovation to create lasting competitive advantages.",
      bgClass: "bg-gradient-to-b from-[#2DD4BF] to-[#F0FDFA]",
      btnClass: "bg-[#14B8A6] hover:bg-[#0D9488] text-white",
    },
    {
      chapterNumber: 7,
      title: "Scaling Businesses & Sustainable Growth",
      description: "Discover how successful businesses scale their operations, spread innovation, build efficient organizations and supply chains, balance growth with profitability, and expand into international markets.",
      bgClass: "bg-gradient-to-b from-[#818CF8] to-[#EEF2FF]",
      btnClass: "bg-[#4F46E5] hover:bg-[#4338CA] text-white",
    },
    {
      chapterNumber: 8,
      title: "Entrepreneurial Ecosystems & the Bigger Picture",
      description: "Explore how institutions, government policies, access to capital, and regional innovation ecosystems shape entrepreneurial success, and apply everything you've learned throughout the course in a final capstone review.",
      bgClass: "bg-gradient-to-b from-[#FCD34D] to-[#FFFBEB]",
      btnClass: "bg-[#D97706] hover:bg-[#B45309] text-white",
    },
  ],
  BEHAVIORAL_ECONOMICS: [
    {
      chapterNumber: 1,
      title: "Foundations of Behavioral Economics",
      description: "Understand how economists moved from the idea of perfectly rational decision-making to a more realistic view of how humans actually think and choose.",
      bgClass: "bg-gradient-to-b from-[#B8A4FF] to-[#F1EAFF]",
      btnClass: "bg-[#7C3AED] hover:bg-[#6D28D9] text-white",
    },
    {
      chapterNumber: 2,
      title: "Mental Shortcuts and Decision Errors",
      description: "Understand how people use quick mental shortcuts to make decisions and why these shortcuts can sometimes lead to mistakes.",
      bgClass: "bg-gradient-to-b from-[#6EC1FF] to-[#E8F3FF]",
      btnClass: "bg-[#2589FE] hover:bg-[#1D6ED8] text-white",
    },
    {
      chapterNumber: 3,
      title: "How We Think About Gains and Losses",
      description: "Understand why people often fear losses more than they value gains and how emotions influence decisions under uncertainty.",
      bgClass: "bg-gradient-to-b from-[#6EE7B7] to-[#ECFDF5]",
      btnClass: "bg-[#10B981] hover:bg-[#059669] text-white",
    },
    {
      chapterNumber: 4,
      title: "Time Preferences and Self-Control",
      description: "Understand why people often choose immediate rewards over better future outcomes and how self-control shapes everyday decisions.",
      bgClass: "bg-gradient-to-b from-[#F9A8D4] to-[#FDF2F8]",
      btnClass: "bg-[#EC4899] hover:bg-[#DB2777] text-white",
    },
    {
      chapterNumber: 5,
      title: "Fairness and Human Behavior",
      description: "Understand how fairness, trust, generosity, and social pressure influence the choices people make.",
      bgClass: "bg-gradient-to-b from-[#FDBA74] to-[#FFF7ED]",
      btnClass: "bg-[#F97316] hover:bg-[#EA580C] text-white",
    },
    {
      chapterNumber: 6,
      title: "Nudges and Better Decisions",
      description: "Understand how small changes in the way choices are presented can influence people's decisions without removing their freedom to choose.",
      bgClass: "bg-gradient-to-b from-[#2DD4BF] to-[#F0FDFA]",
      btnClass: "bg-[#14B8A6] hover:bg-[#0D9488] text-white",
    },
    {
      chapterNumber: 7,
      title: "Behavioral Finance",
      description: "Understand why investors often make irrational financial decisions and how psychology shapes financial markets.",
      bgClass: "bg-gradient-to-b from-[#818CF8] to-[#EEF2FF]",
      btnClass: "bg-[#4F46E5] hover:bg-[#4338CA] text-white",
    },
    {
      chapterNumber: 8,
      title: "Behavioral Economics in the Real World",
      description: "Understand how behavioral economics is used to improve public policy, marketing, and everyday decision-making while recognizing its ethical limits.",
      bgClass: "bg-gradient-to-b from-[#FCD34D] to-[#FFFBEB]",
      btnClass: "bg-[#D97706] hover:bg-[#B45309] text-white",
    },
  ],
  DEVELOPMENT_ECONOMICS: [
    {
      chapterNumber: 1,
      title: "What Development Really Means",
      description: "Understand the difference between economic growth and development, how economists measure progress, and why some countries become prosperous while others struggle.",
      bgClass: "bg-gradient-to-b from-[#B8A4FF] to-[#F1EAFF]",
      btnClass: "bg-[#7C3AED] hover:bg-[#6D28D9] text-white",
    },
    {
      chapterNumber: 2,
      title: "Why Some Countries Grow Faster Than Others",
      description: "Understand the economic forces that drive long-term growth, why some countries catch up with richer nations while others fall behind, and how innovation fuels lasting prosperity.",
      bgClass: "bg-gradient-to-b from-[#6EC1FF] to-[#E8F3FF]",
      btnClass: "bg-[#2589FE] hover:bg-[#1D6ED8] text-white",
    },
    {
      chapterNumber: 3,
      title: "Poverty, Inequality, and Opportunity",
      description: "Understand why economic growth does not benefit everyone equally, how economists measure poverty and inequality, and what policies can help people escape poverty.",
      bgClass: "bg-gradient-to-b from-[#6EE7B7] to-[#ECFDF5]",
      btnClass: "bg-[#10B981] hover:bg-[#059669] text-white",
    },
    {
      chapterNumber: 4,
      title: "Investing in People",
      description: "Understand why education, health, skills, and population changes shape a country's future, and how investing in people drives long-term economic development.",
      bgClass: "bg-gradient-to-b from-[#F9A8D4] to-[#FDF2F8]",
      btnClass: "bg-[#EC4899] hover:bg-[#DB2777] text-white",
    },
    {
      chapterNumber: 5,
      title: "Institutions That Build Prosperity",
      description: "Understand why strong institutions, reliable rules, and effective governments shape economic development and determine why some societies become more prosperous than others.",
      bgClass: "bg-gradient-to-b from-[#FCD34D] to-[#FFFBEB]",
      btnClass: "bg-[#D97706] hover:bg-[#B45309] text-white",
    },
    {
      chapterNumber: 6,
      title: "Connecting to the Global Economy",
      description: "Understand how countries use trade, investment, specialization, and global connections to accelerate economic development and create new opportunities.",
      bgClass: "bg-gradient-to-b from-[#A78BFA] to-[#F5F3FF]",
      btnClass: "bg-[#7C3AED] hover:bg-[#6D28D9] text-white",
    },
    {
      chapterNumber: 7,
      title: "How Economies Transform",
      description: "Understand how economies move from agriculture to industry and services, why cities become centers of opportunity, and how companies and industries reshape development.",
      bgClass: "bg-gradient-to-b from-[#FCA5A5] to-[#FEF2F2]",
      btnClass: "bg-[#DC2626] hover:bg-[#B91C1C] text-white",
    },
    {
      chapterNumber: 8,
      title: "Money, Finance, and Development",
      description: "Understand how countries use aid, migration, finance, technology, and economic reforms to overcome challenges and create new paths for development.",
      bgClass: "bg-gradient-to-b from-[#86EFAC] to-[#F0FDF4]",
      btnClass: "bg-[#22C55E] hover:bg-[#16A34A] text-white",
    },
  ],
};
const generateChapterCoords = (nodeCount: number) => {
  const coords = [];
  const startY = 40; 
  // Adjusted X pattern to match the visual style
  const xPattern = [100, 260, 380, 240, 100, 300, 180];
  
  for (let i = 0; i < nodeCount; i++) {
    const x = xPattern[i % xPattern.length];
    coords.push({ x, y: startY + (i * 105) });
  }
  return coords;
};

const generatePathD = (coords: {x: number, y: number}[]) => {
  if (coords.length < 2) return "";
  let d = `M ${coords[0].x} ${coords[0].y + 36} `;
  
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const midY = (curr.y + next.y) / 2;
    d += `C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y - 36} `;
  }
  return d.trim();
};

export const RoadmapMap = ({
  completedLessonDayOrders,
  completedQuizDayOrders,
  lessons,
  activeTrack = "ENTREPRENEURSHIP_ECONOMICS",
}: {
  completedLessonDayOrders: number[];
  completedQuizDayOrders: number[];
  lessons: Lesson[];
  activeTrack?: string;
}) => {
  const router = useRouter();
  // Group lessons into chapters based on their 7-day cycle (Day 1-7 = Ch 1, Day 8-14 = Ch 2, etc.)
  const chaptersMap: Record<number, Lesson[]> = {};
  lessons.forEach((lesson) => {
    const chapterIndex = Math.floor((lesson.dayOrder - 1) / 7);
    if (!chaptersMap[chapterIndex]) chaptersMap[chapterIndex] = [];
    chaptersMap[chapterIndex].push(lesson);
  });
  
  // Convert map to sorted array
  const chapters: Lesson[][] = Object.keys(chaptersMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map((chapterIndex) => chaptersMap[chapterIndex]);

  const currentChapters = TRACK_CHAPTERS[activeTrack] || TRACK_CHAPTERS.ENTREPRENEURSHIP_ECONOMICS;

  return (
    <div className="flex flex-col items-center w-full">
      <style>
        {`
          @keyframes dashspin {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -40; }
          }
        `}
      </style>
      
      {chapters.map((chapterLessons, chapterIndex) => {
        const chapterNum = chapterIndex + 1;
        const chapterInfo = currentChapters[chapterIndex] || {
          chapterNumber: chapterNum,
          title: `Chapter ${chapterNum}`,
          description: "More advanced concepts and lessons.",
          bgClass: "bg-gray-200",
          btnClass: "bg-gray-400",
        };

        const lastLesson = chapterLessons[chapterLessons.length - 1];
        const chapterQuizDayOrder = lastLesson ? lastLesson.dayOrder + 1 : chapterNum * 7;
        
        // Generate coordinates for this chapter's nodes
        const nodeCount = chapterLessons.length + 1; // +1 for the quiz
        const coords = generateChapterCoords(nodeCount);
        const pathD = generatePathD(coords);
        
        // Add padding at the bottom of the SVG to prevent clipping
        const svgHeight = coords.length > 0 ? coords[coords.length - 1].y + 120 : 200;

        // Determine nextUrl and disabled state for the chapter Start button
        let startHref: string | undefined = undefined;
        let chapterDisabled = true;

        const isLessonUnlocked = (lessonIdx: number) => {
          if (chapterIndex === 0 && lessonIdx === 0) return true;
          
          if (lessonIdx === 0) {
            const prevChapterQuizDayOrder = chapters[chapterIndex - 1][chapters[chapterIndex - 1].length - 1].dayOrder + 1;
            return completedQuizDayOrders.includes(prevChapterQuizDayOrder);
          }

          const prevLesson = chapterLessons[lessonIdx - 1];
          return completedLessonDayOrders.includes(prevLesson.dayOrder);
        };

        const firstActiveLesson = chapterLessons.find((l, idx) => {
          return isLessonUnlocked(idx) && !completedLessonDayOrders.includes(l.dayOrder);
        });

        const isAllLessonsDone = lastLesson ? completedLessonDayOrders.includes(lastLesson.dayOrder) : false;
        const isQuizDone = completedQuizDayOrders.includes(chapterQuizDayOrder);
        const isQuizActive = isAllLessonsDone && !isQuizDone;

        if (firstActiveLesson) {
          chapterDisabled = false;
          startHref = `/lessons/${firstActiveLesson.dayOrder}/concepts`;
        } else if (isQuizActive) {
          chapterDisabled = false;
          startHref = `/lessons/${chapterQuizDayOrder}/quizzes`;
        } else if (isAllLessonsDone && isQuizDone) {
          // Entire chapter is done, let them review the first lesson
          chapterDisabled = false;
          startHref = `/lessons/${chapterLessons[0]?.dayOrder || 1}/concepts`;
        }

        return (
          <React.Fragment key={`chapter-${chapterNum}`}>
            <RoadmapUnitCard 
              chapterNumber={chapterInfo.chapterNumber}
              title={chapterInfo.title}
              description={chapterInfo.description}
              bgClass={(chapterInfo as Record<string, unknown>).bgClass as string}
              btnClass={(chapterInfo as Record<string, unknown>).btnClass as string}
              startHref={startHref}
              disabled={chapterDisabled}
            />

            <svg
              viewBox={`0 0 460 ${svgHeight}`}
              className="w-full max-w-[460px] shrink-0 overflow-visible"
            >
              <path
                d={pathD}
                fill="none"
                stroke="#c4b5fd"
                strokeWidth="2"
                strokeDasharray="8 6"
                className="stroke-linecap-round opacity-100"
              />

              {chapterLessons.map((lesson, lessonIndex) => {
                const { x, y } = coords[lessonIndex];
                const [line1, line2] = splitTitle(lesson.title);

                const isCompleted = completedLessonDayOrders.includes(lesson.dayOrder);

                const isLessonUnlocked = () => {
                  if (chapterIndex === 0 && lessonIndex === 0) return true;
                  
                  // If it's the first lesson of a new chapter, it requires the PREVIOUS chapter's quiz to be done
                  if (lessonIndex === 0) {
                    const prevChapterQuizDayOrder = chapters[chapterIndex - 1][chapters[chapterIndex - 1].length - 1].dayOrder + 1;
                    return completedQuizDayOrders.includes(prevChapterQuizDayOrder);
                  }

                  // Otherwise, it requires the previous lesson in the same chapter
                  const prevLesson = chapterLessons[lessonIndex - 1];
                  return completedLessonDayOrders.includes(prevLesson.dayOrder);
                };

                const isUnlocked = isLessonUnlocked();
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

              {/* Render the Chapter Quiz Node */}
              {(() => {
                const { x, y } = coords[coords.length - 1];
                const isAllLessonsDone = lastLesson ? completedLessonDayOrders.includes(lastLesson.dayOrder) : false;
                
                const isQuizDone = completedQuizDayOrders.includes(chapterQuizDayOrder);
                const isQuizActive = isAllLessonsDone && !isQuizDone;

                if (isQuizDone) {
                  return (
                    <g
                      key={`quiz-${chapterNum}`}
                      transform={`translate(${x}, ${y})`}
                      onClick={() => router.push(`/lessons/${chapterQuizDayOrder}/quizzes`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          router.push(`/lessons/${chapterQuizDayOrder}/quizzes`);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Chapter ${chapterNum} Quiz: Completed`}
                      className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-4 focus:ring-green-300 rounded-full"
                    >
                      <circle r="36" fill="#22c55e" />
                      <polyline points="-10,-2 -2,6 10,-8" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <text y="54" fontSize="13" fill="#0096a5" fontWeight="500" textAnchor="middle">
                        <tspan x="0" dy="0">Chapter {chapterNum} Quiz</tspan>
                      </text>
                    </g>
                  );
                } else if (isQuizActive) {
                  return (
                    <g
                      key={`quiz-${chapterNum}`}
                      transform={`translate(${x}, ${y})`}
                      onClick={() => router.push(`/lessons/${chapterQuizDayOrder}/quizzes`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          router.push(`/lessons/${chapterQuizDayOrder}/quizzes`);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Chapter ${chapterNum} Quiz: Unlocked and active`}
                      className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-4 focus:ring-pink-300 rounded-full"
                    >
                      <circle r="46" fill="none" stroke="#F7C8D3" strokeWidth="2.5" strokeDasharray="6 4" style={{ animation: "dashspin 2s linear infinite" }} />
                      <circle r="36" fill="#0096a5" />
                      <polygon points="0,-12 3,-4 12,-4 5,2 8,10 0,6 -8,10 -5,2 -12,-4 -3,-4" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                      <g transform="translate(0, -60)">
                        <rect x="-56" y="-14" width="112" height="26" rx="12" fill="white" stroke="#F7C8D3" strokeWidth="1" />
                        <text y="4" fontSize="11" fill="#0096a5" fontWeight="500" textAnchor="middle">START QUIZ!</text>
                      </g>
                      <text y="54" fontSize="13" fill="#0096a5" fontWeight="500" textAnchor="middle">
                        <tspan x="0" dy="0">Chapter {chapterNum} Quiz</tspan>
                      </text>
                    </g>
                  );
                } else {
                  return (
                    <g transform={`translate(${x}, ${y})`} key={`quiz-${chapterNum}`} className="opacity-80" aria-label={`Chapter ${chapterNum} Quiz: Locked`}>
                      <circle r="36" fill="#ececf5" stroke="#d4d4e8" strokeWidth="1.5" />
                      <rect x="-8" y="-4" width="16" height="12" rx="2" fill="#9ca3af" />
                      <path d="M-4,-4 v-4 a4,4 0 0,1 8,0 v4" fill="none" stroke="#9ca3af" strokeWidth="2" />
                      <text y="54" fontSize="13" fill="#6b7280" fontWeight="500" textAnchor="middle">
                        <tspan x="0" dy="0">Chapter {chapterNum} Quiz</tspan>
                      </text>
                    </g>
                  );
                }
              })()}
            </svg>
          </React.Fragment>
        );
      })}

      {/* Banner at the very bottom */}
      <svg
        viewBox="0 0 460 100"
        className="w-full max-w-[460px] shrink-0 overflow-visible mt-4 mb-10"
      >
        <g transform={`translate(230, 40)`}>
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
          <rect x="-80" y="-4" width="12" height="10" rx="2" fill="#9ca3af" />
          <path d="M-78,-4 v-3 a4,4 0 0,1 8,0 v3" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
          <text x="-60" y="4" fontSize="13" fill="#9ca3af" fontWeight="500" alignmentBaseline="middle">
            CHAPTER {chapters.length + 1} COMING SOON
          </text>
        </g>
      </svg>
    </div>
  );
};
