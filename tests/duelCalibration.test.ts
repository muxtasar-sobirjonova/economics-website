import { describe, it, expect } from "vitest";
import {
  assess,
  correctRate,
  sortByAttention,
  summarise,
  MIN_SERVINGS,
  type QuestionStat,
} from "@/lib/duel/calibration";

const q = (served: number, correct: number, over: Partial<QuestionStat> = {}): QuestionStat => ({
  id: "q1", topic: "Micro", questionText: "?", timesServed: served, timesCorrect: correct,
  active: true, ...over,
});

describe("correctRate", () => {
  it("is null before a question has been served", () => {
    expect(correctRate(0, 0)).toBeNull();
  });

  it("is the share of servings answered correctly", () => {
    expect(correctRate(20, 5)).toBe(0.25);
  });
});

describe("assess", () => {
  it("withholds judgement until there is enough data", () => {
    // One person getting it wrong is not evidence of anything.
    expect(assess(q(MIN_SERVINGS - 1, 0)).health).toBe("new");
  });

  it("flags a question almost nobody gets as a likely wrong key", () => {
    // Four options: blind guessing scores 25%. Landing far below that means
    // players are being steered to an answer marked incorrect.
    expect(assess(q(40, 2)).health).toBe("suspect");
  });

  it("calls a genuinely hard question hard, not broken", () => {
    // Above chance, so somebody knows it — the key is doing its job.
    expect(assess(q(40, 13)).health).toBe("hard");
  });

  it("calls a well-behaved question fine", () => {
    expect(assess(q(40, 22)).health).toBe("fine");
  });

  it("flags a question nearly everyone gets as deciding nothing", () => {
    expect(assess(q(40, 39)).health).toBe("trivial");
  });

  it("does not call a hard question suspect just above the threshold", () => {
    expect(assess(q(100, 16)).health).not.toBe("suspect");
  });

  it("judges an unserved question as new however it is counted", () => {
    expect(assess(q(0, 0)).rate).toBeNull();
    expect(assess(q(0, 0)).health).toBe("new");
  });
});

describe("sortByAttention", () => {
  it("puts likely broken questions first and unjudged ones last", () => {
    const rows = [q(40, 22), q(40, 39), q(2, 0), q(40, 1), q(40, 13)].map((r, i) =>
      assess({ ...r, id: `q${i}` })
    );
    expect(sortByAttention(rows).map((r) => r.health)).toEqual([
      "suspect", "trivial", "hard", "fine", "new",
    ]);
  });

  it("does not reorder the caller's array", () => {
    const rows = [assess(q(40, 22)), assess(q(40, 1))];
    const before = rows.map((r) => r.health);
    sortByAttention(rows);
    expect(rows.map((r) => r.health)).toEqual(before);
  });
});

describe("summarise", () => {
  it("counts what needs attention and averages only judged questions", () => {
    const rows = [q(40, 2), q(40, 39), q(40, 20), q(1, 0)].map((r, i) =>
      assess({ ...r, id: `q${i}` })
    );
    const s = summarise(rows);
    expect(s.total).toBe(4);
    expect(s.judged).toBe(3);
    expect(s.suspect).toBe(1);
    expect(s.trivial).toBe(1);
    // (0.05 + 0.975 + 0.5) / 3 — the unserved question must not drag it down.
    expect(s.meanRate).toBeCloseTo(0.508, 2);
  });

  it("reports no mean when nothing has been judged", () => {
    expect(summarise([assess(q(0, 0))]).meanRate).toBeNull();
  });

  it("counts active separately from total", () => {
    const rows = [assess(q(40, 2, { active: false })), assess(q(40, 20))];
    expect(summarise(rows)).toMatchObject({ total: 2, active: 1 });
  });
});
