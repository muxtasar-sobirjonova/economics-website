"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { joinCompetitionAction } from "@/app/actions/compete";
import { CODE_LENGTH } from "@/lib/compete/code";

export function JoinByCode() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await joinCompetitionAction(code);
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
      {error && <p className="text-meta" style={{ color: "var(--danger)" }}>{error}</p>}
    </form>
  );
}
