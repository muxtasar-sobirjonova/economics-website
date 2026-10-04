import { describe, it, expect } from "vitest";
import {
  isRated, lengthOf, maxXp, xpEarned, estimateMinutes, strictMs, describe as line,
  parseSetup, DEFAULT_SETUP, RATED_LENGTH, LENGTHS,
  type Setup,
} from "@/lib/practice/session";

const setup = (over: Partial<Setup> = {}): Setup => ({ ...DEFAULT_SETUP, ...over });

describe("isRated — the one place that decides", () => {
  it("rates strict multiple choice and nothing else", () => {
    expect(isRated(setup({ type: "MCQ", mode: "STRICT" }))).toBe(true);
    expect(isRated(setup({ type: "MCQ", mode: "DEFAULT" }))).toBe(false);
    expect(isRated(setup({ type: "OPEN", mode: "STRICT" }))).toBe(false);
    expect(isRated(setup({ type: "OPEN", mode: "DEFAULT" }))).toBe(false);
  });
});

describe("lengthOf", () => {
  it("forces a rated duel to ten, whatever was asked for", () => {
    // Two players settle a duel by sitting the same set. A set whose size
    // depends on who dealt it cannot be shared.
    for (const length of LENGTHS) {
      expect(lengthOf(setup({ type: "MCQ", mode: "STRICT", length }))).toBe(RATED_LENGTH);
    }
  });

  it("honours the choice everywhere else", () => {
    expect(lengthOf(setup({ mode: "DEFAULT", length: 5 }))).toBe(5);
    expect(lengthOf(setup({ type: "OPEN", mode: "STRICT", length: 20 }))).toBe(20);
  });
});

describe("maxXp", () => {
  it("pays ten a question at the base rate", () => {
    expect(maxXp(setup({ type: "MCQ", mode: "DEFAULT", length: 10 }))).toBe(100);
  });

  it("pays double for writing an answer", () => {
    expect(maxXp(setup({ type: "OPEN", mode: "DEFAULT", length: 10 }))).toBe(200);
  });

  it("pays half again under a clock", () => {
    expect(maxXp(setup({ type: "MCQ", mode: "STRICT", length: 10 }))).toBe(150);
  });

  it("compounds both", () => {
    expect(maxXp(setup({ type: "OPEN", mode: "STRICT", length: 10 }))).toBe(300);
  });

  it("prices a rated session at ten questions even when five were asked", () => {
    expect(maxXp(setup({ type: "MCQ", mode: "STRICT", length: 5 }))).toBe(150);
  });
});

describe("xpEarned", () => {
  it("pays for what was right", () => {
    const s = setup({ type: "MCQ", mode: "DEFAULT", length: 10 });
    expect(xpEarned(s, 10)).toBe(100);
    expect(xpEarned(s, 7)).toBe(70);
    expect(xpEarned(s, 0)).toBe(0);
  });

  it("never pays more than the session is worth", () => {
    const s = setup({ length: 5, mode: "DEFAULT" });
    expect(xpEarned(s, 99)).toBe(maxXp(s));
  });

  it("treats nonsense as nothing rather than as everything", () => {
    const s = setup();
    expect(xpEarned(s, -3)).toBe(0);
    expect(xpEarned(s, Number.NaN)).toBe(0);
  });
});

describe("estimateMinutes and strictMs", () => {
  it("allows longer for a written answer", () => {
    expect(estimateMinutes(setup({ type: "OPEN", length: 10 }))).toBeGreaterThan(
      estimateMinutes(setup({ type: "MCQ", length: 10 }))
    );
  });

  it("gives an unclocked session no clock", () => {
    expect(strictMs(setup({ mode: "DEFAULT" }))).toBeNull();
  });

  it("gives a strict session room to think", () => {
    const s = setup({ type: "MCQ", mode: "STRICT" });
    expect(strictMs(s)).toBe(estimateMinutes(s) * 2 * 60_000);
  });
});

describe("describe", () => {
  it("says what the session is", () => {
    expect(line(setup({ type: "OPEN", mode: "STRICT", length: 20 })))
      .toBe("Open-ended · Strict · 20 questions · ~80 min");
  });

  it("says ten for a rated duel however it was set", () => {
    expect(line(setup({ type: "MCQ", mode: "STRICT", length: 5 }))).toContain("10 questions");
  });
});

describe("parseSetup", () => {
  it("reads a well formed setup", () => {
    expect(parseSetup({ type: "OPEN", mode: "STRICT", length: 20, topic: "Micro" }))
      .toEqual({ type: "OPEN", mode: "STRICT", length: 20, topic: "Micro" });
  });

  it("falls back to the unrated, unclocked default", () => {
    // A misspelt mode must never buy somebody a rated run on their own terms.
    expect(parseSetup({ type: "mcq", mode: "strict", length: 7 })).toEqual(DEFAULT_SETUP);
    expect(parseSetup(null)).toEqual(DEFAULT_SETUP);
    expect(parseSetup("nonsense")).toEqual(DEFAULT_SETUP);
  });

  it("refuses a length that is not on offer", () => {
    expect(parseSetup({ length: 500 }).length).toBe(DEFAULT_SETUP.length);
    expect(parseSetup({ length: 5 }).length).toBe(5);
  });

  it("treats a blank topic as every topic", () => {
    expect(parseSetup({ topic: "   " }).topic).toBeNull();
    expect(parseSetup({ topic: 42 }).topic).toBeNull();
  });

  it("bounds a topic somebody pasted a book into", () => {
    expect(parseSetup({ topic: "x".repeat(500) }).topic).toHaveLength(60);
  });
});
