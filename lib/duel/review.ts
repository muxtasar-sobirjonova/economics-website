import type { GradedAnswer } from "./grading";

/**
 * Building the post-duel review.
 *
 * This is the part of the product that teaches. A score tells a player they
 * got six; seeing where they and their opponent diverged, and why, is the
 * reason to come back. Pure, so it can be tested without a database.
 */

export interface ReviewQuestion {
  id: string;
  topic: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
}

export interface ReviewLine {
  id: string;
  topic: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
  yourAnswer: string | null;
  yourCorrect: boolean;
  theirAnswer: string | null;
  theirCorrect: boolean;
  /** True when exactly one of the two got it — the interesting rows. */
  decisive: boolean;
}

/**
 * The answers column is JSON written by this code, but a column typed Json is
 * a column anything could be in after a bad migration or a hand edit. Parsed
 * defensively rather than cast, so a malformed row costs one blank line in the
 * review instead of a crashed page.
 */
export function parseGraded(value: unknown): GradedAnswer[] {
  if (!Array.isArray(value)) return [];

  const out: GradedAnswer[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const a = raw as Record<string, unknown>;
    if (typeof a.questionId !== "string") continue;

    out.push({
      questionId: a.questionId,
      chosen: typeof a.chosen === "string" ? a.chosen : null,
      correctAnswer: typeof a.correctAnswer === "string" ? a.correctAnswer : "",
      isCorrect: a.isCorrect === true,
      ms: typeof a.ms === "number" && Number.isFinite(a.ms) ? a.ms : 0,
    });
  }
  return out;
}

export function buildReview(
  questions: ReviewQuestion[],
  mine: GradedAnswer[],
  theirs: GradedAnswer[]
): ReviewLine[] {
  const byMe = new Map(mine.map((a) => [a.questionId, a]));
  const byThem = new Map(theirs.map((a) => [a.questionId, a]));

  return questions.map((q) => {
    const a = byMe.get(q.id);
    const b = byThem.get(q.id);

    // Correctness is recomputed against the question rather than trusted from
    // the stored flag: if a question is ever corrected, the review should show
    // the truth as it now stands.
    const yourCorrect = a?.chosen != null && a.chosen === q.correctAnswer;
    const theirCorrect = b?.chosen != null && b.chosen === q.correctAnswer;

    return {
      id: q.id,
      topic: q.topic,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      yourAnswer: a?.chosen ?? null,
      yourCorrect,
      theirAnswer: b?.chosen ?? null,
      theirCorrect,
      decisive: yourCorrect !== theirCorrect,
    };
  });
}
