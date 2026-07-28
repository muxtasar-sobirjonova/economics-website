"use client";

import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';

export function MobileProfileMenu({ avatarLetter }: { avatarLetter: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-brand-primary text-white shadow-sm cursor-pointer hover:opacity-90 transition-all"
      >
        {avatarLetter}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <Link href="/profile" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <User size={16} className="text-gray-400" />
            <span className="font-medium">My Profile</span>
          </Link>
          <div className="h-px bg-gray-100 my-1"></div>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut size={16} />
            <span className="font-medium">Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}
