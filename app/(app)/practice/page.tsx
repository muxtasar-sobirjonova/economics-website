import { Metadata } from "next";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPracticeOverview, practiceHistory } from "@/lib/compete/practiceService";

/**
 * Practice — the problem bank, on your own, whenever you like.
 *
 * Its own page rather than a tab inside /duel or /compete, because it is
 * neither of those things: a duel is rated and a competition has a host, and
 * this has no clock, no opponent, no standing and nothing at stake. Folding it
 * into either would have made that page mean two things.
 *
 * KaTeX is loaded with the interactive part rather than with the page, for the
 * reason it was split out of /compete: it is most of the bundle and none of it
 * is needed until a problem is on screen.
 */

const Practice = dynamicImport(
  () => import("@/components/compete/Practice").then((m) => m.Practice),
  { loading: () => <div className="h-[200px] rounded-lg border border-line bg-raised" /> }
);

const PracticeHistory = dynamicImport(
  () => import("@/components/compete/PracticeHistory").then((m) => m.PracticeHistory)
);

export const metadata: Metadata = { title: "Practice | That's So Econ" };
export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [overview, history] = await Promise.all([
    getPracticeOverview(session.user.id),
    practiceHistory(session.user.id),
  ]);

  const { totals } = overview;

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[760px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s5">
        <header className="min-w-0">
          <h1 className="text-h1 font-semibold text-ink pb-[3px] break-words">Practice</h1>
          <p className="text-meta text-muted mt-s2 max-w-[58ch]">
            Problems out of past papers, one at a time, marked as soon as you
            answer. Nothing here is timed, watched or ranked — for that, there is{" "}
            <Link href="/compete" className="text-accent hover:text-accent-strong">
              a competition
            </Link>{" "}
            or{" "}
            <Link href="/duel" className="text-accent hover:text-accent-strong">
              a duel
            </Link>
            .
          </p>

          {totals.attempted > 0 && (
            <p className="text-meta text-faint mt-s3">
              {totals.attempted} worked · {totals.points}/{totals.outOf} marks ·{" "}
              {totals.fullMarks} full
            </p>
          )}
        </header>

        <Practice overview={overview} />

        <PracticeHistory attempts={history} />
      </div>
    </div>
  );
}
