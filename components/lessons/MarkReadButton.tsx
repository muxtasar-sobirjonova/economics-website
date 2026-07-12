"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { markArticleDoneAction } from "@/app/actions/progress";

/**
 * Wraps the "Next: Articles →" link.
 * Fires markArticleDoneAction ONLY when the user intentionally clicks,
 * not as a server-render side-effect.
 */
export function MarkReadButton({ lessonId, isArticle }: { lessonId: string, isArticle?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hasTicked, setHasTicked] = useState(false);

  const handleClick = () => {
    startTransition(async () => {
      try {
        await markArticleDoneAction(lessonId);
        setHasTicked(true);
      } catch {
        // Non-critical — don't block navigation on failure
      }
      router.push(`/lessons/${lessonId}/${isArticle ? 'quizzes' : 'articles'}`);
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
