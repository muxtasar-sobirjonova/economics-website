const fs = require('fs');

const CSS_ANIMATIONS = `
@keyframes flyToLeft {
  0% { transform: translateX(0) rotate(0deg) scale(1); opacity: 1; }
  25% { transform: translateX(-40px) rotate(-5deg) scale(0.98); }
  100% { transform: translateX(-120vw) rotate(-25deg) scale(0.7); opacity: 0; }
}

@keyframes flyToRight {
  0% { transform: translateX(0) rotate(0deg) scale(1); opacity: 1; }
  25% { transform: translateX(40px) rotate(5deg) scale(0.98); }
  70% { transform: translateX(80vw) rotate(20deg) scale(0.8); opacity: 0.6; }
  100% { transform: translateX(110vw) rotate(25deg) scale(0.7); opacity: 0; }
}

@keyframes stackPopV2 {
  0% { transform: translateY(8px) scale(0.97); opacity: 0.6; }
  60% { transform: translateY(-4px) scale(1.01); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}

@keyframes slideUnder {
  0% { transform: translateY(24px) scale(0.91); opacity: 0; }
  100% { transform: translateY(16px) scale(0.94); opacity: 0.35; }
}

@keyframes snapBackV2 {
  0% { transform: translateX(var(--dx)) rotate(var(--rot)); }
  60% { transform: translateX(6px) rotate(0.5deg); }
  80% { transform: translateX(-3px) rotate(-0.3deg); }
  100% { transform: translateX(0) rotate(0deg); }
}

@keyframes confettiFall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
}

.animate-flyToLeft { animation: flyToLeft 0.55s cubic-bezier(0.4, 0, 0.8, 0.6) forwards; }
.animate-flyToRight { animation: flyToRight 0.5s cubic-bezier(0.4, 0, 0.8, 0.6) forwards; }
.animate-stackPopV2 { animation: stackPopV2 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.animate-slideUnder { animation: slideUnder 0.4s ease forwards; }
.animate-snapBackV2 { animation: snapBackV2 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.animate-confettiFall { animation: confettiFall var(--duration) linear forwards; animation-delay: var(--delay); }
`;

let globalsCss = fs.readFileSync('app/globals.css', 'utf8');
if (!globalsCss.includes('@keyframes flyToLeft')) {
  fs.appendFileSync('app/globals.css', CSS_ANIMATIONS, 'utf8');
}

