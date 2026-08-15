import React from 'react';
import Image from 'next/image';

/**
 * Two panes: the form on paper, the plot on the dark side. The right pane is
 * decoration — it collapses away below md so the form owns the phone.
 */
export default function AuthLayout({
  children,
  title,
  subtitle,
  quote,
  quoteMeta,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  quote?: string;
  quoteMeta?: string;
}) {
  return (
    <div className="min-h-screen w-full grid md:grid-cols-2 bg-surface">
      {/* Form */}
      <div className="flex items-center justify-center px-s4 py-s7 md:px-s7">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-s3 mb-s6">
            <span className="w-9 h-9 rounded-md bg-surface border border-line grid place-items-center overflow-hidden p-1">
              <Image src="/favicon.png" alt="" width={28} height={28} className="w-full h-full object-contain" />
            </span>
            <span className="text-ui font-semibold text-ink tracking-[-.01em]">That&apos;s So Econ</span>
          </div>

          <h1 className="text-h1-sm font-semibold text-ink">{title}</h1>
          <p className="text-meta text-muted mt-s2 mb-s5">{subtitle}</p>

          {children}
        </div>
      </div>

      {/* Plot */}
      <aside
        data-theme="dark"
        className="hidden md:flex flex-col justify-between bg-bg-sunk text-ink p-s7 relative overflow-hidden border-l border-line"
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(50rem 30rem at 70% 10%, var(--accent-soft), transparent 60%)" }}
        />

        <span className="relative font-mono text-label uppercase text-accent-strong">
          56 days · 3 tracks
        </span>

        <div className="relative">
          <blockquote className="text-h2 font-semibold text-ink text-balance max-w-[22ch]">
            &ldquo;{quote || "I understood pricing the day I had to set one."}&rdquo;
          </blockquote>
          <p className="text-meta text-muted mt-s4">{quoteMeta || "Chapter 3 · Pricing Power"}</p>
        </div>

        {/* One plot, quietly */}
        <svg viewBox="-90 -110 180 160" className="relative w-[180px] self-end opacity-90" aria-hidden>
          <polygon points="0,-30 66,0 0,30 -66,0" fill="var(--ground)" stroke="var(--ground-edge)" strokeWidth="1.2" />
          <polygon points="30,10 76,36 4,36 -16,24" fill="var(--vol-shadow)" />
          <polygon points="-34,-60 0,-40 0,18 -34,-2" fill="var(--vol-left)" />
          <polygon points="0,-40 34,-60 34,-2 0,18" fill="var(--vol-right)" />
          <polygon points="0,-80 34,-60 0,-40 -34,-60" fill="var(--vol-top)" />
          <polygon points="-24,-49 -13,-43 -13,-33 -24,-39" fill="var(--vol-window)" opacity=".85" />
          <polygon points="13,-43 24,-49 24,-39 13,-33" fill="var(--vol-window)" opacity=".45" />
        </svg>
      </aside>
    </div>
  );
}
