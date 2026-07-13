"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toggleBookmarkAction } from "@/app/actions/notes";

/**
 * Client-side bookmark toggle for the read page.
 * Replaces the non-interactive server-rendered Bookmark icon.
 */
export function ReadPageBookmark({
  slug,
  initialIsBookmarked,
}: {
  slug: string;
  initialIsBookmarked: boolean;
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const next = !isBookmarked;
    setIsBookmarked(next); // optimistic update
    startTransition(async () => {
      try {
        await toggleBookmarkAction(slug);
      } catch {
        setIsBookmarked(!next); // revert on failure
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this lesson"}
      className="p-2 rounded-full hover:bg-brand-primary/10 transition-colors disabled:opacity-50"
    >
      <Bookmark
        size={20}
        color="#7B6FE7"
        fill={isBookmarked ? "#7B6FE7" : "none"}
        strokeWidth={2}
      />
    </button>
  );
}
