"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IsoPlot, PlotDay } from "./IsoPlot";
import { Lesson } from "@prisma/client";

const TRACK_CHAPTERS: Record<string, {
  chapterNumber: number;
  title: string;
  description: string;
}[]> = {
  ENTREPRENEURSHIP_ECONOMICS: [
    {
      chapterNumber: 1,
      title: "Foundations of Entrepreneurship Economics",
      description: "Understand what entrepreneurship economics is, why entrepreneurs exist, and how businesses create, deliver, and capture value in the economy.",
    },
    {
      chapterNumber: 2,
      title: "Scarcity, Trade-Offs & Opportunity Cost",
      description: "Learn how entrepreneurs make decisions when resources are limited, evaluate trade-offs, allocate time and money effectively, and use opportunity cost to make smarter business decisions.",
    },
    {
      chapterNumber: 3,
      title: "Risk, Uncertainty & Market Opportunities",
      description: "Discover how entrepreneurs make decisions under uncertainty, identify overlooked opportunities, overcome market barriers, and gain competitive advantages by solving real economic problems.",
    },
    {
      chapterNumber: 4,
      title: "Creating Value & Building Profitable Businesses",
      description: "Learn how entrepreneurs create value for customers, develop effective pricing strategies, understand cost structures, and measure whether a business model can become sustainably profitable.",
    },
    {
      chapterNumber: 5,
      title: "Business Models & Entrepreneurial Finance",
      description: "Understand how entrepreneurs design scalable business models, choose the right sources of funding, evaluate investment opportunities, and balance growth with long-term financial sustainability.",
    },
    {
      chapterNumber: 6,
      title: "Uncertainty, Pivots & Failure",
      description: "Learn how entrepreneurs make high-stakes decisions with incomplete information, adapt through strategic pivots, learn from setbacks, manage uncertainty, and use innovation to create lasting competitive advantages.",
    },
    {
      chapterNumber: 7,
      title: "Scaling Businesses & Sustainable Growth",
      description: "Discover how successful businesses scale their operations, spread innovation, build efficient organizations and supply chains, balance growth with profitability, and expand into international markets.",
    },
    {
      chapterNumber: 8,
      title: "Entrepreneurial Ecosystems & the Bigger Picture",
      description: "Explore how institutions, government policies, access to capital, and regional innovation ecosystems shape entrepreneurial success, and apply everything you've learned throughout the course in a final capstone review.",
    },
  ],
  BEHAVIORAL_ECONOMICS: [
    {
      chapterNumber: 1,
      title: "Foundations of Behavioral Economics",
      description: "Understand how economists moved from the idea of perfectly rational decision-making to a more realistic view of how humans actually think and choose.",
    },
    {
      chapterNumber: 2,
      title: "Mental Shortcuts and Decision Errors",
      description: "Understand how people use quick mental shortcuts to make decisions and why these shortcuts can sometimes lead to mistakes.",
    },
    {
      chapterNumber: 3,
      title: "How We Think About Gains and Losses",
      description: "Understand why people often fear losses more than they value gains and how emotions influence decisions under uncertainty.",
    },
    {
      chapterNumber: 4,
      title: "Time Preferences and Self-Control",
      description: "Understand why people often choose immediate rewards over better future outcomes and how self-control shapes everyday decisions.",
    },
    {
      chapterNumber: 5,
      title: "Fairness and Human Behavior",
      description: "Understand how fairness, trust, generosity, and social pressure influence the choices people make.",
    },
    {
      chapterNumber: 6,
      title: "Nudges and Better Decisions",
      description: "Understand how small changes in the way choices are presented can influence people's decisions without removing their freedom to choose.",
    },
    {
      chapterNumber: 7,
      title: "Behavioral Finance",
      description: "Understand why investors often make irrational financial decisions and how psychology shapes financial markets.",
    },
    {
      chapterNumber: 8,
      title: "Behavioral Economics in the Real World",
      description: "Understand how behavioral economics is used to improve public policy, marketing, and everyday decision-making while recognizing its ethical limits.",
    },
  ],
  DEVELOPMENT_ECONOMICS: [
    {
      chapterNumber: 1,
      title: "What Development Really Means",
      description: "Understand the difference between economic growth and development, how economists measure progress, and why some countries become prosperous while others struggle.",
    },
    {
      chapterNumber: 2,
      title: "Why Some Countries Grow Faster Than Others",
      description: "Understand the economic forces that drive long-term growth, why some countries catch up with richer nations while others fall behind, and how innovation fuels lasting prosperity.",
    },
    {
      chapterNumber: 3,
      title: "Poverty, Inequality, and Opportunity",
      description: "Understand why economic growth does not benefit everyone equally, how economists measure poverty and inequality, and what policies can help people escape poverty.",
    },
    {
      chapterNumber: 4,
      title: "Investing in People",
      description: "Understand why education, health, skills, and population changes shape a country's future, and how investing in people drives long-term economic development.",
    },
    {
      chapterNumber: 5,
      title: "Institutions That Build Prosperity",
      description: "Understand why strong institutions, reliable rules, and effective governments shape economic development and determine why some societies become more prosperous than others.",
    },
    {
      chapterNumber: 6,
      title: "Connecting to the Global Economy",
      description: "Understand how countries use trade, investment, specialization, and global connections to accelerate economic development and create new opportunities.",
    },
    {
      chapterNumber: 7,
      title: "How Economies Transform",
      description: "Understand how economies move from agriculture to industry and services, why cities become centers of opportunity, and how companies and industries reshape development.",
    },
    {
      chapterNumber: 8,
      title: "Money, Finance, and Development",
      description: "Understand how countries use aid, migration, finance, technology, and economic reforms to overcome challenges and create new paths for development.",
    },
  ],
};
export const RoadmapMap = ({
  completedLessonDayOrders,
  completedQuizDayOrders,
  lessons,
  activeTrack = "ENTREPRENEURSHIP_ECONOMICS",
  scoresByDay = {},
  activitiesLeft,
}: {
  completedLessonDayOrders: number[];
  completedQuizDayOrders: number[];
  lessons: Lesson[];
  activeTrack?: string;
  scoresByDay?: Record<number, number>;
  activitiesLeft?: number;
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
    .map(Number).sort((a, b) => a - b).map((i) => chaptersMap[i]);

  const meta = TRACK_CHAPTERS[activeTrack] || TRACK_CHAPTERS.ENTREPRENEURSHIP_ECONOMICS;

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
        score: scoresByDay[l.dayOrder] ?? null,
        href: `/lessons/${l.dayOrder}/concepts`,
      };
    });

    const allLessonsDone = lastLesson ? completedLessonDayOrders.includes(lastLesson.dayOrder) : false;
    const quizDone = completedQuizDayOrders.includes(quizDayOrder);

    days.push({
      dayOrder: quizDayOrder,
      title: "Chapter review",
      state: quizDone ? "done" : allLessonsDone ? "active" : "locked",
      isQuiz: true,
      score: scoresByDay[quizDayOrder] ?? null,
      href: `/lessons/${quizDayOrder}/quizzes`,
    });

    // Only the first candidate may read as active.
    let seen = false;
    days.forEach((d) => {
      if (d.state === "active") {
        if (seen) d.state = "locked";
        seen = true;
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
      reviewScore: scoresByDay[quizDayOrder] ?? null,
    };
  });

  const currentIndex = built.findIndex((c) => c.hasActive);
  const go = (day: PlotDay) => day.href && router.push(day.href);

  return (
    <div className="flex flex-col items-stretch w-full max-w-[880px] gap-s3">
      {built.map((c) => {
        const num = String(c.info.chapterNumber).padStart(2, "0");
        const range = c.firstDay ? `Days ${c.firstDay}–${c.quizDayOrder}` : "";
        const isCurrent = c.chapterIndex === currentIndex;

        if (!isCurrent) {
          return (
            <section
              key={num}
              className="rounded-lg border border-line bg-surface shadow-sh1 px-s5 py-s4 flex items-center gap-s4"
            >
              <div className="min-w-0 flex-1">
                <div className="text-label uppercase text-faint">
                  Chapter {num} · {c.isClosed ? "Closed" : "Locked"}
                </div>
                <h2 className="text-h3 font-semibold text-ink mt-[2px] line-clamp-3 pb-[3px]">
                  {c.info.title}
                </h2>
                <p className="font-mono text-meta text-muted tabular mt-1">
                  {c.isClosed
                    ? `${c.doneCount} of ${c.days.length} days${c.reviewScore != null ? ` · review quiz ${c.reviewScore}/10` : ""}`
                    : `Clear day ${(c.firstDay ?? 1) - 1} to break ground on ${range.toLowerCase()}.`}
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

        const activeDay = c.days.find((d) => d.state === "active");
        const pct = Math.round((c.doneCount / c.days.length) * 100);

        return (
          <section key={num} className="rounded-lg border border-line bg-surface shadow-sh2 overflow-hidden">
            <div className="p-s5">
              <div className="flex items-start gap-s4">
                <span className="w-11 h-11 rounded-md grid place-items-center shrink-0 bg-accent-soft text-accent-strong font-mono text-h3">
                  {num}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-label uppercase text-accent">Current chapter · {range}</div>
                  <h2 className="text-h2 font-semibold text-ink mt-1 text-balance">{c.info.title}</h2>
                </div>
              </div>

              <p className="text-ui text-muted mt-s3 max-w-[62ch]">{c.info.description}</p>

              <div className="flex items-center gap-s4 mt-s5 flex-wrap">
                <div className="flex-1 min-w-[180px]">
                  <div className="flex items-baseline justify-between mb-s2">
                    <span className="font-mono text-meta text-muted tabular">
                      {c.doneCount} of {c.days.length} days
                    </span>
                    <span className="font-mono text-meta text-muted tabular">{pct}%</span>
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
                    {activeDay.isQuiz ? "Take the review" : `Continue day ${activeDay.dayOrder}`} →
                  </button>
                )}
              </div>
            </div>

            <div className="px-s2 pb-s4">
              <IsoPlot
                days={c.days}
                onSelect={go}
                activitiesLeft={activitiesLeft}
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
