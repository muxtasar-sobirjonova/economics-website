import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/profile/SignOutButton";
import { Page, PageHead, Card, StatTiles } from "@/components/ui/Page";

export const metadata: Metadata = { title: "Profile | That's So Econ" };
export const dynamic = "force-dynamic";

const ICON = {
  award: '<circle cx="12" cy="9" r="6"/><path d="M8.2 14L7 22l5-3 5 3-1.2-8"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 8l9 6 9-6"/>',
};

/**
 * The profile.
 *
 * Reached from the person at the foot of the rail, which is where people look
 * for it. It used to carry its own header with a back arrow pointing at "/" —
 * the marketing site — which was right when this page stood alone and wrong
 * ever since it moved inside the app shell.
 */
export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { progress: true },
  });

  if (!user) redirect("/login");

  const name = user.name?.trim() || "Student";
  const initial = (name.charAt(0) || user.email?.charAt(0) || "?").toUpperCase();
  const joined = new Date(user.createdAt).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const track = (user.activeTrack || "No track selected")
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");

  return (
    <Page>
      <PageHead title="Your profile" lead="What the course knows about you, and the one setting that changes what it teaches." />

      <Card padded className="flex flex-col sm:flex-row items-center sm:items-start gap-s5 text-center sm:text-left">
        <span
          className="w-20 h-20 rounded-full grid place-items-center font-reading font-semibold text-h1 shrink-0"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          aria-hidden
        >
          {initial}
        </span>

        <div className="min-w-0">
          <h2 className="font-reading text-h2 font-semibold tracking-tight text-ink break-words">
            {name}
          </h2>
          <p className="flex items-center justify-center sm:justify-start gap-s2 text-ui text-muted mt-s2 break-all">
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden
              className="shrink-0"
              dangerouslySetInnerHTML={{ __html: ICON.mail }}
            />
            {user.email || "No email on file"}
          </p>
        </div>
      </Card>

      <div className="mt-s4">
        <StatTiles
          stats={[
            { label: "Lessons finished", value: user.lessonsCompleted ?? 0, icon: ICON.award, good: true },
            { label: "Experience", value: (user.progress?.totalXP ?? 0).toLocaleString("en-US"), icon: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
            { label: "Streak", value: `${user.progress?.streak ?? 0} days`, icon: '<path d="M12 2c1 3.5 5 5.5 5 10a5 5 0 01-10 0c0-1.7.8-3 1.8-4 .2 1.2.9 2 1.7 2.3C10 7.5 10.5 4.5 12 2z"/>' },
            { label: "Joined", value: joined, icon: ICON.clock },
          ]}
        />
      </div>

      <Card padded className="flex flex-wrap items-center gap-s4 justify-between">
        <span className="flex items-center gap-s3 min-w-0">
          <span
            className="w-10 h-10 rounded-md grid place-items-center shrink-0"
            style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}
            aria-hidden
          >
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: ICON.compass }}
            />
          </span>
          <span className="min-w-0">
            <span className="block text-meta text-muted">Current track</span>
            <b className="block text-ui font-semibold text-ink truncate">{track}</b>
          </span>
        </span>

        <Link
          href="/track-selection"
          className="inline-flex items-center min-h-[44px] px-s5 rounded-md border border-line text-ui font-semibold transition-colors hover:bg-bg-sunk"
          style={{ color: "var(--accent-strong)" }}
        >
          Change track
        </Link>
      </Card>

      <div className="mt-s5">
        <SignOutButton />
      </div>
    </Page>
  );
}
