import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { StaffPermission } from "@prisma/client";
import { actorFor } from "@/lib/staff";
import { can } from "@/lib/permissions";
import { listProblemsSafe } from "@/lib/compete/problemService";
import { ProblemBank } from "@/components/compete/ProblemBank";

export const metadata: Metadata = { title: "Problems | That's So Econ" };
export const dynamic = "force-dynamic";

/**
 * The problem bank.
 *
 * Behind MANAGE_QUESTIONS, and a 404 rather than a refusal for everyone else:
 * a page whose existence is a hint should not be there. Solutions and answer
 * keys live on this page, which is exactly why.
 */
export default async function ProblemsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const actor = await actorFor(session.user.id, session.user.email);
  if (!can(actor, StaffPermission.MANAGE_QUESTIONS)) notFound();

  const mayHost = can(actor, StaffPermission.HOST_COMPETITIONS);
  const { problems, available } = await listProblemsSafe(true);

  const active = problems.filter((p) => p.active);
  const marks = active.reduce((sum, p) => sum + p.maxPoints, 0);

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[880px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s5">
        <header>
          <Link
            href="/compete"
            className="font-mono text-label uppercase text-accent hover:text-accent-strong"
          >
            ← Competitions
          </Link>
          <h1 className="text-h1 font-semibold text-ink mt-s2 pb-[3px]">Problems</h1>
          <p className="text-meta text-muted mt-s2 max-w-[58ch]">
            Written problems, out of a paper. {active.length} live, worth {marks}{" "}
            marks between them. Rooms are opened from{" "}
            <Link href="/compete" className="text-accent hover:text-accent-strong">
              the competitions page
            </Link>
            ; this is where they are written and retired.
          </p>
        </header>

        <ProblemBank
          problems={problems}
          mayHost={mayHost}
          mayWrite
          available={available}
        />
      </div>
    </div>
  );
}
