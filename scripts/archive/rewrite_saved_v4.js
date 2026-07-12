const fs = require('fs');

const CSS_ANIMATIONS = `
@keyframes flyLeft {
  0% { transform: translateX(0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translateX(-130vw) rotate(-30deg) scale(0.7); opacity: 0; }
}

@keyframes flyRight {
  0% { transform: translateX(0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translateX(130vw) rotate(30deg) scale(0.7); opacity: 0; }
}

@keyframes stackPop {
  0% { transform: translateY(8px) scale(0.97); opacity: 0.7; z-index: 9; }
  100% { transform: translateY(0) scale(1); opacity: 1; z-index: 10; }
}

@keyframes snapBack {
  0% { transform: translateX(var(--drag-x)) rotate(var(--drag-rot)); }
  60% { transform: translateX(8px) rotate(0.5deg); }
  80% { transform: translateX(-4px) rotate(-0.3deg); }
  100% { transform: translateX(0) rotate(0deg); }
}

.animate-flyLeft { animation: flyLeft 0.55s cubic-bezier(0.4, 0, 0.8, 0.6) forwards; }
.animate-flyRight { animation: flyRight 0.55s cubic-bezier(0.4, 0, 0.8, 0.6) forwards; }
.animate-stackPop { animation: stackPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.animate-snapBack { animation: snapBack 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
`;

let globalsCss = fs.readFileSync('app/globals.css', 'utf8');
if (!globalsCss.includes('@keyframes flyLeft')) {
  fs.appendFileSync('app/globals.css', CSS_ANIMATIONS, 'utf8');
}

