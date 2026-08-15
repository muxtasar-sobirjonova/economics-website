import React from "react";

/** The one page header every top-level route uses: eyebrow, title, right slot. */
export function PageHeader({
  eyebrow,
  title,
  right,
}: {
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="w-full bg-surface border-b border-line flex justify-between items-center gap-s4 shrink-0 px-s4 md:px-s5 h-14">
      <div className="min-w-0">
        <span className="text-label uppercase text-faint block">{eyebrow}</span>
        <h1 className="text-h3 font-semibold text-ink leading-tight truncate">{title}</h1>
      </div>
      {right && <div className="shrink-0 flex items-center gap-s3">{right}</div>}
    </header>
  );
}
