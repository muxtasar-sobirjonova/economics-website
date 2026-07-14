import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { client } from "@/sanity/client";
import { ARTICLES_QUERY } from "@/sanity/queries";
import { getLessons } from "@/lib/data";
import { getLessonAccessStatus } from "@/lib/lesson-access";
import { IconClock, IconFileText, IconTrendingUp, IconBrain } from "@tabler/icons-react";
import { FileText } from "lucide-react";
import { LearningPathSlider } from "@/components/lessons/LearningPathSlider";
import { ArticleSummary } from "@/components/lessons/ArticleSummary";
import { SanityArticle, ArticleDataSchema } from "@/types";
import { z } from "zod";

import { LessonHeader } from "@/components/lessons/LessonHeader";

export default async function ArticlesPage({ params }: { params: { lessonId: string } }) {
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

  const lessons = await getLessons();
  const baseLesson = lessons.find((l) => Number(l.dayOrder) === lessonId) || lessons[0];

  let sanityArticle: SanityArticle | undefined = undefined;
  try {
    const sanityData = await client.fetch<{ lessonId: number, title?: string, articleContent?: string, articleSummary?: string }[]>(ARTICLES_QUERY);
    const lessonData = sanityData?.find((d) => d.lessonId === lessonId);
    if (lessonData) {
      sanityArticle = {
        lessonId: lessonData.lessonId,
        title: lessonData.title || "",
        content: lessonData.articleContent,
        articleSummary: lessonData.articleSummary
      } as SanityArticle;
    }
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }
  
  // Use mock content as fallback if Sanity fetch fails
  let mockContentFallback = null;
  if (!sanityArticle) {
    const { MOCK_CONTENT } = await import("@/lib/mockContent");
    mockContentFallback = MOCK_CONTENT[lessonId]?.article;
  }

  let activeLesson;
  if (sanityArticle) {
    activeLesson = sanityArticle as any; // Allow the extra fields
  } else if (mockContentFallback) {
    activeLesson = mockContentFallback;
  } else if (baseLesson) {
    activeLesson = baseLesson;
  }

  const articleTitle = activeLesson?.title || baseLesson.title;
  const articleText = activeLesson?.content || activeLesson?.text || "Content coming soon.";
  const articleSummary = activeLesson?.articleSummary || activeLesson?.summary || articleText;

  // Dynamic Time Estimate based on word count
  let timeEstimate = baseLesson.timeEstimate;
  if (!timeEstimate) {
    if (articleText) {
      // rough word count / 200 wpm
      const words = articleText.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
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
      <LessonHeader lessonId={lessonId} activeTab="articles" avatarLetter={avatarLetter} />

      <main className="px-10 pb-16 max-w-[1240px] w-full mt-4">
        {/* Hero Banner */}
        <div className="flex items-center mb-10 px-8 py-4 rounded-3xl bg-white border border-[#EBEBEB] shadow-sm relative overflow-hidden">
          <div className="flex-1 flex gap-6 items-center w-full relative z-10">
            <div className="w-[84px] h-[84px] rounded-[20px] flex items-center justify-center shrink-0 ml-2">
              <FileText size={48} className="text-brand-primary" strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 px-3 min-w-0 flex flex-col justify-center">
              <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-gray-900 mb-1.5 drop-shadow-sm">
                ARTICLE
              </div>
              <h3 className="text-gray-900 text-[26px] font-bold mb-2 leading-tight whitespace-nowrap">
                {articleTitle}
              </h3>
              <div className="flex items-center text-gray-600 text-sm font-medium">
                <IconClock size={18} className="mr-2" />
                {timeEstimate} min read
              </div>
              <div className="text-sm text-gray-600 truncate mt-1 max-w-[500px]">
                {"Read the core article for this concept."}
              </div>
            </div>

            <div className="shrink-0 flex items-end justify-center mr-4 self-end mb-2">
               <Link href={`/lessons/${lessonId}/articles/read`}>
                 <button className="bg-brand-primary text-white font-medium text-[13px] tracking-wide py-3 px-7 rounded-[14px] hover:opacity-90 hover:scale-105 transition-transform flex items-center gap-2 group active:scale-95 border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                   Continue Article
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

        {/* Article Summary & Quiz Grid */}
        <div className="flex flex-col md:flex-row gap-8 md:items-start mb-5">
          <div className="flex-1 flex items-center justify-between">
             <h3 className="text-[13px] font-bold tracking-[0.08em] text-gray-900 uppercase flex items-center gap-1.5 whitespace-nowrap">
                ARTICLE SUMMARY
             </h3>
          </div>
          <div className="w-full md:w-[340px] flex items-center justify-between">
             <h3 className="text-[13px] font-bold tracking-[0.08em] text-gray-900 uppercase hidden md:flex items-center gap-1.5">
                TEST YOUR UNDERSTANDING
             </h3>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:items-stretch mb-10">
          {/* Article Summary Section */}
          <ArticleSummary text={articleSummary || articleText} />

          {/* Quiz Section */}
          <div className="w-full md:w-[340px] bg-white p-8 flex flex-col relative border border-[#EBEBEB] border-l-4 border-l-brand-primary rounded-2xl shadow-sm">
              <div className="flex gap-4 items-start mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <IconBrain size={24} stroke={2} className="text-brand-primary" />
                </div>
                <div className="pt-0">
                  <h4 className="font-bold text-gray-900 text-base mb-1">Test your understanding</h4>
                  <p className="text-[#333333] text-[13px] leading-[1.7] font-normal">
                    Take a quick quiz to reinforce what you've learned from this article.
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <Link href={`/lessons/${lessonId}/quizzes`}>
                  <button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-3.5 px-6 rounded-2xl transition-transform duration-150 active:scale-95 flex items-center justify-center gap-2 text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                    Start Quiz
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
          
          <LearningPathSlider 
            currentLessonId={lessonId} 
            completedLessonIds={completedLessonIds} 
            routeSuffix="articles" 
            lessons={lessons.map(l => ({ id: l.dayOrder, title: l.title }))}
          />
        </div>

      </main>
    </div>
  );
}