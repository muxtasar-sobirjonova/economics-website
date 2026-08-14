import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { IconChevronDown } from '@tabler/icons-react';
import { unstable_noStore as noStore } from 'next/cache';
import { MobileProfileMenu } from './MobileProfileMenu';

const TRACK_LABEL: Record<string, string> = {
  ENTREPRENEURSHIP_ECONOMICS: 'Entrepreneurship',
  DEVELOPMENT_ECONOMICS: 'Development',
  BEHAVIORAL_ECONOMICS: 'Behavioral',
};

export default async function MobileHeader() {
  noStore();
  const session = await auth();
  if (!session?.user?.id) return null;

  const userRecord = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { activeTrack: true }
  });

  const activeTrack = userRecord?.activeTrack;
  const trackProg = activeTrack ? await prisma.trackProgress.findUnique({
    where: { userId_track: { userId: session.user.id, track: activeTrack } },
    select: { xp: true }
  }) : null;

  const totalXP = trackProg?.xp || 0;
  const trackLabel = activeTrack ? (TRACK_LABEL[activeTrack] ?? 'Economics') : 'Pick a track';

  const avatarLetter = (session.user?.name?.trim().charAt(0) || session.user?.email?.trim().charAt(0) || "?").toUpperCase();

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-surface border-b border-line z-50 flex items-center justify-between px-s4">
      {/* Track switcher */}
      <Link href="/track-selection" className="flex items-center gap-s1 min-w-0 rounded-md py-1">
        <span className="text-meta font-medium text-ink truncate">{trackLabel}</span>
        <IconChevronDown size={15} className="text-faint shrink-0" stroke={2} />
      </Link>

      <div className="flex items-center gap-s3 shrink-0">
        <span className="font-mono text-meta text-ink tabular">
          {totalXP.toLocaleString()}
          <span className="text-faint ml-1">XP</span>
        </span>
        <MobileProfileMenu avatarLetter={avatarLetter} />
      </div>
    </header>
  );
}
