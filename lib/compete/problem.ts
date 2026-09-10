import { cleanText, type AnswerKey } from "./answerCheck";

/**
 * A problem — the long kind, out of a paper, with a box to write in.
 *
 * Kept in its own table rather than added to DuelQuestion, and for the same
 * reason DuelQuestion was kept apart from QuizQuestion: the rated ladder is
 * built on four options and a shuffle, and a problem cannot be served into it
 * by any later refactor if the ladder cannot see the table at all.
 */

export type AnswerKind = "NUMERIC" | "SHORT" | "OPEN";

/**
 * Who awards the mark.
 *
 * - `AUTO` — the key decides. What the key cannot read scores nothing and is
 *   flagged, so the host sees it rather than a student silently losing a mark.
 * - `AI`   — the key decides what it can; the model reads the rest and may
 *   award part of the mark. Every mark it gives is the host's to change.
 * - `HOST` — nothing is scored without a person. For the problems where the
 *   working is the answer.
 */
export type GradingMode = "AUTO" | "AI" | "HOST";

export const MAX_STATEMENT = 6000;
export const MAX_SOLUTION = 6000;
export const MAX_TITLE = 120;
export const MAX_HINT = 80;
export const MIN_POINTS = 1;
export const MAX_POINTS = 100;
export const MAX_ACCEPTED = 12;

export interface ProblemInput {
  title?: unknown;
  topic?: unknown;
  statement?: unknown;
  imageUrl?: unknown;
  answerKind?: unknown;
  numericValue?: unknown;
  numericTolerance?: unknown;
  acceptedAnswers?: unknown;
  answerHint?: unknown;
  solution?: unknown;
  maxPoints?: unknown;
  gradingMode?: unknown;
}

export interface Problem {
  title: string;
  topic: string;
  /** Markdown with `$…$` maths. Rendered, never injected as HTML. */
  statement: string;
  imageUrl: string | null;
  answerKind: AnswerKind;
  numericValue: number | null;
  numericTolerance: number;
  acceptedAnswers: string[];
  /** Placeholder in the box — "in thousands of so'm", "one word". */
  answerHint: string | null;
  /** The worked answer. Never leaves the server while a competition is live. */
  solution: string | null;
  maxPoints: number;
  gradingMode: GradingMode;
}

export type ProblemError =
  | "statement-missing"
  | "statement-too-long"
  | "title-too-long"
  | "solution-too-long"
  | "points-out-of-range"
  | "numeric-value-missing"
  | "tolerance-negative"
  | "accepted-missing"
  | "accepted-too-many"
  | "accepted-duplicated"
  | "auto-needs-a-key"
  | "ai-needs-a-solution"
  | "image-not-allowed";

export const PROBLEM_ERROR_COPY: Record<ProblemError, string> = {
  "statement-missing": "Write the problem itself.",
  "statement-too-long": `Keep the problem under ${MAX_STATEMENT} characters.`,
  "title-too-long": `Keep the title under ${MAX_TITLE} characters.`,
  "solution-too-long": `Keep the solution under ${MAX_SOLUTION} characters.`,
  "points-out-of-range": `A problem is worth between ${MIN_POINTS} and ${MAX_POINTS} points.`,
  "numeric-value-missing": "Give the number this problem answers to.",
  "tolerance-negative": "A tolerance cannot be negative.",
  "accepted-missing": "Give at least one accepted answer.",
  "accepted-too-many": `At most ${MAX_ACCEPTED} accepted answers.`,
  "accepted-duplicated": "Two accepted answers read the same.",
  "auto-needs-a-key": "An open problem has no key to mark against. Choose AI or host marking.",
  "ai-needs-a-solution": "The model marks against your solution. Write one, or mark it yourself.",
  "image-not-allowed": "Use a picture from this site (/problems/…) or an https:// address.",
};

function str(v: unknown, max = 10_000): string {
  return typeof v === "string" ? v.trim().slice(0, max + 1) : "";
}

function num(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v.trim().replace(",", ".")) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

/**
 * Pictures.
 *
 * A problem out of a paper often is a diagram. Only two sources are allowed: a
 * file placed under `public/problems/`, and an https address. `javascript:`
 * and `data:` are refused — a picture nobody checked, rendered inside a page a
 * hundred students have open, is not worth the convenience.
 */
