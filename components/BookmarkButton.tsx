"use client";

import React, { useTransition, useOptimistic } from "react";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { toggleBookmarkAction } from "@/app/actions/notes";

interface BookmarkButtonProps {
  slug: string;
  initialIsSaved: boolean;
  variant?: 'light' | 'dark';
}

export default function BookmarkButton({ slug, initialIsSaved, variant = 'light' }: BookmarkButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticSaved, setOptimisticSaved] = useOptimistic(
    initialIsSaved,
    (state, newSaved: boolean) => newSaved
  );

  const handleToggleBookmark = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent any parent click handlers from firing
    
    startTransition(async () => {
      const newSavedState = !optimisticSaved;
      setOptimisticSaved(newSavedState);
      
      try {
        await toggleBookmarkAction(slug);
      } catch (error) {
        console.error("Failed to toggle bookmark", error);
        // We can't revert useOptimistic explicitly from catch, it reverts automatically when transition fails
      }
    });
  };

  if (variant === 'dark') {
    return (
      <button
        onClick={handleToggleBookmark}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-gray-50 hover:bg-[#ebebeb] transition-all duration-200 shadow-sm"
        aria-label={optimisticSaved ? "Remove from saved" : "Save card"}
      >
        {optimisticSaved ? (
          <IconBookmarkFilled size={22} color="#7B6FE7" fill="#7B6FE7" />
        ) : (
          <IconBookmark size={22} color="#888" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleBookmark}
      className="absolute top-4 right-4 z-10 p-1 rounded-full bg-transparent hover:bg-brand-primary transition-all duration-200"
      aria-label={optimisticSaved ? "Remove from saved" : "Save card"}
    >
      {optimisticSaved ? (
        <IconBookmarkFilled size={20} className="text-white" />
      ) : (
        <IconBookmark size={20} className="text-white opacity-80 hover:opacity-100" />
      )}
    </button>
  );
}