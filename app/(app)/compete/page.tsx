import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { StaffPermission } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { actorFor } from "@/lib/staff";
import { can } from "@/lib/permissions";
import { listCompetitions } from "@/lib/compete/service";
import { listProblemsSafe } from "@/lib/compete/problemService";
import { HostPanel } from "@/components/compete/HostPanel";
import { JoinRoom } from "@/components/compete/JoinRoom";
import { RoomCards } from "@/components/compete/RoomCards";
import { PlayedResults } from "@/components/compete/PlayedResults";

export const metadata: Metadata = {
  title: "Case Competitions | That's So Econ",
  description: "Join a live room with a code. Everyone solves the same problems.",
};

export const dynamic = "force-dynamic";

/**
 * The competitions page.
 *
 * Three questions in the order they get asked: have you been given a code,
 * is anything open, and how did the ones you sat go. The host's own tools sit
 * between the first two and are not there at all for anyone who cannot open a
 * room.
 */
export default async function CompetePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const actor = await actorFor(userId, session.user.email);
  const mayHost = can(actor, StaffPermission.HOST_COMPETITIONS);
  const mayWrite = can(actor, StaffPermission.MANAGE_QUESTIONS);

  const runsRooms = mayHost || mayWrite;

  const [{ open, mine, played }, topicRows, bank] = await Promise.all([
    listCompetitions(userId),
    runsRooms
      ? prisma.duelQuestion.groupBy({
          by: ["topic"],
          where: { active: true },
          _count: { _all: true },
        })
      : Promise.resolve([]),
    runsRooms ? listProblemsSafe() : Promise.resolve({ problems: [], available: true }),
  ]);

  const topics = topicRows
    .map((t) => ({ name: t.topic, count: t._count._all }))
    .sort((a, b) => b.count - a.count);

  const liveRooms = open.filter((c) => c.status === "LOBBY").length;

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[880px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s6">
        <header>
          <h1 className="text-h1 font-bold tracking-tight text-ink pb-[3px]">
            Case Competitions
          </h1>
          <p className="text-meta text-muted mt-s2 max-w-[60ch]">
            Join a live room with a code. Everyone answers the same problems and
            the ranking moves as they go.
          </p>
        </header>

        <JoinRoom liveRooms={liveRooms} />

        <p className="text-meta text-muted -mt-s4">
          No code?{" "}
          <Link href="/practice" className="text-accent hover:text-accent-strong font-semibold">
            Practice on your own
          </Link>
          .
        </p>

        {runsRooms && (
          <HostPanel
            topics={topics}
            problems={bank.problems}
            problemsAvailable={bank.available}
            mayHost={mayHost}
            mayWrite={mayWrite}
          />
        )}

        <section id="open" className="scroll-mt-s5">
          <div className="flex items-center justify-between gap-s4 mb-s4">
            <h2 className="text-h3 font-bold text-ink">Open rooms</h2>
            {open.length > 0 && (
              <span
                className="text-meta font-semibold rounded-full px-s3 py-0.5"
                style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}
              >
                {open.length} {open.length === 1 ? "room" : "rooms"}
              </span>
            )}
          </div>
          <RoomCards
            rooms={open}
            empty="No open rooms. Enter a code above to join one."
          />
        </section>

        {mine.length > 0 && (
          <section>
            <div className="flex items-center justify-between gap-s4 mb-s4">
              <h2 className="text-h3 font-bold text-ink">Rooms you host</h2>
              <span
                className="text-meta font-semibold rounded-full px-s3 py-0.5"
                style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}
              >
                {mine.length}
              </span>
            </div>
            <RoomCards rooms={mine} empty="" />
          </section>
        )}

        {played.length > 0 && (
          <section>
            <div className="flex items-center justify-between gap-s4 mb-s4">
              <h2 className="text-h3 font-bold text-ink">Your results</h2>
              <span className="text-meta text-muted">
                {played.length} {played.length === 1 ? "room" : "rooms"} played
              </span>
            </div>
            <PlayedResults rows={played} />
          </section>
        )}
      </div>
    </div>
  );
}
