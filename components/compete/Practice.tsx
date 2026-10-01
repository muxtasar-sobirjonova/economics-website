"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { RichLazy as Rich } from "./RichLazy";
import { nextProblemAction, answerPracticeAction } from "@/app/actions/practice";
import { MAX_PRACTICE_ANSWER } from "@/lib/compete/practice";
import type { PracticeProblem, PracticeResult, PracticeOverview } from "@/lib/compete/practiceService";

/**
 * Working the bank on your own.
 *
 * Deliberately unlike a room. There is no clock, nothing is watched, nothing
 * is ranked and you stop when you like — a competition measures you and this
 * teaches you, and a screen that looked like the other one would invite the
 * wrong kind of attention to the mark.
 *
 * The one rule it shares with a room: the worked solution does not exist on
 * this page until the answer has been sent and recorded. It arrives with the
 * mark, in the same response.
 */

type Phase =
  | { at: "idle" }
  | { at: "working"; problem: PracticeProblem; since: number }
  | { at: "marked"; problem: PracticeProblem; result: PracticeResult; answer: string }
  | { at: "empty"; why: "topic-done" | "all-done" | "ai-spent" };

const EMPTY_COPY: Record<"topic-done" | "all-done" | "ai-spent", string> = {
  "topic-done": "You have worked every problem in this topic. Pick another one.",
  "all-done": "You have worked every problem in the bank. That is the lot — well done.",
  "ai-spent":
    "Today's marked answers are used up. Problems with an answer key are still open, and the rest come back tomorrow.",
};

export function Practice({ overview }: { overview: PracticeOverview }) {
  const [topic, setTopic] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>({ at: "idle" });
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [aiLeft, setAiLeft] = useState(overview.aiLeft);
  const [pending, start] = useTransition();

  const box = useRef<HTMLTextAreaElement>(null);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase.at === "working") box.current?.focus();
    if (phase.at === "marked") top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [phase.at]);

  function serve(forTopic: string | null) {
    setError(null);
    setAnswer("");
    start(async () => {
      const got = await nextProblemAction(forTopic);
      if (!got) return setError("Sign in again — your session has expired.");
      if ("empty" in got) return setPhase({ at: "empty", why: got.empty });
      setAiLeft(got.aiLeft);
      setPhase({ at: "working", problem: got.problem, since: Date.now() });
    });
  }

  function submit() {
    if (phase.at !== "working" || !answer.trim()) return;
    const { problem, since } = phase;
    setError(null);
    start(async () => {
      const res = await answerPracticeAction(problem.id, answer, Date.now() - since);
      if (!res.ok) return setError(res.error);
      setAiLeft(res.data.aiLeft);
      setPhase({ at: "marked", problem, result: res.data, answer });
    });
  }

  if (!overview.available) {
    return (
      <p className="text-meta text-muted border border-line rounded-lg p-s4 bg-raised">
        Practice is not set up yet. The 20260928_add_problem_practice migration has
        not been run.
      </p>
    );
  }

  return (
    <div ref={top} className="flex flex-col gap-s5 scroll-mt-s4">
      <TopicBar
        overview={overview}
        topic={topic}
        onPick={(t) => {
          setTopic(t);
          if (phase.at !== "working") serve(t);
        }}
        working={phase.at === "working"}
      />

      {error && (
        <p
          className="text-meta rounded-md px-s3 py-s3 border"
          style={{ borderColor: "var(--danger)", color: "var(--danger)" }}
          role="alert"
        >
          {error}
        </p>
      )}

      {phase.at === "idle" && (
        <Start left={overview.left} pending={pending} onStart={() => serve(topic)} />
      )}

      {phase.at === "empty" && (
        <div className="border border-line rounded-lg bg-raised p-s5 flex flex-col gap-s4 items-start">
          <p className="text-ui text-ink max-w-[52ch]">{EMPTY_COPY[phase.why]}</p>
          {phase.why !== "all-done" && (
            <button
              type="button"
              onClick={() => {
                setTopic(null);
                serve(null);
              }}
              className="min-h-[44px] px-s5 rounded-md text-ui font-medium"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              Try any topic
            </button>
          )}
        </div>
      )}

      {(phase.at === "working" || phase.at === "marked") && (
        <article className="border border-line rounded-lg bg-raised p-s4 md:p-s5 flex flex-col gap-s4">
          <header className="flex flex-wrap items-baseline gap-x-s3 gap-y-s1 min-w-0">
            <h2 className="text-h3 font-semibold text-ink min-w-0 break-words">
              {phase.problem.title}
            </h2>
            <span className="text-label uppercase text-faint">
              {phase.problem.topic} · {phase.problem.maxPoints}{" "}
              {phase.problem.maxPoints === 1 ? "mark" : "marks"}
            </span>
          </header>

          <div className="rounded-md bg-read-bg border border-line px-s3 py-s4 md:px-s5 md:py-s5">
            <Rich source={phase.problem.statement} />
          </div>

          {phase.problem.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={phase.problem.imageUrl}
              alt=""
              className="rounded-md border border-line max-w-full"
            />
          )}

          {phase.at === "working" ? (
            <Answering
              problem={phase.problem}
              answer={answer}
              setAnswer={setAnswer}
              onSubmit={submit}
              pending={pending}
              boxRef={box}
            />
          ) : (
            <Marked
              result={phase.result}
              answer={phase.answer}
              pending={pending}
              onNext={() => serve(topic)}
            />
          )}
        </article>
      )}

      {overview.aiLimit > 0 && (
        <p className="text-meta text-faint max-w-[58ch]">
          Written answers are marked by a model reading the worked solution, and
          you get {overview.aiLimit} of those a day — {aiLeft}{" "}
          {aiLeft === 1 ? "is" : "are"} left. Problems with an answer key are
          marked instantly and never count against it. Each problem is worked
          once: the solution comes with the mark.
        </p>
      )}
    </div>
  );
}

