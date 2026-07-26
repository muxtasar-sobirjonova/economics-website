"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markArticleDoneAction } from "@/app/actions/agenda";

/**
 * Wraps the "Next: Articles →" link.
 * Fires markArticleDoneAction ONLY when the user intentionally clicks,
 * not as a server-render side-effect.
 */
export function MarkReadButton({ lessonId, isArticle }: { lessonId: string, isArticle?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // Optimistic Navigation: Immediately go to next page
    router.push(`/lessons/${lessonId}/${isArticle ? 'quizzes' : 'articles'}`);
    
    // Background the save action
    startTransition(async () => {
      try {
        const res = await markArticleDoneAction(lessonId);
        if (!res.success) {
          console.error("Failed to mark done:", res.error);
        }
      } catch {
        // Non-critical — don't block navigation on failure
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="bg-brand-primary text-white hover:bg-[#5A4FBD] px-7 py-3 rounded-lg font-[700] text-sm transition-all shadow-sm active:scale-95 disabled:opacity-70 flex items-center gap-2"
    >
      {isPending ? "Saving…" : (isArticle ? "Next: Quizzes →" : "Next: Articles →")}
    </button>
  );
}
