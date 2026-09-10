/**
 * Reading what a student typed into a problem's answer box.
 *
 * A problem is not a multiple choice question: there is no list to compare
 * against, so the whole risk sits here. Pure on purpose — this is the code
 * that decides whether "1,200 so'm" and "1200" are the same answer, and it has
 * to be provable without a database in front of it.
 */

export type AnswerKind = "NUMERIC" | "SHORT" | "OPEN";

export interface NumericKey {
  kind: "NUMERIC";
  value: number;
  /** Absolute, in the key's own units. 0 means the value must match exactly. */
  tolerance: number;
}

export interface ShortKey {
  kind: "SHORT";
  /** Any one of these counts. Written by the author, compared after cleaning. */
  accepted: string[];
}

/** Nothing to compare against: a human or the model has to read it. */
export interface OpenKey {
  kind: "OPEN";
}

export type AnswerKey = NumericKey | ShortKey | OpenKey;

export interface AutoVerdict {
  points: number;
  correct: boolean;
  /** Shown to the student next to their answer, and to the host when overriding. */
  note: string;
}

/**
 * Apostrophes.
 *
 * Uzbek writes o‘, g‘, and a phone keyboard produces at least five different
 * characters for that mark depending on the keyboard and whether the browser
 * "smartened" it. Comparing them as written would mark "o‘sish" wrong against
 * "o'sish", which is the same word typed on a different phone.
 */
const APOSTROPHES = /[’‘‛`´ʻʼ'']/g;

/**
 * Units and symbols that decorate a number without changing it. Stripped so a
 * student who writes the unit is not punished for being more careful than one
 * who did not.
 */
const NUMERIC_DECORATION =
  /\b(so'?m|sum|usd|eur|dollars?|dollar|units?|birlik|ta|kishi|soat|yil|foiz|percent|pct)\b|[$€£₽% ]/gi;

/** Collapse the ways one string can be written into one string. */
export function cleanText(input: string): string {
  return (input ?? "")
    .replace(APOSTROPHES, "'")
    .toLowerCase()
    .normalize("NFKC")
    // Punctuation that carries no meaning in a short answer.
    .replace(/[.,;:!?"“”()\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * A number, out of whatever the student wrapped it in.
 *
 * Returns null rather than guessing when the text is not a number. Null is not
 * "wrong" — it is "this needs a reader", and the caller decides which.
 *
 * The comma is the hard part. `1,200` is twelve hundred and `12,5` is twelve
 * and a half, and both are typed by the same class. The rule: a comma followed
 * by exactly three digits, with digits in front of it, is a thousands
 * separator; any other comma is a decimal point. When a dot is also present
 * the dot is the decimal point and every comma is a separator.
 */
export function parseNumber(input: string): number | null {
  let s = (input ?? "").replace(APOSTROPHES, "'").replace(NUMERIC_DECORATION, " ").trim();
  if (!s) return null;

  // Accounting negatives: (250) is minus 250.
  let sign = 1;
  const bracketed = s.match(/^\((.*)\)$/);
  if (bracketed) {
    sign = -1;
    s = bracketed[1].trim();
  }

  // Spaces used as thousands separators: 1 200 000.
  s = s.replace(/(\d)[\s_](?=\d{3}\b)/g, "$1");

  const hasDot = s.includes(".");
  if (s.includes(",")) {
    s = hasDot
      ? s.replace(/,/g, "")
      : s.replace(/(\d),(?=\d{3}\b)/g, "$1").replace(",", ".");
  }

  // A fraction is a legitimate way to write an answer: 1/2, -3/4.
  const fraction = s.match(/^([+-]?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (fraction) {
    const bottom = Number(fraction[2]);
    if (!bottom) return null;
    const value = Number(fraction[1]) / bottom;
    return Number.isFinite(value) ? sign * value : null;
  }

  if (!/^[+-]?\d*\.?\d+(?:e[+-]?\d+)?$/i.test(s)) return null;

  const value = Number(s);
  return Number.isFinite(value) ? sign * value : null;
}

/** Rounding noise: 0.1 + 0.2 must not lose a student a point. */
const EPSILON = 1e-9;

export function numericMatches(key: NumericKey, given: number): boolean {
  const tolerance = Number.isFinite(key.tolerance) ? Math.abs(key.tolerance) : 0;
  return Math.abs(given - key.value) <= tolerance + EPSILON;
}

export function shortMatches(key: ShortKey, given: string): boolean {
  const cleaned = cleanText(given);
  if (!cleaned) return false;
  return key.accepted.some((a) => cleanText(a) === cleaned);
}

/**
 * Grade one written answer against its key.
 *
 * Returns null when the key cannot decide — an OPEN problem, or a numeric one
 * where the student wrote something that is not a number. The caller sends
 * those on to the model or to the host; deciding them here would either invent
 * a mark or fail a student for writing "roughly 12".
 *
 * All or nothing: a key holds one right answer, so there is no half of it.
 * Partial credit is what the model and the host are for.
 */
export function autoGrade(
  key: AnswerKey,
  given: string | null,
  maxPoints: number
): AutoVerdict | null {
  const points = Math.max(0, Math.round(maxPoints) || 0);
  const text = typeof given === "string" ? given.trim() : "";

  if (!text) return { points: 0, correct: false, note: "No answer." };
  if (key.kind === "OPEN") return null;

  if (key.kind === "NUMERIC") {
    const value = parseNumber(text);
    if (value === null) return null;
    return numericMatches(key, value)
      ? { points, correct: true, note: "Matches the key." }
      : { points: 0, correct: false, note: `Key: ${key.value}.` };
  }

  return shortMatches(key, text)
    ? { points, correct: true, note: "Matches the key." }
    : { points: 0, correct: false, note: "Does not match the key." };
}
