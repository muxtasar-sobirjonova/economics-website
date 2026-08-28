import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { StaffPermission } from "@prisma/client";
import { actorFor, listStaff } from "@/lib/staff";
import { can, grantable } from "@/lib/permissions";
import { adminEmails } from "@/lib/admin";
import { StaffManager } from "@/components/admin/StaffManager";

export const metadata: Metadata = { title: "Admins | That's So Econ" };
export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const actor = await actorFor(session.user.id, session.user.email);
  // Not "forbidden": a page whose existence is a hint should not be there.
  if (!can(actor, StaffPermission.MANAGE_ADMINS)) notFound();

  const staff = await listStaff();

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[820px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s5">
        <header>
          <Link href="/compete" className="font-mono text-label uppercase text-accent hover:text-accent-strong">
            ← Competitions
          </Link>
          <h1 className="text-h1 font-semibold text-ink mt-s2 pb-[3px]">Admins</h1>
          <p className="text-meta text-muted mt-s2 max-w-[58ch]">
            Rights are handed out one at a time. An admin can only grant what
            they hold themselves, and nobody can edit their own — that is the
            rule that stops a single mistake becoming everyone&apos;s problem.
          </p>
        </header>

        <StaffManager
          staff={staff}
          grantable={grantable(actor)}
          meId={session.user.id}
          ownerEmails={adminEmails()}
        />
      </div>
    </div>
  );
}
