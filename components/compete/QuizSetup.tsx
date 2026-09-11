"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCompetitionAction } from "@/app/actions/compete";
import { QuestionEditor } from "@/components/duel/QuestionEditor";
import { FocusChoice } from "@/components/compete/FocusChoice";
import {
  MIN_QUESTIONS, MAX_QUESTIONS, MIN_SECONDS, MAX_SECONDS, MAX_TITLE,
  type FocusPolicy,
} from "@/lib/compete/setup";

/**
 * Opening a multiple choice room.
 *
 * The question editor sits inside this form rather than on a page of its own,
 * because the moment a host discovers the bank is missing the question they
 * wanted is the moment they are setting a room up. Sending them somewhere else
 * to write it is how a room gets opened without it.
 */
export function QuizSetup({
  topics,
  mayWrite,
  onCancel,
}: {
  topics: { name: string; count: number }[];
  /** MANAGE_QUESTIONS — whether this host may add to the bank. */
  mayWrite: boolean;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(12);
  const [secondsPerQuestion, setSeconds] = useState(25);
  const [access, setAccess] = useState<"OPEN" | "LINK">("OPEN");
  const [focusPolicy, setFocusPolicy] = useState<FocusPolicy>("NONE");
  const [focusAllowance, setFocusAllowance] = useState(2);

  const all = topics.reduce((n, t) => n + t.count, 0);
  const available = topic ? (topics.find((t) => t.name === topic)?.count ?? 0) : all;

  const submit = () => {
    setError(null);
    start(async () => {
      const res = await createCompetitionAction({
        title, topic, questionCount, secondsPerQuestion, access,
        focusPolicy, focusAllowance,
      });
      if (!res.ok) return setError(res.error);
      router.push(`/compete/${res.data.code}`);
    });
  };

  return (
    <div className="flex flex-col gap-s4">
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
            <option value="">Everything ({all})</option>
            {topics.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name} ({t.count})
              </option>
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
          <span className="text-label uppercase text-faint">Questions · {questionCount}</span>
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

      <FocusChoice
        policy={focusPolicy}
        setPolicy={setFocusPolicy}
        allowance={focusAllowance}
        setAllowance={setFocusAllowance}
      />

      {/* A rule and a label, not another padded box: the editor below is
          already a card, and on a 375px screen every nested padding comes out
          of the width of the option fields. */}
      {mayWrite && (
        <div className="pt-s4 border-t border-line flex flex-col gap-s3">
          <span className="text-label uppercase text-faint">
            Not in the bank? Write it now
          </span>
          <p className="text-meta text-muted max-w-[58ch]">
            A question written here joins the shared bank, so it can be drawn
            into this room and into rated duels. Anyone who meets it in a
            competition will never be served it in a duel.
          </p>
          <QuestionEditor topics={topics.map((t) => t.name)} />
        </div>
      )}

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
          onClick={onCancel}
          className="inline-flex items-center min-h-[48px] px-s5 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