function Start({
  left,
  pending,
  onStart,
}: {
  left: number;
  pending: boolean;
  onStart: () => void;
}) {
  return (
    <div className="border border-line rounded-lg bg-raised p-s5 flex flex-col gap-s4 items-start">
      <p className="text-ui text-ink max-w-[52ch]">
        {left > 0
          ? `${left} ${left === 1 ? "problem" : "problems"} you have not worked yet. No clock, no room — stop whenever you like.`
          : "You have worked every problem in the bank."}
      </p>
      {left > 0 && (
        <button
          type="button"
          onClick={onStart}
          disabled={pending}
          className="min-h-[44px] px-s5 rounded-md text-ui font-medium disabled:opacity-60"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        >
          {pending ? "Finding one…" : "Give me a problem"}
        </button>
      )}
    </div>
  );
}

function TopicBar({
  overview,
  topic,
  onPick,
  working,
}: {
  overview: PracticeOverview;
  topic: string | null;
  onPick: (t: string | null) => void;
  working: boolean;
}) {
  if (overview.topics.length === 0) return null;

  const chip = (active: boolean) =>
    active
      ? {
          borderColor: "var(--accent)",
          background: "var(--accent-soft)",
          color: "var(--accent-strong)",
        }
      : { borderColor: "var(--border)", color: "var(--muted)" };

  return (
    <div className="flex flex-col gap-s2">
      <span className="text-label uppercase text-faint">Topic</span>
      <div className="flex flex-wrap gap-s2">
        <button
          type="button"
          onClick={() => onPick(null)}
          aria-pressed={topic === null}
          className="min-h-[44px] px-s4 rounded-md border text-meta transition-colors"
          style={chip(topic === null)}
        >
          Any
        </button>
        {overview.topics.map((t) => (
          <button
            key={t.topic}
            type="button"
            onClick={() => onPick(t.topic)}
            aria-pressed={topic === t.topic}
            className="min-h-[44px] px-s4 rounded-md border text-meta transition-colors"
            style={chip(topic === t.topic)}
          >
            {t.topic}{" "}
            <span className="text-faint">
              {t.done}/{t.total}
            </span>
          </button>
        ))}
      </div>
      {working && (
        <p className="text-meta text-faint">
          Picking a topic now takes effect on the next problem.
        </p>
      )}
    </div>
  );
}

