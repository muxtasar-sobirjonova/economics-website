"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { joinCompetitionAction } from "@/app/actions/compete";
import { CODE_LENGTH } from "@/lib/compete/code";
import { MAX_ALIAS } from "@/lib/compete/setup";

export function JoinByCode() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await joinCompetitionAction(code, alias);
      if (!res.ok) return setError(res.error);
      router.push(`/compete/${res.data.code}`);
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-s2">
      <div className="flex gap-s2">
        <label htmlFor="join-code" className="sr-only">Competition code</label>
        <input
          id="join-code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Code"
          maxLength={CODE_LENGTH + 2}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 min-w-0 bg-raised border border-line rounded-md px-s3 py-s2 font-mono text-h3 tracking-[0.2em] text-ink placeholder:text-faint placeholder:tracking-normal placeholder:text-ui min-h-[52px] uppercase"
        />
        <button
          type="submit"
          disabled={pending}
          className="px-s5 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors min-h-[52px] shrink-0 disabled:opacity-60"
        >
          {pending ? "…" : "Join"}
        </button>
      </div>
      {/*
        A name for the room, not an account. The board shows this and never the
        account name, so a class can compete without everyone reading everyone
        else's full name off a leaderboard. The host still sees both.
      */}
      <label className="flex flex-col gap-s2">
        <span className="text-label uppercase text-faint">
          Join as (optional) · shown to the room instead of your name
        </span>
        <input
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          maxLength={MAX_ALIAS}
          placeholder="Leave it empty to use your own name"
          autoComplete="off"
          className="bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink placeholder:text-faint min-h-[44px]"
        />
      </label>

      {error && <p className="text-meta" style={{ color: "var(--danger)" }}>{error}</p>}
    </form>
  );
}
