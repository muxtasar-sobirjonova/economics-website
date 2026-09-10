import { describe, it, expect } from "vitest";
import {
  parseNumber,
  cleanText,
  numericMatches,
  shortMatches,
  autoGrade,
  type NumericKey,
  type ShortKey,
} from "@/lib/compete/answerCheck";

describe("parseNumber", () => {
  it("reads a plain number", () => {
    expect(parseNumber("1200")).toBe(1200);
    expect(parseNumber(" 12.5 ")).toBe(12.5);
    expect(parseNumber("-3")).toBe(-3);
    expect(parseNumber("+7")).toBe(7);
    expect(parseNumber(".5")).toBe(0.5);
  });

  it("treats a comma before three digits as a thousands separator", () => {
    expect(parseNumber("1,200")).toBe(1200);
    expect(parseNumber("1,200,500")).toBe(1200500);
  });

  it("treats any other comma as a decimal point", () => {
    // The same class types both of these, so both have to work.
    expect(parseNumber("12,5")).toBe(12.5);
    expect(parseNumber("0,75")).toBe(0.75);
  });

  it("lets a dot win when both are present", () => {
    expect(parseNumber("1,200.50")).toBe(1200.5);
  });

  it("reads spaces used as thousands separators", () => {
    expect(parseNumber("1 200 000")).toBe(1200000);
  });

  it("strips the units and symbols a careful student adds", () => {
    expect(parseNumber("1200 so'm")).toBe(1200);
    expect(parseNumber("1200 so‘m")).toBe(1200);
    expect(parseNumber("$1,200")).toBe(1200);
    expect(parseNumber("12%")).toBe(12);
    expect(parseNumber("40 units")).toBe(40);
  });

  it("reads an accounting negative", () => {
    expect(parseNumber("(250)")).toBe(-250);
  });

  it("reads a fraction", () => {
    expect(parseNumber("1/2")).toBe(0.5);
    expect(parseNumber("-3/4")).toBe(-0.75);
    expect(parseNumber("1/0")).toBeNull();
  });

  it("returns null rather than guessing at prose", () => {
    expect(parseNumber("about twelve")).toBeNull();
    expect(parseNumber("12 or 13")).toBeNull();
    expect(parseNumber("")).toBeNull();
    expect(parseNumber("   ")).toBeNull();
  });
});

describe("cleanText", () => {
  it("folds every apostrophe onto one", () => {
    // One word typed on four keyboards.
    const forms = ["o'sish", "o‘sish", "o’sish", "oʻsish"];
    const cleaned = forms.map(cleanText);
    expect(new Set(cleaned).size).toBe(1);
  });

  it("ignores case, edge punctuation and repeated spaces", () => {
    expect(cleanText("  Talab   EGRISI. ")).toBe("talab egrisi");
  });
});

describe("numericMatches", () => {
  const key: NumericKey = { kind: "NUMERIC", value: 12.5, tolerance: 0 };

  it("matches exactly when no tolerance is given", () => {
    expect(numericMatches(key, 12.5)).toBe(true);
    expect(numericMatches(key, 12.51)).toBe(false);
  });

  it("honours a tolerance in both directions", () => {
    const loose: NumericKey = { ...key, tolerance: 0.1 };
    expect(numericMatches(loose, 12.6)).toBe(true);
    expect(numericMatches(loose, 12.4)).toBe(true);
    expect(numericMatches(loose, 12.7)).toBe(false);
  });

  it("survives floating point arithmetic", () => {
    expect(numericMatches({ kind: "NUMERIC", value: 0.3, tolerance: 0 }, 0.1 + 0.2)).toBe(true);
  });
});

describe("shortMatches", () => {
  const key: ShortKey = { kind: "SHORT", accepted: ["inflatsiya", "inflation"] };

  it("accepts any listed answer, however it is typed", () => {
    expect(shortMatches(key, "Inflatsiya")).toBe(true);
    expect(shortMatches(key, "  inflation. ")).toBe(true);
  });

  it("refuses one that is not listed", () => {
    expect(shortMatches(key, "deflyatsiya")).toBe(false);
    expect(shortMatches(key, "")).toBe(false);
  });
});

describe("autoGrade", () => {
  const numeric: NumericKey = { kind: "NUMERIC", value: 40, tolerance: 0.5 };

  it("awards the whole mark or none of it", () => {
    expect(autoGrade(numeric, "40", 5)).toEqual({
      points: 5, correct: true, note: "Matches the key.",
    });
    expect(autoGrade(numeric, "41", 5)?.points).toBe(0);
  });

  it("scores a blank answer without asking anyone", () => {
    expect(autoGrade(numeric, "", 5)).toEqual({ points: 0, correct: false, note: "No answer." });
    expect(autoGrade(numeric, null, 5)).toEqual({ points: 0, correct: false, note: "No answer." });
  });

  it("hands prose in a numeric box to a reader instead of failing it", () => {
    // "roughly forty" may well earn the mark; this code is not the one to say.
    expect(autoGrade(numeric, "roughly forty", 5)).toBeNull();
  });

  it("never decides an open problem", () => {
    expect(autoGrade({ kind: "OPEN" }, "Because demand fell.", 10)).toBeNull();
  });

  it("cannot award more than the problem is worth", () => {
    expect(autoGrade(numeric, "40", 0)?.points).toBe(0);
    expect(autoGrade(numeric, "40", -3)?.points).toBe(0);
  });
});
