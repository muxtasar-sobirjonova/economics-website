"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IsoPlot, PlotDay } from "./IsoPlot";
import { Lesson } from "@prisma/client";


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
      bgClass: "bg-gradient-to-b from-[#A78BFA] to-brand-50",
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
    .map((i) => chaptersMap[i]);

  const meta = TRACK_CHAPTERS[activeTrack] || TRACK_CHAPTERS.ENTREPRENEURSHIP_ECONOMICS;

  // Build every chapter's day list once, so the summary rows and the plot agree.
  const built = chapters.map((chapterLessons, chapterIndex) => {
    const lastLesson = chapterLessons[chapterLessons.length - 1];
    const quizDayOrder = lastLesson ? lastLesson.dayOrder + 1 : (chapterIndex + 1) * 7;

    const isLessonUnlocked = (idx: number): boolean => {
      if (chapterIndex === 0 && idx === 0) return true;
      if (idx === 0) {
        const prev = chapters[chapterIndex - 1];
        return completedQuizDayOrders.includes(prev[prev.length - 1].dayOrder + 1);
      }
      return completedLessonDayOrders.includes(chapterLessons[idx - 1].dayOrder);
    };

    const days: PlotDay[] = chapterLessons.map((l, idx) => {
      const done = completedLessonDayOrders.includes(l.dayOrder);
      return {
        dayOrder: l.dayOrder,
        title: l.title,
        state: done ? "done" : isLessonUnlocked(idx) ? "active" : "locked",
        href: `/lessons/${l.dayOrder}/concepts`,
      };
    });

    const allLessonsDone = lastLesson ? completedLessonDayOrders.includes(lastLesson.dayOrder) : false;
    const quizDone = completedQuizDayOrders.includes(quizDayOrder);

    days.push({
      dayOrder: quizDayOrder,
      title: `${meta[chapterIndex]?.title ?? `Chapter ${chapterIndex + 1}`} review`,
      state: quizDone ? "done" : allLessonsDone ? "active" : "locked",
      isQuiz: true,
      href: `/lessons/${quizDayOrder}/quizzes`,
    });

    // Only one day may read as active — the first one.
    let seenActive = false;
    days.forEach((d) => {
      if (d.state === "active") {
        if (seenActive) d.state = "locked";
        seenActive = true;
      }
    });

    const doneCount = days.filter((d) => d.state === "done").length;

    return {
      chapterIndex,
      info: meta[chapterIndex] || {
        chapterNumber: chapterIndex + 1,
        title: `Chapter ${chapterIndex + 1}`,
        description: "More advanced concepts and lessons.",
      },
      days,
      doneCount,
      isClosed: doneCount === days.length,
      hasActive: days.some((d) => d.state === "active"),
      firstDay: chapterLessons[0]?.dayOrder,
      quizDayOrder,
    };
  });

  const currentIndex = built.findIndex((c) => c.hasActive);
  const go = (day: PlotDay) => day.href && router.push(day.href);

  return (
    <div className="flex flex-col items-stretch w-full max-w-[860px] gap-s3">
      {built.map((c) => {
        const isCurrent = c.chapterIndex === currentIndex;
        const num = String(c.info.chapterNumber).padStart(2, "0");
        const range = c.firstDay ? `Days ${c.firstDay}\u2013${c.quizDayOrder}` : "";

        // ── Closed or not-yet-open chapters collapse to one quiet row ─────────
        if (!isCurrent) {
          return (
            <section
              key={num}
              className={`rounded-lg border border-line bg-surface shadow-sh1 px-s5 py-s4 flex items-center gap-s4 ${
                c.isClosed ? "" : "opacity-70"
              }`}
            >
              <span
                className={`w-10 h-10 rounded-md grid place-items-center shrink-0 font-mono text-meta ${
                  c.isClosed ? "bg-success-soft text-success" : "bg-bg-sunk text-faint"
                }`}
              >
                {num}
              </span>

              <div className="min-w-0 flex-1">
                <div className="text-label uppercase text-faint">
                  {c.isClosed ? "Closed" : "Locked"} · {range}
                </div>
                <h2 className="text-h3 font-semibold text-ink mt-[2px] line-clamp-3 pb-[3px]">{c.info.title}</h2>
                <p className="font-mono text-meta text-muted tabular mt-1">
                  {c.doneCount} of {c.days.length} days
                </p>
              </div>

              {c.isClosed && (
                <button
                  onClick={() => router.push(`/lessons/${c.firstDay}/concepts`)}
                  className="shrink-0 px-s4 py-s2 rounded-md border border-line text-meta text-muted hover:border-accent hover:text-accent transition-colors min-h-[44px]"
                >
                  Revisit
                </button>
              )}
            </section>
          );
        }

        // ── The chapter you are in gets the card and the plot ────────────────
        const activeDay = c.days.find((d) => d.state === "active");
        const pct = (c.doneCount / c.days.length) * 100;

        return (
          <section key={num} className="rounded-lg border border-line bg-surface shadow-sh2 overflow-hidden">
            <div className="p-s5">
              <div className="flex items-start gap-s4">
                <span className="w-11 h-11 rounded-md grid place-items-center shrink-0 bg-accent-soft text-accent-strong font-mono text-h3">
                  {num}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-label uppercase text-accent">Current chapter · {range}</div>
                  <h2 className="text-h3 sm:text-h2 font-semibold text-ink mt-1 text-balance">{c.info.title}</h2>
                </div>
              </div>

              <p className="text-ui text-muted mt-s3 max-w-[62ch]">{c.info.description}</p>

              <div className="flex items-center gap-s4 mt-s5 flex-wrap">
                <div className="flex-1 min-w-[180px]">
                  <div className="flex items-baseline justify-between mb-s2">
                    <span className="font-mono text-meta text-muted tabular">
                      {c.doneCount} of {c.days.length} days
                    </span>
                    <span className="font-mono text-meta text-muted tabular">{Math.round(pct)}%</span>
                  </div>
                  <div className="h-1 w-full bg-bg-sunk rounded-sm overflow-hidden">
                    <div className="h-full bg-accent rounded-sm transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {activeDay && (
                  <button
                    onClick={() => go(activeDay)}
                    className="px-s5 py-s3 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors min-h-[44px] shrink-0"
                  >
                    {activeDay.isQuiz ? "Take the review quiz" : `Continue day ${activeDay.dayOrder}`} &rarr;
                  </button>
                )}
              </div>
            </div>

            <div className="px-s3 pb-s5 bg-gradient-to-b from-transparent to-bg-sunk/40">
              <IsoPlot
                days={c.days}
                onSelect={go}
                ariaLabel={`${c.info.title}: days ${c.firstDay} to ${c.quizDayOrder}`}
              />
            </div>
          </section>
        );
      })}

      <div className="rounded-lg border border-dashed border-line-strong px-s5 py-s4 text-center">
        <span className="text-label uppercase text-faint">
          Chapter {chapters.length + 1} coming soon
        </span>
      </div>
    </div>
  );
};
