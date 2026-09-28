import { describe, it, expect } from "vitest";
import {
  practiceMode, practisable, pickProblem, topicCounts, aiLeftToday,
  startOfDay, totalsOf, DAILY_AI_LIMIT,
  type PracticeCandidate,
} from "@/lib/compete/practice";

const p = (over: Partial<PracticeCandidate> = {}): PracticeCandidate => ({
  id: "a", topic: "Micro", answerKind: "NUMERIC", gradingMode: "AUTO",
  hasKey: true, hasSolution: true, practiceOpen: true, ...over,
});

describe("practiceMode — who marks it when there is no host", () => {
  it("lets the key mark anything the key can read", () => {
    expect(practiceMode(p({ answerKind: "NUMERIC", hasKey: true }))).toBe("AUTO");
    expect(practiceMode(p({ answerKind: "SHORT", hasKey: true }))).toBe("AUTO");
  });

  it("sends an open problem to the model", () => {
    expect(practiceMode(p({ answerKind: "OPEN", hasKey: false }))).toBe("AI");
  });

  it("sends a keyless problem to the model rather than calling it unmarkable", () => {
    // A numeric problem saved without its number: the solution is still there.
    expect(practiceMode(p({ answerKind: "NUMERIC", hasKey: false }))).toBe("AI");
  });

  it("ignores the room's grading mode", () => {
    // HOST means "a person reads it afterwards". Practice has no afterwards,
    // so the model reads the same solution the host would have.
    expect(practiceMode(p({ answerKind: "OPEN", gradingMode: "HOST", hasSolution: true })))
      .toBe("AI");
  });

  it("refuses a problem nothing could mark", () => {
    expect(practiceMode(p({ answerKind: "OPEN", hasKey: false, hasSolution: false })))
      .toBeNull();
  });
});

describe("practisable", () => {
  it("honours a host withholding a problem", () => {
    expect(practisable(p({ practiceOpen: false }))).toBe(false);
    expect(practisable(p({ practiceOpen: true }))).toBe(true);
  });

  it("refuses one nothing could mark, open or not", () => {
    expect(practisable(p({ answerKind: "OPEN", hasKey: false, hasSolution: false })))
      .toBe(false);
  });
});

describe("pickProblem", () => {
  const pool = [
    p({ id: "1", topic: "Micro" }),
    p({ id: "2", topic: "Micro" }),
    p({ id: "3", topic: "Macro" }),
  ];

  it("serves something from the pool", () => {
    const r = pickProblem(pool, { seen: new Set(), aiLeft: 5, rand: () => 0 });
    expect("problem" in r && r.problem.id).toBe("1");
  });

  it("never serves one already attempted", () => {
    const r = pickProblem(pool, { seen: new Set(["1", "2"]), aiLeft: 5, rand: () => 0 });
    expect("problem" in r && r.problem.id).toBe("3");
  });

  it("keeps to the topic asked for", () => {
    const r = pickProblem(pool, { seen: new Set(), topic: "Macro", aiLeft: 5, rand: () => 0 });
    expect("problem" in r && r.problem.id).toBe("3");
  });

  it("skips a problem the host withheld", () => {
    const withheld = [p({ id: "1", practiceOpen: false }), p({ id: "2" })];
    const r = pickProblem(withheld, { seen: new Set(), aiLeft: 5, rand: () => 0 });
    expect("problem" in r && r.problem.id).toBe("2");
  });

  it("says the topic is finished rather than serving another topic", () => {
    const r = pickProblem(pool, { seen: new Set(["3"]), topic: "Macro", aiLeft: 5 });
    expect("empty" in r && r.empty).toBe("topic-done");
  });

  it("says the bank is finished when it is", () => {
    const r = pickProblem(pool, { seen: new Set(["1", "2", "3"]), aiLeft: 5 });
    expect("empty" in r && r.empty).toBe("all-done");
  });

  it("still serves key-marked problems once the day's AI is spent", () => {
    const mixed = [
      p({ id: "ai", answerKind: "OPEN", hasKey: false }),
      p({ id: "free", answerKind: "NUMERIC", hasKey: true }),
    ];
    const r = pickProblem(mixed, { seen: new Set(), aiLeft: 0, rand: () => 0 });
    expect("problem" in r && r.problem.id).toBe("free");
  });

  it("distinguishes a spent allowance from a finished bank", () => {
    // The two need different words: one says come back tomorrow, the other
    // says there is nothing left to come back to.
    const onlyAi = [p({ id: "ai", answerKind: "OPEN", hasKey: false })];
    expect(pickProblem(onlyAi, { seen: new Set(), aiLeft: 0 })).toEqual({ empty: "ai-spent" });
    expect(pickProblem(onlyAi, { seen: new Set(["ai"]), aiLeft: 0 })).toEqual({ empty: "all-done" });
  });

  it("stays inside the array however the random number lands", () => {
    // Math.random() is [0,1), but a caller passing 1 must not read past the end.
    for (const r of [0, 0.999999, 1, -1, Number.NaN]) {
      const got = pickProblem(pool, { seen: new Set(), aiLeft: 5, rand: () => r });
      expect("problem" in got && got.problem).toBeDefined();
    }
  });

  it("survives an empty bank", () => {
    expect(pickProblem([], { seen: new Set(), aiLeft: 5 })).toEqual({ empty: "all-done" });
  });
});