const PAGE_TSX = `"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGameState, saveGlobalNote, deleteGlobalNote } from "@/lib/progress";
import { LESSONS } from "@/lib/data";
import { X } from "lucide-react";

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
  
  const [activeLessonId, setActiveLessonId] = useState<number | null>(lessonIds[0] || null);
  
  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'review'>('grid');
  const [justAddedNoteId, setJustAddedNoteId] = useState<string | null>(null);

  // Focus mode logic (Carousel Overlay from previous build)
  const [focusNoteIndex, setFocusNoteIndex] = useState<number | null>(null);

  // --- REVIEW MODE STATE ---
  const [reviewQueue, setReviewQueue] = useState<any[]>([]);
  const [knewIt, setKnewIt] = useState<any[]>([]);
  const [reviewAgain, setReviewAgain] = useState<any[]>([]);
  
  // Drag physics state
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const startXRef = useRef(0);

  // Animation triggers
  const [animState, setAnimState] = useState<'idle' | 'flyingLeft' | 'flyingRight' | 'snapping'>('idle');

  useEffect(() => {
    if (!activeLessonId && lessonIds.length > 0) {
      setActiveLessonId(lessonIds[0]);
    }
  }, [lessonIds, activeLessonId]);

  const activeNotes = activeLessonId ? notesByLesson[activeLessonId] || [] : [];
  
  // Enter Review Mode
  const startReviewSession = (notesToReview: any[]) => {
    setReviewQueue([...notesToReview]);
    setKnewIt([]);
    setReviewAgain([]);
    setViewMode('review');
    setAnimState('idle');
  };

  const handleAddNote = () => {
    if (!activeLessonId) return;
    const newId = Date.now().toString();
    saveGlobalNote({
      id: newId,
      lessonId: activeLessonId,
      source: 'Direct',
      content: 'New Note...',
      color: '#FFF9C4', // Default sticky yellow
      timestamp: new Date().toISOString()
    });
    setJustAddedNoteId(newId);
    setTimeout(() => setJustAddedNoteId(null), 1000);
  };

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

    if (dragX < -100) confirmAction('knewIt');
    else if (dragX > 100) confirmAction('reviewAgain');
    else {
      setAnimState('snapping');
      setTimeout(() => {
        setDragX(0);
        setAnimState('idle');
      }, 400); // snapBack duration
    }
  };

  const confirmAction = (result: 'knewIt' | 'reviewAgain' | 'skip') => {
    if (reviewQueue.length === 0) return;

    if (result === 'knewIt') setAnimState('flyingLeft');
    else if (result === 'reviewAgain') setAnimState('flyingRight');
    else setAnimState('flyingLeft'); // default skip animation

    const currentCard = reviewQueue[0];

    setTimeout(() => {
      // Pop queue and push to pile
      setReviewQueue(prev => prev.slice(1));
      if (result === 'knewIt') setKnewIt(prev => [...prev, currentCard]);
      else if (result === 'reviewAgain') setReviewAgain(prev => [...prev, currentCard]);
      
      setDragX(0);
      setAnimState('idle');
    }, 550); // fly duration
  };

  // Render Grid Mode
  const renderGrid = () => {
    return (
      <div className="max-w-[1200px] mx-auto p-[40px]">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-[13px] font-[700] text-[#111111] uppercase tracking-[0.08em] mb-1">
            My Notes
          </h1>
          <p className="text-[14px] text-[#666666]">
            Your saved insights across all lessons
          </p>
        </div>

        {/* Day Pills & Start Review Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-[8px] overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {lessonIds.map(id => {
              const isActive = activeLessonId === id;
              const dayStr = id < 10 ? \`0\${id}\` : \`\${id}\`;
              return (
                <button
                  key={id}
                  onClick={() => setActiveLessonId(id)}
                  className="rounded-[20px] px-[14px] py-[6px] text-[12px] font-[700] border shrink-0 transition-colors"
                  style={{
                    backgroundColor: isActive ? '#3D52A0' : '#EEF3FF',
                    borderColor: isActive ? '#3D52A0' : '#C7D7FF',
                    color: isActive ? '#ffffff' : '#3D52A0',
                    cursor: 'pointer'
                  }}
                >
                  DAY {dayStr}
                </button>
              );
            })}
          </div>
          
          {activeNotes.length > 0 && (
             <button 
               onClick={() => startReviewSession(activeNotes)}
               className="bg-[#22C55E] hover:bg-[#16a34a] text-white font-[700] text-[13px] px-[20px] py-[10px] rounded-[8px] shadow-sm transition-colors whitespace-nowrap"
             >
               Start Review
             </button>
          )}
        </div>

        {/* Notes Grid */}
        {activeLessonId && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-[20px] py-[24px]">
            {activeNotes.map((note: any, index: number) => {
              const isEven = index % 2 === 0;
              const lesson = LESSONS.find(l => l.id === note.lessonId);
              const tagText = \`Lesson \${lesson?.id} · \${lesson?.title}\`;
              const isNewlyAdded = justAddedNoteId === note.id;

              return (
                <div 
                  key={note.id}
                  onClick={() => setFocusNoteIndex(index)}
                  className={\`
                    relative rounded-[6px] p-[20px] min-h-[180px] transition-all duration-300 ease-out cursor-pointer flex flex-col
                    \${isEven ? 'rotate-1 hover:rotate-0' : '-rotate-1 hover:rotate-0'}
                    hover:scale-[1.03] hover:z-10
                    shadow-[3px_3px_12px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.08)]
                    hover:shadow-[6px_6px_20px_rgba(0,0,0,0.15)]
                    \${isNewlyAdded ? 'animate-popIn' : ''}
                  \`}
                  style={{ backgroundColor: note.color || '#FFF9C4' }}
                >
                  <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: '#000000', opacity: 0.1 }} />
                  <div 
                    className="text-[14px] leading-[1.7] text-[#333] font-sans flex-1 overflow-hidden" 
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                  <div className="mt-4 flex justify-between items-end">
                    <span className="text-[10px] text-[#888]">{tagText}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteGlobalNote(note.id); }}
                      className="text-[#aaa] text-[14px] hover:text-[#333] leading-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
            
            <div className="flex items-center justify-center p-[20px] min-h-[180px]">
              <button onClick={handleAddNote} className="bg-[#3D52A0] text-[#ffffff] rounded-[8px] px-[20px] py-[10px] font-[700] text-[13px] hover:bg-[#2e3e78] transition-colors shadow-sm">
                + Add Note
              </button>
            </div>
          </div>
        )}

        {globalNotes.length === 0 && (
           <div className="text-center py-20 text-[#666]">
             You haven't saved any notes yet.
           </div>
        )}
        
        {/* Simple Fullscreen Focus Mode logic to preserve original functionality */}
        {focusNoteIndex !== null && (
          <div className="fixed inset-0 z-[200] bg-[rgba(15,15,30,0.85)] backdrop-blur-[8px] flex items-center justify-center">
            <button onClick={() => setFocusNoteIndex(null)} className="absolute top-6 right-8 text-white/50 hover:text-white transition-colors">
              <X size={32} />
            </button>
            <div className="relative w-full max-w-[600px] h-[400px] flex items-center justify-center perspective-[1000px]">
               <div className="absolute w-[480px] min-h-[320px] rounded-[8px] p-[36px] shadow-[0_24px_60px_rgba(0,0,0,0.4)] text-[16px] leading-[1.8] flex flex-col z-[220]" style={{ backgroundColor: activeNotes[focusNoteIndex]?.color || '#FFF9C4' }}>
                  <div className="text-[#333] font-sans flex-1 overflow-y-auto outline-none" dangerouslySetInnerHTML={{ __html: activeNotes[focusNoteIndex]?.content }} />
               </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Review Mode
  const renderReview = () => {
    const isComplete = reviewQueue.length === 0;

    if (isComplete) {
       const total = knewIt.length + reviewAgain.length;
       const successRate = total > 0 ? (knewIt.length / total) : 0;
       return (
         <div className="max-w-[1200px] mx-auto p-[40px] flex flex-col h-full relative">
           <div className="mb-10">
             <h1 className="text-[13px] font-[700] text-[#111111] uppercase tracking-[0.08em] mb-1">My Notes</h1>
             <p className="text-[14px] text-[#666666]">Card Review Complete</p>
           </div>
           
           <div className="flex-1 flex flex-col items-center justify-center">
             {successRate >= 0.7 && (
               <div className="absolute inset-0 pointer-events-none z-0">
                 {Array.from({length: 40}).map((_, i) => {
                    const colors = ['#3D52A0', '#22C55E', '#FCD34D', '#F9A8D4'];
                    const left = Math.random() * 100;
                    const delay = Math.random() * 1;
                    const duration = 1.5 + Math.random() * 1.5;
                    return (
                      <div key={i} className="absolute top-0 w-3 h-3 rounded-full animate-confetti"
                           style={{ left: \`\${left}%\`, backgroundColor: colors[Math.floor(Math.random() * colors.length)], '--delay': \`\${delay}s\`, '--duration': \`\${duration}s\` } as any} />
                    );
                 })}
               </div>
             )}
             
             <h2 className="text-[24px] font-[900] text-[#111] mb-2 z-10">🎉 Session Complete!</h2>
             <p className="text-[16px] text-[#666] mb-8 z-10">{knewIt.length} knew · {reviewAgain.length} to review</p>
             
             <div className="flex gap-4 z-10">
               {reviewAgain.length > 0 && (
                 <button onClick={() => startReviewSession(reviewAgain)} className="bg-[#EF4444] text-white px-6 py-3 rounded-lg font-bold shadow-sm hover:bg-[#dc2626]">
                   Review Again
                 </button>
               )}
               <button onClick={() => setViewMode('grid')} className="bg-[#3D52A0] text-white px-6 py-3 rounded-lg font-bold shadow-sm hover:bg-[#2e3e78]">
                 Done
               </button>
             </div>
           </div>
         </div>
       );
    }

    // Render Review Queue
    const activeCard = reviewQueue[0];
    const ghost1 = reviewQueue[1];
    const ghost2 = reviewQueue[2];

    const totalInSession = reviewQueue.length + knewIt.length + reviewAgain.length;
    const currentCardNum = knewIt.length + reviewAgain.length + 1;
    const lesson = LESSONS.find(l => l.id === activeCard?.lessonId);
    
    // Calculate inline styles for drag
    const rotateDeg = Math.max(Math.min(dragX * 0.05, 15), -15);
    const dragStyle = isDragging ? {
      transform: \`translateX(\${dragX}px) rotate(\${rotateDeg}deg)\`,
      transition: 'none'
    } : (animState === 'snapping' ? {
       '--drag-x': \`\${dragX}px\`,
       '--drag-rot': \`\${rotateDeg}deg\`,
    } : {});

    // Overlays
    const showKnewIt = dragX < -50;
    const showReview = dragX > 50;

    let animClass = '';
    if (animState === 'flyingLeft') animClass = 'animate-flyLeft';
    else if (animState === 'flyingRight') animClass = 'animate-flyRight';
    else if (animState === 'snapping') animClass = 'animate-snapBack';

    const getPileStyle = (index: number) => {
       const rotations = [-5, -2, 0, 2, 5];
       const rot = rotations[index % rotations.length];
       return { transform: \`rotate(\${rot}deg)\`, backgroundColor: '#FFF9C4', position: 'absolute' as any, top: 0, left: 0 };
    };

    return (
      <div className="max-w-[1200px] mx-auto p-[40px] flex flex-col h-[calc(100vh-80px)] overflow-hidden select-none">
        {/* Header stays identical */}
        <div className="mb-10 shrink-0">
          <h1 className="text-[13px] font-[700] text-[#111111] uppercase tracking-[0.08em] mb-1">My Notes</h1>
          <p className="text-[14px] text-[#666666]">Card Review Mode</p>
        </div>
        
        <div className="flex items-center gap-[8px] overflow-x-auto pb-4 mb-6 shrink-0 opacity-50 pointer-events-none">
          <button className="rounded-[20px] px-[14px] py-[6px] text-[12px] font-[700] border shrink-0 bg-[#3D52A0] border-[#3D52A0] text-white">DAY 01</button>
        </div>

        {/* Main Stack Area */}
        <div className="relative flex-1 flex flex-col items-center justify-center min-h-[500px]">
          
          {/* Left Pile (Knew It) */}
          <div className="absolute left-[60px] top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <div className="text-[#22C55E] font-bold text-[14px] mb-4">✓ Knew It</div>
            <div className="relative w-[80px] h-[100px]">
               {knewIt.map((_, i) => (
                 <div key={i} className="w-[80px] h-[100px] rounded-[6px] shadow-sm border border-black/5" style={getPileStyle(i)} />
               ))}
               <div className="absolute -bottom-3 -right-3 bg-[#22C55E] text-white text-[12px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm z-10">
                 {knewIt.length}
               </div>
            </div>
          </div>

          {/* Right Pile (Review Again) */}
          <div className="absolute right-[60px] top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <div className="text-[#EF4444] font-bold text-[14px] mb-4">↻ Review Again</div>
            <div className="relative w-[80px] h-[100px]">
               {reviewAgain.map((_, i) => (
                 <div key={i} className="w-[80px] h-[100px] rounded-[6px] shadow-sm border border-black/5" style={getPileStyle(i)} />
               ))}
               <div className="absolute -bottom-3 -right-3 bg-[#EF4444] text-white text-[12px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm z-10">
                 {reviewAgain.length}
               </div>
            </div>
          </div>

          {/* The Stack */}
          <div className="relative w-[380px] h-[360px] flex items-center justify-center perspective-[1000px]">
            {/* Ghost 2 */}
            {ghost2 && (
              <div className="absolute w-[380px] min-h-[260px] rounded-[12px] z-[8] opacity-40 shadow-sm border border-black/5" 
                   style={{ backgroundColor: ghost2.color || '#FFF9C4', transform: 'translateY(16px) scale(0.94)' }} />
            )}
            
            {/* Ghost 1 */}
            {ghost1 && (
              <div className={\`absolute w-[380px] min-h-[260px] rounded-[12px] opacity-70 shadow-sm border border-black/5 \${animState !== 'idle' && animState !== 'snapping' ? 'animate-stackPop' : 'z-[9]'}\`}
                   style={{ backgroundColor: ghost1.color || '#FFF9C4', transform: 'translateY(8px) scale(0.97)' }} />
            )}

            {/* Active Card */}
            {activeCard && (
              <div 
                className={\`absolute w-[380px] min-h-[260px] rounded-[12px] p-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex flex-col z-[10] \${animClass}\`}
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
                 <div className={\`absolute inset-0 bg-[rgba(34,197,94,0.15)] rounded-[12px] flex items-center justify-center transition-opacity duration-200 pointer-events-none \${showKnewIt ? 'opacity-100' : 'opacity-0'}\`}>
                    <div className="border-4 border-[#22C55E] text-[#22C55E] text-[20px] font-[900] px-4 py-2 rounded-lg rotate-[-15deg]">✓ KNEW IT</div>
                 </div>

                 {/* REVIEW overlay */}
                 <div className={\`absolute inset-0 bg-[rgba(239,68,68,0.15)] rounded-[12px] flex items-center justify-center transition-opacity duration-200 pointer-events-none \${showReview ? 'opacity-100' : 'opacity-0'}\`}>
                    <div className="border-4 border-[#EF4444] text-[#EF4444] text-[20px] font-[900] px-4 py-2 rounded-lg rotate-[15deg]">↻ REVIEW</div>
                 </div>

                 <div className="text-[15px] leading-[1.8] text-[#111] font-sans flex-1 overflow-hidden" dangerouslySetInnerHTML={{ __html: activeCard.content }} />
                 
                 <div className="mt-6 flex justify-between items-center shrink-0">
                    <span className="text-[11px] text-[#888]">Lesson {lesson?.id} · {lesson?.title}</span>
                    <span className="text-[11px] text-[#888]">{currentCardNum} of {totalInSession}</span>
                 </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-[40px] flex items-center gap-[24px] z-20">
             <button onClick={() => confirmAction('knewIt')} className="bg-[#22C55E] text-white rounded-[8px] px-[20px] py-[10px] font-[700] text-[13px] shadow-sm hover:scale-105 transition-transform">
               ← I know this
             </button>
             <button onClick={() => confirmAction('skip')} className="bg-transparent text-[#888] text-[13px] hover:text-[#333] transition-colors underline">
               Skip
             </button>
             <button onClick={() => confirmAction('reviewAgain')} className="bg-[#EF4444] text-white rounded-[8px] px-[20px] py-[10px] font-[700] text-[13px] shadow-sm hover:scale-105 transition-transform">
               Review again →
             </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FC] relative overflow-hidden">
      {viewMode === 'grid' ? renderGrid() : renderReview()}
    </div>
  );
}
`;

fs.writeFileSync('app/saved/page.tsx', PAGE_TSX, 'utf8');
console.log('Saved page updated successfully with Review Mode.');
