"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export const MarketingNav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors ${
        scrolled ? "bg-bg-sunk/90 backdrop-blur border-b border-line" : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1180px] mx-auto px-s4 md:px-s5 h-16 flex items-center justify-between gap-s4">
        <Link href="/" className="flex items-center gap-s3 shrink-0">
          <span className="w-8 h-8 rounded-md bg-surface border border-line grid place-items-center overflow-hidden p-1">
            <Image src="/favicon.png" alt="" width={24} height={24} className="w-full h-full object-contain" />
          </span>
          <span className="text-ui font-semibold text-ink tracking-[-.01em]">That&apos;s So Econ</span>
        </Link>

        <div className="hidden md:flex items-center gap-s5 text-meta text-muted">
          <a href="#how" className="hover:text-ink transition-colors">How it works</a>
          <a href="#tracks" className="hover:text-ink transition-colors">Tracks</a>
          <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-s3 shrink-0">
          <Link href="/login" className="text-meta text-muted hover:text-ink transition-colors min-h-[44px] flex items-center px-s2">
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-s4 py-s2 rounded-md bg-accent text-on-accent text-meta font-semibold hover:bg-accent-strong transition-colors min-h-[44px] flex items-center"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
};