export function validImageUrl(raw: string): boolean {
  if (raw.startsWith("/problems/") && !raw.includes("..")) return true;
  return /^https:\/\/[^\s]+$/i.test(raw);
}

export function parseProblem(input: ProblemInput): { problem: Problem } | { error: ProblemError } {
  const statement = str(input.statement, MAX_STATEMENT);
  if (!statement) return { error: "statement-missing" };
  if (statement.length > MAX_STATEMENT) return { error: "statement-too-long" };

  const title = str(input.title, MAX_TITLE);
  if (title.length > MAX_TITLE) return { error: "title-too-long" };

  const solution = str(input.solution, MAX_SOLUTION);
  if (solution.length > MAX_SOLUTION) return { error: "solution-too-long" };

  const rawImage = str(input.imageUrl, 500);
  if (rawImage && !validImageUrl(rawImage)) return { error: "image-not-allowed" };

  const points = num(input.maxPoints);
  if (points === null) return { error: "points-out-of-range" };
  const maxPoints = Math.round(points);
  if (maxPoints < MIN_POINTS || maxPoints > MAX_POINTS) return { error: "points-out-of-range" };

  const answerKind: AnswerKind =
    input.answerKind === "NUMERIC" ? "NUMERIC" : input.answerKind === "SHORT" ? "SHORT" : "OPEN";

  // Anything unrecognised falls to the host: the safe end, since it means a
  // person looks rather than a mark being invented.
  const gradingMode: GradingMode =
    input.gradingMode === "AUTO" ? "AUTO" : input.gradingMode === "AI" ? "AI" : "HOST";

  let numericValue: number | null = null;
  let numericTolerance = 0;
  let acceptedAnswers: string[] = [];

  if (answerKind === "NUMERIC") {
    numericValue = num(input.numericValue);
    if (numericValue === null) return { error: "numeric-value-missing" };

    const tolerance = num(input.numericTolerance) ?? 0;
    if (tolerance < 0) return { error: "tolerance-negative" };
    numericTolerance = tolerance;
  }

  if (answerKind === "SHORT") {
    const raw = Array.isArray(input.acceptedAnswers)
      ? input.acceptedAnswers
      : typeof input.acceptedAnswers === "string"
        ? input.acceptedAnswers.split("|")
        : [];
    acceptedAnswers = raw.map((a) => str(a, 200)).filter(Boolean);

    if (acceptedAnswers.length === 0) return { error: "accepted-missing" };
    if (acceptedAnswers.length > MAX_ACCEPTED) return { error: "accepted-too-many" };

    // Two spellings of one answer are the point; two of the *same* spelling
    // means the author meant to write something else in that box.
    const seen = new Set<string>();
    for (const a of acceptedAnswers) {
      const folded = cleanText(a);
      if (seen.has(folded)) return { error: "accepted-duplicated" };
      seen.add(folded);
    }
  }

  if (gradingMode === "AUTO" && answerKind === "OPEN") return { error: "auto-needs-a-key" };
  if (gradingMode === "AI" && !solution) return { error: "ai-needs-a-solution" };

  return {
    problem: {
      title: title || "Problem",
      topic: str(input.topic, 60) || "General",
      statement,
      imageUrl: rawImage || null,
      answerKind,
      numericValue,
      numericTolerance,
      acceptedAnswers,
      answerHint: str(input.answerHint, MAX_HINT) || null,
      solution: solution || null,
      maxPoints,
      gradingMode,
    },
  };
}

/** The key as the grader wants it, out of the columns as the table holds them. */
export function answerKeyOf(p: {
  answerKind: AnswerKind;
  numericValue: number | null;
  numericTolerance: number;
  acceptedAnswers: string[];
}): AnswerKey {
  if (p.answerKind === "NUMERIC" && p.numericValue !== null) {
    return { kind: "NUMERIC", value: p.numericValue, tolerance: p.numericTolerance };
  }
  if (p.answerKind === "SHORT" && p.acceptedAnswers.length > 0) {
    return { kind: "SHORT", accepted: p.acceptedAnswers };
  }
  // A numeric problem saved without its number would otherwise mark everyone
  // wrong; treating it as open sends it to a reader instead.
  return { kind: "OPEN" };
}
