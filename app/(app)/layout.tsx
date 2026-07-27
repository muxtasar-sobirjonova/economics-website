import React from 'react';
import Sidebar from "@/components/Sidebar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProviderWrapper>
      <div className="md:fixed md:inset-0 md:flex md:flex-row md:overflow-hidden w-full bg-[#F8F9FC]">
        <Sidebar />
        <main className="w-full relative md:flex-1 md:overflow-y-auto">
          {children}
        </main>
      </div>
    </SessionProviderWrapper>
  );
}
