import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { StaffPermission } from "@prisma/client";
import { actorFor } from "@/lib/staff";
import { can } from "@/lib/permissions";
import { listProblemsSafe } from "@/lib/compete/problemService";
import { ProblemWorkspace } from "@/components/compete/ProblemWorkspace";

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

  return (
    // Full bleed and full height: this is a workspace, not an article. The
    // page chrome is the workspace's own top bar, and the two panels do their
    // own scrolling. On a phone the shell has to make room for the header and
    // the bottom nav, which the app layout pads for but cannot size against.
    <div className="h-[calc(100dvh-9rem)] md:h-full">
      <ProblemWorkspace
        problems={problems}
        mayHost={mayHost}
        mayWrite
        available={available}
      />
    </div>
  );
}
