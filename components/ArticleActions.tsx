"use client";

import React, { useState, useTransition } from "react";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconCheck,
} from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { toggleBookmarkAction } from "@/app/actions/progress";

export default function ArticleActions({ initialSaved = false }: { initialSaved?: boolean }) {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isDone, setIsDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggleSave = () => {
    setIsSaved(!isSaved); // Optimistic
    startTransition(async () => {
      try {
        await toggleBookmarkAction(slug);
      } catch (err) {
        setIsSaved(isSaved); // Revert
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToggleSave}
        disabled={isPending}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-[700] text-[13px] transition-all border ${
          isSaved
            ? "bg-[rgba(200,217,230,0.4)] text-[#4ebdd5] border-tide-mint"
            : "bg-white text-[#4ebdd5] border-sky-blue hover:border-tide-mint hover:text-[#4ebdd5]"
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSaved ? (
          <IconBookmarkFilled size={16} />
        ) : (
          <IconBookmark size={16} />
        )}
        {isSaved ? "Saved" : "Save"}
      </button>

      <button
        onClick={() => setIsDone(!isDone)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-[700] text-[13px] transition-all border ${
          isDone
            ? "bg-[#10b981] text-white border-[#10b981]"
            : "bg-white text-[#4ebdd5] border-sky-blue hover:border-[#10b981] hover:text-[#10b981]"
        }`}
      >
        <IconCheck size={16} stroke={isDone ? 3 : 2.5} />
        {isDone ? "Done" : "Mark as Done"}
      </button>
    </div>
  );
}
