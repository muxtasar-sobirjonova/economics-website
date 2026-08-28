"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCompetitionAction } from "@/app/actions/compete";
import {
  MIN_QUESTIONS, MAX_QUESTIONS, MIN_SECONDS, MAX_SECONDS, MAX_TITLE,
} from "@/lib/compete/setup";

/** Opening a competition. Only rendered for someone allowed to run one. */
export function CreateCompetition({ topics }: { topics: { name: string; count: number }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(12);
  const [secondsPerQuestion, setSeconds] = useState(25);
  const [access, setAccess] = useState<"OPEN" | "LINK">("OPEN");

  const available = topic ? (topics.find((t) => t.name === topic)?.count ?? 0)
    : topics.reduce((n, t) => n + t.count, 0);

  const submit = () => {
    setError(null);
    start(async () => {
      const res = await createCompetitionAction({ title, topic, questionCount, secondsPerQuestion, access });
      if (!res.ok) return setError(res.error);
      router.push(`/compete/${res.data.code}`);
    });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center min-h-[48px] px-s6 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors"
      >
        Open a competition
      </button>
    );
  }

  return (
    <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5 flex flex-col gap-s4">
      <h2 className="text-h3 font-semibold text-ink">Open a competition</h2>

      <label className="flex flex-col gap-s2">
        <span className="text-label uppercase text-faint">Name</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={MAX_TITLE}
          placeholder="Chapter 3 showdown"
          className="bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink placeholder:text-faint min-h-[44px]"
        />
      </label>

      <div className="grid sm:grid-cols-2 gap-s4">
        <label className="flex flex-col gap-s2">
          <span className="text-label uppercase text-faint">Topic</span>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink min-h-[44px]"
          >
            <option value="">Everything ({topics.reduce((n, t) => n + t.count, 0)})</option>
            {topics.map((t) => (
              <option key={t.name} value={t.name}>{t.name} ({t.count})</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-s2">
          <span className="text-label uppercase text-faint">Who can join</span>
          <select
            value={access}
            onChange={(e) => setAccess(e.target.value === "LINK" ? "LINK" : "OPEN")}
            className="bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink min-h-[44px]"
          >
            <option value="OPEN">Anyone — listed here</option>
            <option value="LINK">Only people with the code</option>
          </select>
        </label>

        <label className="flex flex-col gap-s2">
          <span className="text-label uppercase text-faint">
            Questions · {questionCount}
          </span>
          <input
            type="range" min={MIN_QUESTIONS} max={MAX_QUESTIONS} value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="min-h-[44px] accent-[var(--accent)]"
          />
        </label>

        <label className="flex flex-col gap-s2">
          <span className="text-label uppercase text-faint">
            Seconds a question · {secondsPerQuestion}
          </span>
          <input
            type="range" min={MIN_SECONDS} max={MAX_SECONDS} step={5} value={secondsPerQuestion}
            onChange={(e) => setSeconds(Number(e.target.value))}
            className="min-h-[44px] accent-[var(--accent)]"
          />
        </label>
      </div>

      <p className="text-meta text-muted">
        {available} question{available === 1 ? "" : "s"} available
        {topic ? ` in ${topic}` : ""}. Competitions are unrated — nothing here
        moves anyone&apos;s duel rating.
      </p>

      {error && <p className="text-meta" style={{ color: "var(--danger)" }}>{error}</p>}

      <div className="flex flex-wrap gap-s3">
        <button
          onClick={submit}
          disabled={pending}
          className="inline-flex items-center min-h-[48px] px-s5 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors disabled:opacity-60"
        >
          {pending ? "Opening…" : "Open it"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="inline-flex items-center min-h-[48px] px-s5 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </div>
    </section>
  );
}
