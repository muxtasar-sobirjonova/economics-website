import { describe, it, expect } from "vitest";
import { buildReview, parseGraded, type ReviewQuestion } from "@/lib/duel/review";
import type { GradedAnswer } from "@/lib/duel/grading";

const questions: ReviewQuestion[] = [
  { id: "q1", topic: "Micro", questionText: "Ceiling below equilibrium?", options: ["A shortage", "A surplus"], correctAnswer: "A shortage", explanation: "Demand exceeds supply." },
  { id: "q2", topic: "Macro", questionText: "Real rate?", options: ["Nominal minus inflation", "Nominal plus inflation"], correctAnswer: "Nominal minus inflation", explanation: null },
];

const ans = (id: string, chosen: string | null): GradedAnswer => ({
  questionId: id, chosen, correctAnswer: "", isCorrect: false, ms: 1000,
});

describe("buildReview", () => {
  it("puts both players' answers on each question", () => {
    const r = buildReview(questions, [ans("q1", "A shortage")], [ans("q1", "A surplus")]);
    expect(r[0].yourAnswer).toBe("A shortage");
    expect(r[0].theirAnswer).toBe("A surplus");
    expect(r[0].yourCorrect).toBe(true);
    expect(r[0].theirCorrect).toBe(false);
  });

  it("marks a row decisive only when exactly one side got it", () => {
    const split = buildReview(questions, [ans("q1", "A shortage")], [ans("q1", "A surplus")]);
    expect(split[0].decisive).toBe(true);

    const bothRight = buildReview(questions, [ans("q1", "A shortage")], [ans("q1", "A shortage")]);
    expect(bothRight[0].decisive).toBe(false);

    const bothWrong = buildReview(questions, [ans("q1", "A surplus")], [ans("q1", "A surplus")]);
    expect(bothWrong[0].decisive).toBe(false);
  });

  it("recomputes correctness instead of trusting the stored flag", () => {
    // A question corrected after the duel must review against the truth now.
    const stale: GradedAnswer = { questionId: "q1", chosen: "A surplus", correctAnswer: "A surplus", isCorrect: true, ms: 0 };
    const r = buildReview(questions, [stale], []);
    expect(r[0].yourCorrect).toBe(false);
  });

  it("shows an unanswered question as unanswered, not wrong-by-omission", () => {
    const r = buildReview(questions, [ans("q1", null)], [ans("q1", "A shortage")]);
    expect(r[0].yourAnswer).toBeNull();
    expect(r[0].yourCorrect).toBe(false);
  });

  it("covers every question even when neither side answered it", () => {
    const r = buildReview(questions, [], []);
    expect(r).toHaveLength(2);
    expect(r[1].yourAnswer).toBeNull();
    expect(r[1].theirAnswer).toBeNull();
  });

  it("keeps the question order it was given", () => {
    const r = buildReview(questions, [ans("q2", "x")], []);
    expect(r.map((l) => l.id)).toEqual(["q1", "q2"]);
  });
});

describe("parseGraded", () => {
  it("reads what the engine wrote", () => {
    const parsed = parseGraded([
      { questionId: "q1", chosen: "A", correctAnswer: "A", isCorrect: true, ms: 1200 },
    ]);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].isCorrect).toBe(true);
  });

  it("returns nothing for a column that is not an array", () => {
    expect(parseGraded(null)).toEqual([]);
    expect(parseGraded({})).toEqual([]);
    expect(parseGraded("oops")).toEqual([]);
  });

  it("drops entries with no question id rather than throwing", () => {
    expect(parseGraded([{ chosen: "A" }, null, 7, { questionId: "q1" }])).toHaveLength(1);
  });

  it("coerces missing or nonsense fields to safe defaults", () => {
    const [a] = parseGraded([{ questionId: "q1", chosen: 42, ms: "fast", isCorrect: "yes" }]);
    expect(a.chosen).toBeNull();
    expect(a.ms).toBe(0);
    expect(a.isCorrect).toBe(false);
  });
});