function Answering({
  problem,
  answer,
  setAnswer,
  onSubmit,
  pending,
  boxRef,
}: {
  problem: PracticeProblem;
  answer: string;
  setAnswer: (s: string) => void;
  onSubmit: () => void;
  pending: boolean;
  boxRef: React.RefObject<HTMLTextAreaElement>;
}) {
  const short = problem.answerKind !== "OPEN";

  return (
    <div className="flex flex-col gap-s3 border-t border-line pt-s4">
      <label className="flex flex-col gap-s2">
        <span className="text-label uppercase text-faint">
          Your answer{problem.answerHint ? ` · ${problem.answerHint}` : ""}
        </span>
        <textarea
          ref={boxRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={short ? 2 : 8}
          maxLength={MAX_PRACTICE_ANSWER}
          placeholder={short ? "A number or a phrase" : "Show your working."}
          className="bg-bg border border-line rounded-md px-s3 py-s3 text-ui text-ink placeholder:text-faint leading-relaxed resize-y"
          style={{ minHeight: short ? 72 : 180 }}
        />
      </label>

      <div className="flex flex-wrap items-center gap-s3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={pending || !answer.trim()}
          className="min-h-[44px] px-s5 rounded-md text-ui font-medium disabled:opacity-60"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        >
          {pending ? "Marking…" : "Mark it"}
        </button>
        {problem.costsAi && (
          <span className="text-meta text-faint">Uses one of today&rsquo;s marked answers.</span>
        )}
      </div>
    </div>
  );
}

function Marked({
  result,
  answer,
  pending,
  onNext,
}: {
  result: PracticeResult;
  answer: string;
  pending: boolean;
  onNext: () => void;
}) {
  const full = result.maxPoints > 0 && result.points >= result.maxPoints;
  const none = result.points === 0;

  const tone =
    result.gradedBy === "PENDING"
      ? "var(--muted)"
      : full
        ? "var(--success)"
        : none
          ? "var(--danger)"
          : "var(--accent-strong)";

  return (
    <div className="flex flex-col gap-s4 border-t border-line pt-s4">
      <div className="flex flex-wrap items-baseline gap-x-s3 gap-y-s1">
        {result.gradedBy === "PENDING" ? (
          <span className="text-h3 font-semibold" style={{ color: tone }}>
            Not marked
          </span>
        ) : (
          <span className="text-h2 font-semibold" style={{ color: tone }}>
            {result.points}
            <span className="text-h3 text-muted"> / {result.maxPoints}</span>
          </span>
        )}
        <span className="text-label uppercase text-faint">
          {result.gradedBy === "AUTO"
            ? "Answer key"
            : result.gradedBy === "AI"
              ? "Marked against the solution"
              : "The model could not be reached — nothing was recorded against you"}
        </span>
      </div>

      {result.feedback && (
        <p className="text-ui text-ink leading-relaxed max-w-[58ch]">{result.feedback}</p>
      )}

      <details className="border border-line rounded-md">
        <summary className="cursor-pointer min-h-[44px] flex items-center px-s3 text-meta text-muted">
          What you wrote
        </summary>
        <p className="px-s3 pb-s3 text-meta text-muted whitespace-pre-wrap break-words">
          {answer}
        </p>
      </details>

      {result.solution && (
        <section className="flex flex-col gap-s2">
          <h3 className="text-label uppercase text-faint">Worked solution</h3>
          <div className="rounded-md bg-read-bg border border-line px-s3 py-s4 md:px-s4">
            <Rich source={result.solution} />
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={pending}
        className="min-h-[44px] px-s5 rounded-md text-ui font-medium self-start disabled:opacity-60"
        style={{ background: "var(--accent)", color: "var(--on-accent)" }}
      >
        {pending ? "Finding one…" : "Next problem"}
      </button>
    </div>
  );
}
