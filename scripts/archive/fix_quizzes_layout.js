const fs = require('fs');

const PAGE_TSX = `"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useGameState, markLessonDone, saveGlobalNote } from "@/lib/progress";
import { client } from "@/sanity/client";
import { QUIZZES_QUERY } from "@/sanity/queries";
import { Check, X as XIcon, ArrowLeft, StickyNote } from "lucide-react";

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizzesReadPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = parseInt(params.lessonId as string) || 1;

  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]); // 1 for correct, 0 for wrong, -1 for unanswered
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // Animation States
  const [animState, setAnimState] = useState<'idle'|'exiting'|'entering'>('idle');
  const [showFlash, setShowFlash] = useState(false);
  const [showShake, setShowShake] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  // Notes Panel State
  const [marginOpen, setMarginOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'takeaways' | 'notes'>('takeaways');
  const [noteContent, setNoteContent] = useState('');

  const handleSaveNote = () => {
    if (noteContent.trim().length > 0) {
      saveGlobalNote({
        id: Date.now().toString(),
        lessonId: lessonId,
        source: 'Quiz',
        content: noteContent,
        color: '#fef3c7',
        timestamp: new Date().toISOString()
      });
      setNoteContent('');
      alert('Note saved to My Notes!');
    }
  };

  useEffect(() => {
    async function fetchLessons() {
      try {
        const data = await client.fetch(QUIZZES_QUERY);
        import("@/lib/data").then(({ LESSONS, QUIZZES }) => {
          const mergedLessons = LESSONS.map((lesson) => {
            const sanityLesson = data?.find((d: any) => d.lessonId === lesson.id);
            const quiz = QUIZZES.find((q) => q.id === 100 + lesson.id);
            return {
              lessonId: lesson.id,
              title: sanityLesson?.title || lesson.title,
              questions: (lesson.id === 1 ? quiz?.questions : sanityLesson?.questions) || quiz?.questions || [],
            };
          });
          setLessons(mergedLessons);
          setLoading(false);
        });
      } catch (error) {
        import("@/lib/data").then(({ LESSONS, QUIZZES }) => {
          const mergedLessons = LESSONS.map((lesson) => {
            const quiz = QUIZZES.find((q) => q.id === 100 + lesson.id);
            return {
              lessonId: lesson.id,
              title: lesson.title,
              questions: quiz?.questions || [],
            };
          });
          setLessons(mergedLessons);
          setLoading(false);
        });
      }
    }
    fetchLessons();
  }, []);

  const activeLesson = lessons.find((l) => l.lessonId === lessonId);
  const questions = activeLesson?.questions || [];
  const displayQuestions = questions.slice(0, 10);
  
  useEffect(() => {
    if (displayQuestions.length > 0 && answers.length === 0) {
      setAnswers(new Array(displayQuestions.length).fill(-1));
    }
  }, [displayQuestions, answers]);

  if (loading) return <div className="p-8">Loading quiz...</div>;
  if (!activeLesson || displayQuestions.length === 0) return <div className="p-8">No questions found.</div>;

  const currentQuestion = displayQuestions[currentQuestionIndex];
  const hasAnsweredCurrent = selectedAnswer !== null;

  // Resolve correct option index
  let correctOptionIndex = currentQuestion.correctOption;
  if (typeof correctOptionIndex === 'undefined' && currentQuestion.correctAnswer) {
    correctOptionIndex = currentQuestion.options.indexOf(currentQuestion.correctAnswer);
  }

  const handleSelectAnswer = (optionIndex: number) => {
    if (hasAnsweredCurrent) return;
    
    setSelectedAnswer(optionIndex);
    const isCorrect = optionIndex === correctOptionIndex;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = isCorrect ? 1 : 0;
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(s => s + 1);
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 400);
      
      const newParticles = [];
      const colors = ['#22C55E', '#3D52A0', '#FCD34D', '#F9A8D4'];
      for (let i = 0; i < 8; i++) {
        newParticles.push({
          id: Math.random(),
          color: colors[Math.floor(Math.random() * colors.length)],
          tx: \`\${(Math.random() - 0.5) * 160}px\`,
          ty: \`\${(Math.random() - 0.5) * 160}px\`
        });
      }
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 600);
    } else {
      setShowShake(true);
      setTimeout(() => setShowShake(false), 500);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === displayQuestions.length - 1) {
      setIsFinished(true);
      markLessonDone(lessonId);
      return;
    }
    
    setAnimState('exiting');
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setAnimState('entering');
      setTimeout(() => {
        setAnimState('idle');
      }, 500);
    }, 450);
  };

  if (isFinished) {
    let message = "📚 Keep Studying";
    if (score === 10) message = "🏆 Perfect Score!";
    else if (score >= 8) message = "⭐ Excellent!";
    else if (score >= 6) message = "👍 Good Job!";
    
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F8F9FC] relative overflow-hidden h-full min-h-[600px] transition-all duration-300" style={{ marginRight: marginOpen ? '260px' : '0' }}>
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
                    left: \`\${left}%\`,
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    '--delay': \`\${delay}s\`,
                    '--duration': \`\${duration}s\`
                  } as any}
                />
              );
            })}
          </div>
        )}
        
        <h2 className="text-[64px] font-[900] text-[#3D52A0] mb-2">{score} / 10</h2>
        <p className="text-[20px] font-[700] text-[#111111] mb-10">{message}</p>
        
        <div className="flex gap-4">
           <button onClick={() => { setIsFinished(false); setCurrentQuestionIndex(0); setScore(0); setAnswers(new Array(displayQuestions.length).fill(-1)); setSelectedAnswer(null); }} className="px-6 py-3 bg-[#EF4444] hover:bg-[#dc2626] text-white font-bold rounded-lg shadow-sm">
             Review Mistakes
           </button>
           <Link href="/quizzes" className="px-6 py-3 bg-[#3D52A0] hover:bg-[#2e3e78] text-white font-bold rounded-lg shadow-sm">
             Back to Quizzes
           </Link>
        </div>
      </div>
    );
  }

  let cardAnimClass = '';
  if (animState === 'exiting') cardAnimClass = 'animate-slideOutLeft';
  else if (animState === 'entering') cardAnimClass = 'animate-slideInRight';
  
  if (showShake) cardAnimClass += ' animate-shake';

  return (
    <div className="flex-1 bg-[#F8F9FC] relative overflow-hidden flex flex-col h-full min-h-screen">
      
      {/* Main Quiz Content wrapper */}
      <div 
        className="flex-1 flex flex-col transition-all duration-300 relative h-full"
        style={{ marginRight: marginOpen ? '260px' : '0' }}
      >
        {/* Screen Flash Overlay */}
        {showFlash && (
          <div className="absolute inset-0 z-[300] pointer-events-none bg-[rgba(34,197,94,0.08)] animate-flash" />
        )}

        <div className="px-10 flex-1 flex flex-col max-h-[100vh] overflow-y-auto pb-10">
           {/* Top Bar */}
           <div className="max-w-[800px] w-full mx-auto flex items-center justify-between mb-[12px] py-[12px] shrink-0">
             <div className="flex items-center gap-3">
               <Link href="/quizzes" className="flex items-center gap-1 text-[#3D52A0] text-[13px] font-[600] hover:underline">
                 <ArrowLeft size={16} /> Back to Quizzes
               </Link>
               <div className="px-2 py-0.5 bg-black/5 text-[#111] text-[10px] font-bold rounded-md">
                 LESSON {lessonId}
               </div>
             </div>
             <div className="text-[13px] font-[700] text-[#111111]">
               Question {currentQuestionIndex + 1} of 10
             </div>
             <div className="text-[13px] font-[700] text-[#3D52A0]">
               ⭐ {score} / 10
             </div>
           </div>

           {/* Progress Bar */}
           <div className="max-w-[800px] w-full mx-auto flex gap-[6px] mb-[16px] shrink-0">
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
                  <div key={i} className={\`flex-1 h-[6px] rounded-[3px] \${extraClass}\`} style={{ backgroundColor: bgColor }} />
               );
             })}
           </div>

           {/* Question Card & Options Container */}
           <div className={\`max-w-[720px] w-full mx-auto flex flex-col flex-1 min-h-0 \${cardAnimClass}\`}>
             {/* Card */}
             <div className="bg-[linear-gradient(135deg,#EEF3FF,#F8F9FC)] border border-[#C7D7FF] rounded-[20px] px-[24px] py-[20px] shadow-[0_4px_20px_rgba(61,82,160,0.08)] shrink-0">
               <div className="flex justify-between items-center">
                  <div className="bg-[#3D52A0] text-white text-[10px] font-[700] px-[12px] py-[4px] rounded-[20px]">
                     QUESTION {currentQuestionIndex + 1} OF 10
                  </div>
                  <div className="text-[11px] text-[#888]">
                     ⚡ Medium
                  </div>
               </div>
               <h2 className="text-[16px] font-[700] text-[#111111] leading-[1.6] mt-[14px]">
                  {currentQuestion?.questionText || currentQuestion?.question}
               </h2>
             </div>

             {/* Answer Options */}
             <div className="mt-[12px] flex flex-col gap-[8px] relative shrink-0">
                {currentQuestion?.options.map((opt: string, idx: number) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === correctOptionIndex;
                  
                  let bg = '#ffffff';
                  let border = '#E0E7FF';
                  let textColor = '#333';
                  let badgeBg = '#EEF3FF';
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
                  const hoverClass = !hasAnsweredCurrent ? 'hover:border-[#3D52A0] hover:bg-[#F8F9FF] hover:translate-x-[6px] hover:shadow-[0_2px_12px_rgba(61,82,160,0.1)]' : 'pointer-events-none';

                  return (
                    <div 
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      className={\`relative border-[1.5px] rounded-[12px] px-[16px] py-[11px] flex items-center gap-[14px] cursor-pointer transition-all duration-200 ease-out \${hoverClass} \${disabledClass}\`}
                      style={{ backgroundColor: bg, borderColor: border }}
                    >
                      <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-[12px] font-[800] shrink-0" style={{ backgroundColor: badgeBg, color: badgeColor }}>
                         {LETTERS[idx]}
                      </div>
                      <div className="text-[14px]" style={{ color: textColor, fontWeight }}>
                         {opt}
                      </div>
                      {hasAnsweredCurrent && isCorrect && <Check className="ml-auto shrink-0 text-[#22C55E]" size={20} />}
                      {hasAnsweredCurrent && isSelected && !isCorrect && <XIcon className="ml-auto shrink-0 text-[#EF4444]" size={20} />}
                      
                      {/* Particle burst container for correct option */}
                      {hasAnsweredCurrent && isCorrect && particles.length > 0 && (
                        <div className="absolute top-1/2 right-6 w-0 h-0 pointer-events-none">
                          {particles.map(p => (
                            <div key={p.id} className="absolute w-[8px] h-[8px] rounded-full animate-burst" style={{ backgroundColor: p.color, '--tx': p.tx, '--ty': p.ty, transform: 'translate(-50%, -50%)' } as any} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
             </div>
             
             {/* Next Question Button */}
             <div className="flex-1 flex items-end justify-end mt-[12px] pb-4">
                 {hasAnsweredCurrent && (
                   <button onClick={handleNextQuestion} className="animate-fadeUp bg-[#3D52A0] hover:bg-[#2e3e78] text-white rounded-[8px] px-[28px] py-[12px] font-[700] text-[14px] shadow-sm transition-colors">
                     {currentQuestionIndex === displayQuestions.length - 1 ? 'Finish Quiz' : 'Next Question →'}
                   </button>
                 )}
             </div>
           </div>
        </div>
      </div>
      
      {/* Collapsible Notes Panel */}
      <div 
        className="fixed right-0 top-0 bottom-0 w-[260px] bg-white border-l border-[#EBEBEB] shadow-[-4px_0_12px_rgba(0,0,0,0.06)] z-[100] pt-[80px] transition-transform duration-300 ease-in-out"
        style={{ transform: marginOpen ? 'translateX(0)' : 'translateX(260px)' }}
      >
        <button 
          onClick={() => setMarginOpen(!marginOpen)}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-[20px] h-[80px] bg-[#3D52A0] rounded-l-[8px] cursor-pointer flex flex-col items-center justify-center gap-1 text-white hover:bg-[#2e3e78] transition-colors"
        >
          {marginOpen ? (
            <XIcon size={14} />
          ) : (
            <>
              <StickyNote size={14} />
              <span className="text-[9px] font-[700] tracking-[0.1em]" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>NOTES</span>
            </>
          )}
        </button>

        <div className="flex flex-col h-full">
           <div className="flex border-b border-[#EBEBEB] shrink-0">
             <button 
               onClick={() => setActiveTab('takeaways')}
               className={\`flex-1 py-3 text-[12px] font-[700] text-center \${activeTab === 'takeaways' ? 'border-b-2 border-[#3D52A0] text-[#3D52A0]' : 'text-[#888]'}\`}
             >
               💡 Takeaways
             </button>
             <button 
               onClick={() => setActiveTab('notes')}
               className={\`flex-1 py-3 text-[12px] font-[700] text-center \${activeTab === 'notes' ? 'border-b-2 border-[#3D52A0] text-[#3D52A0]' : 'text-[#888]'}\`}
             >
               🗒️ My Notes
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto">
             {activeTab === 'takeaways' ? (
               <div className="bg-[#EEF3FF] border border-[#C7D7FF] rounded-[8px] p-4 m-4">
                 <div className="text-[11px] font-[700] tracking-[0.08em] text-[#3D52A0] mb-3">KEY TAKEAWAYS</div>
                 <ul className="list-disc pl-4 text-[13px] text-[#333] space-y-2">
                   <li>Speed of delivery beats product quality</li>
                   <li>Resource allocation is the core skill</li>
                   <li>Customers define value not producers</li>
                   <li>Constraints reveal competitive advantages</li>
                   <li>Entrepreneurship is economics in action</li>
                 </ul>
               </div>
             ) : (
               <div className="p-4 flex flex-col gap-4 h-full">
                 <div className="bg-[#fef3c7] p-4 rounded-[6px] shadow-sm relative flex flex-col">
                   <div className="w-2 h-2 bg-black/10 rounded-full mb-2" />
                   <textarea
                     className="bg-transparent border-none outline-none resize-none text-[13px] text-[#333] flex-1 min-h-[120px]"
                     placeholder="Write your note here..."
                     value={noteContent}
                     onChange={(e) => setNoteContent(e.target.value)}
                   />
                   <div className="flex justify-end mt-2">
                      <button onClick={handleSaveNote} className="text-[#3D52A0] text-[11px] font-bold hover:underline">Save</button>
                   </div>
                 </div>
               </div>
             )}
           </div>
        </div>
      </div>

    </div>
  );
}
`;

fs.writeFileSync('app/lessons/[lessonId]/quizzes/read/page.tsx', PAGE_TSX, 'utf8');
console.log('Quizzes layout fixed and panel restored.');
