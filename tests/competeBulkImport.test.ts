import { describe, it, expect } from "vitest";
import {
  splitBlocks,
  parseProblemImport,
  parseQuestionImport,
} from "@/lib/compete/bulkImport";
import { parseProblem } from "@/lib/compete/problem";
import { buildQuestions } from "@/lib/duel/questionImport";

describe("splitBlocks", () => {
  it("splits on a line of dashes and drops the empties", () => {
    expect(splitBlocks("one\n---\ntwo\n\n---\n\n---\nthree")).toEqual(["one", "two", "three"]);
  });

  it("treats a document with no separator as one block", () => {
    expect(splitBlocks("just the one")).toEqual(["just the one"]);
  });

  it("survives an empty paste", () => {
    expect(splitBlocks("")).toEqual([]);
    expect(splitBlocks("\n\n  \n")).toEqual([]);
  });

  it("does not split on a dash that is part of the text", () => {
    // A subtraction, a dash in prose, and a markdown bullet all survive.
    expect(splitBlocks("5 - 3 = 2\n- a bullet\nem — dash")).toHaveLength(1);
  });
});

describe("parseProblemImport", () => {
  const paper = `## Problem 1 — the bread market
Demand is $Q_d = 100 - 2P$ and supply is $Q_s = 20 + P$.

Find the equilibrium price.
@topic Microeconomics
@answer 26.67
@tolerance 0.1
@points 5
@hint in thousands of so'm
---
Explain who bears a tax on an inelastic good.
@points 10
@solution The more inelastic side bears more of it.
Show the split.
`;

  it("reads a paper into problems", () => {
    const { records, issues } = parseProblemImport(paper);
    expect(issues).toEqual([]);
    expect(records).toHaveLength(2);
  });

  it("takes a leading heading as the title and out of the statement", () => {
    // Left in, it would be printed twice: once as the title, once as text.
    const [first] = parseProblemImport(paper).records;
    expect(first.title).toBe("Problem 1 — the bread market");
    expect(first.statement.startsWith("Demand is")).toBe(true);
    expect(first.statement).not.toContain("## Problem 1");
  });

  it("names a problem that named itself nothing", () => {
    expect(parseProblemImport("Find P.\n@answer 4").records[0].title).toBe("Problem 1");
  });

  it("reads a number as a number", () => {
    const [first] = parseProblemImport(paper).records;
    expect(first.answerKind).toBe("NUMERIC");
    expect(first.numericValue).toBe("26.67");
    expect(first.numericTolerance).toBe("0.1");
    expect(first.answerHint).toBe("in thousands of so'm");
  });

  it("reads anything else as a short answer, with | between the spellings", () => {
    const r = parseProblemImport("What is it?\n@answer inflation | inflatsiya").records[0];
    expect(r.answerKind).toBe("SHORT");
    expect(r.acceptedAnswers).toBe("inflation | inflatsiya");
  });

  it("reads no answer as an open problem", () => {
    const [, second] = parseProblemImport(paper).records;
    expect(second.answerKind).toBe("OPEN");
  });

  it("lets a directive run onto the following lines", () => {
    // Solutions are written over several lines; nothing should need escaping.
    const [, second] = parseProblemImport(paper).records;
    expect(second.solution).toBe("The more inelastic side bears more of it.\nShow the split.");
  });

  it("chooses a marker the author did not state", () => {
    const [first, second] = parseProblemImport(paper).records;
    // A key exists, so the key marks it.
    expect(first.gradingMode).toBe("AUTO");
    // No key but a solution to mark against, so the model does.
    expect(second.gradingMode).toBe("AI");
    // No key and no solution leaves a person.
    expect(parseProblemImport("Argue it.").records[0].gradingMode).toBe("HOST");
  });

  it("honours a stated marker as closely as it can", () => {
    expect(parseProblemImport("Find P.\n@answer 4\n@marker ai").records[0].gradingMode).toBe("AI");
    expect(parseProblemImport("Find P.\n@answer 4\n@marker host").records[0].gradingMode).toBe("HOST");
    // A key that does not exist cannot mark anything.
    expect(parseProblemImport("Argue it.\n@marker auto").records[0].gradingMode).toBe("HOST");
  });

  it("defaults the marks and reads the ones given", () => {
    expect(parseProblemImport("Find P.").records[0].maxPoints).toBe(5);
    expect(parseProblemImport("Find P.\n@points 12").records[0].maxPoints).toBe(12);
    expect(parseProblemImport("Find P.\n@points nonsense").records[0].maxPoints).toBe(5);
  });

  it("reports a block with nothing in it but directives", () => {
    const { records, issues } = parseProblemImport("@answer 4\n@points 5");
    expect(records).toEqual([]);
    expect(issues).toEqual([{ block: 1, problem: "nothing to read as a problem" }]);
  });

  it("produces records the real validator accepts", () => {
    // The point of the shape: one place decides what a valid problem is.
    for (const record of parseProblemImport(paper).records) {
      expect(parseProblem(record)).toHaveProperty("problem");
    }
  });
});

describe("parseQuestionImport", () => {
  const sheet = `Topic: Microeconomics
A government sets a maximum bread price below equilibrium. What follows?
* A shortage
- A surplus
- No change in quantity
- A rise in supply
> Below the equilibrium, quantity demanded exceeds quantity supplied.
---
Topic: Macroeconomics
What is a sustained fall in the general price level?
- Disinflation
* Deflation
- Stagflation
`;

  it("reads a sheet into questions", () => {
    const { records, issues } = parseQuestionImport(sheet);
    expect(issues).toEqual([]);
    expect(records).toHaveLength(2);
  });

  it("reads the question, the options and which one is right", () => {
    const [first] = parseQuestionImport(sheet).records;
    expect(first.topic).toBe("Microeconomics");
    expect(first.questiontext).toContain("maximum bread price");
    expect(first.options).toEqual([
      "A shortage", "A surplus", "No change in quantity", "A rise in supply",
    ]);
    expect(first.correctanswer).toBe("A shortage");
    expect(first.explanation).toContain("quantity demanded exceeds");
  });

  it("does not care where the right one sits", () => {
    expect(parseQuestionImport(sheet).records[1].correctanswer).toBe("Deflation");
  });

  it("refuses a question with no right answer marked", () => {
    const { records, issues } = parseQuestionImport("What follows?\n- One\n- Two");
    expect(records).toEqual([]);
    expect(issues[0].problem).toContain("no option marked");
  });

  it("refuses two right answers rather than picking one", () => {
    const { issues } = parseQuestionImport("What?\n* One\n* Two");
    expect(issues[0].problem).toContain("2 options marked right");
  });

  it("refuses a block of options with no question", () => {
    const { issues } = parseQuestionImport("* One\n- Two");
    expect(issues[0].problem).toBe("no question text");
  });

  it("numbers the blocks the way the author sees them", () => {
    const { issues } = parseQuestionImport("What?\n* A\n- B\n---\nBroken?\n- A\n- B");
    expect(issues[0].block).toBe(2);
  });

  it("produces records the real importer accepts", () => {
    const { questions, issues } = buildQuestions(
      parseQuestionImport(sheet).records as unknown as Record<string, unknown>[]
    );
    expect(issues).toEqual([]);
    expect(questions).toHaveLength(2);
    expect(questions[0].correctAnswer).toBe("A shortage");
  });
});
