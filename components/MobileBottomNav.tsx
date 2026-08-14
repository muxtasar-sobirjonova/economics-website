"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconMap, IconTrophy, IconBooks, IconX } from "@tabler/icons-react";

/**
 * Four fixed tabs instead of eight scrolling ones. "Learn" opens a sheet where
 * Concept / Article / Quiz sit in reading order, with Notes and Mistakes at its
 * foot — the same destinations, just not all crammed into the bar.
 */
export function MobileBottomNav() {
  const pathname = usePathname() || "";
  const [learnOpen, setLearnOpen] = useState(false);

  const match = pathname.match(/^\/lessons\/(\d+)/);
  const currentLessonId = match ? match[1] : "1";

  const isLearnRoute = /\/(concepts|articles|quizzes)/.test(pathname) || pathname.startsWith("/saved") || pathname.startsWith("/review");

  const tabs = [
    { name: "Home", href: "/home", icon: IconHome, active: pathname === "/home" },
    { name: "Plot", href: "/roadmap", icon: IconMap, active: pathname.startsWith("/roadmap") },
    { name: "Learn", icon: IconBooks, active: isLearnRoute },
    { name: "League", href: "/leaderboard", icon: IconTrophy, active: pathname.startsWith("/leaderboard") },
  ];

  const learnLinks = [
    { name: "Concept", meta: "Read the idea, plainly", href: `/lessons/${currentLessonId}/concepts`, swatch: "var(--concept)" },
    { name: "Article", meta: "The story behind it", href: `/lessons/${currentLessonId}/articles`, swatch: "var(--article)" },
    { name: "Quiz", meta: "10 questions · needs 8 to pass", href: `/lessons/${currentLessonId}/quizzes`, swatch: "var(--quiz)" },
  ];

  const footLinks = [
    { name: "My notes", href: "/saved" },
    { name: "Mistakes", href: "/review" },
  ];

  return (
    <>
      {learnOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-[60]"
            onClick={() => setLearnOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-label="Learn"
            className="md:hidden fixed left-0 right-0 bottom-0 z-[70] bg-surface rounded-t-xl border-t border-line shadow-sh3 p-s5 pb-s8 animate-fadeUp"
          >
            <div className="flex items-start justify-between mb-s4">
              <div>
                <div className="text-label uppercase text-faint">Day {currentLessonId}</div>
                <h2 className="text-h3 font-semibold text-ink mt-1">What&apos;s next</h2>
              </div>
              <button
                onClick={() => setLearnOpen(false)}
                aria-label="Close"
                className="w-9 h-9 grid place-items-center rounded-md border border-line text-faint"
              >
                <IconX size={16} />
              </button>
            </div>

            <div className="grid gap-s2">
              {learnLinks.map((l) => (
                <Link
                  key={l.name}
                  href={l.href}
                  onClick={() => setLearnOpen(false)}
                  className="flex items-center gap-s3 p-s3 rounded-md border border-line bg-raised min-h-[56px]"
                >
                  <span className="w-[7px] h-7 rounded-sm shrink-0" style={{ background: l.swatch }} />
                  <span className="min-w-0">
                    <span className="block text-ui font-semibold text-ink">{l.name}</span>
                    <span className="block text-meta text-muted truncate">{l.meta}</span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-s2 mt-s4 pt-s4 border-t border-line">
              {footLinks.map((l) => (
                <Link
                  key={l.name}
                  href={l.href}
                  onClick={() => setLearnOpen(false)}
                  className="text-meta text-muted px-s3 py-s2 rounded-md border border-line min-h-[44px] flex items-center"
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-line z-50 pb-safe">
        <div className="flex items-stretch">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const cls = `flex-1 flex flex-col items-center justify-center gap-1 min-h-[56px] py-s2 transition-colors ${
              tab.active ? "text-accent" : "text-faint"
            }`;

            const inner = (
              <>
                <Icon size={21} stroke={tab.active ? 2.2 : 1.7} />
                <span className={`text-[10.5px] ${tab.active ? "font-semibold" : "font-medium"}`}>
                  {tab.name}
                </span>
              </>
            );

            return tab.href ? (
              <Link key={tab.name} href={tab.href} className={cls} aria-current={tab.active ? "page" : undefined}>
                {inner}
              </Link>
            ) : (
              <button
                key={tab.name}
                onClick={() => setLearnOpen(true)}
                aria-expanded={learnOpen}
                className={cls}
              >
                {inner}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
