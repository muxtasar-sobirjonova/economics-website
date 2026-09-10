import { describe, it, expect, vi } from "vitest";
import { markAnswer, hostMark, type MarkableProblem, type AskModel } from "@/lib/compete/marking";

const numeric: MarkableProblem = {
  statement: "Find the equilibrium price.",
  solution: "P = 40",
  answerKind: "NUMERIC",
  numericValue: 40,
  numericTolerance: 0,
  acceptedAnswers: [],
  maxPoints: 5,
  gradingMode: "AUTO",
};

const open: MarkableProblem = {
  ...numeric,
  answerKind: "OPEN",
  numericValue: null,
  gradingMode: "AI",
};

/** A model that always answers, and records that it was asked. */
const answering = (points: number, comment = "Fine."): AskModel =>
  vi.fn().mockResolvedValue({ points, comment });

/** A model that is down, unpaid, or not configured. */
const silent: AskModel = vi.fn().mockResolvedValue(null);

describe("markAnswer — nothing written", () => {
  it("scores a blank box without asking anyone, in every mode", async () => {
    for (const mode of ["AUTO", "AI", "HOST"] as const) {
      const ask = answering(5);
      const mark = await markAnswer({ ...numeric, gradingMode: mode }, "   ", ask);
      expect(mark).toEqual({
        points: 0, gradedBy: "AUTO", feedback: "No answer given.", isCorrect: false,
      });
      expect(ask).not.toHaveBeenCalled();
    }
  });
});

describe("markAnswer — AUTO", () => {
  it("awards the mark from the key", async () => {
    const mark = await markAnswer(numeric, "40", silent);
    expect(mark.points).toBe(5);
    expect(mark.gradedBy).toBe("AUTO");
    expect(mark.isCorrect).toBe(true);
  });

  it("scores a wrong number as wrong", async () => {
    const mark = await markAnswer(numeric, "41", silent);
    expect(mark.points).toBe(0);
    expect(mark.isCorrect).toBe(false);
  });

  it("never calls the model", async () => {
    const ask = answering(5);
    await markAnswer(numeric, "41", ask);
    expect(ask).not.toHaveBeenCalled();
  });

  it("leaves an answer the key cannot read for the host", async () => {
    // "roughly forty" may deserve the mark. This mode is not the one to decide.
    const mark = await markAnswer(numeric, "roughly forty", silent);
    expect(mark.gradedBy).toBe("PENDING");
    expect(mark.points).toBe(0);
  });
});

describe("markAnswer — HOST", () => {
  it("waits, and asks nothing", async () => {
    const ask = answering(5);
    const mark = await markAnswer({ ...numeric, gradingMode: "HOST" }, "40", ask);
    expect(mark.gradedBy).toBe("PENDING");
    expect(ask).not.toHaveBeenCalled();
  });
});

describe("markAnswer — AI", () => {
  it("takes the key's word when the key says right, and spends nothing", async () => {
    const ask = answering(1);
    const mark = await markAnswer({ ...numeric, gradingMode: "AI" }, "40", ask);
    expect(mark).toEqual({
      points: 5, gradedBy: "AUTO", feedback: "Matches the key.", isCorrect: true,
    });
    expect(ask).not.toHaveBeenCalled();
  });

  it("sends a wrong number to the model, where the method can still earn marks", async () => {
    const ask = answering(3, "Right method, arithmetic slip.");
    const mark = await markAnswer({ ...numeric, gradingMode: "AI" }, "41", ask);
    expect(ask).toHaveBeenCalledOnce();
    expect(mark).toEqual({
      points: 3, gradedBy: "AI", feedback: "Right method, arithmetic slip.", isCorrect: false,
    });
  });

  it("sends an open problem straight to the model", async () => {
    const ask = answering(7, "Well argued.");
    const mark = await markAnswer({ ...open, maxPoints: 7 }, "Because supply fell.", ask);
    expect(ask).toHaveBeenCalledOnce();
    expect(mark.gradedBy).toBe("AI");
    expect(mark.isCorrect).toBe(true);
  });

  it("passes the author's solution to the model, not the student's", async () => {
    const ask = answering(2);
    await markAnswer(open, "My working", ask);
    expect(ask).toHaveBeenCalledWith({
      statement: "Find the equilibrium price.",
      solution: "P = 40",
      maxPoints: 5,
      answer: "My working",
    });
  });

  it("waits rather than scoring zero when the model cannot be reached", async () => {
    // A class must not be handed a page of noughts because a key expired.
    const mark = await markAnswer(open, "A real attempt at the problem.", silent);
    expect(mark).toEqual({ points: 0, gradedBy: "PENDING", feedback: null, isCorrect: false });
  });
});

describe("hostMark", () => {
  it("takes the mark the host typed", async () => {
    expect(hostMark(3, 5, "Half the method.")).toEqual({
      points: 3, gradedBy: "HOST", feedback: "Half the method.", isCorrect: false,
    });
  });

  it("clamps to what the problem is worth", () => {
    expect(hostMark(99, 5, null).points).toBe(5);
    expect(hostMark(-2, 5, null).points).toBe(0);
    expect(hostMark("not a number", 5, null).points).toBe(0);
  });

  it("counts full marks as correct", () => {
    expect(hostMark(5, 5, null).isCorrect).toBe(true);
    expect(hostMark(0, 0, null).isCorrect).toBe(false);
  });

  it("keeps an empty comment out of the record", () => {
    expect(hostMark(1, 5, "   ").feedback).toBeNull();
  });
});
