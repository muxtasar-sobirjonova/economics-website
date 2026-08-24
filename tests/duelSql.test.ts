import { describe, it, expect } from "vitest";
import { questionsToSql } from "@/lib/duel/questionSql";
import { buildQuestions } from "@/lib/duel/questionImport";

const one = (over: Record<string, unknown> = {}) =>
  buildQuestions([
    {
      topic: "Micro",
      questiontext: "What is marginal revenue?",
      optiona: "Price",
      optionb: "Cost",
      correctanswer: "Price",
      explanation: "Price taker.",
      ...over,
    },
  ]).questions;

/**
 * Everything dangerous lives inside a string literal, so the real question is
 * always "what is left once the literals are removed?" — counting characters
 * across the whole file catches the ones legitimately inside a question.
 */
function outsideLiterals(sql: string): string {
  const body = sql
    .split("\n")
    .filter((l) => !l.trimStart().startsWith("--"))
    .join("\n");
  return body.replace(/'(?:[^']|'')*'/g, "@");
}

describe("questionsToSql", () => {
  it("escapes a single quote by doubling it", () => {
    // The obvious break: "firm's" would otherwise close the string literal.
    const sql = questionsToSql(one({ questiontext: "What is a firm's marginal revenue?" }));
    expect(sql).toContain("What is a firm''s marginal revenue?");
    expect(sql).not.toContain("firm's marginal");
  });

  it("survives an apostrophe inside an option", () => {
    const sql = questionsToSql(one({ optiona: "The buyer's surplus", correctanswer: "A" }));
    expect(sql).toContain("The buyer''s surplus");
  });

  it("does not let a semicolon in a question end the statement early", () => {
    const sql = questionsToSql(one({ questiontext: "Rank these; then choose." }));
    // The semicolon survives in the text, but only one terminates a statement.
    expect(sql).toContain("Rank these; then choose.");
    expect(outsideLiterals(sql).match(/;/g)).toHaveLength(1);
  });

  it("neutralises an injection attempt in the text", () => {
    const sql = questionsToSql(one({ questiontext: "x'); DROP TABLE \"User\"; --" }));
    expect(sql).toContain("x''); DROP TABLE \"User\"; --");

    // The payload must exist only inside a literal: nothing executable escapes.
    const outside = outsideLiterals(sql);
    expect(outside).not.toContain("DROP");
    expect(outside.match(/;/g)).toHaveLength(1);
  });

  it("leaves every quote balanced", () => {
    const sql = questionsToSql(one({ questiontext: "It's a firm's owner's call" }));
    const body = sql.split("\n").filter((l) => !l.trimStart().startsWith("--")).join("\n");
    expect((body.match(/'/g) ?? []).length % 2).toBe(0);
  });

  it("writes options as a typed text array", () => {
    expect(questionsToSql(one())).toContain("ARRAY['Price', 'Cost']::text[]");
  });

  it("writes a missing explanation as NULL, not an empty string", () => {
    const sql = questionsToSql(one({ explanation: "" }));
    expect(sql).toContain(", NULL)");
  });

  it("keeps newlines inside a question", () => {
    const sql = questionsToSql(one({ questiontext: "Line one\nline two" }));
    expect(sql).toContain("Line one\nline two");
  });

  it("upserts rather than inserting twice", () => {
    const sql = questionsToSql(one());
    expect(sql).toContain('ON CONFLICT ("id") DO UPDATE SET');
    expect(sql).not.toContain('"timesServed"');
    expect(sql).not.toContain('"active"');
  });

  it("says so plainly when there is nothing to write", () => {
    expect(questionsToSql([])).toBe("-- no questions\n");
  });
});
