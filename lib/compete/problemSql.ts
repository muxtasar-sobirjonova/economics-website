import { createHash } from "node:crypto";
import type { Problem } from "./problem";

/**
 * Emit problems as SQL.
 *
 * Same reason the duel bank has one of these: the database credentials live in
 * Vercel as sensitive variables that cannot be read back, so the laptop has no
 * route to Postgres. Rather than reset a production password to load a paper,
 * print SQL to paste into the Supabase editor, where the browser session is
 * already authorised.
 *
 * Pure and tested, because a quoting mistake here either breaks the paste or —
 * far worse — runs part of a problem as SQL.
 */

export interface ProblemRow extends Problem {
  id: string;
}

/**
 * A problem's identity is its statement.
 *
 * Re-running a corrected file updates the rows it already loaded instead of
 * doubling the bank — the same rule the question bank uses, and the reason
 * either can be pasted twice without thinking about it.
 */
export function problemId(statement: string): string {
  const normalised = statement.trim().replace(/\s+/g, " ").toLowerCase();
  return "pr_" + createHash("sha1").update(normalised).digest("hex").slice(0, 24);
}

/** Postgres string literal. Doubling the quote is the whole escape, given
 *  standard_conforming_strings, which is on by default. */
function lit(value: string): string {
  return "'" + value.replace(/'/g, "''") + "'";
}

function nullableLit(value: string | null): string {
  return value === null || value === "" ? "NULL" : lit(value);
}

function textArray(values: string[]): string {
  return values.length === 0
    ? "ARRAY[]::text[]"
    : "ARRAY[" + values.map(lit).join(", ") + "]::text[]";
}

function num(value: number | null): string {
  return value === null || !Number.isFinite(value) ? "NULL" : String(value);
}

/** Enum values are written by this file, never by an author, so a cast is safe. */
function enumLit(value: string, type: string): string {
  return `${lit(value)}::"${type}"`;
}

export function problemsToSql(problems: ProblemRow[]): string {
  if (problems.length === 0) return "-- no problems\n";

  const rows = problems
    .map(
      (p) =>
        "  (" +
        [
          lit(p.id),
          lit(p.title),
          lit(p.topic),
          lit(p.statement),
          nullableLit(p.imageUrl),
          enumLit(p.answerKind, "ProblemAnswerKind"),
          num(p.numericValue),
          num(p.numericTolerance),
          textArray(p.acceptedAnswers),
          nullableLit(p.answerHint),
          nullableLit(p.solution),
          String(p.maxPoints),
          enumLit(p.gradingMode, "ProblemGrading"),
        ].join(", ") +
        ")"
    )
    .join(",\n");

  const marks = problems.reduce((sum, p) => sum + p.maxPoints, 0);
  const topics = [...new Set(problems.map((p) => p.topic))].sort();

  return [
    "-- Problems for /compete/problems.",
    "--",
    "-- Safe to run more than once: a problem's id comes from its statement, so a",
    "-- corrected file updates rows instead of doubling the bank.",
    "--",
    '-- "active" is deliberately not overwritten on conflict. Retiring a problem is',
    "-- a decision somebody made about it, and a re-import must not quietly undo it.",
    "",
    'INSERT INTO "Problem"',
    '  ("id", "title", "topic", "statement", "imageUrl", "answerKind",',
    '   "numericValue", "numericTolerance", "acceptedAnswers", "answerHint",',
    '   "solution", "maxPoints", "gradingMode")',
    "VALUES",
    rows,
    'ON CONFLICT ("id") DO UPDATE SET',
    '  "title"            = EXCLUDED."title",',
    '  "topic"            = EXCLUDED."topic",',
    '  "statement"        = EXCLUDED."statement",',
    '  "imageUrl"         = EXCLUDED."imageUrl",',
    '  "answerKind"       = EXCLUDED."answerKind",',
    '  "numericValue"     = EXCLUDED."numericValue",',
    '  "numericTolerance" = EXCLUDED."numericTolerance",',
    '  "acceptedAnswers"  = EXCLUDED."acceptedAnswers",',
    '  "answerHint"       = EXCLUDED."answerHint",',
    '  "solution"         = EXCLUDED."solution",',
    '  "maxPoints"        = EXCLUDED."maxPoints",',
    '  "gradingMode"      = EXCLUDED."gradingMode",',
    '  "updatedAt"        = NOW();',
    "",
    `-- ${problems.length} problem(s), ${marks} marks.`,
    ...topics.map((t) => `--   ${t}: ${problems.filter((p) => p.topic === t).length}`),
    "",
  ].join("\n");
}
