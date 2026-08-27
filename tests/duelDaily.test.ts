import { describe, it, expect } from "vitest";
import { dayKey, hashDay, pickDailyQuestionId } from "@/lib/duel/daily";

const bank = Array.from({ length: 100 }, (_, i) => `q${String(i).padStart(3, "0")}`);

describe("dayKey", () => {
  it("formats as a sortable calendar date", () => {
    expect(dayKey(new Date("2026-08-27T09:00:00Z"))).toBe("2026-08-27");
  });

  it("uses the site's zone, not the server's", () => {
    // 22:00 UTC is already the next day in Tashkent (UTC+5).
    expect(dayKey(new Date("2026-08-27T22:00:00Z"))).toBe("2026-08-28");
  });

  it("gives one key for a whole local day", () => {
    const a = dayKey(new Date("2026-08-27T00:00:00Z"));
    const b = dayKey(new Date("2026-08-27T18:59:00Z"));
    expect(a).toBe(b);
  });
});

describe("pickDailyQuestionId", () => {
  it("gives the same question all day", () => {
    expect(pickDailyQuestionId(bank, "2026-08-27")).toBe(pickDailyQuestionId(bank, "2026-08-27"));
  });

  it("gives a different question the next day", () => {
    expect(pickDailyQuestionId(bank, "2026-08-27")).not.toBe(pickDailyQuestionId(bank, "2026-08-28"));
  });

  it("does not depend on the order the ids arrive in", () => {
    const shuffled = [...bank].reverse();
    expect(pickDailyQuestionId(shuffled, "2026-08-27")).toBe(pickDailyQuestionId(bank, "2026-08-27"));
  });

  it("always picks something that is in the bank", () => {
    for (let d = 1; d <= 28; d++) {
      const day = `2026-09-${String(d).padStart(2, "0")}`;
      expect(bank).toContain(pickDailyQuestionId(bank, day));
    }
  });

  it("never repeats on consecutive days", () => {
    // The only clustering a player would actually notice.
    const seen = Array.from({ length: 365 }, (_, i) => {
      const d = new Date("2026-01-01T12:00:00Z");
      d.setUTCDate(d.getUTCDate() + i);
      return pickDailyQuestionId(bank, dayKey(d));
    });
    const backToBack = seen.filter((q, i) => i > 0 && q === seen[i - 1]);
    expect(backToBack).toEqual([]);
  });

  it("reaches the whole bank over a year", () => {
    const seen = new Set(
      Array.from({ length: 365 }, (_, i) => {
        const d = new Date("2026-01-01T12:00:00Z");
        d.setUTCDate(d.getUTCDate() + i);
        return pickDailyQuestionId(bank, dayKey(d));
      })
    );
    // Sampling with replacement leaves a few unreached in theory; this hash
    // measured 100 of 100, so anything under 90 means real clustering.
    expect(seen.size).toBeGreaterThanOrEqual(90);
  });

  it("returns null on an empty bank instead of throwing", () => {
    expect(pickDailyQuestionId([], "2026-08-27")).toBeNull();
  });

  it("copes with a single-question bank", () => {
    expect(pickDailyQuestionId(["only"], "2026-08-27")).toBe("only");
  });
});

describe("hashDay", () => {
  it("is stable", () => {
    expect(hashDay("2026-08-27")).toBe(hashDay("2026-08-27"));
  });

  it("separates adjacent days", () => {
    expect(hashDay("2026-08-27")).not.toBe(hashDay("2026-08-28"));
  });
});
