import { describe, it, expect } from "vitest";
import { rank, accuracy } from "@/lib/compete/scoring";
import {
  parseSetup, MIN_QUESTIONS, MAX_QUESTIONS, MIN_SECONDS, MAX_SECONDS, MAX_TITLE,
  MAX_ALLOWANCE, MIN_EXAM_MINUTES, MAX_EXAM_MINUTES,
} from "@/lib/compete/setup";

const ok = { title: "Chapter 3 showdown", questionCount: 12, secondsPerQuestion: 25 };
const setupOf = (r: ReturnType<typeof parseSetup>) => ("setup" in r ? r.setup : null);
const errorOf = (r: ReturnType<typeof parseSetup>) => ("error" in r ? r.error : null);

describe("parseSetup", () => {
  it("accepts a reasonable competition", () => {
    expect(setupOf(parseSetup(ok))).toEqual({
      title: "Chapter 3 showdown", topic: null, questionCount: 12,
      secondsPerQuestion: 25, access: "OPEN",
      focusPolicy: "NONE", focusAllowance: 2, durationMinutes: null,
    });
  });

  it("trims the title and refuses a blank one", () => {
    expect(setupOf(parseSetup({ ...ok, title: "  Quiz  " }))?.title).toBe("Quiz");
    expect(errorOf(parseSetup({ ...ok, title: "   " }))).toBe("title-missing");
    expect(errorOf(parseSetup({ ...ok, title: undefined }))).toBe("title-missing");
  });

  it("refuses a title that would break the layout", () => {
    expect(errorOf(parseSetup({ ...ok, title: "x".repeat(MAX_TITLE + 1) }))).toBe("title-too-long");
    expect(errorOf(parseSetup({ ...ok, title: "x".repeat(MAX_TITLE) }))).toBeNull();
  });

  it("holds the question count inside its range", () => {
    expect(errorOf(parseSetup({ ...ok, questionCount: MIN_QUESTIONS - 1 }))).toBe("questions-out-of-range");
    expect(errorOf(parseSetup({ ...ok, questionCount: MAX_QUESTIONS + 1 }))).toBe("questions-out-of-range");
    expect(errorOf(parseSetup({ ...ok, questionCount: MIN_QUESTIONS }))).toBeNull();
    expect(errorOf(parseSetup({ ...ok, questionCount: MAX_QUESTIONS }))).toBeNull();
  });

  it("holds the clock inside its range", () => {
    expect(errorOf(parseSetup({ ...ok, secondsPerQuestion: MIN_SECONDS - 1 }))).toBe("seconds-out-of-range");
    expect(errorOf(parseSetup({ ...ok, secondsPerQuestion: MAX_SECONDS + 1 }))).toBe("seconds-out-of-range");
  });

  it("reads numbers that arrive from a form as strings", () => {
    const s = setupOf(parseSetup({ ...ok, questionCount: "15", secondsPerQuestion: "30" }));
    expect(s).toMatchObject({ questionCount: 15, secondsPerQuestion: 30 });
  });

  it("refuses values that are not numbers at all", () => {
    expect(errorOf(parseSetup({ ...ok, questionCount: "twelve" }))).toBe("questions-out-of-range");
    expect(errorOf(parseSetup({ ...ok, questionCount: null }))).toBe("questions-out-of-range");
    expect(errorOf(parseSetup({ ...ok, secondsPerQuestion: NaN }))).toBe("seconds-out-of-range");
  });

  it("treats an empty topic as the whole bank", () => {
    expect(setupOf(parseSetup({ ...ok, topic: "  " }))?.topic).toBeNull();
    expect(setupOf(parseSetup({ ...ok, topic: "Finance" }))?.topic).toBe("Finance");
  });

  it("falls back to the safer access when it is not recognised", () => {
    expect(setupOf(parseSetup({ ...ok, access: "LINK" }))?.access).toBe("LINK");
    expect(setupOf(parseSetup({ ...ok, access: "EVERYONE_FOREVER" }))?.access).toBe("OPEN");
    expect(setupOf(parseSetup({ ...ok, access: undefined }))?.access).toBe("OPEN");
  });
});

describe("parseSetup — watching the page", () => {
  it("watches nobody unless the host said to", () => {
    // The strict end is never a default: a room that froze people because a
    // value arrived misspelt is worse than one that watched nobody.
    expect(setupOf(parseSetup(ok))?.focusPolicy).toBe("NONE");
    expect(setupOf(parseSetup({ ...ok, focusPolicy: "lock" }))?.focusPolicy).toBe("NONE");
    expect(setupOf(parseSetup({ ...ok, focusPolicy: 7 }))?.focusPolicy).toBe("NONE");
  });

  it("takes the two policies it knows", () => {
    expect(setupOf(parseSetup({ ...ok, focusPolicy: "WARN" }))?.focusPolicy).toBe("WARN");
    expect(setupOf(parseSetup({ ...ok, focusPolicy: "LOCK" }))?.focusPolicy).toBe("LOCK");
  });

  it("holds the allowance inside a range", () => {
    expect(setupOf(parseSetup({ ...ok, focusAllowance: 0 }))?.focusAllowance).toBe(0);
    expect(setupOf(parseSetup({ ...ok, focusAllowance: -4 }))?.focusAllowance).toBe(0);
    expect(setupOf(parseSetup({ ...ok, focusAllowance: 999 }))?.focusAllowance).toBe(MAX_ALLOWANCE);
    expect(setupOf(parseSetup({ ...ok, focusAllowance: "3" }))?.focusAllowance).toBe(3);
  });
});

