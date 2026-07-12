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
      <div className="h-screen flex flex-col md:flex-row overflow-hidden w-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative h-full w-full" style={{ backgroundColor: "#F8F9FC" }}>
          {children}
        </main>
      </div>
    </SessionProviderWrapper>
  );
}
