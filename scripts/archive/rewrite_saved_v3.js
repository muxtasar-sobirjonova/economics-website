const fs = require('fs');

const CSS_ANIMATIONS = `
@keyframes noteExit {
  0% { transform: rotate(0deg) translateX(0) scale(1); opacity: 1; }
  30% { transform: rotate(-5deg) translateX(-20px) scale(0.95); }
  100% { transform: rotate(-15deg) translateX(-120%) scale(0.8); opacity: 0; }
}

@keyframes noteEntrance {
  0% { transform: rotate(15deg) translateX(120%) scale(0.8); opacity: 0; }
  60% { transform: rotate(-3deg) translateX(-10px) scale(1.02); opacity: 1; }
  80% { transform: rotate(2deg) translateX(4px) scale(1); }
  100% { transform: rotate(0deg) translateX(0) scale(1); opacity: 1; }
}

@keyframes noteExitLeft {
  0% { transform: rotate(0deg) translateX(0) scale(1); opacity: 1; }
  30% { transform: rotate(5deg) translateX(20px) scale(0.95); }
  100% { transform: rotate(15deg) translateX(120%) scale(0.8); opacity: 0; }
}

@keyframes noteEntranceLeft {
  0% { transform: rotate(-15deg) translateX(-120%) scale(0.8); opacity: 0; }
  60% { transform: rotate(3deg) translateX(10px) scale(1.02); opacity: 1; }
  80% { transform: rotate(-2deg) translateX(-4px) scale(1); }
  100% { transform: rotate(0deg) translateX(0) scale(1); opacity: 1; }
}

@keyframes particle {
  0% { transform: translate(0,0) scale(1); opacity: 0.6; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}

@keyframes popIn {
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  70% { transform: scale(1.05) rotate(2deg); opacity: 1; }
  100% { transform: scale(1) rotate(-1deg); opacity: 1; }
}

.animate-noteExit { animation: noteExit 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.animate-noteEntrance { animation: noteEntrance 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.animate-noteExitLeft { animation: noteExitLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.animate-noteEntranceLeft { animation: noteEntranceLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.animate-particle { animation: particle 0.6s ease forwards; }
.animate-popIn { animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
`;

let globalsCss = fs.readFileSync('app/globals.css', 'utf8');
if (!globalsCss.includes('@keyframes noteExit')) {
  fs.appendFileSync('app/globals.css', CSS_ANIMATIONS, 'utf8');
}

