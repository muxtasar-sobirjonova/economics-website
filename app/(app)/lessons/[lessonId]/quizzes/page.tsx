import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { client } from "@/sanity/client";
import { QUIZZES_QUERY } from "@/sanity/queries";
import { getLessons } from "@/lib/data";
import { getLessonAccessStatus, quizIdToDayOrder } from "@/lib/lesson-access";
import { IconClock, IconFileText, IconTrendingUp, IconClipboardList, IconCheck, IconArrowRight } from "@tabler/icons-react";
import { BrainCircuit } from "lucide-react";
import { LearningPathSlider } from "@/components/lessons/LearningPathSlider";
import { SanityQuiz, SanityQuizSchema } from "@/types";
import { z } from "zod";

import { LessonHeader } from "@/components/lessons/LessonHeader";
import { MAX_SERVED_QUESTIONS } from "@/services/quizService";

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

  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeTrack: true }
  });
  const activeTrack = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

  const lessons = await getLessons(activeTrack);
  // Chapter-review days (7, 14, 21…) have a quiz but no lesson.
  const matchedLesson = lessons.find((l) => Number(l.dayOrder) === lessonId);
  const hasLesson = Boolean(matchedLesson);
  const baseLesson = matchedLesson || lessons[0];

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
  const localQuiz = await prisma.quiz.findUnique({
    where: { track_dayOrder: { track: activeTrack, dayOrder: lessonId } },
    include: { questions: true }
  });

  const quizTitle = sanityQuiz?.title || localQuiz?.title || baseLesson.title;

  // The quiz player only ever serves the first 10 questions.
  const servedQuestions = Math.min(localQuiz?.questions?.length || MAX_SERVED_QUESTIONS, MAX_SERVED_QUESTIONS);
  const passingScore = Math.max(1, Math.ceil(servedQuestions * 0.8));
  
  // Dynamic Time Estimate based on question count
  let timeEstimate = baseLesson.timeEstimate;
  if (!timeEstimate) {
    const questionCount = sanityQuiz?.questions?.length || localQuiz?.questions?.length || 5;
    timeEstimate = Math.max(1, questionCount); // Roughly 1 minute per question
  }

  // Fetch actual quiz completions and mistakes from Prisma
  let quizResults: { quizId: string, score: number }[] = [];
  try {
    quizResults = await prisma.quizResult.findMany({
      where: { userId, track: activeTrack },
      select: { quizId: true, score: true },
      orderBy: { date: 'desc' } // ensure we get the latest score
    });
  } catch (error) {
    console.error("Failed to fetch quiz results or mistakes from Prisma:", error);
  }

  const currentQuizResult = quizResults.find(q => quizIdToDayOrder(q.quizId) === lessonId);
  const hasCompleted = !!currentQuizResult;

  const completedQuizLessonIds = quizResults
    .map(q => quizIdToDayOrder(q.quizId))
    .filter((d): d is number => d !== null);

  const avatarLetter = (session?.user?.name?.trim().charAt(0) || session?.user?.email?.trim().charAt(0) || "?").toUpperCase();

  return (
    <div className="min-h-screen font-sans flex flex-col text-[#1F2937] bg-slate-50">
      <LessonHeader lessonId={lessonId} activeTab="quizzes" avatarLetter={avatarLetter} hasLesson={hasLesson} />

      <main className="px-4 md:px-10 pb-8 md:pb-16 max-w-[1240px] w-full mx-auto mt-4 overflow-hidden md:overflow-visible">
        {/* Hero Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center mb-6 md:mb-10 p-5 md:px-8 md:py-4 rounded-3xl bg-white border border-[#EBEBEB] shadow-sm relative overflow-hidden">
          <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center w-full relative z-10">
            <div className="w-[60px] h-[60px] md:w-[84px] md:h-[84px] rounded-[16px] md:rounded-[20px] flex items-center justify-center shrink-0 md:ml-2">
              <BrainCircuit className="text-emerald-400 w-10 h-10 md:w-12 md:h-12" strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 px-1 md:px-3 min-w-0 flex flex-col justify-center w-full">
              <div className="text-[10px] md:text-[11px] font-bold tracking-[0.08em] uppercase text-gray-900 mb-1.5 drop-shadow-sm">
                QUIZ
              </div>
              <h3 className="text-gray-900 text-xl md:text-[26px] font-bold mb-2 leading-tight md:whitespace-nowrap">
                {quizTitle}
              </h3>
              <div className="flex items-center text-gray-600 text-[13px] md:text-sm font-medium">
                <IconClock className="mr-2 w-4 h-4 md:w-[18px] md:h-[18px]" />
                10 min quiz
              </div>
              <div className="text-[13px] md:text-sm text-gray-600 truncate mt-1 max-w-[500px]">
                {"Test your understanding of the concepts."}
              </div>
            </div>

            <div className="shrink-0 flex items-start md:items-end justify-start md:justify-center w-full md:w-auto md:mr-4 md:self-end mt-2 md:mt-0 md:mb-2">
               <Link href={`/lessons/${lessonId}/quizzes/read`} className="w-full md:w-auto">
                 <div className="w-full md:w-auto bg-brand-primary text-white font-medium text-[14px] md:text-[13px] tracking-wide py-3 px-6 md:px-7 rounded-[14px] hover:opacity-90 hover:scale-105 transition-transform flex items-center justify-center gap-2 group active:scale-95 border border-transparent cursor-pointer">
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
                 </div>
               </Link>
            </div>
          </div>
        </div>

        {/* Mistakes & Quiz Grid */}
        <div className="flex flex-col md:flex-row gap-8 md:items-start mb-5">
          <div className="flex-1 flex items-center justify-between">
             <h3 className="text-[13px] font-bold tracking-[0.08em] text-gray-900 uppercase flex items-center gap-1.5 whitespace-nowrap">
                LESSON MASTERY
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
          <div className="flex-1 bg-white p-5 md:p-8 flex flex-col border border-[#EBEBEB] border-l-4 border-l-brand-primary rounded-2xl shadow-sm">
               {!hasCompleted ? (
                 <div className="flex flex-col items-center justify-center h-full text-center">
                   <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3">
                     <IconClipboardList size={24} stroke={1.5} />
                   </div>
                    <h4 className="font-bold text-gray-900 text-base mb-1">No attempts yet</h4>
                    <p className="text-gray-600 text-sm leading-[1.6] max-w-md mx-auto font-normal">
                      You haven&apos;t completed this quiz yet. Take the quiz to receive personalized feedback and review your mistakes here!
                    </p>
                  </div>
               ) : currentQuizResult && currentQuizResult.score >= passingScore ? (
                 <div className="flex flex-col items-center justify-center h-full text-center">
                   <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-green-100">
                     <IconCheck size={24} stroke={3} />
                   </div>
                   <h4 className="font-bold text-gray-900 text-base mb-1">Excellent Work!</h4>
                   <p className="text-gray-600 text-[14px] leading-[1.6] max-w-sm mx-auto font-normal">
                     You scored {currentQuizResult.score}/{servedQuestions} on your last attempt. You&apos;re doing fine and have truly mastered this lesson&apos;s concepts!
                   </p>
                 </div>
               ) : currentQuizResult && currentQuizResult.score >= Math.ceil(servedQuestions * 0.6) ? (
                 <div className="flex flex-col items-center justify-center h-full text-center">
                   <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-blue-100">
                     <IconCheck size={24} stroke={3} />
                   </div>
                   <h4 className="font-bold text-gray-900 text-base mb-1">Good job!</h4>
                   <p className="text-gray-600 text-[14px] leading-[1.6] max-w-sm mx-auto font-normal">
                     You scored {currentQuizResult.score}/{servedQuestions} on your last attempt. You&apos;ve got a solid grasp of this lesson&apos;s concepts.
                   </p>
                 </div>
               ) : (
                  <div className="flex flex-col gap-2 h-full items-center text-center justify-center py-2">
                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-1 mx-auto shadow-sm border border-amber-100 shrink-0">
                      <IconClipboardList size={24} stroke={2} />
                    </div>
                    <h4 className="font-bold text-gray-900 text-base mb-1">Review Recommended</h4>
                    <p className="text-gray-600 text-[14px] leading-[1.6] max-w-sm mx-auto font-normal mb-3">
                      You missed some questions on your last attempt (Score: {currentQuizResult?.score || 0}/{servedQuestions}). You need {passingScore}/{servedQuestions} to unlock the next topic — we recommend reviewing the core material before trying again.
                    </p>
                    {hasLesson && (
                      <div className="flex items-center justify-center gap-3 w-full">
                        <Link href={`/lessons/${lessonId}/concepts`} className="text-brand-primary text-[13px] font-bold bg-brand-primary/10 px-4 py-2 rounded-xl hover:bg-brand-primary/20 transition-colors">
                          Review Concept
                        </Link>
                        <Link href={`/lessons/${lessonId}/articles`} className="text-brand-primary text-[13px] font-bold bg-brand-primary/10 px-4 py-2 rounded-xl hover:bg-brand-primary/20 transition-colors">
                          Review Article
                        </Link>
                      </div>
                    )}
                  </div>
               )}
          </div>

          {/* Action Section */}
          <div className="w-full md:w-[340px] bg-white p-5 md:p-8 flex flex-col relative border border-[#EBEBEB] border-l-4 border-l-brand-primary rounded-2xl shadow-sm">
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
                  <div className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-3.5 px-6 rounded-2xl transition-transform duration-150 active:scale-95 flex items-center justify-center gap-2 text-[15px] cursor-pointer">
                    Continue Quiz
                    <IconArrowRight size={18} />
                  </div>
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
