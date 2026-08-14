import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLessonAccessStatus } from "@/lib/lesson-access";
import { ReadingTabs } from "@/components/lessons/ReadingTabs";
import { NoteData, QuizQuestion } from "@/types";
import QuizClient from "./QuizClient";


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

  // 2. Fetch quiz data from Database
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeTrack: true }
  });
  const activeTrack = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

  const quiz = await prisma.quiz.findUnique({
    where: { track_dayOrder: { track: activeTrack, dayOrder: lessonId } },
    include: {
      questions: {
        orderBy: { order: 'asc' }
      }
    }
  });

  const questions = quiz?.questions || [];

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-s4">
        <h1 className="text-h2 font-semibold text-ink">Not written yet</h1>
        <p className="text-ui text-muted mt-s2 max-w-[42ch]">
          This quiz is still being written. Check the roadmap for what&apos;s ready.
        </p>
      </div>
    );
  }

  // Strip correct options from questions to ensure secure client delivery
  const secureQuestions = questions.map((q) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { correctAnswer, ...rest } = q;
    return q as unknown as QuizQuestion;
  });

  // 3. Fetch user notes scoped to this lesson
  let initialNotes: NoteData[] = [];
  try {
    const userNotes = await prisma.note.findMany({
      where: { userId, lessonId: String(lessonId), track: activeTrack },
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
    /* The quiz is a stage: the app chrome steps back and the ground goes dark,
       one question at a time. */
    <div
      data-theme="dark"
      className="content-page fixed inset-0 z-[80] bg-bg text-ink overflow-y-auto"
    >
      <div className="w-full max-w-[720px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 min-h-full flex flex-col">
        <QuizClient lessonId={lessonId} questions={secureQuestions} />
      </div>

      <ReadingTabs
        lessonId={String(lessonId)}
        takeawaysText={""}
        initialNotes={initialNotes}
        hideTakeaways={true}
        source="Quiz"
      />
    </div>
  );
}
