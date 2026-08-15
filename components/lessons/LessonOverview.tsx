import React from "react";
import Link from "next/link";
import { LearningPathSlider } from "@/components/lessons/LearningPathSlider";
import { LessonHeader } from "@/components/lessons/LessonHeader";

export type OverviewKind = "concepts" | "articles" | "quizzes";

const KIND = {
  concepts: { eyebrow: "Concept", tone: "concept", cta: "Start reading", blurb: "The idea, plainly." },
  articles: { eyebrow: "Article · Case study", tone: "article", cta: "Start reading", blurb: "The story behind it." },
  quizzes:  { eyebrow: "Quiz",                  tone: "quiz",    cta: "Start quiz",   blurb: "Prove it." },
} as const;

/**
 * One template, three eyebrows — the Concepts, Articles and Quizzes overview
 * pages differ only in their activity colour, copy and what sits in the
 * mastery panel.
 */
export function LessonOverview({
  kind,
  lessonId,
  dayLabel,
  title,
  description,
  timeLabel,
  readHref,
  avatarLetter,
  hasLesson = true,
  mastery,
  lessons,
  completedLessonIds,
  completedQuizLessonIds,
}: {
  kind: OverviewKind;
  lessonId: number;
  dayLabel: string;
  title: string;
  description?: string;
  timeLabel: string;
  readHref: string;
  avatarLetter: string;
  hasLesson?: boolean;
  mastery?: React.ReactNode;
  lessons: { id: string | number; title: string }[];
  completedLessonIds: number[];
  completedQuizLessonIds?: number[];
}) {
  const k = KIND[kind];

  return (
    <div className="min-h-screen w-full flex flex-col bg-bg bg-sky">
      <LessonHeader lessonId={lessonId} activeTab={kind} avatarLetter={avatarLetter} hasLesson={hasLesson} />

      <main className="w-full max-w-[1100px] mx-auto px-s4 md:px-s6 py-s5 md:py-s6 flex flex-col gap-s5">
        {/* Hero */}
        <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5 md:p-s6">
          <div className="flex items-center gap-s3 mb-s3 flex-wrap">
            <span className="font-mono text-label uppercase text-faint">{dayLabel}</span>
            <span
              className="text-label uppercase px-s2 py-1 rounded-sm"
              style={{ background: `var(--${k.tone}-soft)`, color: `var(--${k.tone})` }}
            >
              {k.eyebrow}
            </span>
            <span className="font-mono text-label uppercase text-faint">{timeLabel}</span>
          </div>

          <h1 className="text-h1-sm md:text-h1 font-semibold text-ink text-balance">{title}</h1>

          {description && (
            <p className="text-ui text-muted mt-s3 max-w-[62ch]">{description}</p>
          )}

          <div className="flex flex-wrap items-center gap-s3 mt-s5">
            <Link
              href={readHref}
              className="px-s5 py-s3 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors min-h-[44px] flex items-center gap-s2"
            >
              {k.cta} <span aria-hidden>&rarr;</span>
            </Link>
            <span className="text-meta text-faint">{k.blurb}</span>
          </div>
        </section>

        {mastery}

        {/* Learning path */}
        <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
          <div className="flex items-baseline justify-between gap-s3 mb-s4">
            <h2 className="text-label uppercase text-faint">Learning path</h2>
            <span className="text-meta text-faint">jump to any unlocked day</span>
          </div>
          <LearningPathSlider
            currentLessonId={lessonId}
            completedLessonIds={completedLessonIds}
            completedQuizLessonIds={completedQuizLessonIds}
            routeSuffix={kind}
            lessons={lessons}
          />
        </section>
      </main>
    </div>
  );
}
