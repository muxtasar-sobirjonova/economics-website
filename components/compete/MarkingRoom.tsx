"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  gradeBatchAction,
  overrideMarkAction,
  markIdenticalAction,
} from "@/app/actions/problems";
import type { MarkedAnswer, MarkingProgress } from "@/lib/compete/problemService";
import { Rich } from "@/components/compete/Rich";

/**
 * Marking a room.
 *
 * The model works through the pile in batches and the host has the last word
 * on every mark it gives. Both halves matter: three hundred answers is more
 * than anyone will read carefully, and a mark nobody can change is a mark a
 * student cannot argue with.
 */

/** Enough batches to clear a large room, and a wall to stop an accidental loop. */
const MAX_ROUNDS = 60;

const TONE: Record<string, { label: string; colour: string }> = {
  PENDING: { label: "not marked", colour: "var(--muted)" },
  AUTO: { label: "key", colour: "var(--success)" },
  AI: { label: "model", colour: "var(--accent)" },
  HOST: { label: "you", colour: "var(--reward)" },
};

export function MarkingRoom({
  competitionId,
  sheet,
  progress,
}: {
  competitionId: string;
  sheet: MarkedAnswer[];
  progress: MarkingProgress;
}) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(progress.pending);
  const [note, setNote] = useState<string | null>(null);
  const [onlyPending, setOnlyPending] = useState(progress.pending > 0);

  const runModel = async () => {
    setRunning(true);
    setNote(null);

    for (let round = 0; round < MAX_ROUNDS; round++) {
      const res = await gradeBatchAction(competitionId);
      if (!res.ok) {
        setNote(res.error);
        break;
      }
      setLeft(res.data.pending);

      if (res.data.pending === 0) {
        setNote("Everything the model marks is marked.");
        break;
      }
      // Nothing marked while answers still wait means it is refusing them, not
      // working through them. Stopping beats spending a hundred more calls.
      if (res.data.stalled) {
        setNote("The model could not mark the rest. Read those by hand.");
        break;
      }
    }

    setRunning(false);
    router.refresh();
  };

  const rows = onlyPending ? sheet.filter((a) => a.gradedBy === "PENDING") : sheet;

  return (
    <div className="flex flex-col gap-s4">
      <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s4 flex flex-wrap items-center gap-s4">
        <div className="flex-1 min-w-[200px]">
          <span className="font-mono text-label uppercase text-faint">Marking</span>
          <p className="text-ui text-ink mt-1">
            {progress.total - left} of {progress.total} marked
            {left > 0 ? ` · ${left} waiting` : ""}
          </p>
          {!progress.modelAvailable && (
            <p className="text-meta text-muted mt-s2 max-w-[52ch]">
              No marking model is configured, so nothing is marked automatically.
              Set <code className="font-mono">ANTHROPIC_API_KEY</code> to turn
              that on, or mark these by hand below.
            </p>
          )}
        </div>

        {progress.modelAvailable && left > 0 && (
          <button
            onClick={() => void runModel()}
            disabled={running}
            className="inline-flex items-center min-h-[48px] px-s5 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors disabled:opacity-60"
          >
            {running ? `Marking… ${left} left` : `Mark ${left} with the model`}
          </button>
        )}
      </section>

      {note && <p className="text-meta text-muted">{note}</p>}

      <div className="flex items-center gap-s3">
        <button
          onClick={() => setOnlyPending((v) => !v)}
          className="inline-flex items-center min-h-[44px] px-s4 rounded-md border border-line text-meta text-muted hover:text-ink transition-colors"
        >
          {onlyPending ? "Show every answer" : "Show only what is waiting"}
        </button>
        <span className="text-meta text-faint">{rows.length} shown</span>
      </div>

      {groupByProblem(rows).map((group) => (
        <section key={group.problemId} className="flex flex-col gap-s3">
          <div className="flex flex-wrap items-baseline gap-s3">
            <h3 className="text-h3 font-semibold text-ink break-words">{group.title}</h3>
            <span className="h-px bg-line flex-1 min-w-[20px]" />
            <span className="text-label uppercase text-faint shrink-0">
              {group.answers.length} answer{group.answers.length === 1 ? "" : "s"}
            </span>
          </div>

          <ul className="list-none m-0 p-0 flex flex-col gap-s3">
            {group.answers.map((answer) => (
              <AnswerCard
                key={answer.answerId}
                competitionId={competitionId}
                answer={answer}
                sameCount={group.same.get(fold(answer.text)) ?? 1}
              />
            ))}
          </ul>
        </section>
      ))}

      {rows.length === 0 && (
        <p className="text-meta text-muted">Nothing is waiting to be marked.</p>
      )}
    </div>
  );
}

