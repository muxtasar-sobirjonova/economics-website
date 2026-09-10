import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import {
  GRADER_SYSTEM,
  buildGradePrompt,
  normaliseGrade,
  type Grade,
  type GradeRequest,
} from "./aiGrading";

/**
 * The one place a model is actually called.
 *
 * Everything decided here is decided nowhere else: which model, that the
 * temperature is zero, and that a failure is a missing mark rather than a
 * zero. The rules about *what* to send and *what to believe* are in
 * `aiGrading.ts`, where they can be tested without a network.
 */

const SHAPE = z.object({
  points: z.number().describe("Whole number of marks awarded, from 0 to the maximum given."),
  comment: z.string().describe("One or two sentences for the student, in their own language."),
});

/**
 * Whichever key exists. Anthropic first because marking an economics argument
 * is the kind of judgement the stronger model is worth paying for; OpenAI is
 * already wired here for the lesson summaries and works as a fallback.
 *
 * No key at all is a supported state, not a crash: answers stay unmarked and
 * the host marks them by hand, which is exactly what happens today.
 */
function resolveModel() {
  const named = process.env.COMPETE_GRADER_MODEL;

  if (process.env.ANTHROPIC_API_KEY) return anthropic(named || "claude-sonnet-5");
  if (process.env.OPENAI_API_KEY) return openai(named || "gpt-4o");
  return null;
}

export function graderAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
}

/**
 * Mark one answer, or return null.
 *
 * Null means "nobody has marked this yet" and never "zero". A model that is
 * down, rate limited or unpaid must not quietly hand a class a page of zeroes;
 * the answer stays pending and the host is told how many are waiting.
 *
 * Temperature zero because a mark that changes when the host presses the
 * button again is not a mark.
 */
export async function gradeWithModel(req: GradeRequest): Promise<Grade | null> {
  const model = resolveModel();
  if (!model) return null;

  try {
    const { object } = await generateObject({
      model,
      schema: SHAPE,
      system: GRADER_SYSTEM,
      prompt: buildGradePrompt(req),
      temperature: 0,
    });
    return normaliseGrade(object, req.maxPoints);
  } catch (error) {
    console.error("gradeWithModel failed", error);
    return null;
  }
}
