"use client";

import { useState } from "react";
import { RichLazy as Rich } from "./RichLazy";
import type { PastAttempt } from "@/lib/compete/practiceService";

/**
 * What you have already worked.
 *
 * Collapsed by default and kept below the problem, because a page that opens
 * on your past marks is a page about your past marks. Solutions are here in
 * full: every problem on this list has been answered, so there is nothing left
 * to give away.
 */
export function PracticeHistory({ attempts }: { attempts: PastAttempt[] }) {
  const [open, setOpen] = useState<string | null>(null);

  if (attempts.length === 0) return null;

  return (
    <section className="flex flex-col gap-s3">
      <h2 className="text-label uppercase text-faint">
        Worked before · {attempts.length}
      </h2>

      <ul className="flex flex-col gap-s2 list-none p-0 m-0">
        {attempts.map((a) => {
          const isOpen = open === a.id;
          const full = a.maxPoints > 0 && a.points >= a.maxPoints;

          return (
            <li key={a.id} className="border border-line rounded-md bg-raised">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : a.id)}
                aria-expanded={isOpen}
                className="w-full text-left min-h-[44px] px-s3 py-s3 flex flex-wrap items-baseline gap-x-s3 gap-y-s1"
              >
                <span className="text-ui text-ink font-medium min-w-0 break-words flex-1">
                  {a.title}
                </span>
                <span
                  className="text-meta font-mono"
                  style={{ color: full ? "var(--success)" : "var(--muted)" }}
                >
                  {a.gradedBy === "PENDING" ? "—" : `${a.points}/${a.maxPoints}`}
                </span>
                <span className="text-label uppercase text-faint">{a.topic}</span>
              </button>

              {isOpen && (
                <div className="px-s3 pb-s3 flex flex-col gap-s3 border-t border-line pt-s3">
                  <p className="text-meta text-muted">{a.preview}</p>

                  <div className="flex flex-col gap-s1">
                    <span className="text-label uppercase text-faint">You wrote</span>
                    <p className="text-meta text-muted whitespace-pre-wrap break-words">
                      {a.text}
                    </p>
                  </div>

                  {a.feedback && (
                    <div className="flex flex-col gap-s1">
                      <span className="text-label uppercase text-faint">Marker</span>
                      <p className="text-meta text-ink">{a.feedback}</p>
                    </div>
                  )}

                  {a.solution && (
                    <div className="flex flex-col gap-s1">
                      <span className="text-label uppercase text-faint">Worked solution</span>
                      <div className="text-meta text-ink leading-relaxed">
                        <Rich source={a.solution} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
