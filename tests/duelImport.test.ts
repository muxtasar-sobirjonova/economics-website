import { describe, it, expect } from "vitest";
import { parseCsv, parseCsvRecords } from "@/lib/duel/csv";
import { buildQuestions, questionId } from "@/lib/duel/questionImport";

describe("parseCsv", () => {
  it("reads plain rows", () => {
    expect(parseCsv("a,b\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("keeps commas inside quoted fields", () => {
    // The whole reason this parser exists: an econ question is full of commas.
    expect(parseCsv('q,"If price rises, what happens?",x')).toEqual([
      ["q", "If price rises, what happens?", "x"],
    ]);
  });

  it("unescapes doubled quotes", () => {
    expect(parseCsv('"He said ""no""",b')).toEqual([['He said "no"', "b"]]);
  });

  it("keeps newlines inside quoted fields", () => {
    expect(parseCsv('"line one\nline two",b')).toEqual([["line one\nline two", "b"]]);
  });

  it("handles CRLF endings from Excel", () => {
    expect(parseCsv("a,b\r\n1,2\r\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("does not invent a row from a trailing newline", () => {
    expect(parseCsv("a,b\n1,2\n")).toHaveLength(2);
  });

  it("strips a byte-order mark", () => {
    expect(parseCsv("﻿topic,q")[0][0]).toBe("topic");
  });

  it("keeps empty trailing cells", () => {
    expect(parseCsv("a,,c")).toEqual([["a", "", "c"]]);
  });
});

describe("parseCsvRecords", () => {
  it("keys rows by lower-cased header", () => {
    const recs = parseCsvRecords("Topic,QuestionText\nMicro, What is elasticity? ");
    expect(recs).toEqual([{ topic: "Micro", questiontext: "What is elasticity?" }]);
  });

  it("drops blank lines", () => {
    expect(parseCsvRecords("a\n1\n\n2")).toHaveLength(2);
  });
});

describe("buildQuestions", () => {
  const good = {
    topic: "Micro",
    questiontext: "A firm faces perfectly elastic demand. What is its marginal revenue?",
    optiona: "Equal to price",
    optionb: "Below price",
    optionc: "Zero",
    optiond: "Rising with output",
    correctanswer: "Equal to price",
    explanation: "Price taker: every extra unit sells at the market price.",
  };

  it("accepts a well-formed row", () => {
    const { questions, issues } = buildQuestions([good]);
    expect(issues).toEqual([]);
    expect(questions).toHaveLength(1);
    expect(questions[0].options).toHaveLength(4);
    expect(questions[0].correctAnswer).toBe("Equal to price");
    expect(questions[0].topic).toBe("Micro");
  });

  it("reads options from a pipe-separated cell", () => {
    const { questions } = buildQuestions([
      { questiontext: "Q?", options: "One | Two | Three", correctanswer: "Two" },
    ]);
    expect(questions[0].options).toEqual(["One", "Two", "Three"]);
  });

  it("reads options from a JSON array", () => {
    const { questions } = buildQuestions([
      { questiontext: "Q?", options: ["One", "Two"], correctanswer: "One" },
    ]);
    expect(questions[0].options).toEqual(["One", "Two"]);
  });

  it("accepts an answer given as a letter", () => {
    const { questions } = buildQuestions([{ ...good, correctanswer: "C" }]);
    expect(questions[0].correctAnswer).toBe("Zero");
  });

  it("accepts an answer given as a number", () => {
    const { questions } = buildQuestions([{ ...good, correctanswer: "2" }]);
    expect(questions[0].correctAnswer).toBe("Below price");
  });

  it("rejects an answer that matches no option", () => {
    const { questions, issues } = buildQuestions([{ ...good, correctanswer: "Above price" }]);
    expect(questions).toHaveLength(0);
    expect(issues[0].problem).toContain("matches none");
  });

  it("rejects a row with one option", () => {
    const { issues } = buildQuestions([
      { questiontext: "Q?", optiona: "Only", correctanswer: "Only" },
    ]);
    expect(issues[0].problem).toContain("at least");
  });

  it("rejects duplicated options", () => {
    const { issues } = buildQuestions([
      { questiontext: "Q?", optiona: "Same", optionb: "same", correctanswer: "Same" },
    ]);
    expect(issues[0].problem).toContain("read the same");
  });

  it("rejects an empty question", () => {
    const { issues } = buildQuestions([{ ...good, questiontext: "  " }]);
    expect(issues[0].problem).toBe("no question text");
  });

  it("reports the spreadsheet row number, counting the header", () => {
    const { issues } = buildQuestions([good, { ...good, questiontext: "" }]);
    expect(issues[0].row).toBe(3);
  });

  it("catches the same question twice in one file", () => {
    const { questions, issues } = buildQuestions([good, { ...good }]);
    expect(questions).toHaveLength(1);
    expect(issues[0].problem).toContain("same question as row 2");
  });

  it("defaults a missing topic rather than failing the row", () => {
    const { questions } = buildQuestions([{ ...good, topic: "" }]);
    expect(questions[0].topic).toBe("General");
  });

  it("gives one question one id however its text is spaced", () => {
    expect(questionId("What is  elasticity?")).toBe(questionId(" what is elasticity? "));
  });

  it("gives different questions different ids", () => {
    expect(questionId("Question one")).not.toBe(questionId("Question two"));
  });
});
