"use client";

import React from "react";
import Link from "next/link";
import { Check, X as XIcon, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/hooks/useQuiz";

const LETTERS = ['A', 'B', 'C', 'D'];

import { QuizQuestion } from "@/types";

interface QuizClientProps {
  lessonId: number;
  questions: QuizQuestion[];
}

export default function QuizClient({ lessonId, questions }: QuizClientProps) {
  const displayQuestions = questions.slice(0, 10);
  
  const {
    currentQuestionIndex,
    currentQuestion,
    currentSelected,
    currentValidated,
    hasAnsweredCurrent,
    answers,
    score,
    isFinished,
    animState,
    showFlash,
    showShake,
    particles,
    handleSelectAnswer,
    handleNextQuestion,
    handlePrevQuestion,
    handleFinishQuiz,
    handleReviewMistakes
  } = useQuiz({ lessonId, displayQuestions });

  if (displayQuestions.length === 0) return <div className="p-8">No questions found.</div>;

  if (isFinished) {
    let message = "📚 Keep Studying";
    if (score === 10) message = "🏆 Perfect Score!";
    else if (score >= 8) message = "⭐ Excellent!";
    else if (score >= 6) message = "👍 Good Job!";
    
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-sm border border-[#EBEBEB] relative overflow-hidden h-full min-h-[600px] transition-all duration-300">
        {score >= 8 && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({length: 40}).map((_, i) => {
              const colors = ['#3D52A0', '#22C55E', '#FCD34D', '#F9A8D4'];
              const left = Math.random() * 100;
              const delay = Math.random() * 1;
              const duration = 1.5 + Math.random() * 1.5;
              return (
                <div 
                  key={i} 
                  className="absolute top-0 w-3 h-3 rounded-full animate-confetti"
                  style={{
                    left: `${left}%`,
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    '--delay': `${delay}s`,
                    '--duration': `${duration}s`
                  } as any}
                />
              );
            })}
          </div>
        )}
        
        <h2 className="text-[64px] font-[900] text-[#3D52A0] mb-2">{score} / 10</h2>
        <p className="text-xl font-[700] text-gray-900 mb-10">{message}</p>
        
        <div className="flex gap-4">
           <button onClick={handleReviewMistakes} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
             Review Mistakes
           </button>
           <Link href="/quizzes" className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-[500] rounded-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
             Back to Quizzes
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative flex flex-col h-full w-full">
      {/* Screen Flash Overlay */}
      {showFlash && (
        <div className="absolute inset-0 z-[300] pointer-events-none bg-[rgba(34,197,94,0.08)] animate-flash rounded-3xl" />
      )}

      <div className="flex-1 flex flex-col w-full h-full">
         {/* Top Bar */}
         <div className="w-full flex items-center justify-between mb-6 py-3 shrink-0">
           <div className="flex items-center gap-3">
             <Link href="/quizzes" className="flex items-center gap-1 text-[#3D52A0] text-[13px] font-[600] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
               <ArrowLeft size={16} /> Back to Quizzes
             </Link>
             <div className="px-2 py-0.5 bg-black/5 text-gray-900 text-[10px] font-bold rounded-md">
               LESSON {lessonId}
             </div>
           </div>
           <div className="text-[13px] font-[700] text-gray-900">
             Question {currentQuestionIndex + 1} of 10
           </div>
           <div className="text-[13px] font-[700] text-[#3D52A0]">
             ⭐ {score} / 10
           </div>
         </div>

         {/* Progress Bar */}
         <div className="w-full flex gap-1.5 mb-8 shrink-0">
           {answers.map((status, i) => {
             let bgColor = '#EBEBEB';
             let extraClass = '';
             if (status === 1) bgColor = '#22C55E';
             else if (status === 0) bgColor = '#EF4444';
             else if (i === currentQuestionIndex) {
                bgColor = '#3D52A0';
                extraClass = 'animate-pulse-custom';
             }
             return (
                <div key={i} className={`flex-1 h-1.5 rounded-[3px] ${extraClass}`} style={{ backgroundColor: bgColor }} />
             );
           })}
         </div>

         {/* Question Card & Options Container */}
         <div className={`w-full flex flex-col flex-1 pb-10 ${showShake ? 'animate-shake' : ''}`}>
           <AnimatePresence mode="wait">
             <motion.div
               key={currentQuestionIndex}
               initial={{ opacity: 0, x: animState === 'exiting' ? -20 : 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: animState === 'exiting' ? -20 : 20 }}
               transition={{ duration: 0.3, ease: "easeOut" }}
               className="flex flex-col w-full"
             >
               {/* Card */}
               <div className="bg-[linear-gradient(135deg,#EEF3FF,#F8F9FC)] border border-[#C7D7FF] rounded-[20px] px-8 py-6 shadow-[0_4px_20px_rgba(61,82,160,0.08)] shrink-0">
                 <div className="flex justify-between items-center">
                    <div className="bg-[#3D52A0] text-white text-[10px] font-[700] px-3 py-1 rounded-[20px]">
                       QUESTION {currentQuestionIndex + 1} OF 10
                    </div>
                    <div className="text-[11px] text-gray-400">
                       ⚡ Medium
                    </div>
                 </div>
                 <h2 className="text-lg font-[700] text-gray-900 leading-[1.6] mt-4 max-w-none">
                    {currentQuestion?.questionText || currentQuestion?.question}
                 </h2>
               </div>

               {/* Answer Options */}
               <motion.div 
                 className="mt-6 flex flex-col gap-3 relative shrink-0"
                 variants={{
                   hidden: { opacity: 0 },
                   show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                 }}
                 initial="hidden"
                 animate="show"
               >
                  {currentQuestion?.options.map((opt: string, idx: number) => {
                    const isSelected = currentSelected === idx;
                    const isCorrect = idx === currentValidated;
                    
                    let bg = '#ffffff';
                    let border = '#EBEBEB';
                    let textColor = '#333';
                    let badgeBg = '#F8F9FC';
                    let badgeColor = '#3D52A0';
                    let fontWeight = 'normal';
                    
                    if (hasAnsweredCurrent) {
                       if (isCorrect) {
                          bg = '#F0FDF4'; border = '#22C55E'; textColor = '#15803D';
                          badgeBg = '#22C55E'; badgeColor = '#ffffff'; fontWeight = '700';
                       } else if (isSelected) {
                          bg = '#FEF2F2'; border = '#EF4444';
                          badgeBg = '#EF4444'; badgeColor = '#ffffff';
                       }
                    }
                    
                    const disabledClass = hasAnsweredCurrent && !isCorrect && !isSelected ? 'opacity-40 pointer-events-none' : '';
                    const hoverClass = !hasAnsweredCurrent ? 'hover:border-[#3D52A0] hover:bg-[#F8F9FF] hover:shadow-[0_2px_12px_rgba(61,82,160,0.1)]' : 'pointer-events-none';

                    return (
                      <motion.div 
                        key={idx}
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          show: { opacity: 1, y: 0 }
                        }}
                        whileHover={!hasAnsweredCurrent ? { x: 6 } : {}}
                        whileTap={!hasAnsweredCurrent ? { scale: 0.98 } : {}}
                        onClick={() => handleSelectAnswer(idx)}
                        className={`relative border-[1.5px] rounded-2xl px-5 py-4 flex items-center gap-4 cursor-pointer transition-colors duration-200 ease-out shadow-sm ${hoverClass} ${disabledClass}`}
                        style={{ backgroundColor: bg, borderColor: border }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-[800] shrink-0 transition-colors" style={{ backgroundColor: badgeBg, color: badgeColor }}>
                           {LETTERS[idx]}
                        </div>
                        <div className="text-[15px] transition-colors" style={{ color: textColor, fontWeight }}>
                           {opt}
                        </div>
                        
                        <AnimatePresence>
                          {hasAnsweredCurrent && isCorrect && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                              className="ml-auto shrink-0"
                            >
                              <Check className="text-green-500" size={20} />
                            </motion.div>
                          )}
                          {hasAnsweredCurrent && isSelected && !isCorrect && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                              className="ml-auto shrink-0"
                            >
                              <XIcon className="text-red-500" size={20} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Particle burst */}
                        {hasAnsweredCurrent && isCorrect && particles.length > 0 && currentSelected === idx && (
                          <div className="absolute top-1/2 right-6 w-0 h-0 pointer-events-none">
                            {particles.map(p => (
                              <div key={p.id} className="absolute w-2 h-2 rounded-full animate-burst" style={{ backgroundColor: p.color, '--tx': p.tx, '--ty': p.ty, transform: 'translate(-50%, -50%)' } as any} />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
               </motion.div>
               
               {/* Navigation Buttons */}
               <div className="w-full flex items-center justify-between mt-8 pb-4 min-h-[60px]">
                 <button 
                   onClick={handlePrevQuestion} 
                   disabled={currentQuestionIndex === 0}
                   className={`px-6 py-3 font-[600] text-[15px] rounded-xl transition-colors ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-100' : 'text-[#3D52A0] bg-[#EEF3FF] hover:bg-[#E0E7FF]'}`}
                 >
                   ← Previous
                 </button>
                 
                 {currentQuestionIndex === displayQuestions.length - 1 ? (
                   <button 
                     onClick={handleFinishQuiz}
                     className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl px-8 py-3 font-[700] text-[15px] shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                   >
                     Finish Quiz
                   </button>
                 ) : (
                   <button 
                     onClick={handleNextQuestion}
                     className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl px-8 py-3 font-[700] text-[15px] shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                   >
                     {hasAnsweredCurrent ? 'Next Question →' : 'Skip Question →'}
                   </button>
                 )}
               </div>
             </motion.div>
           </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
