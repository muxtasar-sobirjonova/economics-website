import React from 'react';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function OpportunitiesCard() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-sm hover:shadow-[var(--sh2)] transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <Briefcase size={18} className="text-[var(--accent)]" />
        <h3 className="text-base font-semibold text-[var(--text)]">Internships</h3>
      </div>
      <p className="text-[var(--muted)] text-sm mb-2">
        Hands‑on economics internships across Uzbekistan.
      </p>
      <div className="mb-2">
        <img src="/uzbekistan-regions.svg" alt="Uzbekistan regions map" className="w-full h-auto rounded" />
      </div>
      <Link
        href="/internships"
        className="inline-flex items-center gap-1 text-[var(--accent-strong)] hover:text-[var(--accent)] transition-colors"
      >
        View Internships
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
