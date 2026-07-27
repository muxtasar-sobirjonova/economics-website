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
      <div className="min-h-screen flex flex-col md:fixed md:inset-0 md:flex-row md:overflow-hidden w-full bg-[#F8F9FC]">
        <Sidebar />
        <main className="flex-1 w-full relative md:overflow-y-auto">
          {children}
        </main>
      </div>
    </SessionProviderWrapper>
  );
}
