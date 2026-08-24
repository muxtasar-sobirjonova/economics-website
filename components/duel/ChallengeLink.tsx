"use client";

import { useState } from "react";

/**
 * Hand your set to someone else.
 *
 * The asynchronous design makes this nearly free: the run is already sitting
 * open, waiting for whoever faces it next. A link just decides who that is —
 * and it is the one thing here that brings a new person to the site.
 */
export function ChallengeLink({ runId }: { runId: string }) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window === "undefined" ? "" : `${window.location.origin}/duel?face=${runId}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard is blocked on insecure origins and in some browsers; the
      // address is shown below either way, so this is not a dead end.
      setCopied(false);
    }
  };

  return (
    <div className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
      <h3 className="text-label uppercase text-faint">Send it to someone</h3>
      <p className="text-meta text-muted mt-s2 max-w-[52ch]">
        They answer the same ten questions and play against you directly, rather
        than waiting for whoever turns up.
      </p>

      <div className="flex flex-wrap gap-s3 items-center mt-s4">
        <button
          onClick={copy}
          className="inline-flex items-center min-h-[44px] px-s5 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors"
        >
          {copied ? "Copied" : "Copy challenge link"}
        </button>
        <code className="font-mono text-meta text-faint break-all min-w-0">{url}</code>
      </div>
    </div>
  );
}