const PAGE_TSX = `"use client";

import React, { useState, useEffect } from "react";
import { useGameState, saveGlobalNote, deleteGlobalNote } from "@/lib/progress";
import { LESSONS } from "@/lib/data";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const [focusNoteIndex, setFocusNoteIndex] = useState<number | null>(null);
  
  // Animation state
  const [animDirection, setAnimDirection] = useState<'next'|'prev'|null>(null);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  // New note animation tracker
  const [justAddedNoteId, setJustAddedNoteId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeLessonId && lessonIds.length > 0) {
      setActiveLessonId(lessonIds[0]);
    } else if (activeLessonId && !lessonIds.includes(activeLessonId)) {
      setActiveLessonId(lessonIds[0] || null);
    }
  }, [lessonIds, activeLessonId]);

  const activeNotes = activeLessonId ? notesByLesson[activeLessonId] || [] : [];
  
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

  const handleNext = () => {
    if (focusNoteIndex !== null && focusNoteIndex < activeNotes.length - 1) {
      setAnimatingIndex(focusNoteIndex);
      setAnimDirection('next');
      setTimeout(() => {
        setFocusNoteIndex(prev => (prev !== null ? prev + 1 : null));
        setAnimDirection(null);
        setAnimatingIndex(null);
      }, 500);
    }
  };

  const handlePrev = () => {
    if (focusNoteIndex !== null && focusNoteIndex > 0) {
      setAnimatingIndex(focusNoteIndex);
      setAnimDirection('prev');
      setTimeout(() => {
        setFocusNoteIndex(prev => (prev !== null ? prev - 1 : null));
        setAnimDirection(null);
        setAnimatingIndex(null);
      }, 500);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-screen bg-[#F8F9FC] relative">
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

        {/* Day Pills */}
        <div className="flex items-center gap-[8px] overflow-x-auto pb-4 mb-6" style={{ scrollbarWidth: 'none' }}>
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
                  {/* Top dot */}
                  <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: '#000000', opacity: 0.1 }} />
                  
                  {/* Content */}
                  <div 
                    className="text-[14px] leading-[1.7] text-[#333] font-sans flex-1 overflow-hidden" 
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />

                  {/* Footer */}
                  <div className="mt-4 flex justify-between items-end">
                    <span className="text-[10px] text-[#888]">
                      {tagText}
                    </span>
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
            
            {/* Add Note Button in Grid Area */}
            <div className="flex items-center justify-center p-[20px] min-h-[180px]">
              <button 
                onClick={handleAddNote}
                className="bg-[#3D52A0] text-[#ffffff] rounded-[8px] px-[20px] py-[10px] font-[700] text-[13px] hover:bg-[#2e3e78] transition-colors shadow-sm"
              >
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
      </div>

      {/* Focus Mode Overlay */}
      {focusNoteIndex !== null && (
        <div className="fixed inset-0 z-[200] bg-[rgba(15,15,30,0.85)] backdrop-blur-[8px] flex items-center justify-center">
          
          <button 
            onClick={() => setFocusNoteIndex(null)}
            className="absolute top-6 right-8 text-white/50 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>

          {/* Carousel Container */}
          <div className="relative w-full max-w-[600px] h-[400px] flex items-center justify-center perspective-[1000px]">
            
            <button onClick={handlePrev} className="absolute left-0 z-[250] text-white/50 hover:text-white transition-colors disabled:opacity-0" disabled={focusNoteIndex === 0 || animDirection !== null}>
               <ChevronLeft size={48} />
            </button>
            
            <button onClick={handleNext} className="absolute right-0 z-[250] text-white/50 hover:text-white transition-colors disabled:opacity-0" disabled={focusNoteIndex === activeNotes.length - 1 || animDirection !== null}>
               <ChevronRight size={48} />
            </button>

            {/* Note Stack logic */}
            {activeNotes.map((note: any, i: number) => {
              const isActive = focusNoteIndex === i;
              const isAnimatingOut = animatingIndex === i;
              const isAnimatingIn = (animDirection === 'next' && focusNoteIndex + 1 === i) || (animDirection === 'prev' && focusNoteIndex - 1 === i);
              
              if (!isActive && !isAnimatingOut && !isAnimatingIn) return null;

              let animClass = '';
              if (animDirection === 'next') {
                if (isAnimatingOut) animClass = 'animate-noteExit z-[210]';
                if (isAnimatingIn) animClass = 'animate-noteEntrance z-[220]';
              } else if (animDirection === 'prev') {
                if (isAnimatingOut) animClass = 'animate-noteExitLeft z-[210]';
                if (isAnimatingIn) animClass = 'animate-noteEntranceLeft z-[220]';
              } else {
                animClass = 'z-[220]'; // Default resting state
              }

              // Particle effects only on entering active card during transition
              const renderParticles = isAnimatingIn;
              const particles = [];
              if (renderParticles) {
                for (let p=0; p<6; p++) {
                   const tx = (Math.random() * 120 - 60) + 'px';
                   const ty = (Math.random() * 120 - 60) + 'px';
                   particles.push(
                     <div 
                       key={p} 
                       className="absolute top-1/2 left-1/2 w-[6px] h-[6px] bg-[#3D52A0] rounded-full animate-particle pointer-events-none"
                       style={{ '--tx': tx, '--ty': ty } as any}
                     />
                   )
                }
              }

              return (
                <React.Fragment key={note.id}>
                  {/* The Ghost Stack (only render for the resting active note, not during animation for clean look) */}
                  {isActive && !animDirection && (
                    <>
                      <div className="absolute w-[480px] min-h-[320px] rounded-[8px] z-[218] opacity-50" style={{ backgroundColor: note.color || '#FFF9C4', transform: 'translateX(8px) translateY(8px) rotate(3deg) scale(0.97)' }} />
                      <div className="absolute w-[480px] min-h-[320px] rounded-[8px] z-[217] opacity-25" style={{ backgroundColor: note.color || '#FFF9C4', transform: 'translateX(16px) translateY(16px) rotate(6deg) scale(0.94)' }} />
                    </>
                  )}
                  
                  {/* The Main Card */}
                  <div 
                    className={\`absolute w-[480px] min-h-[320px] rounded-[8px] p-[36px] shadow-[0_24px_60px_rgba(0,0,0,0.4)] text-[16px] leading-[1.8] flex flex-col \${animClass}\`}
                    style={{ backgroundColor: note.color || '#FFF9C4' }}
                  >
                     <div 
                       className="text-[#333] font-sans flex-1 overflow-y-auto outline-none" 
                       dangerouslySetInnerHTML={{ __html: note.content }}
                     />
                     {renderParticles && particles}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('app/saved/page.tsx', PAGE_TSX, 'utf8');
console.log('Saved page rewritten successfully.');
