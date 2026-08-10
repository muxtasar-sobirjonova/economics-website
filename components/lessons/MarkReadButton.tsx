"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markArticleDoneAction, markConceptDoneAction } from "@/app/actions/agenda";

/**
 * Wraps the "Next: …" link at the bottom of a Concepts / Articles page.
 * Ticks the matching row of Today's Agenda ONLY when the user intentionally
 * clicks — not as a server-render side-effect.
 */
export function MarkReadButton({ lessonId, isArticle }: { lessonId: string, isArticle?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const res = isArticle
          ? await markArticleDoneAction(lessonId)
          : await markConceptDoneAction(lessonId);
        if (!res.success) {
          console.error("Failed to mark done:", res.error);
        }
      } catch {
        // Non-critical — never block navigation on a failed tick.
      }
      router.push(`/lessons/${lessonId}/${isArticle ? 'quizzes' : 'articles'}`);
      router.refresh();
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