/**
 * The same answer, written the same way.
 *
 * Folded the way the key folds one, so " 3025 " and "3025" are one answer and
 * the host is not asked to mark the difference between two spaces.
 */
function fold(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

function groupByProblem(rows: MarkedAnswer[]) {
  const groups = new Map<string, { problemId: string; title: string; answers: MarkedAnswer[] }>();

  for (const row of rows) {
    const group = groups.get(row.problemId) ?? {
      problemId: row.problemId,
      title: row.problemTitle,
      answers: [],
    };
    group.answers.push(row);
    groups.set(row.problemId, group);
  }

  // How many papers wrote each answer, so a card can offer to mark them all.
  return [...groups.values()].map((group) => {
    const same = new Map<string, number>();
    for (const a of group.answers) {
      const key = fold(a.text);
      if (key) same.set(key, (same.get(key) ?? 0) + 1);
    }
    return { ...group, same };
  });
}

function AnswerCard({
  competitionId,
  answer,
  sameCount,
}: {
  competitionId: string;
  answer: MarkedAnswer;
  /** How many papers wrote this same answer, this one included. */
  sameCount: number;
}) {
  const router = useRouter();
  const [points, setPoints] = useState(String(answer.points));
  const [feedback, setFeedback] = useState(answer.feedback ?? "");
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  const tone = TONE[answer.gradedBy] ?? TONE.PENDING;

  /** The same mark, to every paper that wrote this answer to this problem. */
  const saveAll = () => {
    start(async () => {
      const res = await markIdenticalAction(
        competitionId,
        answer.problemId,
        answer.text,
        Number(points),
        feedback.trim() || null
      );
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
      }
    });
  };

  const save = () => {
    start(async () => {
      const res = await overrideMarkAction(
        competitionId,
        answer.answerId,
        Number(points),
        feedback.trim() || null
      );
      if (res.ok) {
        setPoints(String(res.data.points));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
      }
    });
  };

  return (
    <li className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-s3 px-s4 py-s3 border-b border-line bg-bg-sunk">
        <span className="text-ui text-ink min-w-0 break-words">
          {answer.playerName || "Anonymous"} · {answer.problemTitle}
        </span>
        <span
          className="text-label uppercase px-s2 py-1 rounded-sm shrink-0"
          style={{ color: tone.colour, border: `1px solid ${tone.colour}` }}
        >
          {tone.label} · {answer.points}/{answer.maxPoints}
        </span>
      </div>

      <div className="p-s4 flex flex-col gap-s3">
        <details>
          <summary className="text-label uppercase text-faint cursor-pointer min-h-[24px]">
            The problem
          </summary>
          <div className="mt-s3 pl-s3 border-l-2 border-line">
            <Rich source={answer.statement} />
          </div>
        </details>

        <div>
          <span className="text-label uppercase text-faint">What they wrote</span>
          <p className="text-ui text-ink mt-s2 whitespace-pre-wrap leading-relaxed">
            {answer.text || <span className="text-faint">Nothing.</span>}
          </p>
        </div>

        {answer.feedback && answer.gradedBy !== "HOST" && (
          <p className="text-meta text-muted italic">{answer.feedback}</p>
        )}

        <div className="flex flex-wrap items-end gap-s3">
          <label className="flex flex-col gap-s2">
            <span className="text-label uppercase text-faint">
              Marks out of {answer.maxPoints}
            </span>
            <input
              value={points}
              onChange={(e) => setPoints(e.target.value.replace(/[^\d]/g, ""))}
              inputMode="numeric"
              className="w-24 bg-raised border border-line rounded-md px-s3 py-s2 font-mono text-h3 text-ink text-center min-h-[48px]"
            />
          </label>

          <label className="flex flex-col gap-s2 flex-1 min-w-[200px]">
            <span className="text-label uppercase text-faint">Comment (optional)</span>
            <input
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={240}
              placeholder="What earned the marks"
              className="bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink placeholder:text-faint min-h-[48px]"
            />
          </label>

          <button
            onClick={save}
            disabled={pending}
            className="inline-flex items-center min-h-[48px] px-s5 rounded-md border border-line text-ui text-ink hover:border-accent transition-colors disabled:opacity-60"
          >
            {pending ? "Saving…" : saved ? "Saved" : "Set the mark"}
          </button>

          {sameCount > 1 && answer.text.trim() !== "" && (
            <button
              onClick={saveAll}
              disabled={pending}
              className="inline-flex items-center min-h-[48px] px-s4 rounded-md border text-ui transition-colors disabled:opacity-60"
              style={{ borderColor: "var(--accent)", color: "var(--accent-strong)" }}
            >
              {pending ? "…" : `Same for all ${sameCount}`}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
