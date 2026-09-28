"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reopenCompetitionAction } from "@/app/actions/compete";
import { resultsCsvAction } from "@/app/actions/problems";

/**
 * What a host does with a room once it has finished.
 *
 * Two things, and they are the two a teacher actually asks for: the marks in a
 * spreadsheet, and the same paper again for the next class.
 */
export function HostTools({ competitionId }: { competitionId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  /**
   * The file is built on the server and saved by the browser.
   *
   * A Blob and an object URL rather than a download route: the results are
   * already behind the host check in the action, and a URL that served them
   * would be a second place to get that check wrong.
   */
  const download = () =>
    start(async () => {
      setError(null);
      const res = await resultsCsvAction(competitionId);
      if (!res.ok) return setError(res.error);

      const url = URL.createObjectURL(
        new Blob([res.data.csv], { type: "text/csv;charset=utf-8" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = res.data.filename;
      link.click();
      URL.revokeObjectURL(url);

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });

  const reopen = () =>
    start(async () => {
      setError(null);
      const res = await reopenCompetitionAction(competitionId);
      if (!res.ok) return setError(res.error);
      router.push(`/compete/${res.data.code}`);
    });

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s4 flex flex-wrap items-center gap-s3">
      <span className="text-label uppercase text-faint flex-1 min-w-[140px]">
        This room
      </span>

      <button
        onClick={download}
        disabled={pending}
        className="inline-flex items-center min-h-[44px] px-s4 rounded-md border border-line text-meta text-ink hover:border-accent transition-colors disabled:opacity-60"
      >
        {saved ? "Saved" : pending ? "…" : "Results as a spreadsheet"}
      </button>

      <button
        onClick={reopen}
        disabled={pending}
        className="inline-flex items-center min-h-[44px] px-s4 rounded-md border border-line text-meta text-ink hover:border-accent transition-colors disabled:opacity-60"
      >
        {pending ? "…" : "Set it again"}
      </button>

      {error && (
        <p className="text-meta w-full" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </section>
  );
}
