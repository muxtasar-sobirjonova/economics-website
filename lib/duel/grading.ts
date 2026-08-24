/**
 * Scoring a run.
 *
 * Pure: the engine hands it questions and what the player sent back. No
 * Prisma, so the rules can be tested without a database.
 */

export const QUESTIONS_PER_DUEL = 10;

/** A single question cannot contribute more than this to the clock. */
export const MAX_MS_PER_QUESTION = 30_000;

export interface AnswerKey {
  id: string;
  correctAnswer: string;
}

export interface SubmittedAnswer {
  questionId: string;
  /** null when the player ran out of time or skipped. */
  chosen: string | null;
  ms: number;
}

export interface GradedAnswer {
  questionId: string;
  chosen: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  ms: number;
}

export interface GradedRun {
  graded: GradedAnswer[];
  score: number;
}

function clampMs(ms: unknown): number {
  if (typeof ms !== "number" || !Number.isFinite(ms) || ms < 0) return 0;
  return Math.min(Math.round(ms), MAX_MS_PER_QUESTION);
}

/**
 * Answers are matched by question id, not by position: a client that reorders
 * or omits entries must not be able to shift answers onto other questions.
 * A question with no submitted answer counts as unanswered rather than wrong-
 * by-accident, which is the same thing for scoring but reads correctly in the
 * review screen.
 */
export function gradeRun(keys: AnswerKey[], submitted: SubmittedAnswer[]): GradedRun {
  const byId = new Map<string, SubmittedAnswer>();
  for (const a of submitted) {
    if (a && typeof a.questionId === "string" && !byId.has(a.questionId)) {
      byId.set(a.questionId, a);
    }
  }

  const graded = keys.map((k) => {
    const a = byId.get(k.id);
    const chosen = typeof a?.chosen === "string" ? a.chosen : null;
    return {
      questionId: k.id,
      chosen,
      correctAnswer: k.correctAnswer,
      isCorrect: chosen !== null && chosen === k.correctAnswer,
      ms: clampMs(a?.ms),
    };
  });

  return { graded, score: graded.filter((g) => g.isCorrect).length };
}

/**
 * The clock that settles a tie is measured on the server, from when the run
 * was created to when it was submitted. The per-question milliseconds the
 * client reports are kept for the review screen only — trusting them would
 * let a player send zero and win every tiebreak.
 */
export function elapsedMs(startedAt: Date, finishedAt: Date, questionCount: number): number {
  const raw = finishedAt.getTime() - startedAt.getTime();
  const cap = questionCount * MAX_MS_PER_QUESTION;
  if (!Number.isFinite(raw) || raw < 0) return cap;
  return Math.min(raw, cap);
}
