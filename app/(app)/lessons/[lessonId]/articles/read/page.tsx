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

import MagazineArticle from "@/components/MagazineArticle";

export default async function ArticlesReadPage({
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

  // 2. Fetch lesson data
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
        slug: `lesson-${baseLesson.dayOrder}-articles`,
        title: baseLesson.articleTitle || baseLesson.title,
        articleText: baseLesson.articleText || "<p>Content coming soon.</p>",
        articleTakeaways: typeof baseLesson.articleTakeaways === 'string' ? JSON.parse(baseLesson.articleTakeaways as string) : baseLesson.articleTakeaways,
      };
      
      if (activeLesson.articleTakeaways && Array.isArray(activeLesson.articleTakeaways)) {
        takeawaysText = `<ol class="list-decimal pl-4">` + activeLesson.articleTakeaways.map((t: string) => `<li class="mb-2">${t}</li>`).join('') + `</ol>`;
      } else {
        takeawaysText = `<p>Key takeaways for ${baseLesson.title}</p>`;
      }
    }
  } catch (error) {
    console.error(`[CRITICAL] Database fetch failed for article ${lessonId}`, error);
  }

  if (!activeLesson || !activeLesson.articleText) {
    return (
      <div className="min-h-screen bg-read-bg flex flex-col items-center justify-center text-center px-s4">
        <h1 className="text-h2 font-semibold text-read-text">Not written yet</h1>
        <p className="text-ui text-muted mt-s2 max-w-[42ch]">
          This article is still being written. Check the roadmap for what&apos;s ready.
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

  return (
    <div className="content-page min-h-screen w-full flex flex-col bg-read-bg">
      <div className="sticky top-14 md:top-0 z-20 w-full bg-read-bg/95 backdrop-blur-sm border-b border-line">
        <div className="max-w-[860px] mx-auto px-s4 md:px-s5 h-14 flex items-center justify-between gap-s3">
          <div className="flex items-center gap-s3 min-w-0">
            <Link
              href={`/lessons/${lessonId}/articles`}
              className="text-meta text-muted hover:text-ink transition-colors shrink-0"
            >
              &larr; Articles
            </Link>
            <span className="text-label uppercase px-s2 py-1 rounded-sm bg-article-soft text-article shrink-0">
              Day {activeLesson.lessonId}
            </span>
          </div>
          <div className="shrink-0">
            <ReadingActions />
          </div>
        </div>
      </div>

      <article className="flex-1 w-full max-w-[860px] mx-auto px-s4 md:px-s5 py-s6 md:py-s7">
        <div id="main-content" className="text-read-text">
          <MagazineArticle
            title={activeLesson.title || "Untitled"}
            contentHtml={activeLesson.articleText || "<p>Content missing.</p>"}
            lessonId={activeLesson.lessonId}
          />
        </div>

        <div className="flex items-center justify-between gap-s3 mt-s7 pt-s5 border-t border-line">
          <p className="text-meta text-muted hidden sm:block">Next: prove it on the quiz.</p>
          <MarkReadButton lessonId={String(activeLesson.lessonId)} isArticle={true} />
        </div>
      </article>

      <ReadingTabs
        lessonId={String(lessonId)}
        takeawaysText={takeawaysText}
        initialNotes={initialNotes}
        source="Article"
      />
    </div>
  );
}
