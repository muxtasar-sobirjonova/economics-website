import type { DuelQuestionInput } from "./questionImport";

/**
 * Emit the question bank as SQL.
 *
 * The database credentials live in Vercel as sensitive variables, which cannot
 * be read back, so the laptop has no way to reach Postgres. Rather than reset
 * a production password to load some questions, the loader can print SQL to
 * paste into the Supabase editor — the browser session is already authorised.
 *
 * Pure and tested: a quoting mistake here would either break the paste or,
 * worse, execute part of a question as SQL.
 */

/** Postgres string literal. Doubling the single quote is the whole escape,
 *  given standard_conforming_strings, which is on by default. */
function lit(value: string): string {
  return "'" + value.replace(/'/g, "''") + "'";
}

function textArray(values: string[]): string {
  return "ARRAY[" + values.map(lit).join(", ") + "]::text[]";
}

function nullableLit(value: string | null): string {
  return value === null || value === "" ? "NULL" : lit(value);
}

export function questionsToSql(questions: DuelQuestionInput[]): string {
  if (questions.length === 0) return "-- no questions\n";

  const rows = questions
    .map(
      (q) =>
        "  (" +
        [
          lit(q.id),
          lit(q.topic),
          lit(q.questionText),
          textArray(q.options),
          lit(q.correctAnswer),
          nullableLit(q.explanation),
        ].join(", ") +
        ")"
    )
    .join(",\n");

  return [
    "-- Duel question bank. Safe to run more than once: a question's id comes",
    "-- from its text, so a corrected file updates rows instead of doubling them.",
    "-- timesServed, timesCorrect and active are left alone on conflict — those",
    "-- are earned from real play and a re-import must not erase them.",
    "",
    'INSERT INTO "DuelQuestion"',
    '  ("id", "topic", "questionText", "options", "correctAnswer", "explanation")',
    "VALUES",
    rows,
    'ON CONFLICT ("id") DO UPDATE SET',
    '  "topic"         = EXCLUDED."topic",',
    '  "questionText"  = EXCLUDED."questionText",',
    '  "options"       = EXCLUDED."options",',
    '  "correctAnswer" = EXCLUDED."correctAnswer",',
    '  "explanation"   = EXCLUDED."explanation";',
    "",
    `-- ${questions.length} question(s), ${Math.floor(questions.length / 10)} duel sets.`,
    "",
  ].join("\n");
}
