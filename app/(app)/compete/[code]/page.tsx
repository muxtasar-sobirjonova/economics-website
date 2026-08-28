import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import {
  getCompetition,
  getPlaySession,
  getCompetitionReview,
} from "@/lib/compete/service";
import { Lobby } from "@/components/compete/Lobby";
import { CompetitionPlay } from "@/components/compete/CompetitionPlay";
import { Standings } from "@/components/compete/Standings";
import { HostControls } from "@/components/compete/HostControls";
import { DuelReviewList } from "@/components/duel/DuelReviewList";

export const metadata: Metadata = { title: "Competition | That's So Econ" };
export const dynamic = "force-dynamic";

export default async function CompetitionPage({ params }: { params: { code: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const view = await getCompetition(userId, params.code);
  if (!view) notFound();

  const shell = (children: React.ReactNode) => (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[820px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s4">
        <header>
          <Link href="/compete" className="font-mono text-label uppercase text-accent hover:text-accent-strong">
            ← Competitions
          </Link>
          <h1 className="text-h1 font-semibold text-ink mt-s2 pb-[3px] break-words">{view.title}</h1>
          <p className="text-meta text-muted mt-s2">
            Hosted by {view.isHost ? "you" : view.hostName || "Anonymous"} ·{" "}
            {view.questionCount} questions · unrated
          </p>
        </header>
        {children}
      </div>
    </div>
  );

  if (view.status === "LOBBY") return shell(<Lobby view={view} />);

  if (view.status === "ENDED") {
    const review = await getCompetitionReview(userId, view.id);
    const podium = view.standings.slice(0, 3);

    return shell(
      <>
        <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
          <div className="px-s4 py-s3 border-b border-line bg-bg-sunk">
            <h2 className="text-label uppercase text-faint">
              Final · {view.standings.length} played
            </h2>
          </div>
          <Standings rows={view.standings} meId={userId} questionCount={view.questionCount} />
        </section>

        {podium.length > 0 && (
          <p className="text-meta text-muted">
            {podium[0].name || "Anonymous"} took it with {podium[0].score} of {view.questionCount}.
          </p>
        )}

        {review ? (
          <DuelReviewList lines={review} />
        ) : (
          <p className="text-meta text-muted">You did not play this one.</p>
        )}
      </>
    );
  }

  // RUNNING
  const play = view.joined ? await getPlaySession(userId, view.code) : null;

  return shell(
    <>
      {view.isHost && <HostControls id={view.id} progress={view.progress} />}

      {play ? (
        <CompetitionPlay session={play} meId={userId} />
      ) : (
        <>
          <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s6 text-center">
            <h2 className="text-h3 font-semibold text-ink">Already under way</h2>
            <p className="text-meta text-muted mt-s3 max-w-[44ch] mx-auto">
              You can still join — arriving late costs you nothing but the time
              already on the clock.
            </p>
            <Lobby view={view} />
          </section>
        </>
      )}
    </>
  );
}
