import { describe, it, expect } from "vitest";
import { csvField, resultsToCsv, csvFilename, type ResultRow } from "@/lib/compete/csv";

const row = (over: Partial<ResultRow> = {}): ResultRow => ({
  rank: 1, name: "Abdulloh", score: 18, answered: 4, totalMs: 125_000,
  finished: true, ...over,
});

describe("csvField", () => {
  it("leaves a plain value alone", () => {
    expect(csvField("Abdulloh")).toBe("Abdulloh");
    expect(csvField(12)).toBe("12");
  });

  it("writes nothing for nothing", () => {
    expect(csvField(null)).toBe("");
    expect(csvField(undefined)).toBe("");
  });

  it("quotes a value with a comma, so the columns do not shift", () => {
    // The whole reason this file is tested: one comma in one name moves every
    // mark after it into the wrong column, silently.
    expect(csvField("Sobirjonova, Muxtasar")).toBe('"Sobirjonova, Muxtasar"');
  });

  it("doubles a quote rather than ending the field", () => {
    expect(csvField('She said "no"')).toBe('"She said ""no"""');
  });

  it("quotes a value with a newline in it", () => {
    expect(csvField("two\nlines")).toBe('"two\nlines"');
  });

  it("stops a spreadsheet reading a name as a formula", () => {
    // A student called "-Ali" should not become #NAME? in Excel.
    expect(csvField("-Ali")).toBe("'-Ali");
    expect(csvField("=SUM(A1)")).toBe("'=SUM(A1)");
    expect(csvField("@home")).toBe("'@home");
  });
});

describe("resultsToCsv", () => {
  it("writes a header and a line per player", () => {
    const csv = resultsToCsv([row(), row({ rank: 2, name: "Muxtasar", score: 12 })], {
      title: "Round one",
    });
    const lines = csv.trim().split("\r\n");
    expect(lines[0]).toContain("Round one");
    expect(lines[1]).toContain("Rank,Name,Score");
    expect(lines).toHaveLength(4); // title, header, two players
  });

  it("writes the time as minutes and seconds", () => {
    expect(resultsToCsv([row({ totalMs: 125_000 })], { title: "t" })).toContain("2:05");
  });

  it("says what happened to each paper", () => {
    const csv = resultsToCsv(
      [
        row({ finished: true }),
        row({ rank: 2, finished: false }),
        row({ rank: 3, disqualified: true, disqualifyReason: "Two papers matched" }),
      ],
      { title: "t" }
    );
    expect(csv).toContain("Submitted");
    expect(csv).toContain("Unfinished");
    expect(csv).toContain("Disqualified");
    expect(csv).toContain("Two papers matched");
  });

  it("adds a column per problem, in the order the paper asked them", () => {
    const csv = resultsToCsv(
      [row({ perProblem: [10, 0, null] })],
      { title: "t", problemTitles: ["Q1", "Q2", "Q3"] }
    );
    const [, header, line] = csv.trim().split("\r\n");
    expect(header).toContain("Q1,Q2,Q3");
    // An unmarked answer is blank, not a zero — they are not the same thing.
    expect(line).toContain("10,0,,");
  });

  it("names a player nobody named", () => {
    expect(resultsToCsv([row({ name: null })], { title: "t" })).toContain("Anonymous");
  });

  it("starts with a BOM so Excel reads so'm and em dashes correctly", () => {
    expect(resultsToCsv([row({ name: "Abdulloh — o'quvchi" })], { title: "t" })[0])
      .toBe("﻿");
  });

  it("survives a room nobody played", () => {
    const csv = resultsToCsv([], { title: "Empty" });
    expect(csv).toContain("Rank,Name");
    expect(csv.trim().split("\r\n")).toHaveLength(2);
  });
});

describe("csvFilename", () => {
  it("builds a name a teacher can find again", () => {
    expect(csvFilename("Round one — micro", "A7XYV4")).toBe("Round-one-micro-A7XYV4.csv");
  });

  it("keeps letters that are not English", () => {
    expect(csvFilename("Birinchi bosqich", "AB12CD")).toBe("Birinchi-bosqich-AB12CD.csv");
  });

  it("still produces a name when the title is all punctuation", () => {
    expect(csvFilename("!!!", "AB12CD")).toBe("results-AB12CD.csv");
  });
});
