"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { joinCompetitionAction } from "@/app/actions/compete";
import { CODE_LENGTH } from "@/lib/compete/code";
import { MAX_ALIAS } from "@/lib/compete/setup";

/**
 * Joining a room.
 *
 * One box per character rather than one box for six. A room code is read off a
 * screen or a whiteboard and typed by somebody who has not seen it before, and
 * the boxes keep their place for them — they can see at a glance how many are
 * left, and a mistyped character is one backspace rather than a re-read of the
 * whole string.
 *
 * Pasting a code into any box fills them all, because the code usually arrives
 * in a message.
 */
export function JoinRoom({ liveRooms = 0 }: { liveRooms?: number }) {
  const router = useRouter();
  const [chars, setChars] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [alias, setAlias] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const code = chars.join("");

  const put = (i: number, value: string) => {
    setError(null);
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (clean.length > 1) {
      // A paste, wherever it landed: fill from the start.
      const next = Array(CODE_LENGTH).fill("");
      clean.slice(0, CODE_LENGTH).split("").forEach((c, n) => (next[n] = c));
      setChars(next);
      boxes.current[Math.min(clean.length, CODE_LENGTH - 1)]?.focus();
      return;
    }

    setChars((prev) => {
      const next = [...prev];
      next[i] = clean;
      return next;
    });
    if (clean && i < CODE_LENGTH - 1) boxes.current[i + 1]?.focus();
  };

  const key = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !chars[i] && i > 0) {
      boxes.current[i - 1]?.focus();
      setChars((prev) => {
        const next = [...prev];
        next[i - 1] = "";
        return next;
      });
    } else if (e.key === "ArrowLeft" && i > 0) boxes.current[i - 1]?.focus();
    else if (e.key === "ArrowRight" && i < CODE_LENGTH - 1) boxes.current[i + 1]?.focus();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.length < CODE_LENGTH) {
      setError(`Enter the full ${CODE_LENGTH}-character code.`);
      boxes.current[chars.findIndex((c) => !c)]?.focus();
      return;
    }

    start(async () => {
      const res = await joinCompetitionAction(code, alias);
      if (!res.ok) return setError(res.error);
      router.push(`/compete/${res.data.code}`);
    });
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-lg border border-line p-s5 md:px-s6 grid lg:grid-cols-[230px_1fr] gap-s5 lg:gap-s7 items-center"
      style={{ background: "var(--bg-sunk)" }}
    >
      <div>
        <h2 className="font-reading text-h2 font-semibold tracking-tight text-ink">Join a room</h2>
        <p className="text-ui text-muted mt-s1">
          Enter the {CODE_LENGTH}-character code from your host.
        </p>
        {liveRooms > 0 && (
          <a
            href="#open"
            className="inline-flex items-center gap-s2 text-meta font-semibold mt-s3"
            style={{ color: "var(--success)" }}
          >
            <span
              className="w-[7px] h-[7px] rounded-full animate-pulse"
              style={{ background: "var(--success)" }}
              aria-hidden
            />
            {liveRooms} {liveRooms === 1 ? "room" : "rooms"} open now
          </a>
        )}
      </div>

      <div>
        <div className="flex gap-s2" role="group" aria-label="Room code">
          {chars.map((c, i) => (
            <input
              key={i}
              ref={(el) => {
                boxes.current[i] = el;
              }}
              value={c}
              onChange={(e) => put(i, e.target.value)}
              onKeyDown={(e) => key(i, e)}
              onFocus={(e) => e.currentTarget.select()}
              maxLength={CODE_LENGTH}
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              aria-label={`Character ${i + 1}`}
              className="w-[44px] h-[54px] text-center font-mono font-semibold text-h2 uppercase rounded-md border-[1.5px] bg-raised text-ink focus:outline-none transition-colors"
              style={{
                borderColor: error ? "var(--danger)" : "var(--border-strong)",
                // Split after three, the way a code is read aloud.
                marginRight: i === 2 ? 10 : undefined,
              }}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-s2 mt-s3">
          <input
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            maxLength={MAX_ALIAS}
            placeholder="Your name (optional)"
            aria-label="Your name"
            autoComplete="off"
            className="flex-1 min-w-0 max-w-[260px] min-h-[44px] bg-raised border border-line rounded-lg px-s4 text-ui text-ink placeholder:text-faint"
          />
          <button
            type="submit"
            disabled={pending}
            className="min-h-[44px] px-s5 rounded-lg text-ui font-semibold shrink-0 disabled:opacity-60 transition-colors"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            {pending ? "Joining…" : "Join"}
          </button>
        </div>

        {error && (
          <p className="text-meta font-semibold mt-s2" style={{ color: "var(--danger)" }} role="alert">
            {error}
          </p>
        )}

        {/* The board shows this and never the account name, so a class can
            compete without everyone reading everyone else's full name off a
            leaderboard. The host still sees both. */}
        <p className="text-meta text-faint mt-s2">
          Other players see this name. Leave it blank to use your account name.
        </p>
      </div>
    </form>
  );
}
