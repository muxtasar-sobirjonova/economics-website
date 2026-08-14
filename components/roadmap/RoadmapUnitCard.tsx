import React from "react";
import Link from "next/link";

type RoadmapUnitCardProps = {
  chapterNumber: number;
  title: string;
  description: string;
  startHref?: string;
  disabled?: boolean;
  dayRange?: string;
  /** completed / total lessons in this chapter */
  progress?: { done: number; total: number };
};

export const RoadmapUnitCard = ({
  chapterNumber,
  title,
  description,
  startHref,
  disabled = false,
  dayRange,
  progress,
}: RoadmapUnitCardProps) => {
  const pct = progress && progress.total > 0 ? (progress.done / progress.total) * 100 : 0;
  const isDone = progress ? progress.done >= progress.total : false;

  return (
    <div
      className={`w-full max-w-[520px] rounded-lg border border-line bg-surface shadow-sh2 p-s5 mt-s6 mb-s5 shrink-0 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-baseline justify-between gap-s3 mb-s2">
        <span className="text-label uppercase text-faint">
          Chapter {String(chapterNumber).padStart(2, "0")}
          {dayRange ? ` · ${dayRange}` : ""}
        </span>
        {progress && (
          <span className="font-mono text-meta text-muted tabular shrink-0">
            {progress.done}/{progress.total}
          </span>
        )}
      </div>

      <h2 className="text-h2 font-semibold text-ink text-balance">{title}</h2>
      <p className="text-meta text-muted mt-s2 max-w-[56ch]">{description}</p>

      {progress && (
        <div className="h-1 w-full bg-bg-sunk rounded-sm overflow-hidden mt-s4">
          <div
            className={`h-full rounded-sm transition-all duration-500 ${isDone ? "bg-success" : "bg-accent"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      <div className="mt-s4">
        {startHref && !disabled ? (
          <Link
            href={startHref}
            className="inline-flex items-center gap-s2 px-s5 py-s3 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors min-h-[44px]"
          >
            {isDone ? "Review chapter" : "Continue"}
            <span aria-hidden>&rarr;</span>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-s2 px-s5 py-s3 rounded-md border border-line text-ui text-faint min-h-[44px] cursor-not-allowed">
            Locked
          </span>
        )}
      </div>
    </div>
  );
};
