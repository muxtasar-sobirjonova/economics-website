import { describe, it, expect } from "vitest";
import {
  START_RATING,
  K_PROVISIONAL,
  K_ESTABLISHED,
  kFactor,
  expectedScore,
  outcome,
  ratingDelta,
  resolveDuel,
} from "@/lib/duel/elo";

describe("kFactor", () => {
  it("is doubled for a player's first ten duels", () => {
    expect(kFactor(0)).toBe(K_PROVISIONAL);
    expect(kFactor(9)).toBe(K_PROVISIONAL);
  });

  it("settles down from the tenth duel on", () => {
    expect(kFactor(10)).toBe(K_ESTABLISHED);
    expect(kFactor(400)).toBe(K_ESTABLISHED);
  });
});

describe("expectedScore", () => {
  it("is an even split between equal players", () => {
    expect(expectedScore(1000, 1000)).toBeCloseTo(0.5, 10);
  });

  it("gives a 400-point favourite about ten to one", () => {
    expect(expectedScore(1400, 1000)).toBeCloseTo(10 / 11, 6);
  });

  it("is symmetric — the two expectations sum to one", () => {
    expect(expectedScore(1240, 980) + expectedScore(980, 1240)).toBeCloseTo(1, 10);
  });
});

describe("outcome", () => {
  it("gives it to more correct answers", () => {
    expect(outcome({ score: 8, totalMs: 90_000 }, { score: 7, totalMs: 10_000 })).toBe(1);
    expect(outcome({ score: 6, totalMs: 10_000 }, { score: 7, totalMs: 90_000 })).toBe(0);
  });

  it("breaks a tie on total time", () => {
    expect(outcome({ score: 7, totalMs: 60_000 }, { score: 7, totalMs: 61_000 })).toBe(1);
    expect(outcome({ score: 7, totalMs: 62_000 }, { score: 7, totalMs: 61_000 })).toBe(0);
  });

  it("is a draw only when score and time both match", () => {
    expect(outcome({ score: 7, totalMs: 60_000 }, { score: 7, totalMs: 60_000 })).toBe(0.5);
  });
});

describe("ratingDelta", () => {
  it("moves an even match by half the K factor", () => {
    expect(ratingDelta(1000, 1000, 50, 1)).toBe(K_ESTABLISHED / 2);
    expect(ratingDelta(1000, 1000, 50, 0)).toBe(-K_ESTABLISHED / 2);
  });

  it("costs a heavy favourite little for winning", () => {
    const won = ratingDelta(1600, 1000, 50, 1);
    expect(won).toBeGreaterThan(0);
    expect(won).toBeLessThan(3);
  });

  it("punishes that favourite hard for losing", () => {
    expect(ratingDelta(1600, 1000, 50, 0)).toBeLessThan(-17);
  });

  it("never returns zero for a decided duel, however lopsided", () => {
    // A 900-point gap rounds the raw delta below half a point; the ladder must
    // still move, or a win that reads as +0 looks like a broken feature.
    expect(ratingDelta(2000, 1100, 50, 1)).toBe(1);
    expect(ratingDelta(1100, 2000, 50, 0)).toBe(-1);
  });

  it("leaves an even draw exactly where it was", () => {
    expect(ratingDelta(1000, 1000, 50, 0.5)).toBe(0);
  });

  it("moves a provisional player twice as far as an established one", () => {
    expect(ratingDelta(1000, 1000, 0, 1)).toBe(2 * ratingDelta(1000, 1000, 50, 1));
  });
});

describe("resolveDuel", () => {
  it("names the winner and moves both ratings", () => {
    const r = resolveDuel(
      { rating: START_RATING, played: 0, result: { score: 9, totalMs: 70_000 } },
      { rating: START_RATING, played: 0, result: { score: 5, totalMs: 70_000 } }
    );
    expect(r.winner).toBe("A");
    expect(r.deltaA).toBe(20);
    expect(r.deltaB).toBe(-20);
    expect(r.ratingA).toBe(1020);
    expect(r.ratingB).toBe(980);
  });

  it("reports a draw as no winner", () => {
    const r = resolveDuel(
      { rating: 1200, played: 30, result: { score: 6, totalMs: 55_000 } },
      { rating: 1200, played: 30, result: { score: 6, totalMs: 55_000 } }
    );
    expect(r.winner).toBeNull();
    expect(r.deltaA).toBe(0);
    expect(r.deltaB).toBe(0);
  });

  it("hands the draw to the lower-rated player when ratings differ", () => {
    const r = resolveDuel(
      { rating: 1400, played: 30, result: { score: 6, totalMs: 55_000 } },
      { rating: 1000, played: 30, result: { score: 6, totalMs: 55_000 } }
    );
    expect(r.winner).toBeNull();
    expect(r.deltaA).toBeLessThan(0);
    expect(r.deltaB).toBeGreaterThan(0);
  });

  it("reads both ratings before either moves", () => {
    // If A were written first, B would be scored against A's new rating.
    const a = { rating: 1500, played: 30, result: { score: 8, totalMs: 60_000 } };
    const b = { rating: 1100, played: 30, result: { score: 4, totalMs: 60_000 } };
    const r = resolveDuel(a, b);
    expect(r.deltaA).toBe(-r.deltaB);
  });

  it("keeps a provisional newcomer's swing bigger than the veteran's", () => {
    const r = resolveDuel(
      { rating: 1000, played: 0, result: { score: 9, totalMs: 60_000 } },
      { rating: 1000, played: 200, result: { score: 3, totalMs: 60_000 } }
    );
    expect(Math.abs(r.deltaA)).toBeGreaterThan(Math.abs(r.deltaB));
  });
});
