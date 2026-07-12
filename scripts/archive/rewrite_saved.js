const fs = require('fs');
const path = 'C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/saved/page.tsx';

const content = `"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGameState, deleteGlobalNote } from "@/lib/progress";
import { ALL_CONTENT, LESSONS } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";

export default function SavedPage() {
  const state = useGameState();
  const savedSlugs = state.savedArticles || [];
  const globalNotes = state.globalNotes || [];

  const [activeTab, setActiveTab] = useState<'notes'|'articles'>('notes');

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
          Review the notes and articles you've saved for later.
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#EBEBEB]">
          <button 
            onClick={() => setActiveTab('notes')}
            className={\`pb-2 font-bold \${activeTab === 'notes' ? 'text-[#3D52A0] border-b-2 border-[#3D52A0]' : 'text-[#888888] hover:text-[#111111]'}\`}
          >
            Saved Notes
          </button>
          <button 
            onClick={() => setActiveTab('articles')}
            className={\`pb-2 font-bold \${activeTab === 'articles' ? 'text-[#3D52A0] border-b-2 border-[#3D52A0]' : 'text-[#888888] hover:text-[#111111]'}\`}
          >
            Saved Articles
          </button>
        </div>

        {activeTab === 'notes' ? (
          globalNotes.length === 0 ? (
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
          )
        ) : (
          savedSlugs.length === 0 ? (
            <div className="bg-white rounded-[24px] border border-[#EBEBEB] p-12 text-center shadow-sm">
              <h3 className="text-xl font-bold text-[#111111] mb-2">
                No saved articles yet
              </h3>
              <p className="text-[#555555]">
                When you find something interesting, click the bookmark icon to keep it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSlugs.map((slug: string) => {
                if (slug.startsWith("lesson-")) {
                  const parts = slug.split("-");
                  const lessonId = parseInt(parts[1]);
                  const type = parts[2] || "articles";
                  const lesson = LESSONS.find((l: any) => l.id === lessonId);

                  const typeDisplay =
                    type === "concepts"
                      ? "Concept"
                      : type === "examples"
                        ? "Real-World Example"
                        : "Article";

                  return (
                    <Link
                      key={slug}
                      href={\`/lessons/\${lessonId}/\${type}/read\`}
                      className="group block bg-white rounded-xl border border-[#EBEBEB] p-6 hover:shadow-sm transition-shadow h-full flex flex-col"
                    >
                      <div className="mb-4">
                        <span className="inline-block bg-[#E0E7FF] text-[#3D52A0] text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          {typeDisplay}
                        </span>
                      </div>

                      <h2 className="font-semibold text-[#111111] text-lg leading-snug mb-2 group-hover:text-[#3D52A0] transition-colors">
                        {lesson?.title || \`Lesson \${lessonId} \${typeDisplay}\`}
                      </h2>

                      <p className="text-[#555555] text-sm mt-2 line-clamp-3 mb-6 flex-1">
                        {lesson?.subtitle || \`A saved \${typeDisplay.toLowerCase()} from Lesson \${lessonId}.\`}
                      </p>

                      <div className="flex items-center justify-between border-t border-[#EBEBEB] pt-4 mt-auto">
                        <span className="text-[#3D52A0] text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform ml-auto">
                          Read more <span className="ml-1">→</span>
                        </span>
                      </div>
                    </Link>
                  );
                }

                // Fallback for legacy ALL_CONTENT slugs
                const article = ALL_CONTENT.find((item) => item.slug === slug);
                if (article) {
                  return (
                    <ArticleCard
                      key={slug}
                      article={{ ...article, slug: { current: article.slug } } as any}
                    />
                  );
                }
                return null;
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
