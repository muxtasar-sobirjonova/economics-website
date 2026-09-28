/**
 * A room's results, as a spreadsheet.
 *
 * Marks live in a database and a register lives in a spreadsheet, and a teacher
 * who cannot move one into the other copies numbers by hand. Pure and tested
 * for the usual reason: a name with a comma in it, or an answer with a quote,
 * shifts every column after it and nobody notices until the marks are wrong.
 */

export interface ResultRow {
  rank: number;
  name: string | null;
  score: number;
  answered: number;
  totalMs: number;
  finished: boolean;
  disqualified?: boolean;
  disqualifyReason?: string | null;
  /** Marks for each problem, in the order the paper asked them. */
  perProblem?: (number | null)[];
}

/**
 * One field, quoted when it has to be.
 *
 * Excel and Numbers both read a leading `=`, `+`, `-` or `@` as a formula, so a
 * name that begins with one is prefixed with a quote. That is not paranoia
 * about spreadsheets: it is the difference between a student called "-Ali" and
 * a cell that reads `#NAME?`.
 */
export function csvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";

  let text = String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;

  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function duration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  return `${m}:${String(total % 60).padStart(2, "0")}`;
}

export function resultsToCsv(
  rows: ResultRow[],
  { title, problemTitles = [] }: { title: string; problemTitles?: string[] }
): string {
  const header = [
    "Rank",
    "Name",
    "Score",
    "Answered",
    "Time",
    "Status",
    ...problemTitles,
    "Note",
  ];

  const lines = rows.map((r) =>
    [
      r.rank,
      r.name ?? "Anonymous",
      r.score,
      r.answered,
      duration(r.totalMs),
      r.disqualified ? "Disqualified" : r.finished ? "Submitted" : "Unfinished",
      ...problemTitles.map((_, i) => r.perProblem?.[i] ?? ""),
      r.disqualifyReason ?? "",
    ]
      .map(csvField)
      .join(",")
  );

  // A BOM, so Excel opens a file with "so'm" and "—" in it as UTF-8 rather
  // than as mojibake. Every other reader ignores it.
  return "﻿" + [`# ${title}`, header.map(csvField).join(","), ...lines].join("\r\n") + "\r\n";
}

/** A file name a teacher can find again. */
export function csvFilename(title: string, code: string): string {
  const stem = title.trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
  return `${stem || "results"}-${code}.csv`;
}