const PAGE_TSX = `"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGameState } from "@/lib/progress";
import { LESSONS } from "@/lib/data";
import Link from "next/link";

export default function SavedPage() {
  const state = useGameState();
  const globalNotes = state.globalNotes || [];

  // Group notes by lessonId
  const notesByLesson = globalNotes.reduce((acc: any, note: any) => {
    if (!acc[note.lessonId]) acc[note.lessonId] = [];
    acc[note.lessonId].push(note);
    return acc;
  }, {});

  const lessonIds = Object.keys(notesByLesson).map(Number).sort((a, b) => a - b);
  
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  
  // --- REVIEW MODE STATE ---
  const [reviewQueue, setReviewQueue] = useState<any[]>([]);
  const [knewIt, setKnewIt] = useState<any[]>([]);
  const [reviewAgainCount, setReviewAgainCount] = useState(0); // Only visual count for the pile
  const [totalInSession, setTotalInSession] = useState(0);
  
  // Drag physics state
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const startXRef = useRef(0);

  // Animation triggers
  const [animState, setAnimState] = useState<'idle' | 'flyingLeft' | 'flyingRight' | 'snapping'>('idle');
  const [showFlash, setShowFlash] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSlideUnder, setShowSlideUnder] = useState(false);
  const [slideUnderCard, setSlideUnderCard] = useState<any>(null); // Temp card for the slideUnder animation

  // Start a review session
  const startSession = (id: number) => {
    const notes = notesByLesson[id] || [];
    setActiveLessonId(id);
    setReviewQueue([...notes]);
    setKnewIt([]);
    setReviewAgainCount(0);
    setTotalInSession(notes.length);
    setIsComplete(false);
    setAnimState('idle');
  };

  // Check completion
  useEffect(() => {
    if (activeLessonId && reviewQueue.length === 0 && animState === 'idle' && knewIt.length > 0) {
      setIsComplete(true);
    }
  }, [reviewQueue.length, animState, knewIt.length, activeLessonId]);

  // --- REVIEW DRAG LOGIC ---
  const handlePointerDown = (e: React.PointerEvent) => {
    if (animState !== 'idle' || reviewQueue.length === 0) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragX(e.clientX - startXRef.current);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    if (dragX < -120) confirmAction('knewIt');
    else if (dragX > 120) confirmAction('reviewAgain');
    else {
      setAnimState('snapping');
      setTimeout(() => {
        setDragX(0);
        setAnimState('idle');
      }, 400); // snapBack duration
    }
  };

  const confirmAction = (result: 'knewIt' | 'reviewAgain') => {
    if (reviewQueue.length === 0 || animState !== 'idle') return;

    if (result === 'knewIt') {
      setAnimState('flyingLeft');
      setTimeout(() => {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 400);
      }, 300);
    } else {
      setAnimState('flyingRight');
    }

    const currentCard = reviewQueue[0];

    setTimeout(() => {
      // Logic executed after fly animation
      if (result === 'knewIt') {
        setKnewIt(prev => [...prev, currentCard]);
        setReviewQueue(prev => prev.slice(1));
      } else {
        setReviewAgainCount(prev => prev + 1);
        setSlideUnderCard(currentCard);
        setShowSlideUnder(true);
        
        // Move to back of queue
        setReviewQueue(prev => {
           const newQ = prev.slice(1);
           newQ.push(currentCard);
           return newQ;
        });

        setTimeout(() => {
          setShowSlideUnder(false);
          setSlideUnderCard(null);
        }, 400); // slideUnder duration
      }
      
      setDragX(0);
      setAnimState('idle');
    }, 550); // fly duration
  };

  // RENDER: Default Empty State
  if (!activeLessonId) {
    return (
      <div className="flex-1 min-h-screen bg-[#F8F9FC] flex flex-col p-[40px] max-w-[1200px] mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-[13px] font-[700] text-[#111111] uppercase tracking-[0.08em] mb-1">
            My Notes
          </h1>
          <p className="text-[14px] text-[#666666]">
            Your saved insights across all lessons
          </p>
        </div>

        <div className="flex items-center gap-[8px] overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
          {lessonIds.map(id => {
            const dayStr = id < 10 ? \`0\${id}\` : \`\${id}\`;
            return (
              <button
                key={id}
                onClick={() => startSession(id)}
                className="rounded-[20px] px-[14px] py-[6px] text-[12px] font-[700] border shrink-0 transition-colors bg-[#EEF3FF] border-[#C7D7FF] text-[#3D52A0] hover:bg-[#dce6fa]"
              >
                DAY {dayStr}
              </button>
            );
          })}
        </div>
        
        {lessonIds.length === 0 && (
           <div className="text-center py-20 text-[#666]">
             You haven't saved any notes yet.
           </div>
        )}
      </div>
    );
  }

  // RENDER: Completion Screen
  if (isComplete) {
     const isPerfect = knewIt.length === totalInSession;
     return (
       <div className="flex-1 min-h-screen bg-[#F8F9FC] flex flex-col p-[40px] relative max-w-[1200px] mx-auto w-full">
         <div className="mb-10 shrink-0">
           <h1 className="text-[13px] font-[700] text-[#111111] uppercase tracking-[0.08em] mb-1">My Notes</h1>
           <p className="text-[14px] text-[#666666]">Card Review Complete</p>
         </div>
         
         <div className="flex-1 flex flex-col items-center justify-center">
           {isPerfect && (
             <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
               {Array.from({length: 20}).map((_, i) => {
                  const colors = ['#3D52A0', '#22C55E', '#FCD34D', '#F9A8D4'];
                  const left = Math.random() * 100;
                  const delay = Math.random() * 1.5;
                  const duration = 1.5 + Math.random() * 1.5;
                  return (
                    <div key={i} className="absolute top-0 w-3 h-3 rounded-full animate-confettiFall"
                         style={{ left: \`\${left}%\`, backgroundColor: colors[Math.floor(Math.random() * colors.length)], '--delay': \`\${delay}s\`, '--duration': \`\${duration}s\` } as any} />
                  );
               })}
             </div>
           )}
           
           <h2 className="text-[28px] font-[900] text-[#111] mb-2 z-10">🎉 All Done!</h2>
           <p className="text-[16px] text-[#666] z-10">You memorized {knewIt.length} of {totalInSession} notes today</p>
           {reviewAgainCount > 0 && (
             <p className="text-[14px] text-[#EF4444] mt-2 font-bold z-10">↻ {reviewAgainCount} notes needed review</p>
           )}
           
           <div className="flex gap-4 z-10 mt-8">
             {reviewAgainCount > 0 && (
               <button onClick={() => startSession(activeLessonId)} className="bg-[#EF4444] text-white px-6 py-3 rounded-lg font-bold shadow-sm hover:bg-[#dc2626]">
                 Review Again
               </button>
             )}
             <button onClick={() => setActiveLessonId(null)} className="bg-[#3D52A0] text-white px-6 py-3 rounded-lg font-bold shadow-sm hover:bg-[#2e3e78]">
               Back to Notes
             </button>
           </div>
         </div>
       </div>
     );
  }

  // RENDER: Stack Mode
  const activeCard = reviewQueue[0];
  const ghost1 = reviewQueue[1];
  const ghost2 = reviewQueue[2];
  const lesson = LESSONS.find(l => l.id === activeCard?.lessonId);
  const currentCardNum = totalInSession - reviewQueue.length + 1; // Approximate visual
  
  // Drag styles
  const rotateDeg = Math.max(Math.min(dragX * 0.1, 15), -15);
  const dragStyle = isDragging ? {
    transform: \`translateX(\${dragX}px) rotate(\${rotateDeg}deg)\`,
    transition: 'none'
  } : (animState === 'snapping' ? {
     '--dx': \`\${dragX}px\`,
     '--rot': \`\${rotateDeg}deg\`,
  } : {});

  // Overlays
  const showKnewIt = dragX < -50;
  const showReview = dragX > 50;

  let animClass = '';
  if (animState === 'flyingLeft') animClass = 'animate-flyToLeft';
  else if (animState === 'flyingRight') animClass = 'animate-flyToRight';
  else if (animState === 'snapping') animClass = 'animate-snapBackV2';

  const getPileStyle = (index: number) => {
     const rotations = [-6, -3, 0, 3, 6];
     const rot = rotations[index % rotations.length];
     return { transform: \`rotate(\${rot}deg)\`, backgroundColor: '#FFF9C4', position: 'absolute' as any, top: 0, left: 0 };
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FC] relative overflow-hidden">
      {/* Flash overlay */}
      {showFlash && (
        <div className="fixed inset-0 z-[300] pointer-events-none bg-[rgba(34,197,94,0.06)] animate-flash" />
      )}

      <div className="max-w-[1200px] mx-auto p-[40px] flex flex-col h-[calc(100vh-40px)] select-none">
        
        {/* Header */}
        <div className="mb-10 shrink-0">
          <div className="flex items-center gap-4 mb-1">
             <button onClick={() => setActiveLessonId(null)} className="text-[#3D52A0] text-[13px] font-[600] hover:underline">
               ← Back to days
             </button>
          </div>
          <h1 className="text-[13px] font-[700] text-[#111111] uppercase tracking-[0.08em] mb-1 mt-4">
            My Notes
          </h1>
          <p className="text-[14px] text-[#666666]">Card Review Mode</p>
        </div>

        {/* Main Interface */}
        <div className="relative flex-1 flex flex-col items-center justify-center min-h-[500px]">
          
          {/* Counter */}
          <div className="text-[13px] font-[700] text-[#555] text-center mb-[16px] absolute top-0">
             Card {Math.min(currentCardNum, totalInSession)} of {totalInSession}
          </div>

          {/* Left Pile (Memorized) */}
          <div className="absolute left-[40px] top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <div className="text-[#22C55E] font-[700] text-[12px] mb-4">✓ Memorized</div>
            <div className="relative w-[80px] h-[100px]">
               {knewIt.map((_, i) => (
                 <div key={i} className="w-[80px] h-[100px] rounded-[8px] shadow-[2px_2px_8px_rgba(0,0,0,0.1)]" style={getPileStyle(i)} />
               ))}
               {knewIt.length > 0 && (
                 <div className="absolute -bottom-3 -right-3 bg-[#22C55E] text-white text-[12px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm z-10">
                   {knewIt.length}
                 </div>
               )}
            </div>
          </div>

          {/* Right Pile (Review Again Tracker) */}
          <div className="absolute right-[40px] top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <div className="text-[#EF4444] font-[700] text-[12px] mb-4">↻ Review Again</div>
            <div className="relative w-[80px] h-[100px]">
               {Array.from({length: reviewAgainCount}).map((_, i) => (
                 <div key={i} className="w-[80px] h-[100px] rounded-[8px] shadow-[2px_2px_8px_rgba(0,0,0,0.1)]" style={getPileStyle(i)} />
               ))}
               {reviewAgainCount > 0 && (
                 <div className="absolute -bottom-3 -right-3 bg-[#EF4444] text-white text-[12px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm z-10">
                   {reviewAgainCount}
                 </div>
               )}
            </div>
          </div>

          {/* The Stack */}
          <div className="relative w-[400px] h-[360px] flex items-center justify-center">
            
            {/* Slide Under Temp Card (rejoining back of queue visually) */}
            {showSlideUnder && slideUnderCard && (
               <div className="absolute w-[400px] min-h-[220px] rounded-[12px] p-[28px] animate-slideUnder z-[7]"
                    style={{ backgroundColor: slideUnderCard.color || '#FFF9C4' }}>
               </div>
            )}

            {/* Ghost 2 */}
            {ghost2 && (
              <div className="absolute w-[400px] min-h-[220px] rounded-[12px] p-[28px] opacity-35 z-[8]" 
                   style={{ backgroundColor: ghost2.color || '#FFF9C4', transform: 'translateY(16px) scale(0.94)' }} />
            )}
            
            {/* Ghost 1 */}
            {ghost1 && (
              <div className={\`absolute w-[400px] min-h-[220px] rounded-[12px] p-[28px] opacity-60 \${animState === 'flyingLeft' ? 'animate-stackPopV2 delay-[0.4s]' : 'z-[9]'}\`}
                   style={{ backgroundColor: ghost1.color || '#FFF9C4', transform: 'translateY(8px) scale(0.97)' }} />
            )}

            {/* Active Card */}
            {activeCard && (
              <div 
                className={\`absolute w-[400px] min-h-[220px] rounded-[12px] p-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex flex-col z-[10] \${animClass}\`}
                style={{ 
                  backgroundColor: activeCard.color || '#FFF9C4', 
                  cursor: isDragging ? 'grabbing' : 'grab',
                  ...(dragStyle as any)
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                 {/* KNEW IT overlay */}
                 <div className={\`absolute inset-0 bg-[rgba(34,197,94,0.12)] rounded-[12px] flex items-center justify-center transition-opacity duration-200 pointer-events-none \${showKnewIt ? 'opacity-100' : 'opacity-0'}\`}>
                    <div className="text-[#22C55E] text-[20px] font-[900] px-4 py-2 rotate-[-15deg]">✓ MEMORIZED</div>
                 </div>

                 {/* REVIEW overlay */}
                 <div className={\`absolute inset-0 bg-[rgba(239,68,68,0.12)] rounded-[12px] flex items-center justify-center transition-opacity duration-200 pointer-events-none \${showReview ? 'opacity-100' : 'opacity-0'}\`}>
                    <div className="text-[#EF4444] text-[20px] font-[900] px-4 py-2 rotate-[15deg]">↻ REVIEW</div>
                 </div>

                 <div className="text-[15px] leading-[1.8] text-[#111] font-sans flex-1 overflow-hidden" dangerouslySetInnerHTML={{ __html: activeCard.content }} />
                 
                 <div className="mt-6 flex justify-between items-center shrink-0">
                    <span className="text-[11px] text-[#888]">Lesson {lesson?.id} · {lesson?.title}</span>
                 </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-[32px] flex gap-[16px] justify-center absolute bottom-10">
             <button onClick={() => confirmAction('reviewAgain')} className="bg-[#FEF2F2] border-2 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-[12px] px-[32px] py-[14px] font-[700] text-[14px] transition-colors">
               ↻ Review Again
             </button>
             <button onClick={() => confirmAction('knewIt')} className="bg-[#F0FDF4] border-2 border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E] hover:text-white rounded-[12px] px-[32px] py-[14px] font-[700] text-[14px] transition-colors">
               ✓ Memorized
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('app/saved/page.tsx', PAGE_TSX, 'utf8');
console.log('Saved page rewritten successfully.');
