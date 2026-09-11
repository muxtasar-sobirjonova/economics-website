"use client";

import { useEffect } from "react";

/**
 * The room, while it is being sat.
 *
 * Two things that belong to the whole screen rather than to any one question:
 * the site's own navigation is taken away, and leaving the page is made
 * deliberate.
 *
 * Taking the navigation away is not decoration. Every link in a sidebar is a
 * way out of an exam somebody is sitting, the guard counts going out, and
 * punishing a student for using a control the page itself offered them is
 * indefensible. Remove the exits rather than fine people for taking them.
 */

/** Hide the site chrome for as long as this is mounted and `active`. */
export function useArena(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const root = document.documentElement;
    root.dataset.arena = "on";
    return () => {
      // Cleared on unmount, not on a route change: a crash that left the flag
      // on would leave the whole site without navigation.
      delete root.dataset.arena;
    };
  }, [active]);
}

/**
 * The browser's own "leave site?" prompt.
 *
 * Nothing is actually lost to a reload — every answer is already saved — but a
 * reload mid-exam is almost never what someone meant to do, and the prompt
 * costs a keystroke to dismiss when it was.
 */
export function useLeaveWarning(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Ignored by every current browser, which shows its own wording; set
      // because older ones read it and the property is what arms the prompt.
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [active]);
}

function Backdrop({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-s4"
      style={{ background: "rgba(20, 18, 32, .55)", backdropFilter: "blur(3px)" }}
      role="alertdialog"
      aria-modal="true"
    >
      <div className="w-full max-w-[440px] rounded-lg border border-line bg-surface shadow-sh3 p-s6 text-center">
        {children}
      </div>
    </div>
  );
}

/**
 * A strike, read on the way back in.
 *
 * Dismissible, and deliberately so: this is a warning, and a warning nobody
 * can close is a lock wearing the wrong label.
 */
export function StrikeModal({
  notice,
  strikes,
  remaining,
  onDismiss,
}: {
  notice: string;
  strikes: number;
  /** -1 when the room only records and never pauses. */
  remaining: number;
  onDismiss: () => void;
}) {
  return (
    <Backdrop>
      <span className="text-label uppercase" style={{ color: "var(--danger)" }}>
        You left the exam
      </span>
      <h2 className="text-h3 font-semibold text-ink mt-s2">
        {strikes === 1 ? "First time" : `${strikes} times now`}
      </h2>
      <p className="text-ui text-ink mt-s3">{notice}</p>

      {remaining >= 0 && (
        <p className="text-meta text-muted mt-s3">
          {remaining === 0
            ? "The next one pauses your paper."
            : `${remaining} more before your paper pauses.`}
        </p>
      )}

      <button
        onClick={onDismiss}
        autoFocus
        className="inline-flex items-center justify-center min-h-[48px] px-s6 mt-s5 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors"
      >
        Back to the exam
      </button>
    </Backdrop>
  );
}

/**
 * The paper is frozen. No way out of this one, because there is nothing the
 * student can do about it — the host clears it, and the page will follow along
 * when they do.
 */
export function PausedModal({
  reason,
  byHost,
  answered,
  total,
}: {
  reason: string | null;
  byHost: boolean;
  answered: number;
  total: number;
}) {
  return (
    <Backdrop>
      <span className="text-label uppercase" style={{ color: "var(--danger)" }}>
        Paused
      </span>
      <h2 className="text-h3 font-semibold text-ink mt-s2">
        {byHost ? "The host stopped your paper" : "Your paper stopped itself"}
      </h2>

      {reason && (
        <p
          className="text-ui mt-s4 px-s4 py-s3 rounded-md"
          style={{ background: "var(--danger-soft)", color: "var(--text)" }}
        >
          {reason}
        </p>
      )}

      <p className="text-meta text-muted mt-s4">
        <strong className="text-ink">Nothing you wrote is lost.</strong> All{" "}
        {answered} of your {total} answers are saved. Talk to the host — they can
        let you carry on from where you were.
      </p>
    </Backdrop>
  );
}
