import React from "react";
import Link from "next/link";

interface LessonHeaderProps {
  lessonId: string | number;
  activeTab: "concepts" | "articles" | "quizzes";
  avatarLetter: string;
}

export function LessonHeader({ lessonId, activeTab, avatarLetter }: LessonHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 flex items-center justify-between px-10 py-4">
      <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
        <Link href="/roadmap" className="flex items-center hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
          Roadmap
        </Link>
        
        <div className="relative flex flex-col items-center">
          <Link 
            href={`/lessons/${lessonId}/concepts`} 
            className={`transition-colors pb-2 ${activeTab === 'concepts' ? 'text-[#1F2937] font-bold' : 'hover:text-black'}`}
          >
            Concepts
          </Link>
          {activeTab === 'concepts' && (
            <div className="absolute bottom-0 w-full h-[3px] bg-[#111827] rounded-t-md"></div>
          )}
        </div>

        <div className="relative flex flex-col items-center">
          <Link 
            href={`/lessons/${lessonId}/articles`} 
            className={`transition-colors pb-2 ${activeTab === 'articles' ? 'text-[#1F2937] font-bold' : 'hover:text-black'}`}
          >
            Articles
          </Link>
          {activeTab === 'articles' && (
            <div className="absolute bottom-0 w-full h-[3px] bg-[#111827] rounded-t-md"></div>
          )}
        </div>

        <div className="relative flex flex-col items-center">
          <Link 
            href={`/lessons/${lessonId}/quizzes`} 
            className={`transition-colors pb-2 ${activeTab === 'quizzes' ? 'text-[#1F2937] font-bold' : 'hover:text-black'}`}
          >
            Quizzes
          </Link>
          {activeTab === 'quizzes' && (
            <div className="absolute bottom-0 w-full h-[3px] bg-[#111827] rounded-t-md"></div>
          )}
        </div>

        <Link href="/saved" className="hover:text-black transition-colors pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
          My Notes
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-brand-primary text-white shadow-sm cursor-pointer hover:opacity-90 transition-all">
          {avatarLetter}
        </div>
      </div>
    </header>
  );
}
