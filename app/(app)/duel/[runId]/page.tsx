import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getDuelReview } from "@/lib/duel/engine";
import { DuelReviewList } from "@/components/duel/DuelReviewList";

export const metadata: Metadata = { title: "Duel review | That's So Econ" };
export const dynamic = "force-dynamic";

export default async function DuelReviewPage({ params }: { params: { runId: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Returns null both for a duel that is not settled and for one that is not
  // this player's — neither is something to explain to a stranger.
  const lines = await getDuelReview(session.user.id, params.runId);
  if (!lines) notFound();

  const yours = lines.filter((l) => l.yourCorrect).length;
  const theirs = lines.filter((l) => l.theirCorrect).length;

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[880px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s5">
        <header>
          <Link href="/duel" className="font-mono text-label uppercase text-accent hover:text-accent-strong">
            ← Duel
          </Link>
          <h1 className="text-h1 font-semibold text-ink mt-s2 pb-[3px]">
            {yours}–{theirs}
          </h1>
          <p className="text-meta text-muted mt-s2">
            What each of you answered, and why the answer is what it is.
          </p>
        </header>

        <DuelReviewList lines={lines} />
      </div>
    </div>
  );
}
