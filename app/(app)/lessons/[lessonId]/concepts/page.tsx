import React, { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getLessonAccessStatus } from "@/lib/lesson-access";
import { getLessons, getQuizzes, QUIZZES } from "@/lib/data";
import { BookOpen } from "lucide-react";
import { IconClock, IconFileText, IconTrendingUp, IconCompass, IconLoader } from "@tabler/icons-react";
import { LessonHeader } from "@/components/lessons/LessonHeader";
import { client } from "@/sanity/client";
import { CONCEPTS_QUERY } from "@/sanity/queries";
import { MOCK_CONTENT } from "@/lib/mockContent";
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
  }
  
  const lessons = await getLessons();
  let activeLesson = lessons.find((l) => l.dayOrder === lessonId) as LessonData | undefined;
  if (!activeLesson) {
    notFound();
  }

  // Fetch Sanity Data for dynamic title/description
  try {
    const sanityData = await client.fetch<{ lessonId: number, title?: string, conceptText?: string }[]>(CONCEPTS_QUERY);
    const sanityLesson = sanityData?.find((d) => d.lessonId === lessonId);
    if (sanityLesson) {
      activeLesson = {
        ...activeLesson,
        title: sanityLesson.title || activeLesson.title,
        conceptText: sanityLesson.conceptText,
      };
    } else {
      activeLesson = {
        ...activeLesson,
        title: MOCK_CONTENT[lessonId]?.concept?.title || activeLesson.title,
        conceptText: MOCK_CONTENT[lessonId]?.concept?.text,
      };
    }
  } catch (error) {
    console.error("Failed to fetch Sanity data for concepts dashboard", error);
  }

  // Dynamic Time Estimate based on word count
  let timeEstimate = activeLesson.timeEstimate;
  if (!timeEstimate) {
    if (activeLesson.conceptText) {
      // rough word count / 200 wpm
      const words = activeLesson.conceptText.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
      timeEstimate = Math.max(1, Math.ceil(words / 200));
    } else {
      timeEstimate = 10;
    }
  }

  const avatarLetter = session.user.name 
    ? session.user.name.charAt(0).toUpperCase() 
    : session.user.email 
      ? session.user.email.charAt(0).toUpperCase() 
      : "U";

  return (
    <div className="min-h-screen font-sans flex flex-col text-[#1F2937] bg-slate-50">
      <LessonHeader lessonId={lessonId} activeTab="concepts" avatarLetter={avatarLetter} />

      <main className="px-10 pb-16 max-w-[1240px] w-full mx-auto mt-4">
        {/* Clean Header (No Background) */}
        <div className="flex items-center mb-10 px-8 py-4 rounded-3xl bg-white border border-[#EBEBEB] shadow-sm relative overflow-hidden">
          <div className="flex-1 flex gap-6 items-center w-full relative z-10">
            <div className="w-[84px] h-[84px] rounded-[20px] flex items-center justify-center shrink-0 ml-2">
              <BookOpen size={48} className="text-[#4ebdd5]" strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 px-3 min-w-0 flex flex-col justify-center">
              <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-gray-900 mb-1.5 drop-shadow-sm">
                CONCEPT
              </div>
              <h3 className="text-gray-900 text-[26px] font-bold mb-2 leading-tight whitespace-nowrap">
                {activeLesson.title}
              </h3>
              <div className="flex items-center text-gray-600 text-sm font-medium">
                <IconClock size={18} className="mr-2" />
                {timeEstimate} min read
              </div>
              <div className="text-sm text-gray-600 truncate mt-1 max-w-[500px]">
                {activeLesson.subtitle}
              </div>
            </div>

            <div className="shrink-0 flex items-end justify-center mr-4 self-end mb-2">
               <Link href={`/lessons/${lessonId}/concepts/read`}>
                 <button className="bg-brand-primary text-white font-medium text-[13px] tracking-wide py-3 px-7 rounded-[14px] hover:opacity-90 hover:scale-105 transition-transform flex items-center gap-2 group active:scale-95 border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
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
                 </button>
               </Link>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-8 md:items-start mb-5">
          <div className="flex-1 flex items-center gap-4">
             <h3 className="text-[13px] font-bold tracking-[0.08em] text-gray-900 uppercase">
                CONCEPT SUMMARY
             </h3>
          </div>
          <div className="w-full md:w-[340px] flex items-center gap-3">
             <h3 className="text-[13px] font-bold tracking-[0.08em] text-gray-900 uppercase hidden md:block">
                EXPLORE ARTICLE
             </h3>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:items-stretch mb-10">
          {/* Concept Summary Section */}
          <div className="flex-1 bg-white p-8 flex flex-col gap-4 border border-[#EBEBEB] border-l-4 border-l-brand-primary rounded-2xl shadow-sm">
             <p className="text-gray-900 text-[15px] leading-[1.7] font-normal">
               {activeLesson.description || "Master the fundamental principles of entrepreneurship."}
             </p>
          </div>

          {/* Article Section */}
          <div className="w-full md:w-[340px] bg-white p-8 flex flex-col relative border border-[#EBEBEB] border-l-4 border-l-brand-primary rounded-2xl shadow-sm">
              <div className="flex gap-4 items-start mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <IconCompass size={24} stroke={2} className="text-brand-primary" />
                </div>
                <div className="pt-0">
                  <h4 className="font-bold text-gray-900 text-base mb-1">Dive deeper</h4>
                  <p className="text-[#333333] text-[13px] leading-[1.7] font-normal">
                    Read the full article to master these concepts
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <Link href={`/lessons/${lessonId}/articles`}>
                  <button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-3.5 px-6 rounded-2xl transition-transform duration-150 active:scale-95 flex items-center justify-center gap-2 text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                    Read Full Article
                    <IconFileText size={18} />
                  </button>
                </Link>
              </div>
            </div>
        </div>

        {/* Learning Path */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[13px] font-bold tracking-[0.08em] text-gray-900 uppercase flex items-center gap-1.5">
              LEARNING PATH <IconTrendingUp size={16} className="text-[#1F2937]" stroke={2.5} />
            </h3>
          </div>
          
          <Suspense fallback={
            <div className="flex items-center justify-center py-10 bg-white border border-[#EBEBEB] rounded-3xl">
              <IconLoader className="animate-spin text-brand-primary" size={32} />
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
