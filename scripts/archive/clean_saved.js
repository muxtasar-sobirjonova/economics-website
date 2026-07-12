const fs = require('fs');
const path = 'C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/saved/page.tsx';

let content = `"use client";

import React from "react";
import { useGameState, deleteGlobalNote } from "@/lib/progress";
import { LESSONS } from "@/lib/data";

export default function SavedPage() {
  const state = useGameState();
  const globalNotes = state.globalNotes || [];

  // Group notes by lesson
  const notesByLesson = globalNotes.reduce((acc, note) => {
    if (!acc[note.lessonId]) acc[note.lessonId] = [];
    acc[note.lessonId].push(note);
    return acc;
  }, {} as Record<number, typeof globalNotes>);

  const lessonIds = Object.keys(notesByLesson).map(Number).sort((a, b) => a - b);

  return (
    <div className="flex-1 overflow-y-auto p-[32px] bg-[#F8F9FC]">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-[32px] font-[800] text-[#111111] mb-2">
          My Notes
        </h1>
        <p className="text-[#555555] mb-8">
          Review the notes you've saved for later.
        </p>

        {globalNotes.length === 0 ? (
          <div className="bg-white rounded-[24px] border border-[#EBEBEB] p-12 text-center shadow-sm">
            <h3 className="text-xl font-bold text-[#111111] mb-2">
              No notes saved yet
            </h3>
            <p className="text-[#555555]">
              When you take a note in a lesson, click the "Save Note" button to keep it here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {lessonIds.map(lessonId => {
              const lesson = LESSONS.find(l => l.id === lessonId);
              const notes = notesByLesson[lessonId];
              return (
                <div key={lessonId}>
                  <h2 className="text-[#111111] font-bold text-[20px] mb-4 pb-2 border-b border-[#EBEBEB]">
                    Day {lessonId} / {lesson?.title || \`Lesson \${lessonId}\`}
                  </h2>
                  <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                    {notes.map(note => (
                      <div key={note.id} style={{ background: note.color, borderRadius: '8px', padding: '16px', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative', breakInside: 'avoid' }}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] opacity-50">
                            {note.source}
                          </span>
                          <button onClick={() => deleteGlobalNote(note.id)} className="text-[#111111] opacity-30 hover:opacity-100 font-bold leading-none cursor-pointer">×</button>
                        </div>
                        <div className="text-[13px] leading-relaxed text-[#111111] whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: note.content }} />
                        <div className="mt-4 text-[10px] text-[#111111] opacity-40">
                          {new Date(note.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path, content, 'utf8');
console.log('Saved page cleaned');
