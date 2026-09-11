"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  saveProblem,
  retireProblem,
  getProblemForEditor,
  importProblems,
  createProblemCompetition,
  saveProblemDraft,
  setFlag,
  submitProblems,
  gradeNextBatch,
  markingProgress,
  overrideMark,
  markIdentical,
  type ProblemSetupInput,
  type MarkingProgress,
} from "@/lib/compete/problemService";
import {
  reportAway,
  unlockPlayer,
  blockPlayer,
  disqualifyPlayer,
  reinstatePlayer,
  type FocusState,
} from "@/lib/compete/focusService";
import { parseProblemImport } from "@/lib/compete/bulkImport";
import type { ProblemInput } from "@/lib/compete/problem";
import type { Outcome } from "@/lib/compete/service";

/**
 * Every one of these re-reads the session rather than trusting an id from the
 * caller, and every permission and ownership check lives in the service — a
 * server action is a public endpoint, and these ones hand out marks.
 */

async function requireUser() {
  const session = await auth();
  return session?.user?.id
    ? { id: session.user.id, email: session.user.email ?? null }
    : null;
}

const str = (v: unknown) => (typeof v === "string" ? v : "");

export async function saveProblemAction(
  input: ProblemInput & { id?: string }
): Promise<Outcome<{ id: string }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await saveProblem(user.id, user.email, input);
  if (result.ok) revalidatePath("/compete/problems");
  return result;
}

export async function retireProblemAction(id: string, active: boolean): Promise<Outcome<null>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await retireProblem(user.id, user.email, str(id), active === true);
  if (result.ok) revalidatePath("/compete/problems");
  return result;
}

export async function createProblemCompetitionAction(
  input: ProblemSetupInput
): Promise<Outcome<{ code: string }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await createProblemCompetition(user.id, user.email, input);
  if (result.ok) revalidatePath("/compete");
  return result;
}

/**
 * Called as the student types, so it stays as small as it can be: no
 * revalidation, no marking, one upsert.
 */
export async function saveDraftAction(
  competitionId: string,
  problemId: string,
  text: string
): Promise<Outcome<{ savedAt: number }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  return saveProblemDraft(user.id, str(competitionId), str(problemId), str(text));
}

export async function submitProblemsAction(
  competitionId: string
): Promise<Outcome<{ pending: number }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await submitProblems(user.id, str(competitionId));
  if (result.ok) revalidatePath("/compete");
  return result;
}

/** One batch. The host's screen calls it again until nothing is pending. */
export async function gradeBatchAction(
  competitionId: string
): Promise<Outcome<{ graded: number; pending: number; stalled: boolean }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  return gradeNextBatch(user.id, str(competitionId));
}

export async function markingProgressAction(
  competitionId: string
): Promise<Outcome<MarkingProgress>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const progress = await markingProgress(user.id, str(competitionId));
  return progress ? { ok: true, data: progress } : { ok: false, error: "Not your competition." };
}

export async function overrideMarkAction(
  competitionId: string,
  answerId: string,
  points: number,
  feedback: string | null
): Promise<Outcome<{ points: number }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await overrideMark(user.id, str(competitionId), str(answerId), points, feedback);
  if (result.ok) revalidatePath("/compete");
  return result;
}

/**
 * "I left the page."
 *
 * Called by the page itself, so the duration is the page's word. The server
 * stamps the time, clamps the duration and decides what it means — see
 * lib/compete/focusService.ts for what this can and cannot be trusted to know.
 */
export async function reportAwayAction(
  competitionId: string,
  ms: number
): Promise<Outcome<FocusState>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  return reportAway(user.id, str(competitionId), ms);
}

/** The host letting a frozen paper carry on. */
export async function unlockPlayerAction(
  competitionId: string,
  playerId: string
): Promise<Outcome<null>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await unlockPlayer(user.id, str(competitionId), str(playerId));
  if (result.ok) revalidatePath("/compete");
  return result;
}

/** The host stopping a paper by hand, with a reason the student reads. */
export async function blockPlayerAction(
  competitionId: string,
  playerId: string,
  reason: string
): Promise<Outcome<null>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await blockPlayer(user.id, str(competitionId), str(playerId), reason);
  if (result.ok) revalidatePath("/compete");
  return result;
}

/** The verdict after the room ended. Never a delete — see focusService.ts. */
export async function disqualifyPlayerAction(
  competitionId: string,
  playerId: string,
  reason: string
): Promise<Outcome<null>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await disqualifyPlayer(user.id, str(competitionId), str(playerId), reason);
  if (result.ok) revalidatePath("/compete");
  return result;
}

export async function reinstatePlayerAction(
  competitionId: string,
  playerId: string
): Promise<Outcome<null>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await reinstatePlayer(user.id, str(competitionId), str(playerId));
  if (result.ok) revalidatePath("/compete");
  return result;
}

/** Marking a question for review, or clearing the mark. */
export async function setFlagAction(
  competitionId: string,
  problemId: string,
  flagged: boolean
): Promise<Outcome<null>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  return setFlag(user.id, str(competitionId), str(problemId), flagged === true);
}

/**
 * One problem, with its key and its solution, for the editor.
 *
 * Fetched on demand rather than sent down with the list: the list is rendered
 * for anyone who may host a room, and the answer key is for whoever may write
 * one. Two different rights, so two different reads.
 */
export async function getProblemAction(id: string): Promise<Outcome<ProblemDraft>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const row = await getProblemForEditor(user.id, user.email, str(id));
  if (!row) return { ok: false, error: "Could not open that problem." };

  return {
    ok: true,
    data: {
      id: row.id,
      title: row.title,
      topic: row.topic,
      statement: row.statement,
      imageUrl: row.imageUrl ?? "",
      answerKind: row.answerKind,
      // Numbers become strings here because the form holds strings: a field
      // the author is halfway through typing is not a number yet.
      numericValue: row.numericValue === null ? "" : String(row.numericValue),
      numericTolerance: String(row.numericTolerance),
      acceptedAnswers: row.acceptedAnswers.join(" | "),
      answerHint: row.answerHint ?? "",
      solution: row.solution ?? "",
      maxPoints: row.maxPoints,
      gradingMode: row.gradingMode,
    },
  };
}

/** The editor's shape, which is all strings where the form holds strings. */
export interface ProblemDraft {
  id: string;
  title: string;
  topic: string;
  statement: string;
  imageUrl: string;
  answerKind: "NUMERIC" | "SHORT" | "OPEN";
  numericValue: string;
  numericTolerance: string;
  acceptedAnswers: string;
  answerHint: string;
  solution: string;
  maxPoints: number;
  gradingMode: "AUTO" | "AI" | "HOST";
}

/** A pasted paper, read and saved in one go. */
export async function importProblemsAction(
  text: string
): Promise<Outcome<{ added: number; issues: { block: number; problem: string }[] }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const { records, issues } = parseProblemImport(str(text));
  const result = await importProblems(user.id, user.email, records);
  if (!result.ok) return result;

  revalidatePath("/compete/problems");
  // The reading issues and the validating ones are one list to the author:
  // they do not care which half of the pipeline objected.
  return {
    ok: true,
    data: { added: result.data.added, issues: [...issues, ...result.data.issues] },
  };
}

/** One mark, applied to every paper that wrote the same answer to one problem. */
export async function markIdenticalAction(
  competitionId: string,
  problemId: string,
  sample: string,
  points: number,
  feedback: string | null
): Promise<Outcome<{ marked: number }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const result = await markIdentical(
    user.id, str(competitionId), str(problemId), str(sample), points, feedback
  );
  if (result.ok) revalidatePath("/compete");
  return result;
}
