import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLessonAccessStatus } from "@/lib/lesson-access";
import { client } from "@/sanity/client";
import { QUIZ_BY_ID_QUERY } from "@/sanity/queries";
import { z } from "zod";
import { ReadingTabs } from "@/components/lessons/ReadingTabs";
import { NoteData, QuizQuestion, SanityQuizSchema } from "@/types";
import { MOCK_CONTENT } from "@/lib/mockContent";
import { getLessons, getQuizzes, QUIZZES } from "@/lib/data";
import QuizClient from "./QuizClient";
import QuizPageLayout from "./QuizPageLayout";

export default async function QuizzesReadPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const lessonId = parseInt(params.lessonId);
  if (isNaN(lessonId)) {
    notFound();
  }

  // 1. Check access
  const access = await getLessonAccessStatus(userId, lessonId);
  if (!access.isUnlocked) {
    redirect("/roadmap");
  }

  // 2. Fetch lesson data from Sanity
  const activeLesson = null;
  let questions: any[] = [];
  try {
    const rawSanityLesson = await client.fetch(
      QUIZ_BY_ID_QUERY,
      { lessonId },
      { next: { revalidate: 3600 } }
    );
    const parsedData = SanityQuizSchema.safeParse(rawSanityLesson);
    
    let sanityLesson;
    if (parsedData.success) {
      sanityLesson = parsedData.data;
    } else {
      console.error("[CRITICAL] Sanity CMS Quiz validation failed:", parsedData.error.flatten());
    }

    const quiz = QUIZZES.find((q) => q.id === 100 + lessonId);
    
    questions = (lessonId === 1 ? quiz?.questions : sanityLesson?.questions) || quiz?.questions || [];
  } catch (error) {
    console.error(`[CRITICAL] Sanity CMS fetch failed for quiz ${lessonId}`, error);
    // Fallback to mock content
    const quiz = QUIZZES.find((q) => q.id === 100 + lessonId);
    questions = quiz?.questions || [];
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-brand-primary bg-[#F8F9FC] min-h-screen">
        Content coming soon for this quiz.
      </div>
    );
  }

  // Strip correct options from questions to ensure secure client delivery
  const secureQuestions = questions.map((q: any) => {
    const { correctAnswer, ...rest } = q;
    return rest as QuizQuestion;
  });

  // 3. Fetch user notes scoped to this lesson
  let initialNotes: NoteData[] = [];
  try {
    const userNotes = await prisma.note.findMany({
      where: { userId, lessonId: String(lessonId) },
      orderBy: { createdAt: 'asc' },
    });
    
    initialNotes = userNotes.map(n => ({
      id: n.id,
      lessonId: n.lessonId || null,
      content: n.content,
      color: n.color || undefined,
      source: n.source || undefined,
      timestamp: n.timestamp ? n.timestamp.toISOString() : undefined
    }));
  } catch (error) {
    console.error("Failed to fetch user notes:", error);
  }

  return (
    <div className="content-page min-h-screen w-full font-sans flex flex-col p-0 bg-[#F8F9FC]">
      <div className="w-full bg-white border-b border-gray-100 h-[56px] px-8 flex items-center shrink-0">
        <div className="text-[13px] font-[700] tracking-[0.08em] text-gray-900 uppercase">
          QUIZZES
        </div>
      </div>

      <QuizPageLayout
        quizContent={<QuizClient lessonId={lessonId} questions={secureQuestions} />}
        notesContent={
          <ReadingTabs
            lessonId={String(lessonId)}
            takeawaysText={""}
            initialNotes={initialNotes}
            hideTakeaways={true}
          />
        }
      />
    </div>
  );
}
