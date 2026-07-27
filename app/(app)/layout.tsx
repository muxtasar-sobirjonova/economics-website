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
      <div className="fixed inset-0 flex flex-col md:flex-row overflow-hidden w-full bg-[#F8F9FC]">
        <Sidebar />
        <main className="grow shrink overflow-y-auto relative">
          {children}
        </main>
      </div>
    </SessionProviderWrapper>
  );
}
