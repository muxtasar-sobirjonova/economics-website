import React from 'react';

export const SectionHeading = ({ children, align = "left" }: { children: React.ReactNode, align?: "left" | "center" }) => (
  <h3 className={`text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 text-${align}`}>{children}</h3>
);