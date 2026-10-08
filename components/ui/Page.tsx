import React from "react";

/**
 * The page furniture every redesigned screen shares.
 *
 * Built as components rather than a set of classes to copy, because the last
 * round of "same page, twice" is what left nine corner radii and four purples
 * in the app. A page that wants this shape asks for it by name.
 *
 * Headings are set in the reading face. The redesign asks for Newsreader; this
 * project already loads Literata for exactly that role, and the two are the
 * same kind of transitional serif. Two more font files for a difference nobody
 * can name is not a trade worth making.
 */

export function Page({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  /** 1180px instead of 1040, for a board that needs the room. */
  wide?: boolean;
}) {
  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div
        className={`w-full ${wide ? "max-w-[1180px]" : "max-w-[1040px]"} mx-auto px-s4 md:px-s6 pt-s5 md:pt-s7 pb-s8`}
      >
        {children}
      </div>
    </div>
  );
}

/** The title block, with room for one control on the right. */
export function PageHead({
  title,
  lead,
  aside,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <header className="flex justify-between items-end gap-s5 flex-wrap mb-s6">
      <div className="min-w-0">
        <h1 className="font-reading text-h1 font-semibold tracking-tight text-ink leading-[1.1] break-words">
          {title}
        </h1>
        {lead && <p className="text-muted mt-s2 max-w-[56ch] text-ui">{lead}</p>}
      </div>
      {aside}
    </header>
  );
}

/** A band of the page, with its own heading and an optional count. */
export function Section({
  title,
  count,
  children,
  id,
}: {
  title: React.ReactNode;
  /** Set in the mono face, like every other figure on these pages. */
  count?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mt-s7 first:mt-0 scroll-mt-s5">
      <div className="flex justify-between items-baseline gap-s3 mb-s4">
        <h2 className="font-reading text-h2 font-semibold tracking-tight text-ink">{title}</h2>
        {count !== undefined && <span className="font-mono text-meta text-muted">{count}</span>}
      </div>
      {children}
    </section>
  );
}

/** A bordered white panel. The only card shape these pages use. */
export function Card({
  children,
  className = "",
  padded = false,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`border border-line rounded-lg bg-surface ${padded ? "p-s5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export interface Stat {
  label: string;
  value: React.ReactNode;
  /** An SVG path string, drawn at 18px. */
  icon?: string;
  /** Green rather than purple, for a figure that is a good thing. */
  good?: boolean;
}

/** The row of figures that opens a page. Four across, two on a phone. */
export function StatTiles({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-s3 mb-s6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="h-[76px] border border-line rounded-lg px-s4 flex items-center gap-s3 min-w-0 bg-surface"
        >
          {s.icon && (
            <span
              className="w-9 h-9 rounded-md grid place-items-center shrink-0"
              style={
                s.good
                  ? { background: "var(--success-soft)", color: "var(--success)" }
                  : { background: "var(--accent-soft)", color: "var(--accent-strong)" }
              }
              aria-hidden
            >
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
                dangerouslySetInnerHTML={{ __html: s.icon }}
              />
            </span>
          )}
          <span className="min-w-0">
            <span className="block text-meta text-muted leading-tight truncate">{s.label}</span>
            <b className="block text-h3 font-bold tracking-tight text-ink leading-tight tabular">
              {s.value}
            </b>
          </span>
        </div>
      ))}
    </div>
  );
}

/** Nothing here yet. */
export function Empty({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border border-line rounded-lg bg-surface py-s8 px-s5 text-center text-meta text-muted">
      <b className="block text-ui text-ink mb-s1">{title}</b>
      {children}
    </div>
  );
}
