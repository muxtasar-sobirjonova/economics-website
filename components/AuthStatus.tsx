'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { IconLogin, IconUserPlus, IconLogout } from '@tabler/icons-react';

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center px-3 py-2.5 gap-3">
        <div className="w-9 h-9 rounded-full bg-[#362A5C] animate-pulse"></div>
        <div className="flex flex-col gap-2 w-full">
          <div className="h-3 bg-[#362A5C] rounded animate-pulse w-24"></div>
          <div className="h-2 bg-[#362A5C] rounded animate-pulse w-16"></div>
        </div>
      </div>
    );
  }

  if (session?.user) {
    const authName = session.user.name || session.user.email || "Student";
    
    return (
      <div className="flex items-center px-3 py-2.5 gap-3 text-white group">
        <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-white font-[500] text-sm shrink-0 border-2 border-white/20">
          {authName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col overflow-hidden w-full">
          <span className="text-sm font-bold truncate">{authName}</span>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-[11px] text-gray-200 hover:text-white flex items-center gap-1 transition-colors mt-0.5 text-left"
          >
            <IconLogout size={12} />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return null;
}
