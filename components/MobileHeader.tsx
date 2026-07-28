import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { IconChevronDown } from '@tabler/icons-react';
import { Star } from 'lucide-react';

export default async function MobileHeader() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userRecord = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { activeTrack: true, totalXP: true }
  });

  // Simple mapping for track to an emoji icon
  const trackLabels: Record<string, string> = {
    ENTREPRENEURSHIP_ECONOMICS: "📈", 
  };

  const trackIcon = trackLabels[userRecord?.activeTrack || ""] || "🎓";

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#F8F9FC] z-50 flex items-center justify-between px-5">
      {/* Left side: Track Selector */}
      <Link href="/track-selection" className="flex items-center gap-1.5">
         <span className="text-2xl leading-none">{trackIcon}</span>
         <IconChevronDown size={16} className="text-gray-600" stroke={2.5} />
      </Link>

      {/* Right side: Rewards */}
      <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-50">
         <Star size={18} className="text-amber-400 fill-amber-400" />
         <span className="font-bold text-[#1A1A2E] text-sm tracking-wide">{userRecord?.totalXP || 0}</span>
      </div>
    </header>
  );
}
