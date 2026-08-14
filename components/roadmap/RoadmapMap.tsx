"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { splitTitle } from "@/lib/roadmap-utils";
import { LockedNode, ActiveNode, CompletedNode, NODE_R } from "./Nodes";
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
/**
 * Node positions are generated from the chapter's day list — a chapter of 7
 * nodes and a chapter of 70 both lay out correctly. (The old version had seven
 * hardcoded x-coordinates.)
 */
const COL_X = [96, 230, 364];
const ROW_H = 104;

const generateChapterCoords = (nodeCount: number) => {
  const coords: { x: number; y: number }[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const row = Math.floor(i / COL_X.length);
    const idxInRow = i % COL_X.length;
    // Serpentine: every other row runs right-to-left, so the path never jumps.
    const x = row % 2 === 0 ? COL_X[idxInRow] : COL_X[COL_X.length - 1 - idxInRow];
    coords.push({ x, y: 48 + i * ROW_H });
  }
  return coords;
};

const generatePathD = (coords: { x: number; y: number }[]) => {
  if (coords.length < 2) return "";
  let d = `M ${coords[0].x} ${coords[0].y + NODE_R} `;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const midY = (curr.y + next.y) / 2;
    d += `C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y - NODE_R} `;
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

  // Days 1-7 = chapter 1, 8-14 = chapter 2, and so on.
  const chaptersMap: Record<number, Lesson[]> = {};
  lessons.forEach((lesson) => {
    const chapterIndex = Math.floor((lesson.dayOrder - 1) / 7);
    if (!chaptersMap[chapterIndex]) chaptersMap[chapterIndex] = [];
    chaptersMap[chapterIndex].push(lesson);
  });

  const chapters: Lesson[][] = Object.keys(chaptersMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map((chapterIndex) => chaptersMap[chapterIndex]);

  const currentChapters = TRACK_CHAPTERS[activeTrack] || TRACK_CHAPTERS.ENTREPRENEURSHIP_ECONOMICS;

  return (
    <div className="flex flex-col items-center w-full">
      {chapters.map((chapterLessons, chapterIndex) => {
        const chapterNum = chapterIndex + 1;
        const chapterInfo = currentChapters[chapterIndex] || {
          chapterNumber: chapterNum,
          title: `Chapter ${chapterNum}`,
          description: "More advanced concepts and lessons.",
        };

        const lastLesson = chapterLessons[chapterLessons.length - 1];
        const chapterQuizDayOrder = lastLesson ? lastLesson.dayOrder + 1 : chapterNum * 7;

        const coords = generateChapterCoords(chapterLessons.length + 1); // +1 for the chapter quiz
        const pathD = generatePathD(coords);
        const svgHeight = coords.length > 0 ? coords[coords.length - 1].y + 90 : 200;

        const isLessonUnlocked = (lessonIdx: number) => {
          if (chapterIndex === 0 && lessonIdx === 0) return true;
          if (lessonIdx === 0) {
            const prev = chapters[chapterIndex - 1];
            const prevChapterQuizDayOrder = prev[prev.length - 1].dayOrder + 1;
            return completedQuizDayOrders.includes(prevChapterQuizDayOrder);
          }
          return completedLessonDayOrders.includes(chapterLessons[lessonIdx - 1].dayOrder);
        };

        const firstActiveLesson = chapterLessons.find(
          (l, idx) => isLessonUnlocked(idx) && !completedLessonDayOrders.includes(l.dayOrder)
        );

        const doneCount = chapterLessons.filter((l) =>
          completedLessonDayOrders.includes(l.dayOrder)
        ).length;
        const isAllLessonsDone = lastLesson ? completedLessonDayOrders.includes(lastLesson.dayOrder) : false;
        const isQuizDone = completedQuizDayOrders.includes(chapterQuizDayOrder);
        const isQuizActive = isAllLessonsDone && !isQuizDone;

        let startHref: string | undefined;
        let chapterDisabled = true;

        if (firstActiveLesson) {
          chapterDisabled = false;
          startHref = `/lessons/${firstActiveLesson.dayOrder}/concepts`;
        } else if (isQuizActive) {
          chapterDisabled = false;
          startHref = `/lessons/${chapterQuizDayOrder}/quizzes`;
        } else if (isAllLessonsDone && isQuizDone) {
          chapterDisabled = false;
          startHref = `/lessons/${chapterLessons[0]?.dayOrder || 1}/concepts`;
        }

        const firstDay = chapterLessons[0]?.dayOrder;
        const dayRange = firstDay ? `Days ${firstDay}\u2013${chapterQuizDayOrder}` : undefined;

        return (
          <React.Fragment key={`chapter-${chapterNum}`}>
            <RoadmapUnitCard
              chapterNumber={chapterInfo.chapterNumber}
              title={chapterInfo.title}
              description={chapterInfo.description}
              startHref={startHref}
              disabled={chapterDisabled}
              dayRange={dayRange}
              progress={{ done: doneCount + (isQuizDone ? 1 : 0), total: chapterLessons.length + 1 }}
            />

            <svg
              viewBox={`0 0 460 ${svgHeight}`}
              className="w-full max-w-[460px] shrink-0 overflow-visible"
              role="img"
              aria-label={`Chapter ${chapterNum} path`}
            >
              <path
                d={pathD}
                fill="none"
                stroke="var(--road-line)"
                strokeWidth="2"
                strokeDasharray="7 7"
                strokeLinecap="round"
              />

              {chapterLessons.map((lesson, lessonIndex) => {
                const { x, y } = coords[lessonIndex];
                const [line1, line2] = splitTitle(lesson.title);
                const isCompleted = completedLessonDayOrders.includes(lesson.dayOrder);
                const isUnlocked = isLessonUnlocked(lessonIndex);
                const isActive = !isCompleted && isUnlocked;
                const go = () => router.push(`/lessons/${lesson.dayOrder}/concepts`);

                if (isCompleted) return <CompletedNode key={lesson.id} x={x} y={y} line1={line1} line2={line2} onClick={go} />;
                if (isActive) return <ActiveNode key={lesson.id} x={x} y={y} line1={line1} line2={line2} onClick={go} />;
                return <LockedNode key={lesson.id} x={x} y={y} line1={line1} line2={line2} />;
              })}

              {/* Chapter review quiz — the last node of every chapter */}
              {(() => {
                const { x, y } = coords[coords.length - 1];
                const go = () => router.push(`/lessons/${chapterQuizDayOrder}/quizzes`);
                const label1 = `Chapter ${chapterNum}`;
                const label2 = "review quiz";

                if (isQuizDone) {
                  return <CompletedNode x={x} y={y} line1={label1} line2={label2} onClick={go} />;
                }
                if (isQuizActive) {
                  return <ActiveNode x={x} y={y} line1={label1} line2={label2} onClick={go} />;
                }
                return <LockedNode x={x} y={y} line1={label1} line2={label2} />;
              })()}
            </svg>
          </React.Fragment>
        );
      })}

      <div className="w-full max-w-[460px] rounded-lg border border-dashed border-line-strong px-s5 py-s4 mt-s5 mb-s7 text-center">
        <span className="text-label uppercase text-faint">
          Chapter {chapters.length + 1} coming soon
        </span>
      </div>
    </div>
  );
};