describe("rank — disqualification", () => {
  const base = { totalMs: 1000, answered: 5, finished: true };

  it("sends a disqualified player to the bottom, whatever they scored", () => {
    const rows = rank([
      { userId: "a", name: "A", score: 10, ...base, disqualified: true },
      { userId: "b", name: "B", score: 4, ...base },
      { userId: "c", name: "C", score: 2, ...base },
    ]);
    expect(rows.map((r) => r.userId)).toEqual(["b", "c", "a"]);
    expect(rows[2].rank).toBe(3);
  });

  it("keeps them on the board rather than removing them", () => {
    // The row is the evidence for the decision; deleting it deletes that too.
    const rows = rank([{ userId: "a", name: "A", score: 10, ...base, disqualified: true }]);
    expect(rows).toHaveLength(1);
    expect(rows[0].score).toBe(10);
  });

  it("does not give two disqualified players a shared rank", () => {
    const rows = rank([
      { userId: "a", name: "A", score: 5, ...base, disqualified: true },
      { userId: "b", name: "B", score: 5, ...base, disqualified: true },
      { userId: "c", name: "C", score: 1, ...base },
    ]);
    expect(rows.map((r) => r.rank)).toEqual([1, 2, 3]);
  });

  it("still shares a rank between two who are genuinely level", () => {
    const rows = rank([
      { userId: "a", name: "A", score: 5, ...base },
      { userId: "b", name: "B", score: 5, ...base },
      { userId: "c", name: "C", score: 1, ...base },
    ]);
    expect(rows.map((r) => r.rank)).toEqual([1, 1, 3]);
  });
});

describe("rank — accuracy as the third tie-breaker", () => {
  const level = { totalMs: 1000, finished: true };

  it("separates two players level on score and on the clock", () => {
    // Four from four beats four from ten: the same total, less guessing.
    const rows = rank([
      { userId: "guesser", name: "A", score: 4, answered: 10, ...level },
      { userId: "sharp", name: "B", score: 4, answered: 4, ...level },
    ]);
    expect(rows.map((r) => r.userId)).toEqual(["sharp", "guesser"]);
    expect(rows.map((r) => r.rank)).toEqual([1, 2]);
  });

  it("does not let score or the clock be overridden by accuracy", () => {
    const rows = rank([
      { userId: "low", name: "A", score: 2, answered: 2, ...level },
      { userId: "high", name: "B", score: 9, answered: 10, ...level },
    ]);
    expect(rows[0].userId).toBe("high");
  });

  it("still shares a rank between two who match on all three", () => {
    const rows = rank([
      { userId: "a", name: "A", score: 5, answered: 5, ...level },
      { userId: "b", name: "B", score: 5, answered: 5, ...level },
    ]);
    expect(rows.map((r) => r.rank)).toEqual([1, 1]);
  });

  it("gives nobody credit for answering nothing", () => {
    expect(accuracy({ score: 0, answered: 0 })).toBe(0);
    expect(accuracy({ score: 3, answered: 6 })).toBe(0.5);
  });
});

describe("parseSetup — the two shapes of a quiz room", () => {
  it("is a fast round unless a clock for the paper is given", () => {
    // Absent, null and unreadable all mean the per-question quiz that came
    // first; nothing silently turns an old room into an exam.
    expect(setupOf(parseSetup(ok))?.durationMinutes).toBeNull();
    expect(setupOf(parseSetup({ ...ok, durationMinutes: null }))?.durationMinutes).toBeNull();
    expect(setupOf(parseSetup({ ...ok, durationMinutes: "soon" }))?.durationMinutes).toBeNull();
    expect(setupOf(parseSetup({ ...ok, durationMinutes: 0 }))?.durationMinutes).toBeNull();
  });

  it("becomes an exam when one is", () => {
    expect(setupOf(parseSetup({ ...ok, durationMinutes: 20 }))?.durationMinutes).toBe(20);
    expect(setupOf(parseSetup({ ...ok, durationMinutes: "45" }))?.durationMinutes).toBe(45);
  });

  it("clamps a clock nobody could have dragged a slider to", () => {
    expect(setupOf(parseSetup({ ...ok, durationMinutes: 1 }))?.durationMinutes)
      .toBe(MIN_EXAM_MINUTES);
    expect(setupOf(parseSetup({ ...ok, durationMinutes: 99999 }))?.durationMinutes)
      .toBe(MAX_EXAM_MINUTES);
  });
});
