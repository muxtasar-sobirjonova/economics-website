"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { unlockPlayerAction } from "@/app/actions/problems";
import type { FocusRow } from "@/lib/compete/focusService";

/**
 * Who left the page, for the host.
 *
 * A record, not a verdict. It reports what the browser saw and leaves the
 * judgement where it belongs: a student with two forty-second absences may
 * have taken a phone call, and a student with fourteen four-second ones was
 * reading something. The host knows which of their students is which, and
 * this page does not.
 */

function duration(ms: number): string {
  if (ms < 1000) return "0s";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return s % 60 === 0 ? `${m}m` : `${m}m ${s % 60}s`;
}

function clockTime(at: number): string {
  return new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function FocusRecord({
  competitionId,
  policy,
  rows,
}: {
  competitionId: string;
  policy: "NONE" | "WARN" | "LOCK";
  rows: FocusRow[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  if (policy === "NONE") return null;

  const wandered = rows.filter((r) => r.total > 0);
  const locked = rows.filter((r) => r.locked).length;

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-s3 px-s4 py-s3 border-b border-line bg-bg-sunk">
        <h2 className="text-label uppercase text-faint">
          Who left the page · {wandered.length} of {rows.length}
          {locked > 0 ? ` · ${locked} paused` : ""}
        </h2>
        <span className="text-label uppercase text-faint">
          {policy === "LOCK" ? "pauses the paper" : "recorded only"}
        </span>
      </div>

      {wandered.length === 0 ? (
        <p className="text-meta text-muted p-s4 text-center">
          Nobody has left their paper.
        </p>
      ) : (
        <ul className="list-none m-0 p-0">
          {wandered.map((row) => (
            <li key={row.userId} className="border-t border-line first:border-t-0">
              <div className="grid grid-cols-[1fr_auto] gap-s3 items-center px-s4 py-s3">
                <span className="min-w-0">
                  <span className="block text-ui text-ink break-words pb-[2px]">
                    {row.name || "Anonymous"}
                    {row.locked && (
                      <span
                        className="ml-s2 text-label uppercase px-s2 py-[2px] rounded-sm"
                        style={{ background: "var(--danger-soft)", color: "var(--danger)" }}
                      >
                        paused
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => setOpen(open === row.userId ? null : row.userId)}
                    className="font-mono text-label uppercase text-faint hover:text-ink transition-colors text-left min-h-[24px]"
                  >
                    {row.total} {row.total === 1 ? "time" : "times"} · {duration(row.awayMs)} away
                    {row.strikes > 0 ? ` · ${row.strikes} counted` : " · none counted"} ·{" "}
                    {open === row.userId ? "hide" : "when"}
                  </button>
                </span>

                {row.locked && (
                  <LetThemBack competitionId={competitionId} playerId={row.userId} />
                )}
              </div>

              {open === row.userId && (
                <ul className="list-none m-0 px-s4 pb-s3 pl-s5 flex flex-col gap-1">
                  {row.log.map((e, i) => (
                    <li key={i} className="font-mono text-label text-faint tabular">
                      {clockTime(e.at)} · {duration(e.ms)}
                      {e.ms >= 10_000 ? " · counted" : ""}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function LetThemBack({
  competitionId,
  playerId,
}: {
  competitionId: string;
  playerId: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <button
      onClick={() =>
        start(async () => {
          await unlockPlayerAction(competitionId, playerId);
          router.refresh();
        })
      }
      disabled={pending}
      className="inline-flex items-center min-h-[44px] px-s4 rounded-md border border-line text-meta text-ink hover:border-accent transition-colors shrink-0 disabled:opacity-60"
    >
      {pending ? "…" : "Let them carry on"}
    </button>
  );
}
