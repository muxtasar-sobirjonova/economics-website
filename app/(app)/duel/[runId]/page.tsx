import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getDuelOutcome } from "@/lib/duel/engine";
import { DuelScoreboard } from "@/components/duel/DuelScoreboard";
import { DuelReviewList } from "@/components/duel/DuelReviewList";

export const metadata: Metadata = { title: "Duel review | That's So Econ" };
export const dynamic = "force-dynamic";

export default async function DuelReviewPage({ params }: { params: { runId: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Null both for a run that is not this player's and one that does not exist
  // — neither is something to explain to a stranger.
  const outcome = await getDuelOutcome(session.user.id, params.runId);
  if (!outcome) notFound();

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[880px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s4">
        <Link href="/duel" className="font-mono text-label uppercase text-accent hover:text-accent-strong">
          ← Duel
        </Link>

        <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s6">
          <DuelScoreboard outcome={outcome} />
        </section>

        {outcome.review ? (
          <DuelReviewList lines={outcome.review} />
        ) : (
          <p className="text-meta text-muted">
            This one is still waiting for a challenger. The answers open once
            somebody has faced the set.
          </p>
        )}
      </div>
    </div>
  );
}
