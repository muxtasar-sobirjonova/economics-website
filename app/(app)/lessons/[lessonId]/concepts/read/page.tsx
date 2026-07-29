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
      <div className="p-8 text-center text-brand-primary bg-[#FCF6F0] min-h-screen">
        Content coming soon for this concept.
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
    <div className="content-page min-h-screen w-full font-sans flex flex-col p-0 bg-[#FCF6F0]">
      <div className="w-full bg-white border-b border-gray-100 h-[56px] px-8 flex items-center shrink-0">
        <div className="text-[13px] font-[700] tracking-[0.08em] text-gray-900 uppercase">
          CONCEPTS
        </div>
      </div>

      <div className="flex-1 overflow-visible w-full px-6 max-w-4xl mx-auto relative flex flex-col">
        {/* Main Content Column */}
        <div className="flex-1 overflow-visible py-8 w-full">
          <div className="w-full mx-auto flex flex-col gap-6">
            <div className="relative pt-5 pb-10 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <Link
                  href={`/lessons/${lessonId}/concepts`}
                  className="text-brand-primary text-[15px] font-[700] hover:text-[#5A4FBD] transition-colors inline-block w-fit bg-transparent border-none mb-2"
                >
                  &larr; Back to Concepts
                </Link>

              </div>
              <div className="flex justify-between items-center mb-8 w-full sticky top-4 z-20 py-3 bg-[#FCF6F0]/95 backdrop-blur-sm rounded-lg border-b border-[#EBEBEB]">
                <div className="inline-block border border-brand-primary bg-transparent text-brand-primary text-[11px] font-[800] tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full">
                  LESSON {activeLesson.lessonId}
                </div>
                <div className="flex-shrink-0">
                  <ReadingActions />
                </div>
              </div>
              <div className="relative z-10 text-center mb-16 pt-8" id="main-content">
                  <h1 className={`text-[44px] md:text-[52px] font-black text-[#1A1A2E] leading-[1.1] uppercase tracking-tight`}>
                    {activeLesson.title}
                  </h1>
                  <div className="text-center text-gray-400 font-sans font-[500] text-[13px] mt-6 tracking-wide uppercase">
                    ESTIMATED READING TIME (10-20 MIN) • DAY 0{lessonId || 1}
                  </div>
              </div>
              <div className="flex flex-col">
                <div className="prose prose-lg max-w-[800px] mx-auto w-full prose-h2:text-[#1A1A2E] prose-h2:uppercase prose-h2:tracking-tight prose-h2:font-bold prose-h2:mt-12 prose-p:text-[18px] prose-p:leading-[1.8] prose-p:text-gray-800">
                  <div dangerouslySetInnerHTML={{ __html: cleanConceptHtml }} />
                </div>
              </div>
              <div className="relative z-10 flex items-center justify-end mt-12">
                <MarkReadButton lessonId={String(activeLesson.lessonId)} />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Notes Drawer */}
        <div className="z-50">
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