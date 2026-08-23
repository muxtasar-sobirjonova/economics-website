import { createHash } from "node:crypto";

/**
 * Turning a spreadsheet into duel questions.
 *
 * Pure and separate from the seed script on purpose: this is where a bad
 * import silently corrupts five hundred questions, so it has to be testable
 * without a database in front of it.
 */

export interface DuelQuestionInput {
  id: string;
  topic: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
}

export interface ImportIssue {
  /** 1-based, counting the header as row 1, so it matches the spreadsheet. */
  row: number;
  problem: string;
}

export interface ImportResult {
  questions: DuelQuestionInput[];
  issues: ImportIssue[];
}

export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 6;

/**
 * A question's identity is its text. Re-importing a corrected file updates the
 * rows it already loaded instead of doubling the bank.
 */
export function questionId(questionText: string): string {
  const normalised = questionText.trim().replace(/\s+/g, " ").toLowerCase();
  return "dq_" + createHash("sha1").update(normalised).digest("hex").slice(0, 24);
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
}

/**
 * Options come either as one `options` cell separated by `|`, as `optionA`…
 * `optionF` columns, or as a real array from JSON. Spreadsheets produce all
 * three shapes and none of them is worth arguing with a content writer about.
 */
function readOptions(rec: Record<string, unknown>): string[] {
  const raw = rec.options;
  if (Array.isArray(raw)) return raw.map(str).filter(Boolean);
  if (typeof raw === "string" && raw.trim()) {
    return raw.split("|").map((o) => o.trim()).filter(Boolean);
  }

  const lettered: string[] = [];
  for (const letter of ["a", "b", "c", "d", "e", "f"]) {
    const v = str(rec[`option${letter}`] ?? rec[`option_${letter}`] ?? rec[letter]);
    if (v) lettered.push(v);
  }
  return lettered;
}

/**
 * The answer may be given as the option text or as its letter (`B`) or index
 * (`2`). Returns the matching option, or null when it matches nothing — which
 * is the single most common error in a hand-written bank.
 */
function resolveAnswer(given: string, options: string[]): string | null {
  if (!given) return null;

  const exact = options.find((o) => o === given);
  if (exact) return exact;

  const loose = options.find((o) => o.toLowerCase() === given.toLowerCase());
  if (loose) return loose;

  if (/^[a-fA-F]$/.test(given)) {
    const idx = given.toLowerCase().charCodeAt(0) - 97;
    return options[idx] ?? null;
  }
  if (/^[1-9]$/.test(given)) {
    return options[Number(given) - 1] ?? null;
  }
  return null;
}

export function buildQuestions(records: Record<string, unknown>[]): ImportResult {
  const questions: DuelQuestionInput[] = [];
  const issues: ImportIssue[] = [];
  const seen = new Map<string, number>();

  records.forEach((rec, i) => {
    const row = i + 2; // header is row 1
    const fail = (problem: string) => issues.push({ row, problem });

    const questionText = str(rec.questiontext ?? rec.questionText ?? rec.question);
    const topic = str(rec.topic) || "General";
    const explanation = str(rec.explanation) || null;
    const options = readOptions(rec);
    const givenAnswer = str(rec.correctanswer ?? rec.correctAnswer ?? rec.answer);

    if (!questionText) {
      fail("no question text");
      return;
    }
    if (options.length < MIN_OPTIONS) {
      fail(`only ${options.length} option(s); at least ${MIN_OPTIONS} needed`);
      return;
    }
    if (options.length > MAX_OPTIONS) {
      fail(`${options.length} options; at most ${MAX_OPTIONS} allowed`);
      return;
    }

    const duplicateOption = options.find(
      (o, idx) => options.findIndex((x) => x.toLowerCase() === o.toLowerCase()) !== idx
    );
    if (duplicateOption) {
      fail(`two options read the same: "${duplicateOption}"`);
      return;
    }

    const correctAnswer = resolveAnswer(givenAnswer, options);
    if (!correctAnswer) {
      fail(
        givenAnswer
          ? `answer "${givenAnswer}" matches none of the options`
          : "no correct answer given"
      );
      return;
    }

    const id = questionId(questionText);
    const firstSeen = seen.get(id);
    if (firstSeen) {
      fail(`same question as row ${firstSeen}`);
      return;
    }
    seen.set(id, row);

    questions.push({ id, topic, questionText, options, correctAnswer, explanation });
  });

  return { questions, issues };
}
