import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { client } from "@/sanity/client";
import { QUIZZES_QUERY } from "@/sanity/queries";
import { getLessons, getQuizzes, QUIZZES } from "@/lib/data";
import { getLessonAccessStatus } from "@/lib/lesson-access";
import { IconClock, IconFileText, IconTrendingUp, IconClipboardList, IconCheck, IconArrowRight } from "@tabler/icons-react";
import { BrainCircuit } from "lucide-react";
import { LearningPathSlider } from "@/components/lessons/LearningPathSlider";
import { SanityQuiz, Mistake, SanityQuizSchema } from "@/types";
import { z } from "zod";

import { LessonHeader } from "@/components/lessons/LessonHeader";

export default async function QuizzesPage({ params }: { params: { lessonId: string } }) {
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

  let sanityQuiz: SanityQuiz | undefined = undefined;
  try {
    const rawSanityData = await client.fetch(QUIZZES_QUERY);
    const parsedData = z.array(SanityQuizSchema).safeParse(rawSanityData);
    
    if (parsedData.success) {
      sanityQuiz = parsedData.data.find((d) => d.lessonId === lessonId);
    } else {
      console.error("[CRITICAL] Sanity CMS Quizzes validation failed:", parsedData.error.flatten());
    }
  } catch (error) {
    console.error("Failed to fetch quizzes from Sanity:", error);
  }
  const localQuiz = QUIZZES.find((q) => q.id === 100 + lessonId);

  const quizTitle = sanityQuiz?.title || localQuiz?.title || baseLesson.title;
  
  // Dynamic Time Estimate based on question count
  let timeEstimate = baseLesson.timeEstimate;
  if (!timeEstimate) {
    const questionCount = sanityQuiz?.questions?.length || localQuiz?.questions?.length || 5;
    timeEstimate = Math.max(1, questionCount); // Roughly 1 minute per question
  }

  // Fetch actual quiz completions and mistakes from Prisma
  let quizResults: { quizId: string; mistakes: string }[] = [];
  try {
    quizResults = await prisma.quizResult.findMany({
      where: { userId },
      select: { quizId: true, mistakes: true }
    }) as { quizId: string; mistakes: string }[];
  } catch (error) {
    console.error("Failed to fetch quiz results from Prisma:", error);
  }

  const currentQuizResult = quizResults.find(q => q.quizId === String(100 + lessonId));
  const hasCompleted = !!currentQuizResult;
  let mistakes: Mistake[] = [];
  try {
    mistakes = currentQuizResult ? JSON.parse(currentQuizResult.mistakes || "[]") : [];
  } catch (e) {
    mistakes = [];
  }

  const completedQuizLessonIds = quizResults.map(q => parseInt(q.quizId) - 100);

  const avatarLetter = session.user.name
    ? session.user.name.charAt(0).toUpperCase()
    : session.user.email
      ? session.user.email.charAt(0).toUpperCase()
      : "U";

  return (
    <div className="min-h-screen font-sans flex flex-col text-[#1F2937] bg-slate-50">
      <LessonHeader lessonId={lessonId} activeTab="quizzes" avatarLetter={avatarLetter} />

      <main className="px-10 pb-16 max-w-[1240px] w-full mx-auto mt-4">
        {/* Hero Banner */}
        <div className="flex items-center mb-10 px-8 py-4 rounded-3xl bg-white border border-[#EBEBEB] shadow-sm relative overflow-hidden">
          <div className="flex-1 flex gap-6 items-center w-full relative z-10">
            <div className="w-[84px] h-[84px] rounded-[20px] flex items-center justify-center shrink-0 ml-2">
              <BrainCircuit size={48} className="text-emerald-400" strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 px-3 min-w-0 flex flex-col justify-center">
              <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-gray-900 mb-1.5 drop-shadow-sm">
                QUIZ
              </div>
              <h3 className="text-gray-900 text-[26px] font-bold mb-2 leading-tight whitespace-nowrap">
                {quizTitle}
              </h3>
              <div className="flex items-center text-gray-600 text-sm font-medium">
                <IconClock size={18} className="mr-2" />
                {timeEstimate} min quiz
              </div>
              <div className="text-sm text-gray-600 truncate mt-1 max-w-[500px]">
                {"Test your understanding of the concepts."}
              </div>
            </div>

            <div className="shrink-0 flex items-end justify-center mr-4 self-end mb-2">
               <Link href={`/lessons/${lessonId}/quizzes/read`}>
                 <button className="bg-brand-primary text-white font-medium text-[13px] tracking-wide py-3 px-7 rounded-[14px] hover:opacity-90 hover:scale-105 transition-transform flex items-center gap-2 group active:scale-95 border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                   Continue Quiz
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

        {/* Mistakes & Quiz Grid */}
        <div className="flex flex-col md:flex-row gap-8 md:items-start mb-5">
          <div className="flex-1 flex items-center justify-between">
             <h3 className="text-[13px] font-bold tracking-[0.08em] text-gray-900 uppercase flex items-center gap-1.5 whitespace-nowrap">
                REVIEW YOUR MISTAKES
             </h3>
          </div>
          <div className="w-full md:w-[340px] flex items-center justify-between">
             <h3 className="text-[13px] font-bold tracking-[0.08em] text-gray-900 uppercase hidden md:flex items-center gap-1.5">
                READY TO START
             </h3>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:items-stretch mb-10">
          {/* Mistakes Section */}
          <div className="flex-1 bg-white p-8 flex flex-col border border-[#EBEBEB] border-l-4 border-l-brand-primary rounded-2xl shadow-sm">
               {!hasCompleted ? (
                 <div className="flex flex-col items-center justify-center h-full text-center">
                   <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3">
                     <IconClipboardList size={24} stroke={1.5} />
                   </div>
                    <h4 className="font-bold text-gray-900 text-base mb-1">No attempts yet</h4>
                    <p className="text-gray-600 text-sm leading-[1.6] max-w-md mx-auto font-normal">
                      You haven't completed this quiz yet. Take the quiz to receive personalized feedback and review your mistakes here!
                    </p>
                  </div>
               ) : mistakes.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-center">
                   <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-green-100">
                     <IconCheck size={24} stroke={3} />
                   </div>
                   <h4 className="font-bold text-gray-900 text-base mb-1">Flawless Victory!</h4>
                   <p className="text-gray-600 text-sm leading-[1.6] max-w-md mx-auto font-normal">
                     You got everything right on your last attempt. Incredible work! Keep up the momentum.
                   </p>
                 </div>
               ) : (
                  <div className="flex flex-col gap-5 h-full">
                    <h4 className="font-bold text-[#1F2937] text-lg">Areas to Review</h4>
                    <div className="flex-1 overflow-y-auto pr-2">
                      <ul className="flex flex-col gap-3">
                        {mistakes.map((mistake, i) => (
                          <li key={i} className="flex gap-4 p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/20">
                            <span className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shrink-0">!</span>
                            <span className="text-[#1F2937] text-sm leading-[1.7] font-medium">
                              {typeof mistake === 'string' ? mistake : (mistake.questionText || 'Question not recorded')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
               )}
          </div>

          {/* Action Section */}
          <div className="w-full md:w-[340px] bg-white p-8 flex flex-col relative border border-[#EBEBEB] border-l-4 border-l-brand-primary rounded-2xl shadow-sm">
              <div className="flex gap-4 items-start mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <IconFileText size={24} stroke={2} className="text-brand-primary" />
                </div>
                <div className="pt-0">
                  <h4 className="font-bold text-gray-900 text-base mb-1">{hasCompleted ? "Retake Quiz" : "Test yourself"}</h4>
                  <p className="text-[#333333] text-[13px] leading-[1.7] font-normal">
                    {hasCompleted ? "Try again to beat your previous score and clear your mistakes." : "Take a quick quiz to reinforce what you've learned so far."}
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <Link href={`/lessons/${lessonId}/quizzes/read`}>
                  <button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-3.5 px-6 rounded-2xl transition-transform duration-150 active:scale-95 flex items-center justify-center gap-2 text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                    Continue Quiz
                    <IconArrowRight size={18} />
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
            completedQuizLessonIds={completedQuizLessonIds}
            routeSuffix="quizzes"
            lessons={lessons.map(l => ({ id: l.dayOrder, title: l.title }))}
          />
        </div>

      </main>
    </div>
  );
}
