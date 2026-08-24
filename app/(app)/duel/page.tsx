import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDuelLadder, getRecentDuels, type RecentDuel } from "@/lib/duel/engine";
import { START_RATING, PROVISIONAL_GAMES } from "@/lib/duel/elo";
import { DuelClient } from "@/components/duel/DuelClient";
import { DuelLadder } from "@/components/duel/DuelLadder";
import { RecentDuels } from "@/components/duel/RecentDuels";

export const metadata: Metadata = {
  title: "Duel | That's So Econ",
  description: "Ten questions, one opponent, one rating. The economics ladder.",
};

export const dynamic = "force-dynamic";

export default async function DuelPage({
  searchParams,
}: {
  searchParams?: { face?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  // The ladder is reference data; a failure there must not cost the player the
  // page they came to use.
  let ladder: Awaited<ReturnType<typeof getDuelLadder>> = [];
  let recent: RecentDuel[] = [];
  let me: { rating: number; played: number; won: number; lost: number; drawn: number } | null = null;
  try {
    [ladder, me, recent] = await Promise.all([
      getDuelLadder(20),
      prisma.playerRating.findUnique({
        where: { userId },
        select: { rating: true, played: true, won: true, lost: true, drawn: true },
      }),
      getRecentDuels(userId, 6),
    ]);
  } catch (e) {
    console.error("duel page load failed", e);
  }

  const rating = me?.rating ?? START_RATING;
  const played = me?.played ?? 0;
  const toEstablished = Math.max(0, PROVISIONAL_GAMES - played);

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[880px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s5">
        <header>
          <span className="font-mono text-label uppercase text-faint">
            Rated ladder · economics
          </span>
          <h1 className="text-h1 font-semibold text-ink mt-s2 pb-[3px]">Duel</h1>
          <p className="text-meta text-muted mt-s2 max-w-[56ch]">
            You and one other person answer the same ten questions. Whoever gets
            more right takes the rating — ties go to the faster run.
          </p>
        </header>

        <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
          <div className="flex flex-wrap items-baseline gap-s6">
            <div>
              <div className="font-mono text-h1 text-accent-strong tabular leading-none">{rating}</div>
              <div className="text-label uppercase text-faint mt-s2">Rating</div>
            </div>
            <div>
              <div className="font-mono text-h2 text-ink tabular leading-none">{played}</div>
              <div className="text-label uppercase text-faint mt-s2">Settled</div>
            </div>
            <div>
              <div className="font-mono text-h2 text-ink tabular leading-none">
                {me ? `${me.won}–${me.lost}–${me.drawn}` : "0–0–0"}
              </div>
              <div className="text-label uppercase text-faint mt-s2">W · L · D</div>
            </div>
          </div>

          {toEstablished > 0 && (
            <p className="text-meta text-muted mt-s4 pt-s4 border-t border-line">
              {toEstablished} more {toEstablished === 1 ? "duel" : "duels"} before your
              rating settles. Until then it moves twice as fast in both directions.
            </p>
          )}
        </section>

        <DuelClient rating={rating} played={played} faceRunId={searchParams?.face} />

        <RecentDuels duels={recent} />

        <div>
          <div className="flex items-baseline gap-s4 mb-s3">
            <h2 className="text-h2 font-semibold text-ink whitespace-nowrap">The ladder</h2>
            <span className="h-px bg-line flex-1" />
          </div>
          <DuelLadder
            rows={ladder.map((r) => ({
              userId: r.userId,
              rating: r.rating,
              played: r.played,
              won: r.won,
              lost: r.lost,
              drawn: r.drawn,
              name: r.user?.name ?? null,
            }))}
            meId={userId}
          />
        </div>
      </div>
    </div>
  );
}
