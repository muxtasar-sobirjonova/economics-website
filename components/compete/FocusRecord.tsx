"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  unlockPlayerAction,
  blockPlayerAction,
  disqualifyPlayerAction,
  reinstatePlayerAction,
} from "@/app/actions/problems";
import { MAX_REASON, type FocusRow } from "@/lib/compete/focusService";

/**
 * Invigilating a room.
 *
 * A record, not a verdict. It reports what the browser saw and leaves the
 * judgement where it belongs: a student with two forty-second absences may
 * have taken a phone call, and a student with fourteen four-second ones was
 * reading something. The host knows which of their students is which, and
 * this page does not.
 *
 * Everyone is listed, not only the ones the browser noticed — a host who sees
 * a phone under a desk needs to act on it, and the browser will never report
 * that. The ones it did notice sort to the top.
 *
 * Every action takes a reason, because the student reads it. A paper that
 * stops without saying why is how a room ends in an argument nobody can
 * settle a week later.
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
  ended = false,
}: {
  competitionId: string;
  policy: "NONE" | "WARN" | "LOCK";
  rows: FocusRow[];
  /** After the room ends the question changes from "stop them" to "do they count". */
  ended?: boolean;
}) {
  const [open, setOpen] = useState<string | null>(null);

  if (rows.length === 0) return null;

  const noticed = rows.filter((r) => r.total > 0).length;
  const paused = rows.filter((r) => r.locked).length;
  const out = rows.filter((r) => r.disqualified).length;

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-s3 px-s4 py-s3 border-b border-line bg-bg-sunk">
        <h2 className="text-label uppercase text-faint">
          {ended ? "Check the room" : "Watching the room"} · {rows.length}
          {noticed > 0 ? ` · ${noticed} left the page` : ""}
          {paused > 0 ? ` · ${paused} paused` : ""}
          {out > 0 ? ` · ${out} disqualified` : ""}
        </h2>
        <span className="text-label uppercase text-faint">
          {policy === "LOCK"
            ? "pauses automatically"
            : policy === "WARN"
              ? "recorded only"
              : "not watched"}
        </span>
      </div>

      {policy === "NONE" && (
        <p className="text-meta text-muted px-s4 pt-s3">
          This room was opened without watching, so nothing was recorded. You can
          still stop or disqualify anyone — a browser never sees the phone on the
          desk, and you do.
        </p>
      )}

      <ul className="list-none m-0 p-0">
        {rows.map((row) => (
          <li key={row.userId} className="border-t border-line first:border-t-0">
            <div className="flex flex-wrap items-start justify-between gap-s3 px-s4 py-s3">
              <span className="min-w-0 flex-1">
                <span className="block text-ui text-ink break-words pb-[2px]">
                  {row.name || "Anonymous"}
                  {row.locked && <Badge tone="danger">paused</Badge>}
                  {row.disqualified && <Badge tone="danger">disqualified</Badge>}
                  {!row.locked && !row.disqualified && row.submitted && (
                    <Badge tone="success">handed in</Badge>
                  )}
                </span>

                {row.total > 0 ? (
                  <button
                    onClick={() => setOpen(open === row.userId ? null : row.userId)}
                    // The negative margin gives back what the padding takes, so
                    // the row stays tight while the target reaches 44px.
                    className="font-mono text-label uppercase text-faint hover:text-ink transition-colors text-left inline-flex items-center min-h-[44px] py-s2 -my-s2"
                  >
                    {row.total} {row.total === 1 ? "time" : "times"} · {duration(row.awayMs)} away
                    {row.strikes > 0 ? ` · ${row.strikes} counted` : " · none counted"} ·{" "}
                    {open === row.userId ? "hide" : "when"}
                  </button>
                ) : (
                  <span className="block font-mono text-label uppercase text-faint">
                    never left the page
                  </span>
                )}

                {row.lockReason && (
                  <p className="text-meta text-muted mt-s2 break-words">
                    Paused {row.byHost ? "by you" : "automatically"}: {row.lockReason}
                  </p>
                )}
                {row.disqualifyReason && (
                  <p className="text-meta text-muted mt-s2 break-words">
                    Disqualified: {row.disqualifyReason}
                  </p>
                )}
              </span>

              <Actions
                competitionId={competitionId}
                row={row}
                ended={ended}
              />
            </div>

            {open === row.userId && row.log.length > 0 && (
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
    </section>
  );
}

function Badge({ tone, children }: { tone: "danger" | "success"; children: React.ReactNode }) {
  return (
    <span
      className="ml-s2 text-label uppercase px-s2 py-[2px] rounded-sm whitespace-nowrap"
      style={{ background: `var(--${tone}-soft)`, color: `var(--${tone})` }}
    >
      {children}
    </span>
  );
}

function Actions({
  competitionId,
  row,
  ended,
}: {
  competitionId: string;
  row: FocusRow;
  ended: boolean;
}) {
  const router = useRouter();
  const [asking, setAsking] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, start] = useTransition();

  const run = (fn: () => Promise<{ ok: boolean }>) =>
    start(async () => {
      await fn();
      setAsking(false);
      setReason("");
      router.refresh();
    });

  // Asking for the reason. The same form serves both decisions.
  if (asking) {
    const verb = ended ? "Disqualify" : "Stop the paper";
    return (
      <div className="flex flex-col gap-s2 w-full sm:w-auto sm:min-w-[280px]">
        <label className="flex flex-col gap-s2">
          <span className="text-label uppercase text-faint">
            Why — {row.name || "they"} will read this
          </span>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={MAX_REASON}
            autoFocus
            placeholder={ended ? "Answers matched another paper" : "Second screen open"}
            className="bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink placeholder:text-faint min-h-[44px]"
          />
        </label>
        <div className="flex flex-wrap gap-s2">
          <button
            onClick={() =>
              run(() =>
                ended
                  ? disqualifyPlayerAction(competitionId, row.userId, reason)
                  : blockPlayerAction(competitionId, row.userId, reason)
              )
            }
            disabled={pending || reason.trim() === ""}
            className="inline-flex items-center min-h-[44px] px-s4 rounded-md text-ui font-semibold text-on-accent transition-colors disabled:opacity-50"
            style={{ background: "var(--danger)" }}
          >
            {pending ? "…" : verb}
          </button>
          <button
            onClick={() => { setAsking(false); setReason(""); }}
            className="inline-flex items-center min-h-[44px] px-s4 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-s2 shrink-0">
      {row.locked && (
        <button
          onClick={() => run(() => unlockPlayerAction(competitionId, row.userId))}
          disabled={pending}
          className="inline-flex items-center min-h-[44px] px-s4 rounded-md border border-line text-meta text-ink hover:border-accent transition-colors disabled:opacity-60"
        >
          {pending ? "…" : "Let them carry on"}
        </button>
      )}

      {row.disqualified ? (
        <button
          onClick={() => run(() => reinstatePlayerAction(competitionId, row.userId))}
          disabled={pending}
          className="inline-flex items-center min-h-[44px] px-s4 rounded-md border border-line text-meta text-ink hover:border-accent transition-colors disabled:opacity-60"
        >
          {pending ? "…" : "Put them back"}
        </button>
      ) : (
        // Stopping a paper is only meaningful while one is open; afterwards the
        // question is whether it counts.
        (ended || !row.locked) && (
          <button
            onClick={() => setAsking(true)}
            className="inline-flex items-center min-h-[44px] px-s4 rounded-md border border-line text-meta text-muted hover:text-ink transition-colors"
            style={{ borderColor: "var(--border)" }}
          >
            {ended ? "Disqualify" : "Stop their paper"}
          </button>
        )
      )}
    </div>
  );
}
