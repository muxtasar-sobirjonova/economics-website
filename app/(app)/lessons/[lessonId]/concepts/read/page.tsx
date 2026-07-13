import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLessonAccessStatus } from "@/lib/lesson-access";
import { client } from "@/sanity/client";
import { CONCEPT_BY_ID_QUERY } from "@/sanity/queries";
import ReadingActions from "@/components/ReadingActions";
import { ReadingTabs } from "@/components/lessons/ReadingTabs";
import { NoteData, LessonDataSchema } from "@/types";

import { MOCK_CONTENT } from "@/lib/mockContent";
import { getLessons } from "@/lib/data";
import { MarkReadButton } from "@/components/lessons/MarkReadButton";
import { ReadPageBookmark } from "@/components/lessons/ReadPageBookmark";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

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

  // 2. Fetch lesson data from Sanity with Caching and Scoped Query
  let activeLesson = null;
  let takeawaysText = "";
  try {
    const rawSanityLesson = await client.fetch(
      CONCEPT_BY_ID_QUERY,
      { lessonId },
      { next: { revalidate: 3600 } }
    );
    const parsedData = LessonDataSchema.safeParse(rawSanityLesson);
    
    if (parsedData.success) {
      activeLesson = parsedData.data;
    } else {
      console.error("[CRITICAL] Sanity CMS Lesson validation failed:", parsedData.error.flatten());
    }
  } catch (error) {
    console.error(`[CRITICAL] Sanity CMS fetch failed for lesson ${lessonId}`, error);
  }

  if (!activeLesson) {
    // Fallback to mock content if sanity fails
    const lessons = await getLessons();
    const baseLesson = lessons.find((l) => Number(l.dayOrder) === lessonId) || lessons[0];
    
    if (baseLesson) {
      activeLesson = {
        lessonId: Number(baseLesson.dayOrder),
        slug: `lesson-${baseLesson.dayOrder}-concepts`,
        lessonNumber: Number(baseLesson.dayOrder),
        title: baseLesson.title,
        conceptText: MOCK_CONTENT[lessonId]?.concept?.text || "Content coming soon.",
      };
      takeawaysText = `<p>Key takeaways for ${baseLesson.title}</p>`;
    }
  }

  // markArticleDoneAction is now triggered by the MarkReadButton client component
  // when the user clicks "Next: Articles →" — NOT on server render.

  if (!activeLesson || !activeLesson.conceptText) {
    return (
      <div className="p-8 text-center text-brand-primary bg-[#F8F9FC] min-h-screen">
        Content coming soon for this concept.
      </div>
    );
  }

  // 3. Fetch user notes scoped to this lesson
  let initialNotes: NoteData[] = [];
  let isBookmarked = false;
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
    
    const slug = activeLesson.slug || `lesson-${activeLesson.lessonId}-concepts`;
    const userBookmark = await prisma.bookmark.findFirst({
      where: { userId, slug },
    });
    
    isBookmarked = !!userBookmark;
  } catch (error) {
    console.error("Failed to fetch user notes or bookmarks:", error);
  }

  return (
    <div className="content-page min-h-screen w-full font-sans flex flex-col p-0 bg-[#F8F9FC]">
      <div className="w-full bg-white border-b border-gray-100 h-[56px] px-8 flex items-center shrink-0">
        <div className="text-[13px] font-[700] tracking-[0.08em] text-gray-900 uppercase">
          CONCEPTS
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 flex-1 overflow-visible w-full px-6 max-w-[1200px] mx-auto relative">
        {/* Left Column */}
        <div className="flex-1 overflow-visible p-8 w-full">
          <div className="w-full mx-auto flex flex-col gap-6">
            <div className="relative pt-5 pb-10 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <Link
                  href={`/lessons/${lessonId}/concepts`}
                  className="text-brand-primary text-[15px] font-[700] hover:text-[#5A4FBD] transition-colors inline-block w-fit bg-transparent border-none mb-2"
                >
                  &larr; Back to Concepts
                </Link>
                <ReadPageBookmark
                  slug={activeLesson.slug || `lesson-${activeLesson.lessonId}-concepts`}
                  initialIsBookmarked={isBookmarked}
                />
              </div>
              <div className="flex justify-between items-center mb-8 w-full sticky top-4 z-20 py-3 bg-[#F8F9FC]/95 backdrop-blur-sm rounded-lg border-b border-[#EBEBEB]">
                <div className="inline-block border border-brand-primary bg-transparent text-brand-primary text-[11px] font-[800] tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full">
                  LESSON {activeLesson.lessonId}
                </div>
                <div className="flex-shrink-0">
                  <ReadingActions slug={activeLesson.slug || `lesson-${activeLesson.lessonId}-concepts`} />
                </div>
              </div>
              <div className="relative z-10" id="main-content">
                  <h2 className={`${playfair.className} text-[#1A1A2E] text-[42px] font-[800] mb-10 leading-[1.1] tracking-tight uppercase`}>
                    {activeLesson.title}
                  </h2>
                  <div className="prose prose-purple max-w-none text-[#1A1A2E] text-[17px] leading-[1.8] font-[500]">
                    <div dangerouslySetInnerHTML={{ __html: activeLesson.conceptText }} />
                  </div>
              </div>
              <div className="relative z-10 flex items-center justify-end mt-12">
                <MarkReadButton lessonId={String(activeLesson.lessonId)} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full pt-8 order-2 lg:order-none pb-12 lg:pb-0">
          <ReadingTabs
            lessonId={String(lessonId)}
            takeawaysText={takeawaysText}
            initialNotes={initialNotes}
          />
        </div>
      </div>
    </div>
  );
}