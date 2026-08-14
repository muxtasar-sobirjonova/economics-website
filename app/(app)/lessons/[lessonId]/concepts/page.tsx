import React, { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getLessonAccessStatus } from "@/lib/lesson-access";
import { getLessons } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { BookOpen } from "lucide-react";
import { IconClock, IconFileText, IconTrendingUp, IconCompass, IconLoader } from "@tabler/icons-react";
import { LessonHeader } from "@/components/lessons/LessonHeader";
import { client } from "@/sanity/client";
import { CONCEPTS_QUERY } from "@/sanity/queries";
import { MOCK_CONTENT, DEV_MOCK_CONTENT } from "@/lib/mockContent";
import { LearningPathSlider } from "@/components/lessons/LearningPathSlider";
export default async function ConceptsPage({ params }: { params: { lessonId: string } }) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const lessonId = parseInt(params.lessonId);
  if (isNaN(lessonId)) {
    notFound();
  }
  
  interface LessonData {
    id: number;
    title: string;
    subtitle?: string;
    description?: string;
    timeEstimate?: number;
    conceptText?: string;
    conceptSummary?: string;
  }
  
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeTrack: true }
  });
  const activeTrack = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

  const lessons = await getLessons(activeTrack);
  const foundLesson = lessons.find((l) => l.dayOrder === lessonId) as LessonData | undefined;
  if (!foundLesson) {
    notFound();
  }
  
  let activeLesson: LessonData = foundLesson;

  // Fetch Sanity Data for dynamic title/description
  try {
    const sanityData = await client.fetch<{ lessonId: number, title?: string, conceptText?: string, conceptSummary?: string }[]>(CONCEPTS_QUERY);
    const sanityLesson = sanityData?.find((d) => d.lessonId === lessonId);
    if (sanityLesson) {
      activeLesson = {
        ...activeLesson,
        title: sanityLesson.title || activeLesson.title,
        conceptText: sanityLesson.conceptText,
        conceptSummary: sanityLesson.conceptSummary,
      };
    } else {
      let mockFallback = null;
      if (activeTrack === "ENTREPRENEURSHIP_ECONOMICS") mockFallback = MOCK_CONTENT[lessonId]?.concept;
      else if (activeTrack === "DEVELOPMENT_ECONOMICS") mockFallback = DEV_MOCK_CONTENT[lessonId]?.concept;

      if (mockFallback) {
        activeLesson = {
          ...activeLesson,
          title: mockFallback.title || activeLesson.title,
          conceptText: mockFallback.text,
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch Sanity data for concepts dashboard", error);
  }

  // Dynamic Time Estimate based on word count
  let timeEstimate = activeLesson.timeEstimate;
  if (!timeEstimate) {
    if (activeLesson.conceptText) {
      // rough word count / 200 wpm
      const words = (activeLesson.conceptText || "").replace(/<[^>]*>?/g, '').split(/\s+/).length;
      timeEstimate = Math.max(1, Math.ceil((words || 0) / 200)) || 5;
    } else {
      timeEstimate = 10;
    }
  }

  const avatarLetter = (session?.user?.name?.trim().charAt(0) || session?.user?.email?.trim().charAt(0) || "?").toUpperCase();

  return (
    <div className="min-h-screen font-sans flex flex-col text-ink bg-bg">
      <LessonHeader lessonId={lessonId} activeTab="concepts" avatarLetter={avatarLetter} />

      <main className="px-4 md:px-10 pb-8 md:pb-16 max-w-[1240px] w-full mx-auto mt-4 overflow-hidden md:overflow-visible">
        {/* Clean Header (No Background) */}
        <div className="flex flex-col md:flex-row items-start md:items-center mb-6 md:mb-10 p-5 md:px-8 md:py-4 rounded-3xl bg-surface border border-line shadow-sm relative overflow-hidden">
          <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center w-full relative z-10">
            <div className="w-[60px] h-[60px] md:w-[84px] md:h-[84px] rounded-[16px] md:rounded-[20px] flex items-center justify-center shrink-0 md:ml-2">
              <BookOpen className="text-article w-10 h-10 md:w-12 md:h-12" strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 px-1 md:px-3 min-w-0 flex flex-col justify-center w-full">
              <div className="text-[10px] md:text-[11px] font-bold tracking-[0.08em] uppercase text-ink mb-1.5 drop-shadow-sm">
                CONCEPT
              </div>
              <h3 className="text-ink text-xl md:text-[26px] font-bold mb-2 leading-tight md:whitespace-nowrap">
                {activeLesson.title}
              </h3>
              <div className="flex items-center text-muted text-[13px] md:text-sm font-medium">
                <IconClock className="mr-2 w-4 h-4 md:w-[18px] md:h-[18px]" />
                {timeEstimate} min read
              </div>
              <div className="text-[13px] md:text-sm text-muted truncate mt-1 max-w-[500px]">
                {activeLesson.subtitle}
              </div>
            </div>

            <div className="shrink-0 flex items-start md:items-end justify-start md:justify-center w-full md:w-auto md:mr-4 md:self-end mt-2 md:mt-0 md:mb-2">
               <Link href={`/lessons/${lessonId}/concepts/read`} className="w-full md:w-auto">
                 <div className="w-full md:w-auto bg-accent text-white font-medium text-[14px] md:text-[13px] tracking-wide py-3 px-6 md:px-7 rounded-[14px] hover:opacity-90 hover:scale-105 transition-transform flex items-center justify-center gap-2 group active:scale-95 border border-transparent cursor-pointer">
                   Continue Lesson
                   <svg
                     width="14"
                     height="14"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2.5"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     className="transition-transform group-hover:translate-x-1"
                   >
                     <path d="M5 12h14M12 5l7 7-7 7" />
                   </svg>
                 </div>
               </Link>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-8 md:items-start mb-5">
          <div className="flex-1 flex items-center gap-4">
             <h3 className="text-[13px] font-bold tracking-[0.08em] text-ink uppercase">
                CONCEPT SUMMARY
             </h3>
          </div>
          <div className="w-full md:w-[340px] flex items-center gap-3">
             <h3 className="text-[13px] font-bold tracking-[0.08em] text-ink uppercase hidden md:block">
                EXPLORE ARTICLE
             </h3>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:items-stretch mb-10">
          {/* Concept Summary Section */}
          <div className="flex-1 bg-surface p-5 md:p-8 flex flex-col gap-4 border border-line border-l-4 border-l-brand-primary rounded-2xl shadow-sm">
             <p className="text-ink text-[15px] leading-[1.7] font-normal">
               {activeLesson.conceptSummary || activeLesson.description || "Master the fundamental principles of entrepreneurship."}
             </p>
          </div>

          {/* Article Section */}
          <div className="w-full md:w-[340px] bg-surface p-5 md:p-8 flex flex-col relative border border-line border-l-4 border-l-brand-primary rounded-2xl shadow-sm">
              <div className="flex gap-4 items-start mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <IconCompass size={24} stroke={2} className="text-accent" />
                </div>
                <div className="pt-0">
                  <h4 className="font-bold text-ink text-base mb-1">Dive deeper</h4>
                  <p className="text-muted text-[13px] leading-[1.7] font-normal">
                    Read the full article to master these concepts
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <Link href={`/lessons/${lessonId}/articles`}>
                  <div className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3.5 px-6 rounded-2xl transition-transform duration-150 active:scale-95 flex items-center justify-center gap-2 text-[15px] cursor-pointer">
                    Read Full Article
                    <IconFileText size={18} />
                  </div>
                </Link>
              </div>
            </div>
        </div>

        {/* Learning Path */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[13px] font-bold tracking-[0.08em] text-ink uppercase flex items-center gap-1.5">
              LEARNING PATH <IconTrendingUp size={16} className="text-ink" stroke={2.5} />
            </h3>
          </div>
          
          <Suspense fallback={
            <div className="flex items-center justify-center py-10 bg-surface border border-line rounded-3xl">
              <IconLoader className="animate-spin text-accent" size={32} />
            </div>
          }>
            <LearningPathData userId={userId} lessonId={lessonId} lessons={lessons.map(l => ({ id: l.dayOrder, title: l.title }))} />
          </Suspense>
        </div>

      </main>
    </div>
  );
}

async function LearningPathData({ userId, lessonId, lessons }: { userId: string, lessonId: number, lessons: {id: number|string, title: string}[] }) {
  const { isUnlocked, completedLessonIds } = await getLessonAccessStatus(userId, lessonId);

  // Security Logic: Ensure the requested lesson is actually unlocked
  if (!isUnlocked) {
    redirect("/roadmap");
  }

  return (
    <LearningPathSlider 
      currentLessonId={lessonId} 
      completedLessonIds={completedLessonIds} 
      lessons={lessons}
    />
  );
}
