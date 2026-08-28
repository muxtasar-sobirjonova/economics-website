import { describe, it, expect } from "vitest";
import {
  CODE_ALPHABET,
  CODE_LENGTH,
  CONFUSABLE_PAIRS,
  generateCode,
  normaliseCode,
} from "@/lib/compete/code";
import { rank, progress, type Standing } from "@/lib/compete/scoring";

describe("CODE_ALPHABET", () => {
  it("never keeps both halves of a confusable pair", () => {
    // Keeping one of O/0 is fine — keeping both produces codes people mistype.
    for (const [a, b] of CONFUSABLE_PAIRS) {
      const both = CODE_ALPHABET.includes(a) && CODE_ALPHABET.includes(b);
      expect(both, `${a} and ${b} are both in the alphabet`).toBe(false);
    }
  });

  it("is still large enough to name every competition", () => {
    // 26^6 is far more than this site will ever run.
    expect(Math.pow(CODE_ALPHABET.length, CODE_LENGTH)).toBeGreaterThan(10_000_000);
  });

  it("has no repeats", () => {
    expect(new Set(CODE_ALPHABET).size).toBe(CODE_ALPHABET.length);
  });
});

describe("generateCode", () => {
  it("is the right length and always typeable", () => {
    const code = generateCode();
    expect(code).toHaveLength(CODE_LENGTH);
    for (const ch of code) expect(CODE_ALPHABET).toContain(ch);
  });

  it("uses the whole alphabet rather than clustering", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 500; i++) for (const ch of generateCode()) seen.add(ch);
    expect(seen.size).toBe(CODE_ALPHABET.length);
  });

  it("does not repeat itself over many draws", () => {
    const codes = new Set(Array.from({ length: 400 }, () => generateCode()));
    expect(codes.size).toBeGreaterThan(390);
  });
});

describe("normaliseCode", () => {
  it("accepts a code exactly as stored", () => {
    expect(normaliseCode("ACDEFH")).toBe("ACDEFH");
  });

  it("forgives case, spaces and dashes", () => {
    expect(normaliseCode(" acd-efh ")).toBe("ACDEFH");
    expect(normaliseCode("AC D EFH")).toBe("ACDEFH");
  });

  it("refuses a character outside the alphabet rather than guessing", () => {
    // Mapping O to 0, or G to 6, would quietly send someone to the wrong
    // competition rather than telling them the code is wrong.
    expect(normaliseCode("ACDEFO")).toBeNull();
    expect(normaliseCode("ACDEF1")).toBeNull();
    expect(normaliseCode("ACDEFG")).toBeNull();
  });

  it("refuses the wrong length", () => {
    expect(normaliseCode("ACDEF")).toBeNull();
    expect(normaliseCode("ACDEFHJ")).toBeNull();
    expect(normaliseCode("")).toBeNull();
  });
});

const p = (name: string, score: number, totalMs: number, answered = 10, finished = true): Standing => ({
  userId: name, name, score, totalMs, answered, finished,
});

describe("rank", () => {
  it("orders by score, then by speed", () => {
    const r = rank([p("slow", 8, 90_000), p("top", 9, 90_000), p("fast", 8, 40_000)]);
    expect(r.map((x) => x.name)).toEqual(["top", "fast", "slow"]);
    expect(r.map((x) => x.rank)).toEqual([1, 2, 3]);
  });

  it("shares a rank only when score and time both match", () => {
    const r = rank([p("a", 7, 50_000), p("b", 7, 50_000), p("c", 6, 10_000)]);
    expect(r.map((x) => x.rank)).toEqual([1, 1, 3]);
  });

  it("does not reorder the caller's array", () => {
    const players = [p("a", 5, 10), p("b", 9, 10)];
    const before = players.map((x) => x.name);
    rank(players);
    expect(players.map((x) => x.name)).toEqual(before);
  });

  it("handles an empty room", () => {
    expect(rank([])).toEqual([]);
  });
});

describe("progress", () => {
  it("counts who is still playing", () => {
    const s = progress([p("a", 5, 10, 10, true), p("b", 2, 10, 4, false)], 10);
    expect(s).toMatchObject({ total: 2, finished: 1, playing: 1 });
    expect(s.completion).toBeCloseTo(0.7, 5);
  });

  it("reports zero rather than dividing by nothing", () => {
    expect(progress([], 10).completion).toBe(0);
    expect(progress([p("a", 0, 0, 0, false)], 0).completion).toBe(0);
  });
});
