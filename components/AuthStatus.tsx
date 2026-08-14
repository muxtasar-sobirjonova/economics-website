'use client';

import { useSession, signOut } from 'next-auth/react';
import { IconLogout } from '@tabler/icons-react';

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-[9px] px-s3 py-[11px] rounded-md bg-surface border border-line">
        <div className="w-7 h-7 rounded-full bg-bg-sunk animate-pulse shrink-0" />
        <div className="flex flex-col gap-s1 w-full">
          <div className="h-3 w-20 rounded-sm bg-bg-sunk animate-pulse" />
          <div className="h-2 w-14 rounded-sm bg-bg-sunk animate-pulse" />
        </div>
      </div>
    );
  }

  if (session?.user) {
    const authName = session.user.name || session.user.email || "Student";

    return (
      <div className="flex items-center gap-[9px] px-s3 py-[11px] rounded-md bg-surface border border-line">
        <div className="w-7 h-7 rounded-full bg-accent-soft text-accent grid place-items-center font-semibold text-[13px] shrink-0">
          {authName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col overflow-hidden w-full">
          <span className="text-meta font-medium text-ink truncate">{authName}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-[11px] text-faint hover:text-ink flex items-center gap-1 transition-colors text-left"
          >
            <IconLogout size={12} />
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return null;
}
