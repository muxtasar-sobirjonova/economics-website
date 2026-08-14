import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Track } from "@prisma/client";
import { getLessonAccessStatus } from "@/lib/lesson-access";
import ReadingActions from "@/components/ReadingActions";
import { ReadingTabs } from "@/components/lessons/ReadingTabs";
import { NoteData } from "@/types";
import { getLessons } from "@/lib/data";
import { MarkReadButton } from "@/components/lessons/MarkReadButton";



export default async function ConceptsReadPage({
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

  // 2. Fetch lesson data from DB
  let activeLesson = null;
  let takeawaysText = "";
  let activeTrack: Track = Track.ENTREPRENEURSHIP_ECONOMICS;
  try {
    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { activeTrack: true }
    });
    activeTrack = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

    const lessons = await getLessons(activeTrack);
    const baseLesson = lessons.find((l) => Number(l.dayOrder) === lessonId);
    
    if (baseLesson) {
      activeLesson = {
        lessonId: Number(baseLesson.dayOrder),
        slug: `lesson-${baseLesson.dayOrder}-concepts`,
        lessonNumber: Number(baseLesson.dayOrder),
        title: baseLesson.title,
        conceptText: baseLesson.conceptText || "Content coming soon.",
        conceptSummary: baseLesson.conceptSummary,
        conceptTakeaways: typeof baseLesson.conceptTakeaways === 'string' ? JSON.parse(baseLesson.conceptTakeaways as string) : baseLesson.conceptTakeaways,
      };
      
      if (activeLesson.conceptTakeaways && Array.isArray(activeLesson.conceptTakeaways)) {
        takeawaysText = `<ol class="list-decimal pl-4">` + activeLesson.conceptTakeaways.map((t: string) => `<li class="mb-2">${t}</li>`).join('') + `</ol>`;
      } else {
        takeawaysText = `<p>Key takeaways for ${baseLesson.title}</p>`;
      }
    }
  } catch (error) {
    console.error(`[CRITICAL] Database fetch failed for concept ${lessonId}`, error);
  }

  // markArticleDoneAction is now triggered by the MarkReadButton client component
  // when the user clicks "Next: Articles →" — NOT on server render.

  if (!activeLesson || !activeLesson.conceptText) {
    return (
      <div className="min-h-screen bg-read-bg flex flex-col items-center justify-center text-center px-s4">
        <h1 className="text-h2 font-semibold text-read-text">Not written yet</h1>
        <p className="text-ui text-muted mt-s2 max-w-[42ch]">
          This concept is still being written. Check the roadmap for what&apos;s ready.
        </p>
      </div>
    );
  }

  // 3. Fetch user notes scoped to this lesson
  let initialNotes: NoteData[] = [];

  try {
    const userNotes = await prisma.note.findMany({
      where: { userId, lessonId: String(lessonId), track: activeTrack as Track },
      orderBy: { createdAt: 'asc' },
    });
    
    initialNotes = userNotes.map(n => {
      const note: NoteData = {
        id: n.id,
        lessonId: n.lessonId || null,
        content: n.content,
      };
      if (n.color) note.color = n.color;
      if (n.source) note.source = n.source;
      if (n.timestamp) note.timestamp = n.timestamp.toISOString();
      return note;
    });
    

  } catch (error) {
    console.error("Failed to fetch user notes or bookmarks:", error);
  }

  const cleanConceptHtml = activeLesson.conceptText;

  return (
    <div className="content-page min-h-screen w-full flex flex-col bg-read-bg">
      {/* Sticky context bar — lesson chip on the left, highlight hint on the right */}
      <div className="sticky top-14 md:top-0 z-20 w-full bg-read-bg/95 backdrop-blur-sm border-b border-line">
        <div className="max-w-[860px] mx-auto px-s4 md:px-s5 h-14 flex items-center justify-between gap-s3">
          <div className="flex items-center gap-s3 min-w-0">
            <Link
              href={`/lessons/${lessonId}/concepts`}
              className="text-meta text-muted hover:text-ink transition-colors shrink-0"
            >
              &larr; Concepts
            </Link>
            <span className="text-label uppercase px-s2 py-1 rounded-sm bg-concept-soft text-concept shrink-0">
              Day {activeLesson.lessonId}
            </span>
          </div>
          <div className="shrink-0">
            <ReadingActions />
          </div>
        </div>
      </div>

      <article className="flex-1 w-full max-w-[860px] mx-auto px-s4 md:px-s5 py-s6 md:py-s7">
        {/* #main-content is the highlightable region — it must wrap the body copy,
            not just the heading. */}
        <div id="main-content" className="text-read-text">
          <header className="mb-s6 md:mb-s7">
            <div className="text-label uppercase text-muted mb-s3">Concept</div>
            <h1 className="text-h1-sm md:text-display font-semibold tracking-[-.03em] text-read-text text-balance">
              {activeLesson.title}
            </h1>
            <p className="font-mono text-meta text-faint mt-s4">
              5&ndash;10 min read · Day {lessonId || 1}
            </p>
          </header>

          <div
            className="prose prose-article mx-auto"
            dangerouslySetInnerHTML={{ __html: cleanConceptHtml }}
          />
        </div>

        <div className="flex items-center justify-between gap-s3 mt-s7 pt-s5 border-t border-line">
          <p className="text-meta text-muted hidden sm:block">Next: the story behind it.</p>
          <MarkReadButton lessonId={String(activeLesson.lessonId)} />
        </div>
      </article>

      <ReadingTabs
        lessonId={String(lessonId)}
        takeawaysText={takeawaysText}
        initialNotes={initialNotes}
        source="Concept"
      />
    </div>
  );
}
