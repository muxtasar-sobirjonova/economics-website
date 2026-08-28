import { describe, it, expect } from "vitest";
import {
  parseSetup, MIN_QUESTIONS, MAX_QUESTIONS, MIN_SECONDS, MAX_SECONDS, MAX_TITLE,
} from "@/lib/compete/setup";

const ok = { title: "Chapter 3 showdown", questionCount: 12, secondsPerQuestion: 25 };
const setupOf = (r: ReturnType<typeof parseSetup>) => ("setup" in r ? r.setup : null);
const errorOf = (r: ReturnType<typeof parseSetup>) => ("error" in r ? r.error : null);

describe("parseSetup", () => {
  it("accepts a reasonable competition", () => {
    expect(setupOf(parseSetup(ok))).toEqual({
      title: "Chapter 3 showdown", topic: null, questionCount: 12,
      secondsPerQuestion: 25, access: "OPEN",
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
