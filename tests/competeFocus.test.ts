import { describe, it, expect } from "vitest";
import {
  judge, parseAwayLog, appendAway, noticeFor,
  STRIKE_AFTER_MS, MAX_LOG, MAX_AWAY_MS,
  type AwayEvent,
} from "@/lib/compete/focus";

const away = (ms: number, at = Date.now()): AwayEvent => ({ at, ms });

/** A notification, a call, a screen lock — all of these look like leaving. */
const blip = () => away(2_000);
const trip = () => away(45_000);

describe("judge — what counts as a strike", () => {
  it("does not punish a brief absence", () => {
    const v = judge([blip(), blip(), blip()], "LOCK", 1);
    expect(v.strikes).toBe(0);
    expect(v.locked).toBe(false);
  });

  it("still records a brief absence, so the host can see the pattern", () => {
    // Fourteen two-second absences is not innocent, and the host reads this.
    const v = judge(Array.from({ length: 14 }, blip), "LOCK", 1);
    expect(v.total).toBe(14);
    expect(v.awayMs).toBe(28_000);
    expect(v.strikes).toBe(0);
  });

  it("counts an absence at the threshold", () => {
    expect(judge([away(STRIKE_AFTER_MS)], "LOCK", 5).strikes).toBe(1);
    expect(judge([away(STRIKE_AFTER_MS - 1)], "LOCK", 5).strikes).toBe(0);
  });
});

describe("judge — locking", () => {
  it("locks only after the allowance is used up", () => {
    expect(judge([trip()], "LOCK", 1).locked).toBe(false);
    expect(judge([trip(), trip()], "LOCK", 1).locked).toBe(true);
  });

  it("locks on the first strike when nothing is allowed", () => {
    expect(judge([trip()], "LOCK", 0).locked).toBe(true);
  });

  it("counts down what is left", () => {
    expect(judge([], "LOCK", 2).remaining).toBe(2);
    expect(judge([trip()], "LOCK", 2).remaining).toBe(1);
    expect(judge([trip(), trip()], "LOCK", 2).remaining).toBe(0);
    expect(judge([trip(), trip(), trip()], "LOCK", 2).remaining).toBe(0);
  });

  it("never locks under the other policies, however far they wandered", () => {
    const many = Array.from({ length: 20 }, trip);
    expect(judge(many, "WARN", 0).locked).toBe(false);
    expect(judge(many, "NONE", 0).locked).toBe(false);
    expect(judge(many, "WARN", 0).strikes).toBe(20);
  });

  it("treats a nonsense allowance as none rather than as infinite", () => {
    expect(judge([trip()], "LOCK", -5).locked).toBe(true);
    expect(judge([trip()], "LOCK", NaN).locked).toBe(true);
  });
});

describe("parseAwayLog", () => {
  it("reads a well formed log", () => {
    expect(parseAwayLog([{ at: 1, ms: 2 }])).toEqual([{ at: 1, ms: 2 }]);
  });

  it("survives anything else a Json column could hold", () => {
    expect(parseAwayLog(null)).toEqual([]);
    expect(parseAwayLog("nonsense")).toEqual([]);
    expect(parseAwayLog([null, 3, "x", {}, { at: 1 }, { ms: 1 }])).toEqual([]);
    expect(parseAwayLog([{ at: NaN, ms: 1 }])).toEqual([]);
  });

  it("refuses an absence longer than a day at the desk", () => {
    expect(parseAwayLog([{ at: 1, ms: 9e15 }])[0].ms).toBe(MAX_AWAY_MS);
    expect(parseAwayLog([{ at: 1, ms: -5 }])[0].ms).toBe(0);
  });

  it("keeps the log bounded", () => {
    const huge = Array.from({ length: MAX_LOG + 50 }, (_, i) => ({ at: i, ms: 1 }));
    expect(parseAwayLog(huge)).toHaveLength(MAX_LOG);
  });
});

describe("appendAway", () => {
  it("adds to the end", () => {
    expect(appendAway([away(1, 10)], away(2, 20))).toEqual([
      { at: 10, ms: 1 }, { at: 20, ms: 2 },
    ]);
  });

  it("drops the oldest rather than growing without limit", () => {
    // A client reporting an absence every second must not grow the row forever.
    let log: AwayEvent[] = [];
    for (let i = 0; i < MAX_LOG + 30; i++) log = appendAway(log, away(1, i));
    expect(log).toHaveLength(MAX_LOG);
    expect(log[log.length - 1].at).toBe(MAX_LOG + 29);
  });

  it("clamps what the client claims", () => {
    expect(appendAway([], away(9e15)).at(-1)?.ms).toBe(MAX_AWAY_MS);
    expect(appendAway([], { at: 1, ms: Number.NaN }).at(-1)?.ms).toBe(0);
  });
});

describe("noticeFor", () => {
  it("says nothing when nothing is watched or nothing happened", () => {
    expect(noticeFor(judge([trip()], "NONE", 0), "NONE")).toBeNull();
    expect(noticeFor(judge([blip()], "WARN", 0), "WARN")).toBeNull();
  });

  it("tells a warned student they were seen, without accusing them", () => {
    const text = noticeFor(judge([trip()], "WARN", 0), "WARN") ?? "";
    expect(text).toContain("host can see");
    expect(text.toLowerCase()).not.toContain("cheat");
  });

  it("says how many chances are left", () => {
    expect(noticeFor(judge([trip()], "LOCK", 3), "LOCK")).toContain("2 more");
    expect(noticeFor(judge([trip(), trip(), trip()], "LOCK", 3), "LOCK")).toContain("again pauses");
  });

  it("tells a locked student their work is safe", () => {
    const text = noticeFor(judge([trip(), trip()], "LOCK", 1), "LOCK") ?? "";
    expect(text).toContain("Nothing you wrote is lost");
  });
});
