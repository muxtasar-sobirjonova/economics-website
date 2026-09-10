import { autoGrade } from "./answerCheck";
import { answerKeyOf, type GradingMode, type AnswerKind } from "./problem";
import type { Grade, GradeRequest } from "./aiGrading";

/**
 * Deciding who marks one answer, and what the mark is.
 *
 * The model call is passed in rather than imported, so the whole decision —
 * including every path where the model is not reached — is testable without a
 * network or an API key.
 */

export type GradedBy = "PENDING" | "AUTO" | "AI" | "HOST";

export interface MarkableProblem {
  statement: string;
  solution: string | null;
  answerKind: AnswerKind;
  numericValue: number | null;
  numericTolerance: number;
  acceptedAnswers: string[];
  maxPoints: number;
  gradingMode: GradingMode;
}

export interface Mark {
  points: number;
  gradedBy: GradedBy;
  feedback: string | null;
  /** Full marks. What the review screen ticks. */
  isCorrect: boolean;
}

export type AskModel = (req: GradeRequest) => Promise<Grade | null>;

const pending: Mark = { points: 0, gradedBy: "PENDING", feedback: null, isCorrect: false };

function blank(): Mark {
  // Nothing written is nothing to mark, in every mode. Sending empty boxes to
  // a model would spend money to be told they are empty, and leaving them for
  // the host would bury the answers that need reading under the ones that
  // do not.
  return { points: 0, gradedBy: "AUTO", feedback: "No answer given.", isCorrect: false };
}

/**
 * Mark one written answer.
 *
 * - `HOST` — nobody marks it but the host. It waits.
 * - `AUTO` — the key marks it. What the key cannot read waits for the host
 *   rather than scoring zero: "roughly forty" is not the same as wrong.
 * - `AI`   — the key first, because it is instant and free. A right answer by
 *   the key takes full marks without a call at all. Only a wrong or unreadable
 *   one goes to the model, which is where partial credit for a sound method
 *   with a slip in it can still be awarded.
 */
export async function markAnswer(
  problem: MarkableProblem,
  text: string | null,
  askModel: AskModel
): Promise<Mark> {
  const answer = typeof text === "string" ? text.trim() : "";
  const maxPoints = Math.max(0, Math.round(problem.maxPoints) || 0);

  if (!answer) return blank();
  if (problem.gradingMode === "HOST") return pending;

  const key = answerKeyOf(problem);
  const auto = autoGrade(key, answer, maxPoints);

  if (problem.gradingMode === "AUTO") {
    return auto
      ? { points: auto.points, gradedBy: "AUTO", feedback: auto.note, isCorrect: auto.correct }
      : pending;
  }

  // AI from here. A key that says "right" is not worth a second opinion.
  if (auto?.correct) {
    return { points: auto.points, gradedBy: "AUTO", feedback: auto.note, isCorrect: true };
  }

  const graded = await askModel({
    statement: problem.statement,
    solution: problem.solution,
    maxPoints,
    answer,
  });

  // The model was unreachable. Pending, never zero: a class must not be handed
  // a page of noughts because a key expired.
  if (!graded) return pending;

  return {
    points: graded.points,
    gradedBy: "AI",
    feedback: graded.comment,
    isCorrect: graded.points >= maxPoints && maxPoints > 0,
  };
}

/** A mark a host typed. Clamped here so no screen has to be trusted to do it. */
export function hostMark(points: unknown, maxPoints: number, feedback: unknown): Mark {
  const ceiling = Math.max(0, Math.round(maxPoints) || 0);
  const raw = typeof points === "number" ? points : Number(points);
  const value = Number.isFinite(raw) ? Math.min(Math.max(Math.round(raw), 0), ceiling) : 0;

  return {
    points: value,
    gradedBy: "HOST",
    feedback: typeof feedback === "string" && feedback.trim() ? feedback.trim().slice(0, 240) : null,
    isCorrect: value >= ceiling && ceiling > 0,
  };
}
