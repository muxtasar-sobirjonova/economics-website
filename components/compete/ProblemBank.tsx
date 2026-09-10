"use client";

import { ProblemPicker } from "@/components/compete/ProblemPicker";
import type { ProblemSummary } from "@/lib/compete/problemService";

/**
 * The bank page.
 *
 * The same picker the room form uses, with the retire controls turned on. A
 * host does not need this page to run a competition — everything is on
 * `/compete` — but someone who has written forty problems needs somewhere to
 * see and retire them.
 */
export function ProblemBank({
  problems,
  mayHost,
  mayWrite,
  available,
}: {
  problems: ProblemSummary[];
  mayHost: boolean;
  mayWrite: boolean;
  available: boolean;
}) {
  return (
    <ProblemPicker
      problems={problems}
      mayWrite={mayWrite}
      mayHost={mayHost}
      available={available}
      manage
    />
  );
}
