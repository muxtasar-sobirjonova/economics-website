import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getCompetition } from "@/lib/compete/service";
import { Lobby } from "@/components/compete/Lobby";

export const metadata: Metadata = { title: "Competition | That's So Econ" };
export const dynamic = "force-dynamic";

export default async function CompetitionPage({ params }: { params: { code: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const view = await getCompetition(session.user.id, params.code);
  if (!view) notFound();

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[820px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s4">
        <header>
          <Link href="/compete" className="font-mono text-label uppercase text-accent hover:text-accent-strong">
            ← Competitions
          </Link>
          <h1 className="text-h1 font-semibold text-ink mt-s2 pb-[3px] break-words">{view.title}</h1>
          <p className="text-meta text-muted mt-s2">
            Hosted by {view.isHost ? "you" : view.hostName || "Anonymous"} · unrated
          </p>
        </header>

        {view.status === "ENDED" ? (
          <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s6 text-center">
            <h2 className="text-h3 font-semibold text-ink">This competition has finished</h2>
            <p className="text-meta text-muted mt-s2">
              Final standings and answers arrive with the next piece of work.
            </p>
          </section>
        ) : view.status === "RUNNING" ? (
          <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s6 text-center">
            <h2 className="text-h3 font-semibold text-ink">Under way</h2>
            <p className="text-meta text-muted mt-s2 max-w-[46ch] mx-auto">
              {view.standings.length} in the room. Playing is not wired up yet —
              that is the next stage.
            </p>
          </section>
        ) : (
          <Lobby view={view} />
        )}
      </div>
    </div>
  );
}
