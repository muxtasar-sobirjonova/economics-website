import { describe, it, expect } from "vitest";
import { problemsToSql, problemId, type ProblemRow } from "@/lib/compete/problemSql";

const base: ProblemRow = {
  id: "pr_one",
  title: "Problem 1",
  topic: "Case · Hyperloop",
  statement: "Find the equilibrium price.",
  imageUrl: null,
  answerKind: "NUMERIC",
  numericValue: 26.67,
  numericTolerance: 0.1,
  acceptedAnswers: [],
  answerHint: "a number",
  solution: "Set Qd = Qs.",
  maxPoints: 5,
  gradingMode: "AUTO",
};

describe("problemId", () => {
  it("is the same for the same statement, whatever the spacing", () => {
    expect(problemId("Find P.")).toBe(problemId("  find   p. "));
  });

  it("differs for a different statement", () => {
    expect(problemId("Find P.")).not.toBe(problemId("Find Q."));
  });

  it("is recognisable in a database", () => {
    expect(problemId("Find P.")).toMatch(/^pr_[0-9a-f]{24}$/);
  });
});

describe("problemsToSql", () => {
  it("says so rather than emitting a broken statement", () => {
    expect(problemsToSql([])).toContain("no problems");
    expect(problemsToSql([])).not.toContain("INSERT");
  });

  it("writes one row per problem", () => {
    const sql = problemsToSql([base, { ...base, id: "pr_two", title: "Problem 2" }]);
    expect(sql).toContain('INSERT INTO "Problem"');
    expect(sql).toContain("'pr_one'");
    expect(sql).toContain("'pr_two'");
    expect(sql).toContain("-- 2 problem(s), 10 marks.");
  });

  it("escapes a quote instead of ending the string early", () => {
    // The whole reason this file is pure and tested: a problem about a firm's
    // margin would otherwise run part of itself as SQL.
    const sql = problemsToSql([
      { ...base, statement: "What is the firm's margin? Don't guess." },
    ]);
    expect(sql).toContain("'What is the firm''s margin? Don''t guess.'");
    // Every literal still opens and closes. Counted over the statement only —
    // the header comments are prose and contain apostrophes of their own.
    const statement = sql
      .split("\n")
      .filter((line) => !line.trimStart().startsWith("--"))
      .join("\n");
    expect((statement.match(/'/g) ?? []).length % 2).toBe(0);
  });

  it("writes null where there is nothing, not an empty string", () => {
    const sql = problemsToSql([
      { ...base, imageUrl: null, solution: null, answerHint: "", numericValue: null },
    ]);
    expect(sql).toContain("NULL");
    expect(sql).not.toContain("''");
  });

  it("casts the enums, which are written here and never by an author", () => {
    const sql = problemsToSql([{ ...base, answerKind: "OPEN", gradingMode: "AI" }]);
    expect(sql).toContain(`'OPEN'::"ProblemAnswerKind"`);
    expect(sql).toContain(`'AI'::"ProblemGrading"`);
  });

  it("writes an accepted-answer array, empty or not", () => {
    expect(problemsToSql([base])).toContain("ARRAY[]::text[]");
    expect(
      problemsToSql([{ ...base, answerKind: "SHORT", acceptedAnswers: ["a", "b"] }])
    ).toContain("ARRAY['a', 'b']::text[]");
  });

  it("updates on conflict rather than doubling the bank", () => {
    const sql = problemsToSql([base]);
    expect(sql).toContain('ON CONFLICT ("id") DO UPDATE SET');
    expect(sql).toContain('"statement"        = EXCLUDED."statement"');
  });

  it("never overwrites active", () => {
    // Retiring a problem is a decision somebody made; a re-import must not
    // quietly bring it back. Asserted against the SET clause rather than the
    // whole file, which says so in a comment.
    const sql = problemsToSql([base]);
    const setClause = sql.slice(sql.indexOf("DO UPDATE SET"));
    expect(setClause).not.toContain('"active"');
    expect(setClause).toContain('"statement"');
  });

  it("counts the marks and the topics in the footer", () => {
    const sql = problemsToSql([
      base,
      { ...base, id: "pr_two", topic: "Case · Vaccine pricing", maxPoints: 10 },
    ]);
    expect(sql).toContain("-- 2 problem(s), 15 marks.");
    expect(sql).toContain("--   Case · Hyperloop: 1");
    expect(sql).toContain("--   Case · Vaccine pricing: 1");
  });
});
