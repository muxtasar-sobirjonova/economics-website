import React from "react";
import type { ProblemReviewLine } from "@/lib/compete/problemService";
import { Rich } from "@/components/compete/Rich";

/**
 * What a student reads afterwards.
 *
 * The part of a competition that teaches: the problem, what they wrote, the
 * mark with a reason for it, and the worked solution beside it. A total on its
 * own says only who won.
 */
export function ProblemReview({ lines }: { lines: ProblemReviewLine[] }) {
  if (lines.length === 0) return null;

  const scored = lines.reduce((sum, l) => sum + l.points, 0);
  const available = lines.reduce((sum, l) => sum + l.maxPoints, 0);
  const waiting = lines.filter((l) => l.gradedBy === "PENDING").length;

  return (
    <section className="flex flex-col gap-s4">
      <div className="flex items-baseline gap-s4">
        <h2 className="text-h2 font-semibold text-ink whitespace-nowrap">
          {scored} / {available}
        </h2>
        <span className="h-px bg-line flex-1" />
        {waiting > 0 && (
          <span className="text-meta text-muted shrink-0">
            {waiting} still to be marked
          </span>
        )}
      </div>

      <ul className="list-none m-0 p-0 flex flex-col gap-s4">
        {lines.map((line) => {
          const full = line.maxPoints > 0 && line.points >= line.maxPoints;
          const none = line.points === 0;
          const unmarked = line.gradedBy === "PENDING";

          const colour = unmarked
            ? "var(--muted)"
            : full
              ? "var(--success)"
              : none
                ? "var(--danger)"
                : "var(--reward)";

          return (
            <li
              key={line.id}
              className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-s3 px-s4 py-s3 border-b border-line bg-bg-sunk">
                {/* Wraps rather than truncates: on a phone the half that got
                    cut was the title, which is the half worth reading. */}
                <span className="font-mono text-label uppercase text-faint min-w-0 break-words">
                  {line.topic} · {line.title}
                </span>
                <span
                  className="font-mono text-meta tabular shrink-0"
                  style={{ color: colour }}
                >
                  {unmarked ? "not marked yet" : `${line.points} / ${line.maxPoints}`}
                </span>
              </div>

              <div className="p-s4 flex flex-col gap-s4">
                <Rich source={line.statement} />

                {line.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- see Rich.
                  <img
                    src={line.imageUrl}
                    alt={`Figure for ${line.title}`}
                    loading="lazy"
                    className="max-w-full h-auto rounded-md border border-line bg-white"
                  />
                )}

                <div className="rounded-md border p-s3" style={{ borderColor: colour }}>
                  <span className="text-label uppercase text-faint">Your answer</span>
                  <p className="text-ui text-ink mt-s2 whitespace-pre-wrap leading-relaxed">
                    {line.yourAnswer || <span className="text-faint">You left this blank.</span>}
                  </p>
                  {line.feedback && (
                    <p className="text-meta text-muted mt-s3 italic">{line.feedback}</p>
                  )}
                </div>

                {line.solution && (
                  <div>
                    <span className="text-label uppercase text-faint">The solution</span>
                    <div className="mt-s2 pl-s3 border-l-2 border-line">
                      <Rich source={line.solution} />
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
