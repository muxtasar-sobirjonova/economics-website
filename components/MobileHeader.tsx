import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { IconChevronDown } from '@tabler/icons-react';
import { Compass } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';
import { MobileProfileMenu } from './MobileProfileMenu';

export default async function MobileHeader() {
  noStore();
  const session = await auth();
  if (!session?.user?.id) return null;

  const userRecord = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { 
      activeTrack: true, 
    }
  });

  const activeTrack = userRecord?.activeTrack;
  const trackProg = activeTrack ? await prisma.trackProgress.findUnique({
    where: { userId_track: { userId: session.user.id, track: activeTrack } },
    select: { xp: true }
  }) : null;

  const totalXP = trackProg?.xp || 0;

  // Simple mapping for track to an emoji icon
  // We're moving away from emojis to a cleaner lucide icon, but keeping this logic 
  // in case we want to customize the lucide icon per track later.
  
  const avatarLetter = (session.user?.name?.trim().charAt(0) || session.user?.email?.trim().charAt(0) || "?").toUpperCase();

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-50 z-50 flex items-center justify-between px-5">
      {/* Left side: Track Selector */}
      <Link href="/track-selection" className="flex items-center gap-2 group">
         <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 border border-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors">
            <Compass size={18} className="text-brand-primary" strokeWidth={2.5} />
         </div>
         <IconChevronDown size={16} className="text-gray-500 group-hover:text-gray-900 transition-colors" stroke={2.5} />
      </Link>

      {/* Right side: Rewards */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-50">
           <span className="text-amber-400 font-black text-sm tracking-tighter">XP</span>
           <span className="font-bold text-[#1A1A2E] text-sm tracking-wide">{totalXP}</span>
        </div>
        {/* Avatar circle with Dropdown */}
        <MobileProfileMenu avatarLetter={avatarLetter} />
      </div>
    </header>
  );
}
