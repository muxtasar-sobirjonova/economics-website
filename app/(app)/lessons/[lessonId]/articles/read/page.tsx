import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLessonAccessStatus } from "@/lib/lesson-access";
import { client } from "@/sanity/client";
import { ARTICLE_BY_ID_QUERY } from "@/sanity/queries";
import ReadingActions from "@/components/ReadingActions";
import { ReadingTabs } from "@/components/lessons/ReadingTabs";
import { NoteData, LessonDataSchema } from "@/types";
import { z } from "zod";
import { MOCK_CONTENT } from "@/lib/mockContent";
import { getLessons } from "@/lib/data";
import { MarkReadButton } from "@/components/lessons/MarkReadButton";

import { Playfair_Display } from "next/font/google";
import { LessonOneCaseStudy } from "@/components/lessons/LessonOneCaseStudy";


const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

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

  // 2. Fetch lesson data from Sanity
  let activeLesson = null;
  let takeawaysText = "";
  try {
    const rawSanityLesson = await client.fetch(
      ARTICLE_BY_ID_QUERY,
      { lessonId },
      { next: { revalidate: 3600 } }
    );
    const parsedData = LessonDataSchema.safeParse(rawSanityLesson);
    
    let sanityLesson;
    if (parsedData.success) {
      sanityLesson = parsedData.data;
    } else {
      console.error("[CRITICAL] Sanity CMS Article validation failed:", parsedData.error.flatten());
    }
    
    const lessons = await getLessons();
    const baseLesson = lessons.find((l) => l.dayOrder === lessonId);
    
    if (baseLesson) {
      activeLesson = {
        lessonId: Number(baseLesson.dayOrder),
        slug: `lesson-${baseLesson.dayOrder}-articles`,
        title: (lessonId === 1 ? MOCK_CONTENT[1].article.title : sanityLesson?.title) || MOCK_CONTENT[lessonId]?.article?.title || baseLesson.title,
        articleText: (lessonId === 1 ? MOCK_CONTENT[1].article.text : sanityLesson?.articleContent) || MOCK_CONTENT[lessonId]?.article?.text || "Content coming soon.",
      };
      takeawaysText = `<p>Key takeaways for ${baseLesson.title}</p>`;
    }
  } catch (error) {
    console.error(`[CRITICAL] Sanity CMS fetch failed for article ${lessonId}`, error);
    // Fallback to mock content
    const lessons = await getLessons();
    const baseLesson = lessons.find((l) => l.dayOrder === lessonId);
    if (baseLesson) {
      activeLesson = {
        lessonId: Number(baseLesson.dayOrder),
        slug: `lesson-${baseLesson.dayOrder}-articles`,
        title: MOCK_CONTENT[lessonId]?.article?.title || baseLesson.title,
        articleText: MOCK_CONTENT[lessonId]?.article?.text || "Content coming soon.",
      };
      takeawaysText = `<p>Key takeaways for ${baseLesson.title}</p>`;
    }
  }

  if (!activeLesson || !activeLesson.articleText) {
    return (
      <div className="p-8 text-center text-brand-primary bg-[#F8F9FC] min-h-screen">
        Content coming soon for this article.
      </div>
    );
  }

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
    console.error("Failed to fetch user notes or bookmarks:", error);
  }

  const isLesson1 = Number(activeLesson.lessonId) === 1;

  return (
    <div className="content-page min-h-screen w-full font-sans flex flex-col p-0 bg-[#F8F9FC]">
      <div className="w-full bg-white border-b border-gray-100 h-[56px] px-8 flex items-center shrink-0">
        <div className="text-[13px] font-[700] tracking-[0.08em] text-gray-900 uppercase">
          ARTICLES
        </div>
      </div>

      <div className="flex-1 overflow-visible w-full px-4 sm:px-6 max-w-4xl mx-auto relative flex flex-col">
        {/* Main Content Column */}
        <div className="flex-1 overflow-visible py-8 px-2 sm:px-0 w-full">
          <div className="w-full mx-auto flex flex-col gap-6">
            <div className="relative pt-5 pb-10 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <Link
                  href={`/lessons/${lessonId}/articles`}
                  className="text-brand-primary text-[15px] font-[700] hover:text-[#5A4FBD] transition-colors inline-block w-fit bg-transparent border-none mb-2"
                >
                  &larr; Back to Articles
                </Link>

              </div>
              <div className="flex justify-between items-center mb-8 w-full sticky top-4 z-20 py-3 bg-[#F8F9FC]/95 backdrop-blur-sm rounded-lg border-b border-[#EBEBEB]">
                <div className="inline-block border border-brand-primary bg-transparent text-brand-primary text-[11px] font-[800] tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full">
                  LESSON {activeLesson.lessonId}
                </div>
                <div className="flex-shrink-0">
                  <ReadingActions slug={activeLesson.slug || `lesson-${activeLesson.lessonId}-articles`} />
                </div>
              </div>
              
              <div className="relative z-10" id="main-content">
                {isLesson1 ? (
                  <LessonOneCaseStudy />
                ) : (
                  <>
                    <h2 className={`${playfair.className} text-[#1A1A2E] text-[42px] font-[800] mb-10 leading-[1.1] tracking-tight uppercase`}>
                      {activeLesson.title}
                    </h2>
                    <div className="prose prose-purple max-w-none prose-img:rounded-xl prose-img:w-full prose-table:block prose-table:overflow-x-auto text-[#1A1A2E] text-[17px] leading-[1.8] font-medium overflow-hidden w-full break-words">
                      <div dangerouslySetInnerHTML={{ __html: activeLesson.articleText }} />
                    </div>
                  </>
                )}
              </div>
              <div className="relative z-10 flex items-center justify-end mt-12">
                <MarkReadButton lessonId={String(activeLesson.lessonId)} isArticle={true} />
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
