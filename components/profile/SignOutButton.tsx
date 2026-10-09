"use client";

import React from 'react';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      // Red because it is the one thing on this page that cannot be undone
      // with a click back — but the project's red, not Tailwind's.
      className="w-full flex items-center justify-center gap-s2 min-h-[48px] px-s5 rounded-md border font-semibold text-ui transition-colors"
      style={{
        borderColor: "var(--danger)",
        background: "var(--danger-soft)",
        color: "var(--danger)",
      }}
    >
      <LogOut size={18} />
      Sign out
    </button>
  );
}
