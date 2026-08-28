/**
 * Validating what a host asks for.
 *
 * Pure, and deliberately strict about ranges: a competition of two questions
 * or six hundred seconds is not a competition, and the host finds out here
 * rather than after thirty people have joined.
 */

export const MIN_QUESTIONS = 5;
export const MAX_QUESTIONS = 30;
export const MIN_SECONDS = 10;
export const MAX_SECONDS = 90;
export const MAX_TITLE = 80;

export type Access = "OPEN" | "LINK";

export interface SetupInput {
  title?: unknown;
  topic?: unknown;
  questionCount?: unknown;
  secondsPerQuestion?: unknown;
  access?: unknown;
}

export interface Setup {
  title: string;
  topic: string | null;
  questionCount: number;
  secondsPerQuestion: number;
  access: Access;
}

export type SetupError =
  | "title-missing"
  | "title-too-long"
  | "questions-out-of-range"
  | "seconds-out-of-range";

export const SETUP_ERROR_COPY: Record<SetupError, string> = {
  "title-missing": "Give the competition a name.",
  "title-too-long": `Keep the name under ${MAX_TITLE} characters.`,
  "questions-out-of-range": `Choose between ${MIN_QUESTIONS} and ${MAX_QUESTIONS} questions.`,
  "seconds-out-of-range": `Choose between ${MIN_SECONDS} and ${MAX_SECONDS} seconds a question.`,
};

function num(value: unknown): number | null {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? Math.round(n) : null;
}

export function parseSetup(input: SetupInput): { setup: Setup } | { error: SetupError } {
  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (!title) return { error: "title-missing" };
  if (title.length > MAX_TITLE) return { error: "title-too-long" };

  const questionCount = num(input.questionCount);
  if (questionCount === null || questionCount < MIN_QUESTIONS || questionCount > MAX_QUESTIONS) {
    return { error: "questions-out-of-range" };
  }

  const secondsPerQuestion = num(input.secondsPerQuestion);
  if (secondsPerQuestion === null || secondsPerQuestion < MIN_SECONDS || secondsPerQuestion > MAX_SECONDS) {
    return { error: "seconds-out-of-range" };
  }

  const topicRaw = typeof input.topic === "string" ? input.topic.trim() : "";

  return {
    setup: {
      title,
      // An empty topic means the whole bank, which is different from a topic
      // that happens to be named "".
      topic: topicRaw || null,
      questionCount,
      secondsPerQuestion,
      // Anything unrecognised falls back to the safer of the two.
      access: input.access === "LINK" ? "LINK" : "OPEN",
    },
  };
}
