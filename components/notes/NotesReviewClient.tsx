"use client";

import React, { useState, useEffect, useRef } from "react";
import { Lesson } from "@prisma/client";

export interface Note {
  id?: string;
  lessonId: number;
  content: string;
  color?: string;
}

export const NotesReviewClient = ({ initialNotes, lessons }: { initialNotes: Note[], lessons: Lesson[] }) => {
  // Group notes by lessonId
  const notesByLesson = initialNotes.reduce((acc: Record<number, Note[]>, note: Note) => {
    if (!acc[note.lessonId]) acc[note.lessonId] = [];
    acc[note.lessonId].push(note);
    return acc;
  }, {});

  const lessonIds = Object.keys(notesByLesson).map(Number).sort((a, b) => a - b);
  
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  
  // --- REVIEW MODE STATE ---
  const [reviewQueue, setReviewQueue] = useState<Note[]>([]);
  const [knewIt, setKnewIt] = useState<Note[]>([]);
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
  const [slideUnderCard, setSlideUnderCard] = useState<Note | null>(null);

  // Start a review session
  const startSession = (id: number) => {
    const rawNotes = notesByLesson[id] || [];
    const notes = rawNotes.filter((n: Note) => {
      const txt = (n.content || '').replace(/<[^>]*>?/gm, '').trim();
      return txt !== '' && txt !== 'New Note...';
    });
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

  // RENDER: Completion Screen
  if (isComplete) {
     const isPerfect = knewIt.length === totalInSession;
     return (
       <div className="flex-1 min-h-screen bg-[#F8F9FC] flex flex-col p-10 relative max-w-[1200px] mx-auto w-full">
         <div className="mb-2 shrink-0">
           <h1 className="text-[13px] font-[700] text-gray-900 uppercase tracking-[0.08em] mb-1">My Notes</h1>
           <p className="text-sm text-gray-500">Card Review Complete</p>
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
                         style={{ left: `${left}%`, backgroundColor: colors[Math.floor(Math.random() * colors.length)], '--delay': `${delay}s`, '--duration': `${duration}s` } as React.CSSProperties} />
                  );
               })}
             </div>
           )}
           
           <h2 className="text-[28px] font-[900] text-gray-900 mb-2 z-10">🎉 All Done!</h2>
           <p className="text-base text-gray-500 z-10">You memorized {knewIt.length} of {totalInSession} notes today</p>
           {reviewAgainCount > 0 && (
             <p className="text-sm text-red-500 mt-2 font-bold z-10">↻ {reviewAgainCount} notes needed review</p>
           )}
           
           <div className="flex gap-4 z-10 mt-8">
             {reviewAgainCount > 0 && (
               <button onClick={() => startSession(activeLessonId!)} className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold shadow-sm hover:bg-red-600">
                 Review Again
               </button>
             )}
             <button onClick={() => setActiveLessonId(null)} className="bg-brand-primary text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-brand-primary/90 transition-colors">
               ← Back to days
             </button>
           </div>
         </div>
       </div>
     );
  }

  // RENDER: Stack Mode setup
  const activeCard = reviewQueue[0];
  const ghost1 = reviewQueue[1];
  const ghost2 = reviewQueue[2];
  const lesson = lessons.find(l => l.id === String(activeCard?.lessonId) || l.dayOrder === activeCard?.lessonId);
  const currentCardNum = totalInSession - reviewQueue.length + 1; // Approximate visual
  
  // Drag styles
  const rotateDeg = Math.max(Math.min(dragX * 0.1, 15), -15);
  const dragStyle = isDragging ? {
    transform: `translateX(${dragX}px) rotate(${rotateDeg}deg)`,
    transition: 'none'
  } : (animState === 'snapping' ? {
     '--dx': `${dragX}px`,
     '--rot': `${rotateDeg}deg`,
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
     return { transform: `rotate(${rot}deg)`, backgroundColor: '#FFF9C4', position: 'absolute' as const, top: 0, left: 0 };
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FC] relative overflow-hidden flex flex-col p-10 max-w-[1200px] mx-auto w-full select-none">
      {/* Flash overlay */}
      {showFlash && (
        <div className="fixed inset-0 z-[300] pointer-events-none bg-[rgba(34,197,94,0.06)] animate-flash" />
      )}

      {/* Header and Day Pills */}
      <div className="mb-2 shrink-0">
        <h1 className="text-[13px] font-[700] text-gray-900 uppercase tracking-[0.08em] mb-1">
          My Notes
        </h1>
        <p className="text-sm text-gray-500">
          Your saved insights across all lessons
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 shrink-0 scrollbar-hide">
        {lessonIds.map(id => {
          const dayStr = id < 10 ? `0${id}` : `${id}`;
          const isActive = activeLessonId === id;
          return (
            <button
              key={id}
              onClick={() => startSession(id)}
              className="rounded-[20px] px-[18px] py-2 text-xs font-[700] border transition-colors cursor-pointer"
              style={{
                backgroundColor: isActive ? '#3D52A0' : '#EEF3FF',
                borderColor: isActive ? '#3D52A0' : '#C7D7FF',
                color: isActive ? '#ffffff' : '#3D52A0'
              }}
            >
              DAY {dayStr}
            </button>
          );
        })}
      </div>

      {activeLessonId && (
        <div className="mb-2 shrink-0">
           <button onClick={() => setActiveLessonId(null)} className="text-[#3D52A0] text-[13px] font-[600] hover:underline">
             ← Back to days
           </button>
        </div>
      )}

      {!activeLessonId ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] shrink-0">
           {/* Card Stack */}
           <div className="relative w-[280px] h-[180px] mb-5">
              {/* Card 3 */}
              <div className="absolute top-5 left-10 w-[240px] h-[140px] bg-[#E8D6FF] rounded-xl opacity-40 shadow-[2px_2px_8px_rgba(0,0,0,0.08)]" style={{ transform: 'rotate(6deg)' }} />
              {/* Card 2 */}
              <div className="absolute top-2.5 left-5 w-[240px] h-[140px] bg-[#D6E8FF] rounded-xl opacity-60 shadow-[2px_2px_8px_rgba(0,0,0,0.1)]" style={{ transform: 'rotate(3deg)' }} />
              {/* Card 1 */}
              <div className="absolute top-0 left-0 w-[240px] h-[140px] bg-[#FFF9C4] rounded-xl shadow-[4px_4px_16px_rgba(0,0,0,0.12)] p-4 flex flex-col justify-between animate-float" style={{ transform: 'rotate(-1deg)' }}>
                  <div>
                    <div className="h-2.5 bg-[rgba(0,0,0,0.08)] rounded mb-2 w-full" />
                    <div className="h-2.5 bg-[rgba(0,0,0,0.08)] rounded mb-2 w-full" />
                    <div className="h-2.5 bg-[rgba(0,0,0,0.08)] rounded mb-2 w-[60%]" />
                  </div>
                  <div className="text-[10px] text-gray-400">Lesson 1 · Concepts</div>
              </div>
           </div>

           {/* Instructions */}
           <div className="mb-4">
              <h2 className="text-xl font-[800] text-gray-900 text-center mb-2">Review your notes</h2>
              <p className="text-sm text-gray-500 text-center leading-[1.6] max-w-[320px] mx-auto">Pick a day above to start reviewing your saved insights.</p>
           </div>

           {/* 3 Steps */}
           <div className="flex gap-2.5 justify-center mb-4">
              <div className="bg-white border border-[#EBEBEB] rounded-[10px] px-3.5 py-2 flex items-center gap-2 text-xs text-gray-600">
                 <div className="w-[22px] h-[22px] rounded-full bg-[#3D52A0] text-white flex items-center justify-center font-[800] text-[11px]">1</div>
                 Pick a day
              </div>
              <div className="bg-white border border-[#EBEBEB] rounded-[10px] px-3.5 py-2 flex items-center gap-2 text-xs text-gray-600">
                 <div className="w-[22px] h-[22px] rounded-full bg-[#3D52A0] text-white flex items-center justify-center font-[800] text-[11px]">2</div>
                 Read each card
              </div>
              <div className="bg-white border border-[#EBEBEB] rounded-[10px] px-3.5 py-2 flex items-center gap-2 text-xs text-gray-600">
                 <div className="w-[22px] h-[22px] rounded-full bg-[#3D52A0] text-white flex items-center justify-center font-[800] text-[11px]">3</div>
                 Sort by memory
              </div>
           </div>

           {/* Swipe Hint */}
           <div className="flex items-center gap-5 justify-center">
               <div className="text-[13px] font-[700] text-green-500">← Memorized</div>
               <div className="w-[1px] h-6 bg-[#EBEBEB]" />
               <div className="text-[13px] font-[700] text-red-500">Review Again →</div>
           </div>
        </div>
      ) : reviewQueue.length === 0 && knewIt.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center text-gray-500">
           No reviewable notes found for this day. (New notes must be filled out first.)
        </div>
      ) : (
        /* Main Interface */
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-160px)] w-full max-w-[900px] mx-auto">
          
          {/* Counter */}
          <div className="text-sm font-[700] text-gray-600 text-center mb-3">
             Card {Math.min(currentCardNum, totalInSession)} of {totalInSession}
          </div>

          {/* Left Pile (Memorized) */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <div className="text-green-500 font-[700] text-xs mb-4">✓ Memorized</div>
            <div className="relative w-[100px] h-[130px]">
               {knewIt.map((_, i) => (
                 <div key={i} className="w-[100px] h-[130px] rounded-lg shadow-[2px_2px_8px_rgba(0,0,0,0.12)]" style={getPileStyle(i)} />
               ))}
               {knewIt.length > 0 && (
                 <div className="absolute -bottom-3 -right-3 bg-green-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm z-10">
                   {knewIt.length}
                 </div>
               )}
            </div>
          </div>

          {/* Right Pile (Review Again Tracker) */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <div className="text-red-500 font-[700] text-xs mb-4">↻ Review Again</div>
            <div className="relative w-[100px] h-[130px]">
               {Array.from({length: reviewAgainCount}).map((_, i) => (
                 <div key={i} className="w-[100px] h-[130px] rounded-lg shadow-[2px_2px_8px_rgba(0,0,0,0.12)]" style={getPileStyle(i)} />
               ))}
               {reviewAgainCount > 0 && (
                 <div className="absolute -bottom-3 -right-3 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm z-10">
                   {reviewAgainCount}
                 </div>
               )}
            </div>
          </div>

          {/* The Stack */}
          <div className="relative w-[460px] h-[240px] flex items-center justify-center shrink-0">
            
            {/* Slide Under Temp Card (rejoining back of queue visually) */}
            {showSlideUnder && slideUnderCard && (
               <div className="absolute w-[460px] min-h-[240px] rounded-xl p-7 animate-slideUnder z-[7]"
                    style={{ backgroundColor: slideUnderCard.color || '#FFF9C4' }}>
               </div>
            )}

            {/* Ghost 2 */}
            {ghost2 && (
              <div className="absolute w-[460px] min-h-[240px] rounded-xl p-7 opacity-35 z-[8]" 
                   style={{ backgroundColor: ghost2.color || '#FFF9C4', transform: 'translateY(20px) scale(0.94)' }} />
            )}
            
            {/* Ghost 1 */}
            {ghost1 && (
              <div className={`absolute w-[460px] min-h-[240px] rounded-xl p-7 opacity-60 ${animState === 'flyingLeft' ? 'animate-stackPopV2 delay-[0.4s]' : 'z-[9]'}`}
                   style={{ backgroundColor: ghost1.color || '#FFF9C4', transform: 'translateY(10px) scale(0.97)' }} />
            )}

            {/* Active Card */}
            {activeCard && (
              <div 
                className={`absolute w-[460px] min-h-[240px] rounded-xl p-7 shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex flex-col z-[10] ${animClass}`}
                style={{ 
                  backgroundColor: activeCard.color || '#FFF9C4', 
                  cursor: isDragging ? 'grabbing' : 'grab',
                  ...(dragStyle as React.CSSProperties)
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                 {/* KNEW IT overlay */}
                 <div className={`absolute inset-0 bg-[rgba(34,197,94,0.12)] rounded-xl flex items-center justify-center transition-opacity duration-200 pointer-events-none ${showKnewIt ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-green-500 text-xl font-[900] px-4 py-2 rotate-[-15deg]">✓ MEMORIZED</div>
                 </div>

                 {/* REVIEW overlay */}
                 <div className={`absolute inset-0 bg-[rgba(239,68,68,0.12)] rounded-xl flex items-center justify-center transition-opacity duration-200 pointer-events-none ${showReview ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-red-500 text-xl font-[900] px-4 py-2 rotate-[15deg]">↻ REVIEW</div>
                 </div>

                 <div className="text-base leading-[1.8] text-gray-900 font-sans flex-1 overflow-hidden" dangerouslySetInnerHTML={{ __html: activeCard.content }} />
                 
                 <div className="mt-6 flex justify-between items-center shrink-0">
                    <span className="text-[11px] text-gray-400">Lesson {lesson?.id} · {lesson?.title}</span>
                 </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-4 justify-center shrink-0">
             <button onClick={() => confirmAction('reviewAgain')} className="bg-red-50 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl px-8 py-3.5 font-[700] text-sm transition-colors min-w-[160px]">
               ↻ Review Again
             </button>
             <button onClick={() => confirmAction('knewIt')} className="bg-green-50 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded-xl px-8 py-3.5 font-[700] text-sm transition-colors min-w-[160px]">
               ✓ Memorized
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
