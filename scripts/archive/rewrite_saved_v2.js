const fs = require('fs');
const path = 'C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/saved/page.tsx';

const content = `"use client";

import React, { useState, useEffect } from "react";
import { useGameState, deleteGlobalNote, saveGlobalNote } from "@/lib/progress";
import { LESSONS } from "@/lib/data";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

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
  
  // State for tabs and current note index
  const [activeLessonId, setActiveLessonId] = useState<number | null>(lessonIds[0] || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newNoteText, setNewNoteText] = useState("");

  // Update active lesson if notes are added/removed and active is null
  useEffect(() => {
    if (!activeLessonId && lessonIds.length > 0) {
      setActiveLessonId(lessonIds[0]);
    } else if (activeLessonId && !lessonIds.includes(activeLessonId)) {
      setActiveLessonId(lessonIds[0] || null);
    }
  }, [lessonIds, activeLessonId]);

  // Reset index when changing tabs
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeLessonId]);

  const activeNotes = activeLessonId ? notesByLesson[activeLessonId] || [] : [];
  
  // Safe index in case notes get deleted
  const safeIndex = Math.min(currentIndex, Math.max(0, activeNotes.length - 1));
  const activeNote = activeNotes[safeIndex];

  const handleNext = () => {
    if (safeIndex < activeNotes.length - 1) {
      setCurrentIndex(safeIndex + 1);
    }
  };

  const handlePrior = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    }
  };

  const handleDelete = () => {
    if (!activeNote) return;
    deleteGlobalNote(activeNote.id);
  };

  const handleAddNote = () => {
    if (!newNoteText.trim() || !activeLessonId) return;
    saveGlobalNote({
      id: Date.now().toString(),
      lessonId: activeLessonId,
      source: 'Direct',
      content: newNoteText,
      color: '#fef3c7', // Default yellow
      timestamp: new Date().toISOString()
    });
    setNewNoteText("");
    // Go to the last note
    setTimeout(() => {
       setCurrentIndex(notesByLesson[activeLessonId].length);
    }, 50);
  };

  // Pastel colors for tabs based on index
  const tabColors = ['#fef3c7', '#bfdbfe', '#86efac', '#e9d5ff', '#fbcfe8', '#99f6e4', '#fecaca'];

  return (
    <div className="flex-1 overflow-y-auto p-[40px] bg-[#F8F9FC] min-h-screen">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-[20px] font-[800] text-[#111111] mb-4 tracking-tight">
          Study Logs By Day
        </h1>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {lessonIds.map((id, index) => {
            const isActive = activeLessonId === id;
            const color = tabColors[index % tabColors.length];
            const dayStr = id < 10 ? \`0\${id}\` : \`\${id}\`;
            
            return (
              <button
                key={id}
                onClick={() => setActiveLessonId(id)}
                className="relative px-6 py-2 rounded-xl font-bold text-sm text-[#111111] transition-transform active:scale-95 shadow-sm border border-black/5 shrink-0"
                style={{ 
                  backgroundColor: color,
                  opacity: isActive ? 1 : 0.7,
                  transform: isActive ? 'translateY(-2px)' : 'none',
                  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                DAY {dayStr}
                {isActive && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm border border-white">
                    <Check size={10} color="#111" strokeWidth={4} />
                  </div>
                )}
              </button>
            );
          })}
          {lessonIds.length > 5 && (
            <div className="text-sm font-semibold text-[#555] ml-2 shrink-0">Next →</div>
          )}
        </div>

        {/* Main Deck Container */}
        {activeLessonId ? (
          <div className="bg-[#F0F2F5] rounded-2xl border border-[#E5E7EB] p-8 shadow-inner relative overflow-hidden flex flex-col" style={{ minHeight: '600px' }}>
            <h2 className="text-[#111111] font-bold text-[18px] mb-8">
              Saved Notes - Day {activeLessonId < 10 ? \`0\${activeLessonId}\` : activeLessonId}
            </h2>

            {/* Deck of Cards */}
            <div className="relative flex-1 flex items-center justify-center my-8" style={{ perspective: '1000px' }}>
              
              {/* Outer navigation arrows */}
              <button 
                onClick={handlePrior}
                disabled={safeIndex === 0}
                className="absolute left-4 z-20 w-12 h-12 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center text-[#111] hover:bg-gray-50 disabled:opacity-30 transition-all active:scale-95"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button 
                onClick={handleNext}
                disabled={safeIndex === activeNotes.length - 1}
                className="absolute right-4 z-20 w-12 h-12 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center text-[#111] hover:bg-gray-50 disabled:opacity-30 transition-all active:scale-95"
              >
                <ChevronRight size={24} />
              </button>

              {/* Cards */}
              <div className="relative w-full max-w-[500px] h-[350px]">
                {activeNotes.map((note: any, index: number) => {
                  const offset = index - safeIndex;
                  const absOffset = Math.abs(offset);
                  const isVisible = absOffset < 4; // Show up to 3 cards on each side
                  
                  if (!isVisible) return null;

                  // Calculate transforms based on offset
                  const translateX = offset * 45; // Pixels to shift left/right
                  const scale = 1 - (absOffset * 0.05); // Scale down slightly
                  const zIndex = 10 - absOffset;
                  const opacity = 1 - (absOffset * 0.15);
                  const isFront = offset === 0;

                  return (
                    <div 
                      key={note.id}
                      className="absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                      style={{
                        transform: \`translateX(\${translateX}px) scale(\${scale})\`,
                        zIndex,
                        opacity,
                        pointerEvents: isFront ? 'auto' : 'none',
                      }}
                    >
                      {/* Actual Card */}
                      <div 
                        className="w-full h-full rounded-xl shadow-lg border border-black/5 relative overflow-hidden flex flex-col p-8"
                        style={{ backgroundColor: note.color || '#fef3c7' }}
                      >
                        {/* Folded corner trick using CSS clip-path and a shadow triangle */}
                        <div 
                          className="absolute top-0 right-0 w-10 h-10 overflow-hidden"
                          style={{
                            background: 'linear-gradient(225deg, transparent 50%, rgba(0,0,0,0.1) 50%)',
                            borderBottomLeftRadius: '8px'
                          }}
                        />
                        <div 
                          className="absolute top-0 right-0 w-10 h-10 bg-white"
                          style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                        />

                        {isFront && (
                          <div className="flex justify-between items-start mb-6">
                            <h3 className="font-bold text-[#111] text-[18px]">
                              Note {index < 9 ? \`0\${index + 1}\` : index + 1}
                            </h3>
                            <button 
                              onClick={handleDelete} 
                              className="text-[#111111] opacity-30 hover:opacity-100 font-bold text-xl leading-none cursor-pointer"
                              title="Delete Note"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        
                        <div 
                          className="text-[14px] leading-relaxed text-[#111] whitespace-pre-wrap flex-1 overflow-y-auto pr-2" 
                          dangerouslySetInnerHTML={{ __html: note.content }} 
                        />
                        
                        {isFront && (
                          <div className="flex justify-between items-center mt-6 pt-4 text-sm font-semibold text-[#111] opacity-60">
                             <button onClick={handlePrior} className="hover:opacity-100 flex items-center gap-1 disabled:opacity-0 transition-opacity" disabled={safeIndex === 0}>
                               <ChevronLeft size={16} /> Prior
                             </button>
                             <button onClick={handleNext} className="hover:opacity-100 flex items-center gap-1 disabled:opacity-0 transition-opacity" disabled={safeIndex === activeNotes.length - 1}>
                               Next <ChevronRight size={16} />
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Input area */}
            <div className="mt-auto relative">
               <input 
                 type="text" 
                 value={newNoteText}
                 onChange={(e) => setNewNoteText(e.target.value)}
                 onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(); }}
                 placeholder={\`Add a new note for Day \${activeLessonId < 10 ? '0' + activeLessonId : activeLessonId}...\`}
                 className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 text-[14px] text-[#111] shadow-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all pr-16"
               />
               <button 
                 onClick={handleAddNote}
                 className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-50 text-blue-600 rounded-lg p-2 font-bold hover:bg-blue-100 transition-colors"
               >
                 Add
               </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[24px] border border-[#EBEBEB] p-16 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-[#111111] mb-3">
              Your copybook is empty
            </h3>
            <p className="text-[#555555] text-lg max-w-[400px] mx-auto">
              When you take a note in a lesson, click the "Save Note" button to keep it here in your copybook.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
