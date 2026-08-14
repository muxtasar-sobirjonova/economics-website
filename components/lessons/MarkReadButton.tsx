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
      className="px-s5 py-s3 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors disabled:opacity-60 min-h-[44px] flex items-center gap-s2 shrink-0"
    >
      {isPending ? "Saving…" : (isArticle ? "Next: Quiz" : "Next: Article")}
      <span aria-hidden>&rarr;</span>
    </button>
  );
}
