import React from 'react';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { ThemeToggle } from '@/components/ThemeToggle';
import SignOutButton from '@/components/profile/SignOutButton'; // We'll create this to handle sign out safely on client

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      progress: true
    }
  });

  if (!user) {
    redirect('/login');
  }

  const avatarLetter = (user.name?.trim().charAt(0) || user.email?.trim().charAt(0) || "?").toUpperCase();
  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Format track name to look nice (e.g. ENTREPRENEURSHIP_ECONOMICS -> Entrepreneurship Economics)
  const trackName = (user.activeTrack || 'No track selected')
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');

  const trackProgress = user.activeTrack
    ? await prisma.trackProgress.findUnique({
        where: { userId_track: { userId: user.id, track: user.activeTrack } },
        select: { xp: true },
      })
    : null;

  const totalXP = trackProgress?.xp ?? 0;
  const buildings = user.lessonsCompleted ?? 0;
  const signInMethod = user.password ? "Email and password" : "Google";

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-center justify-between gap-s4 px-s5 py-s4 border-t border-line first:border-t-0">
      <span className="text-meta text-muted shrink-0">{label}</span>
      <span className="text-ui text-ink text-right min-w-0 truncate">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg bg-sky flex flex-col">
      <PageHeader eyebrow="Account" title="My profile" />

      <main className="flex-1 w-full max-w-[720px] mx-auto px-s4 md:px-s5 py-s5 flex flex-col gap-s4">
        {/* Identity */}
        <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5 flex items-center gap-s4">
          <span className="w-14 h-14 rounded-full bg-accent text-on-accent grid place-items-center font-semibold text-h2 shrink-0">
            {avatarLetter}
          </span>
          <div className="min-w-0">
            <h2 className="text-h2 font-semibold text-ink pb-[2px] truncate">{user.name || "Student"}</h2>
            <p className="text-meta text-muted">Joined {joinedDate}</p>
          </div>
        </section>

        {/* Figures */}
        <section className="grid grid-cols-2 gap-s3">
          <div className="rounded-lg border border-transparent shadow-sh1 p-s5" style={{ background: "var(--reward-soft)" }}>
            <div className="text-label uppercase" style={{ color: "var(--reward)" }}>Total XP</div>
            <div className="font-mono text-h1 text-ink tabular leading-none mt-s3">{totalXP.toLocaleString()}</div>
          </div>
          <div className="rounded-lg border border-transparent shadow-sh1 p-s5" style={{ background: "var(--quiz-soft)" }}>
            <div className="text-label uppercase" style={{ color: "var(--quiz)" }}>Buildings</div>
            <div className="font-mono text-h1 text-ink tabular leading-none mt-s3">{buildings}</div>
          </div>
        </section>

        {/* Details */}
        <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
          <h2 className="text-label uppercase text-faint px-s5 pt-s4 pb-s3">Account details</h2>
          <Row label="Email" value={user.email || "\u2014"} />
          <Row label="Sign-in" value={signInMethod} />
          <Row label="Current track" value={trackName} />
          <div className="flex items-center justify-between gap-s4 px-s5 py-s4 border-t border-line flex-wrap">
            <span className="text-meta text-muted shrink-0">Appearance</span>
            <ThemeToggle />
          </div>
        </section>

        <div className="flex flex-wrap gap-s3">
          <Link
            href="/track-selection"
            className="px-s5 py-s3 rounded-md border border-line-strong text-ink text-ui font-medium hover:border-accent hover:text-accent transition-colors min-h-[44px] flex items-center"
          >
            Change track
          </Link>
          <SignOutButton />
        </div>
      </main>
    </div>
  );
}
