"use client";

import { MAX_ALLOWANCE, type FocusPolicy } from "@/lib/compete/setup";

/**
 * How closely a room is watched. The host's call, per room.
 *
 * The note under it is not marketing copy — it is the honest limit, and a host
 * who does not read it will believe this stops cheating and plan around a
 * guarantee that does not exist.
 */

const COPY: Record<FocusPolicy, { label: string; detail: string }> = {
  NONE: {
    label: "Off",
    detail: "Nobody is watched. Right for practice and for anything unmarked.",
  },
  WARN: {
    label: "Record it",
    detail:
      "Leaving the page is recorded and you see it beside each paper. The student is told it was seen. Nothing stops.",
  },
  LOCK: {
    label: "Pause the paper",
    detail:
      "The same record, and the paper freezes once the allowance is used up. Nothing is lost and you can let anyone carry on.",
  },
};

export function FocusChoice({
  policy,
  setPolicy,
  allowance,
  setAllowance,
}: {
  policy: FocusPolicy;
  setPolicy: (p: FocusPolicy) => void;
  allowance: number;
  setAllowance: (n: number) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-s3 border-0 p-0 m-0">
      <legend className="text-label uppercase text-faint">Leaving the page</legend>

      <div className="flex flex-wrap gap-s2">
        {(["NONE", "WARN", "LOCK"] as FocusPolicy[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPolicy(p)}
            aria-pressed={policy === p}
            className="min-h-[44px] px-s4 rounded-md border text-ui transition-colors"
            style={
              policy === p
                ? {
                    borderColor: "var(--accent)",
                    background: "var(--accent-soft)",
                    color: "var(--accent-strong)",
                  }
                : { borderColor: "var(--border)", color: "var(--muted)" }
            }
          >
            {COPY[p].label}
          </button>
        ))}
      </div>

      <p className="text-meta text-muted max-w-[58ch]">{COPY[policy].detail}</p>

      {policy === "LOCK" && (
        <label className="flex flex-col gap-s2">
          <span className="text-label uppercase text-faint">
            Allowed first ·{" "}
            {allowance === 0
              ? "none — the first time pauses it"
              : `${allowance} ${allowance === 1 ? "time" : "times"}`}
          </span>
          <input
            type="range"
            min={0}
            max={MAX_ALLOWANCE}
            value={allowance}
            onChange={(e) => setAllowance(Number(e.target.value))}
            className="min-h-[44px] accent-[var(--accent)] max-w-[320px]"
          />
        </label>
      )}

      {policy !== "NONE" && (
        <p className="text-meta text-faint max-w-[58ch]">
          Pasting into the answer box is switched off too. Be clear with the
          room about what this does and does not see: it catches another tab or
          another window on the same device, and it cannot see a phone lying
          beside the laptop. Nothing that runs in a browser can.
          {policy === "LOCK" &&
            " Absences under ten seconds are recorded but never pause anyone — a notification is not an accusation."}
        </p>
      )}
    </fieldset>
  );
}
