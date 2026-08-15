import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full bg-slate-50">
      {children}
    </div>
  );
}
