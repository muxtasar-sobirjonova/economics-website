import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { assess, sortByAttention, summarise, CHANCE_RATE } from "@/lib/duel/calibration";
import { BankTable } from "@/components/duel/BankTable";

export const metadata: Metadata = { title: "Question bank | That's So Econ" };
export const dynamic = "force-dynamic";

export default async function BankPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Not "forbidden": a page whose existence is itself a hint should simply
  // not be there for anyone who may not use it.
  if (!isAdmin(session.user.email)) notFound();

  const rows = await prisma.duelQuestion.findMany({
    select: {
      id: true,
      topic: true,
      questionText: true,
      timesServed: true,
      timesCorrect: true,
      active: true,
    },
  });

  const assessed = sortByAttention(rows.map(assess));
  const s = summarise(assessed);

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[1000px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s5">
        <header>
          <Link href="/duel" className="font-mono text-label uppercase text-accent hover:text-accent-strong">
            ← Duel
          </Link>
          <h1 className="text-h1 font-semibold text-ink mt-s2 pb-[3px]">Question bank</h1>
          <p className="text-meta text-muted mt-s2 max-w-[62ch]">
            Four options means guessing scores {Math.round(CHANCE_RATE * 100)}%. A
            question landing well under that is usually not hard — it is keyed
            wrong, and every player who knew the answer lost a point for it.
          </p>
        </header>

        <section className="grid grid-cols-2 sm:flex border border-line rounded-lg bg-surface shadow-sh1 overflow-hidden">
          <Stat label="Questions" value={`${s.active}`} hint={s.total !== s.active ? `${s.total - s.active} retired` : undefined} />
          <Stat label="Judged" value={`${s.judged}`} hint={`${s.total - s.judged} need plays`} />
          <Stat
            label="Check the key"
            value={`${s.suspect}`}
            hint={s.suspect > 0 ? "Look at these first" : "None"}
            tone={s.suspect > 0 ? "danger" : undefined}
          />
          <Stat
            label="Bank accuracy"
            value={s.meanRate === null ? "—" : `${Math.round(s.meanRate * 100)}%`}
            hint={
              s.meanRate === null
                ? "No data yet"
                : s.meanRate < CHANCE_RATE + 0.05
                  ? "At guessing level"
                  : "Above guessing"
            }
            tone={s.meanRate !== null && s.meanRate < CHANCE_RATE + 0.05 ? "danger" : undefined}
          />
        </section>

        <BankTable rows={assessed} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: string;
}) {
  return (
    <div className="px-s4 py-s3 border-b border-r border-line sm:border-b-0 last:border-r-0 sm:flex-1 min-w-0">
      <div className="text-label uppercase text-faint">{label}</div>
      <div
        className="font-mono text-h2 tabular leading-none mt-s2"
        style={{ color: tone ? `var(--${tone})` : "var(--text)" }}
      >
        {value}
      </div>
      {hint && <div className="text-meta text-muted mt-s2">{hint}</div>}
    </div>
  );
}
