"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { reportAwayAction } from "@/app/actions/problems";

/**
 * Noticing that the page was left.
 *
 * Two signals, coalesced into one. `visibilitychange` catches a tab switch, a
 * minimise and an app switch on a phone; `blur` catches focus moving to
 * another window on a second monitor, where the tab stays visible. Counting
 * both separately would report one absence twice, so a single "away since"
 * mark is set by whichever fires first and cleared by whichever returns first.
 *
 * Full screen was considered and left out. It is refused outright on iOS
 * Safari, it is dismissed with one key everywhere else, and a student whose
 * paper demanded it would think the site had broken. Detection that works
 * quietly beats a lock that does not work at all.
 */

type Policy = "NONE" | "WARN" | "LOCK";

export interface Guard {
  notice: string | null;
  locked: boolean;
  dismiss: () => void;
}

export function useFocusGuard({
  competitionId,
  policy,
  initialLocked,
  active,
}: {
  competitionId: string;
  policy: Policy;
  initialLocked: boolean;
  /** False once the paper is in: a results page is not being invigilated. */
  active: boolean;
}): Guard {
  const [notice, setNotice] = useState<string | null>(null);
  const [locked, setLocked] = useState(initialLocked);
  const awaySince = useRef<number | null>(null);

  const returned = useCallback(async () => {
    const left = awaySince.current;
    awaySince.current = null;
    if (left === null) return;

    const res = await reportAwayAction(competitionId, Date.now() - left);
    if (!res.ok) return;

    if (res.data.notice) setNotice(res.data.notice);
    if (res.data.verdict.locked) setLocked(true);
  }, [competitionId]);

  useEffect(() => {
    if (policy === "NONE" || !active || locked) return;

    const left = () => {
      if (awaySince.current === null) awaySince.current = Date.now();
    };
    const back = () => void returned();

    const onVisibility = () => (document.hidden ? left() : back());

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", left);
    window.addEventListener("focus", back);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", left);
      window.removeEventListener("focus", back);
    };
  }, [policy, active, locked, returned]);

  return { notice, locked, dismiss: () => setNotice(null) };
}

/** What they read when they come back. Reporting, never accusing. */
export function FocusNotice({
  notice,
  onDismiss,
}: {
  notice: string | null;
  onDismiss: () => void;
}) {
  if (!notice) return null;

  return (
    <div
      role="status"
      className="rounded-lg border p-s4 flex flex-wrap items-center gap-s3"
      style={{ borderColor: "var(--reward)", background: "var(--reward-soft)" }}
    >
      <p className="text-ui flex-1 min-w-[200px]" style={{ color: "var(--text)" }}>
        {notice}
      </p>
      <button
        onClick={onDismiss}
        className="inline-flex items-center min-h-[44px] px-s4 rounded-md border border-line text-meta text-muted hover:text-ink transition-colors"
      >
        I understand
      </button>
    </div>
  );
}

/**
 * A frozen paper.
 *
 * It says what happened, that nothing was lost, and what to do — because the
 * student reading it is about to panic, and a locked screen with no way
 * forward is how a room ends in an argument.
 */
export function LockedPaper({
  answered,
  total,
  reason,
  byHost,
}: {
  answered: number;
  total: number;
  /** Why, in the host's words or the guard's. Always shown. */
  reason: string | null;
  byHost: boolean;
}) {
  return (
    <section
      className="rounded-lg border bg-surface shadow-sh1 p-s6 text-center"
      style={{ borderColor: "var(--danger)" }}
    >
      <h2 className="text-h3 font-semibold" style={{ color: "var(--danger)" }}>
        Your paper is paused
      </h2>
      <p className="text-ui text-ink mt-s3 max-w-[46ch] mx-auto">
        {byHost ? "The host stopped your paper." : "Your paper stopped itself."}
      </p>
      {reason && (
        <p
          className="text-ui mt-s3 max-w-[46ch] mx-auto px-s4 py-s3 rounded-md"
          style={{ background: "var(--danger-soft)", color: "var(--text)" }}
        >
          {reason}
        </p>
      )}
      <p className="text-meta text-muted mt-s3 max-w-[46ch] mx-auto">
        <strong className="text-ink">Nothing you wrote is lost.</strong> All{" "}
        {answered} of your {total} answers are saved. Talk to the host — they
        can let you carry on from where you were.
      </p>
    </section>
  );
}
