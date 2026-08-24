import { describe, it, expect } from "vitest";
import {
  gradeRun,
  elapsedMs,
  MAX_MS_PER_QUESTION,
  type AnswerKey,
} from "@/lib/duel/grading";
import { pickQuestionIds, shuffle } from "@/lib/duel/selection";

const keys: AnswerKey[] = [
  { id: "q1", correctAnswer: "A shortage" },
  { id: "q2", correctAnswer: "Inelastic" },
  { id: "q3", correctAnswer: "Zero" },
];

/** Deterministic source so a shuffle can be asserted. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

describe("gradeRun", () => {
  it("scores only exact matches", () => {
    const { score, graded } = gradeRun(keys, [
      { questionId: "q1", chosen: "A shortage", ms: 4000 },
      { questionId: "q2", chosen: "Elastic", ms: 3000 },
      { questionId: "q3", chosen: "Zero", ms: 2000 },
    ]);
    expect(score).toBe(2);
    expect(graded.map((g) => g.isCorrect)).toEqual([true, false, true]);
  });

  it("treats a missing answer as unanswered, not as a guess", () => {
    const { score, graded } = gradeRun(keys, [
      { questionId: "q1", chosen: "A shortage", ms: 1000 },
    ]);
    expect(score).toBe(1);
    expect(graded[1].chosen).toBeNull();
    expect(graded[1].isCorrect).toBe(false);
  });

  it("matches by question id, not by position", () => {
    // A reordered payload must not shift answers onto the wrong questions.
    const { score } = gradeRun(keys, [
      { questionId: "q3", chosen: "Zero", ms: 1000 },
      { questionId: "q1", chosen: "A shortage", ms: 1000 },
      { questionId: "q2", chosen: "Inelastic", ms: 1000 },
    ]);
    expect(score).toBe(3);
  });

  it("ignores an answer for a question not in the set", () => {
    const { graded, score } = gradeRun(keys, [
      { questionId: "q99", chosen: "Zero", ms: 1000 },
    ]);
    expect(graded).toHaveLength(3);
    expect(score).toBe(0);
  });

  it("keeps the first answer when a question is sent twice", () => {
    const { score } = gradeRun(keys, [
      { questionId: "q1", chosen: "A surplus", ms: 1000 },
      { questionId: "q1", chosen: "A shortage", ms: 1000 },
    ]);
    expect(score).toBe(0);
  });

  it("caps a reported time and refuses a negative one", () => {
    const { graded } = gradeRun(keys, [
      { questionId: "q1", chosen: "A shortage", ms: 999_999 },
      { questionId: "q2", chosen: "Inelastic", ms: -50 },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { questionId: "q3", chosen: "Zero", ms: "fast" as any },
    ]);
    expect(graded[0].ms).toBe(MAX_MS_PER_QUESTION);
    expect(graded[1].ms).toBe(0);
    expect(graded[2].ms).toBe(0);
  });

  it("does not credit an empty or null choice", () => {
    const { score } = gradeRun([{ id: "q1", correctAnswer: "" }], [
      { questionId: "q1", chosen: null, ms: 0 },
    ]);
    expect(score).toBe(0);
  });
});

describe("elapsedMs", () => {
  it("measures from the server's own clock", () => {
    const start = new Date("2026-08-24T10:00:00Z");
    const end = new Date("2026-08-24T10:01:00Z");
    expect(elapsedMs(start, end, 10)).toBe(60_000);
  });

  it("caps a run left open for hours", () => {
    const start = new Date("2026-08-24T10:00:00Z");
    const end = new Date("2026-08-24T18:00:00Z");
    expect(elapsedMs(start, end, 10)).toBe(10 * MAX_MS_PER_QUESTION);
  });

  it("gives the worst possible time if the clock ran backwards", () => {
    // A submission timestamped before its start cannot be allowed to win a
    // tiebreak, so it is treated as the slowest possible run.
    const start = new Date("2026-08-24T10:00:00Z");
    const end = new Date("2026-08-24T09:00:00Z");
    expect(elapsedMs(start, end, 10)).toBe(10 * MAX_MS_PER_QUESTION);
  });
});

describe("pickQuestionIds", () => {
  const bank = Array.from({ length: 40 }, (_, i) => `q${i}`);

  it("never repeats a question inside one set", () => {
    const { ids } = pickQuestionIds(bank, [], 10, seeded(1));
    expect(new Set(ids).size).toBe(10);
  });

  it("prefers questions the player has not seen", () => {
    const seen = bank.slice(0, 30);
    const { ids, reused } = pickQuestionIds(bank, seen, 10, seeded(2));
    expect(reused).toBe(false);
    expect(ids.every((id) => !seen.includes(id))).toBe(true);
  });

  it("still deals a set when the bank is exhausted, and says so", () => {
    const seen = bank.slice(0, 35);
    const { ids, reused } = pickQuestionIds(bank, seen, 10, seeded(3));
    expect(ids).toHaveLength(10);
    expect(new Set(ids).size).toBe(10);
    expect(reused).toBe(true);
  });

  it("uses every unseen question before reaching for a seen one", () => {
    const seen = bank.slice(0, 35); // 5 unseen remain
    const { ids } = pickQuestionIds(bank, seen, 10, seeded(4));
    const unseen = bank.slice(35);
    expect(unseen.every((id) => ids.includes(id))).toBe(true);
  });

  it("returns what it can when the bank is smaller than a set", () => {
    const { ids } = pickQuestionIds(["a", "b", "c"], [], 10, seeded(5));
    expect(ids).toHaveLength(3);
  });

  it("does not reorder the caller's array", () => {
    const original = bank.slice();
    pickQuestionIds(bank, [], 10, seeded(6));
    expect(bank).toEqual(original);
  });
});

describe("shuffle", () => {
  it("keeps every element exactly once", () => {
    const items = ["a", "b", "c", "d"];
    expect(shuffle(items, seeded(7)).sort()).toEqual(items);
  });

  it("does change the order", () => {
    const items = Array.from({ length: 20 }, (_, i) => i);
    expect(shuffle(items, seeded(8))).not.toEqual(items);
  });
});
