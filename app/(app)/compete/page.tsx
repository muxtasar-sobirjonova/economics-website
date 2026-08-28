import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { StaffPermission } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { actorFor } from "@/lib/staff";
import { can } from "@/lib/permissions";
import { listCompetitions } from "@/lib/compete/service";
import { CreateCompetition } from "@/components/compete/CreateCompetition";
import { JoinByCode } from "@/components/compete/JoinByCode";

export const metadata: Metadata = {
  title: "Competitions | That's So Econ",
  description: "Open a room, share a code, and everyone answers the same questions.",
};

export const dynamic = "force-dynamic";

const STATUS_COPY = {
  LOBBY: { label: "Waiting", tone: "reward" },
  RUNNING: { label: "Playing", tone: "success" },
  ENDED: { label: "Finished", tone: "muted" },
} as const;

export default async function CompetePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const actor = await actorFor(userId, session.user.email);
  const mayHost = can(actor, StaffPermission.HOST_COMPETITIONS);

  const [{ open, mine }, topicRows] = await Promise.all([
    listCompetitions(userId),
    mayHost
      ? prisma.duelQuestion.groupBy({
          by: ["topic"],
          where: { active: true },
          _count: { _all: true },
        })
      : Promise.resolve([]),
  ]);

  const topics = topicRows
    .map((t) => ({ name: t.topic, count: t._count._all }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[880px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s5">
        <header>
          <span className="font-mono text-label uppercase text-faint">
            Rooms · unrated
          </span>
          <h1 className="text-h1 font-semibold text-ink mt-s2 pb-[3px]">Competitions</h1>
          <p className="text-meta text-muted mt-s2 max-w-[56ch]">
            Everyone in the room answers the same questions and the standings
            move as they go. Nothing here touches your duel rating, so a host
            can set whatever length they like.
          </p>
        </header>

        <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
          <h2 className="text-label uppercase text-faint mb-s3">Have a code?</h2>
          <JoinByCode />
        </section>

        {mayHost && <CreateCompetition topics={topics} />}

        <Section title="Open now" empty="Nothing is running. If you have a code, use it above." rows={open} />

        {mine.length > 0 && <Section title="Yours" empty="" rows={mine} />}
      </div>
    </div>
  );
}

function Section({
  title,
  empty,
  rows,
}: {
  title: string;
  empty: string;
  rows: {
    code: string; title: string; status: keyof typeof STATUS_COPY;
    topic: string | null; questionCount: number; hostName: string | null; players: number;
  }[];
}) {
  return (
    <section>
      <div className="flex items-baseline gap-s4 mb-s3">
        <h2 className="text-h2 font-semibold text-ink whitespace-nowrap">{title}</h2>
        <span className="h-px bg-line flex-1" />
      </div>

      {rows.length === 0 ? (
        empty ? (
          <p className="text-meta text-muted">{empty}</p>
        ) : null
      ) : (
        <ul className="list-none m-0 p-0 rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
          {rows.map((c) => {
            const s = STATUS_COPY[c.status];
            return (
              <li key={c.code}>
                <Link
                  href={`/compete/${c.code}`}
                  className="grid grid-cols-[1fr_auto] gap-s3 items-center px-s4 py-s3 border-t border-line first:border-t-0 hover:bg-bg-sunk transition-colors"
                >
                  <span className="min-w-0">
                    <span className="block text-ui text-ink truncate pb-[2px]">{c.title}</span>
                    <span className="block font-mono text-label uppercase text-faint truncate">
                      {c.hostName || "Anonymous"} · {c.questionCount} questions
                      {c.topic ? ` · ${c.topic}` : ""} · {c.players} in
                    </span>
                  </span>
                  <span className="flex items-center gap-s3 shrink-0">
                    <span
                      className="text-label uppercase px-s2 py-1 rounded-sm"
                      style={{ background: `var(--${s.tone}-soft)`, color: `var(--${s.tone})` }}
                    >
                      {s.label}
                    </span>
                    <span className="font-mono text-meta text-muted tracking-[0.15em]">{c.code}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
