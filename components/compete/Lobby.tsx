"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  joinCompetitionAction,
  startCompetitionAction,
  endCompetitionAction,
} from "@/app/actions/compete";
import type { CompetitionView } from "@/lib/compete/service";

/**
 * The room before it starts.
 *
 * Watching names arrive is most of what makes a lobby feel like an event, so
 * the list refreshes on a timer. Polling rather than a socket: a two-second
 * refresh reads as live, and Vercel cannot hold a socket open anyway.
 */
const POLL_MS = 2500;

export function Lobby({ view }: { view: CompetitionView }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Only while it matters — an ended competition is not going to change.
  useEffect(() => {
    if (view.status === "ENDED") return;
    const id = setInterval(() => router.refresh(), POLL_MS);
    return () => clearInterval(id);
  }, [router, view.status]);

  const act = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null);
    start(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "That did not work.");
      router.refresh();
    });
  };

  const copyCode = async () => {
    const url = `${window.location.origin}/compete/${view.code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col gap-s4">
      <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5 text-center">
        <span className="font-mono text-label uppercase text-faint">Join code</span>
        <div className="font-mono text-display text-ink tracking-[0.18em] leading-none mt-s3">
          {view.code}
        </div>

        <div className="flex flex-wrap gap-s3 justify-center mt-s4">
          <button
            onClick={copyCode}
            className="inline-flex items-center min-h-[44px] px-s4 rounded-md border border-line text-meta text-muted hover:text-ink transition-colors"
          >
            {copied ? "Copied" : "Copy the link"}
          </button>
        </div>

        <p className="text-meta text-muted mt-s4">
          {view.questionCount} questions · {view.secondsPerQuestion}s each
          {view.topic ? ` · ${view.topic}` : ""} ·{" "}
          {view.access === "LINK" ? "code only" : "listed publicly"}
        </p>
      </section>

      <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
        <div className="flex items-baseline justify-between gap-s3 px-s4 py-s3 border-b border-line bg-bg-sunk">
          <h2 className="text-label uppercase text-faint">
            In the room · {view.standings.length}
          </h2>
          <span className="flex items-center gap-s2">
            <span
              className="w-[7px] h-[7px] rounded-full animate-ringpulse"
              style={{ background: "var(--success)" }}
              aria-hidden
            />
            <span className="text-label uppercase text-faint">live</span>
          </span>
        </div>

        {view.standings.length === 0 ? (
          <p className="text-meta text-muted p-s5 text-center">
            Nobody yet. Share the code above.
          </p>
        ) : (
          <ul className="list-none m-0 p-0 grid sm:grid-cols-2">
            {view.standings.map((p) => (
              <li
                key={p.userId}
                className="flex items-center gap-s3 px-s4 py-s3 border-t border-line"
              >
                <span className="w-8 h-8 rounded-full grid place-items-center shrink-0 bg-bg-sunk text-muted font-semibold text-meta">
                  {(p.name || "?").charAt(0).toUpperCase()}
                </span>
                <span className="text-ui text-ink truncate">{p.name || "Anonymous"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {error && (
        <p className="text-meta" style={{ color: "var(--danger)" }}>{error}</p>
      )}

      {view.isHost ? (
        <div className="flex flex-wrap gap-s3">
          <button
            onClick={() => act(() => startCompetitionAction(view.id))}
            disabled={pending || view.standings.length === 0}
            className="inline-flex items-center min-h-[48px] px-s6 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors disabled:opacity-50"
          >
            {view.standings.length === 0 ? "Waiting for players" : "Start"}
          </button>
          <button
            onClick={() => act(() => endCompetitionAction(view.id))}
            disabled={pending}
            className="inline-flex items-center min-h-[48px] px-s5 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors"
          >
            Cancel it
          </button>
        </div>
      ) : view.joined ? (
        <p className="text-meta text-muted text-center">
          You are in. The host starts it — this page will follow along.
        </p>
      ) : (
        <button
          onClick={() => act(() => joinCompetitionAction(view.code))}
          disabled={pending}
          className="inline-flex items-center justify-center min-h-[48px] px-s6 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors disabled:opacity-60"
        >
          {pending ? "Joining…" : "Take a seat"}
        </button>
      )}
    </div>
  );
}
