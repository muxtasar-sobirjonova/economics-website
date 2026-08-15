import React from "react";
import Link from "next/link";
import { LessonOverview } from "@/components/lessons/LessonOverview";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { client } from "@/sanity/client";
import { QUIZZES_QUERY } from "@/sanity/queries";
import { getLessons } from "@/lib/data";
import { getLessonAccessStatus, quizIdToDayOrder } from "@/lib/lesson-access";
import { SanityQuiz, SanityQuizSchema } from "@/types";
import { z } from "zod";

import { MAX_SERVED_QUESTIONS } from "@/services/quizService";

export default async function QuizzesPage({ params }: { params: { lessonId: string } }) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const lessonId = parseInt(params.lessonId) || 1;

  const { isUnlocked, completedLessonIds } = await getLessonAccessStatus(userId, lessonId);

  // Security Logic: Ensure the requested lesson is actually unlocked
  if (!isUnlocked) {
    redirect("/roadmap");
  }

  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeTrack: true }
  });
  const activeTrack = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

  const lessons = await getLessons(activeTrack);
  // Chapter-review days (7, 14, 21…) have a quiz but no lesson.
  const matchedLesson = lessons.find((l) => Number(l.dayOrder) === lessonId);
  const hasLesson = Boolean(matchedLesson);
  const baseLesson = matchedLesson || lessons[0];

  let sanityQuiz: SanityQuiz | undefined = undefined;
  try {
    const rawSanityData = await client.fetch(QUIZZES_QUERY);
    const parsedData = z.array(SanityQuizSchema).safeParse(rawSanityData);
    
    if (parsedData.success) {
      sanityQuiz = parsedData.data.find((d) => d.lessonId === lessonId);
    } else {
      console.error("[CRITICAL] Sanity CMS Quizzes validation failed:", parsedData.error.flatten());
    }
  } catch (error) {
    console.error("Failed to fetch quizzes from Sanity:", error);
  }
  const localQuiz = await prisma.quiz.findUnique({
    where: { track_dayOrder: { track: activeTrack, dayOrder: lessonId } },
    include: { questions: true }
  });

  const quizTitle = sanityQuiz?.title || localQuiz?.title || baseLesson.title;

  // The quiz player only ever serves the first 10 questions.
  const servedQuestions = Math.min(localQuiz?.questions?.length || MAX_SERVED_QUESTIONS, MAX_SERVED_QUESTIONS);
  const passingScore = Math.max(1, Math.ceil(servedQuestions * 0.8));
  
  // Dynamic Time Estimate based on question count
  let timeEstimate = baseLesson.timeEstimate;
  if (!timeEstimate) {
    const questionCount = sanityQuiz?.questions?.length || localQuiz?.questions?.length || 5;
    timeEstimate = Math.max(1, questionCount); // Roughly 1 minute per question
  }

  // Fetch actual quiz completions and mistakes from Prisma
  let quizResults: { quizId: string, score: number }[] = [];
  try {
    quizResults = await prisma.quizResult.findMany({
      where: { userId, track: activeTrack },
      select: { quizId: true, score: true },
      orderBy: { date: 'desc' } // ensure we get the latest score
    });
  } catch (error) {
    console.error("Failed to fetch quiz results or mistakes from Prisma:", error);
  }

  const currentQuizResult = quizResults.find(q => quizIdToDayOrder(q.quizId) === lessonId);
  const hasCompleted = !!currentQuizResult;

  const completedQuizLessonIds = quizResults
    .map(q => quizIdToDayOrder(q.quizId))
    .filter((d): d is number => d !== null);

  const avatarLetter = (session?.user?.name?.trim().charAt(0) || session?.user?.email?.trim().charAt(0) || "?").toUpperCase();

  const score = currentQuizResult?.score ?? 0;

  // Four mastery states, in the order a learner meets them.
  let mastery: { tone: string; label: string; title: string; body: string; showReview: boolean };
  if (!hasCompleted) {
    mastery = {
      tone: "faint",
      label: "No attempts yet",
      title: "Nothing recorded",
      body: "Read the concept and the article first \u2014 between them they cover every question.",
      showReview: false,
    };
  } else if (score >= passingScore) {
    mastery = {
      tone: "success",
      label: "Day cleared",
      title: "Excellent work",
      body: `You scored ${score}/${servedQuestions}. This day is complete and the next one is open.`,
      showReview: false,
    };
  } else if (score >= Math.ceil(servedQuestions * 0.6)) {
    mastery = {
      tone: "reward",
      label: "Close",
      title: "Good job",
      body: `You scored ${score}/${servedQuestions} \u2014 ${passingScore - score} short of the ${passingScore} you need to unlock the next day.`,
      showReview: true,
    };
  } else {
    mastery = {
      tone: "danger",
      label: "Review recommended",
      title: "Go back before trying again",
      body: `You scored ${score}/${servedQuestions}. Reread the material \u2014 another attempt costs a heart.`,
      showReview: true,
    };
  }

  const masteryPanel = (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
      <div className="flex items-baseline justify-between gap-s3 mb-s3 flex-wrap">
        <h2 className="text-label uppercase text-faint">Lesson mastery</h2>
        <span
          className="text-label uppercase px-s2 py-1 rounded-sm"
          style={{ background: `var(--${mastery.tone}-soft, var(--bg-sunk))`, color: `var(--${mastery.tone})` }}
        >
          {mastery.label}
        </span>
      </div>

      <div className="flex items-baseline gap-s4 flex-wrap">
        {hasCompleted && (
          <span className="font-mono text-h1 text-ink tabular leading-none">
            {score}<span className="text-faint">/{servedQuestions}</span>
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-h3 font-semibold text-ink">{mastery.title}</h3>
          <p className="text-ui text-muted mt-1 max-w-[58ch]">{mastery.body}</p>
        </div>
      </div>

      {mastery.showReview && hasLesson && (
        <div className="flex flex-wrap gap-s2 mt-s4 pt-s4 border-t border-line">
          <Link
            href={`/lessons/${lessonId}/concepts`}
            className="px-s4 py-s2 rounded-md border border-line text-meta text-muted hover:border-accent hover:text-accent transition-colors min-h-[44px] flex items-center"
          >
            Review concept
          </Link>
          <Link
            href={`/lessons/${lessonId}/articles`}
            className="px-s4 py-s2 rounded-md border border-line text-meta text-muted hover:border-accent hover:text-accent transition-colors min-h-[44px] flex items-center"
          >
            Review article
          </Link>
        </div>
      )}
    </section>
  );

  return (
    <LessonOverview
      kind="quizzes"
      lessonId={lessonId}
      dayLabel={`Day ${lessonId} / 56`}
      title={quizTitle}
      description={`${servedQuestions} questions \u00b7 you need ${passingScore} to clear the day.`}
      timeLabel={`${servedQuestions} questions \u00b7 10 min`}
      readHref={`/lessons/${lessonId}/quizzes/read`}
      avatarLetter={avatarLetter}
      hasLesson={hasLesson}
      mastery={masteryPanel}
      lessons={lessons.map((l) => ({ id: l.dayOrder, title: l.title }))}
      completedLessonIds={completedLessonIds}
      completedQuizLessonIds={completedQuizLessonIds}
    />
  );
}
