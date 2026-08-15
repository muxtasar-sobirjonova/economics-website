import React from 'react';

/** Marketing runs dark; the app runs light. */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="dark" className="w-full min-h-screen bg-bg text-ink selection:bg-accent selection:text-on-accent">
      {children}
    </div>
  );
}