describe("topicCounts", () => {
  it("counts how far through each topic somebody is", () => {
    const pool = [
      p({ id: "1", topic: "Micro" }),
      p({ id: "2", topic: "Micro" }),
      p({ id: "3", topic: "Macro" }),
    ];
    expect(topicCounts(pool, new Set(["1"]))).toEqual([
      { topic: "Macro", total: 1, done: 0 },
      { topic: "Micro", total: 2, done: 1 },
    ]);
  });

  it("leaves out what cannot be practised, so the total is not a lie", () => {
    const pool = [p({ id: "1", topic: "Micro" }), p({ id: "2", topic: "Micro", practiceOpen: false })];
    expect(topicCounts(pool, new Set())[0].total).toBe(1);
  });
});

describe("aiLeftToday", () => {
  it("counts down", () => {
    expect(aiLeftToday(0)).toBe(DAILY_AI_LIMIT);
    expect(aiLeftToday(3, 10)).toBe(7);
  });

  it("never goes below zero", () => {
    expect(aiLeftToday(999, 10)).toBe(0);
  });

  it("spends the allowance rather than granting it when the count is nonsense", () => {
    // A failed count must not hand out unlimited model calls.
    expect(aiLeftToday(Number.NaN, 10)).toBe(0);
  });
});

describe("startOfDay", () => {
  it("winds back to midnight", () => {
    const d = startOfDay(new Date(2026, 8, 28, 17, 43, 21, 500));
    expect([d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()])
      .toEqual([0, 0, 0, 0]);
    expect(d.getDate()).toBe(28);
  });

  it("does not move the date it was given", () => {
    const given = new Date(2026, 8, 28, 17, 0, 0);
    startOfDay(given);
    expect(given.getHours()).toBe(17);
  });
});

describe("totalsOf", () => {
  it("adds up a person's practice", () => {
    expect(totalsOf([{ points: 8, maxPoints: 10 }, { points: 5, maxPoints: 5 }]))
      .toEqual({ attempted: 2, points: 13, outOf: 15, fullMarks: 1 });
  });

  it("survives having done nothing", () => {
    expect(totalsOf([])).toEqual({ attempted: 0, points: 0, outOf: 0, fullMarks: 0 });
  });

  it("does not call a zero-mark problem full marks", () => {
    expect(totalsOf([{ points: 0, maxPoints: 0 }]).fullMarks).toBe(0);
  });
});
