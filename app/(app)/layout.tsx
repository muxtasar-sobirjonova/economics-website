import React from 'react';
import Sidebar from "@/components/Sidebar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import MobileHeader from "@/components/MobileHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProviderWrapper>
      <div className="md:fixed md:inset-0 md:flex md:flex-row md:overflow-hidden w-full bg-bg min-h-[100dvh]">
        <MobileHeader />
        <Sidebar />
        <main className="w-full relative md:flex-1 md:overflow-y-auto pt-14 pb-[72px] md:pt-0 md:pb-0">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </SessionProviderWrapper>
  );
}
