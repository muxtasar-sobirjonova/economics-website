"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { saveDailyChallengeThought } from "@/app/(app)/home/actions";

export function DailyChallengeInput({ 
  challengeId, 
  initialContent = "" 
}: { 
  challengeId: string; 
  initialContent?: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(42, textareaRef.current.scrollHeight)}px`;
    }
  }, [content]);

  useEffect(() => {
    if (content === initialContent) return;

    const handler = setTimeout(() => {
      setSaveStatus("Saving...");
      startTransition(async () => {
        try {
          await saveDailyChallengeThought(content, challengeId);
          setSaveStatus("Saved");
          setTimeout(() => setSaveStatus(""), 2000);
        } catch (error) {
          console.error(error);
          setSaveStatus("Failed");
        }
      });
    }, 1000);

    return () => clearTimeout(handler);
  }, [content, challengeId, initialContent]);

  return (
    <div className="relative w-full group">
      <div className="absolute left-4 top-[10px] pointer-events-none opacity-40">
        ✏️
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts here..."
        className="w-full bg-slate-50 border border-transparent rounded-[24px] py-[11px] pl-10 pr-4 text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all resize-none overflow-hidden leading-tight"
        style={{ minHeight: '42px' }}
      />
      {saveStatus && (
        <div className="absolute right-4 bottom-2.5 text-[10px] font-bold text-slate-300 pointer-events-none">
          {saveStatus}
        </div>
      )}
    </div>
  );
}
