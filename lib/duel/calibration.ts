/**
 * Reading a question's health from how people answer it.
 *
 * A hand-written bank always contains a few questions whose key is simply
 * wrong. They are invisible from the outside — the question looks fine — but
 * every player loses a point they earned, and on a rated ladder that is not a
 * typo, it is a corrupted result. The signature is unmistakable once there is
 * data: almost nobody gets it right. Genuinely hard questions still land well
 * above chance because some players know the answer.
 *
 * Pure, so the thresholds can be tested without a database.
 */

/** Below this many servings there is nothing to conclude. */
export const MIN_SERVINGS = 8;

/** Four options, so blind guessing scores 25%. */
export const CHANCE_RATE = 0.25;

/** Well under chance: the key is more likely wrong than the question hard. */
export const SUSPECT_RATE = 0.15;

/** Almost everyone gets it: real, but it separates nobody. */
export const TRIVIAL_RATE = 0.95;

export type Health = "new" | "suspect" | "hard" | "fine" | "trivial";

export interface QuestionStat {
  id: string;
  topic: string;
  questionText: string;
  timesServed: number;
  timesCorrect: number;
  active: boolean;
}

export interface Assessed extends QuestionStat {
  rate: number | null;
  health: Health;
}

export function correctRate(served: number, correct: number): number | null {
  if (served <= 0) return null;
  return correct / served;
}

export function assess(q: QuestionStat): Assessed {
  const rate = correctRate(q.timesServed, q.timesCorrect);

  if (q.timesServed < MIN_SERVINGS || rate === null) {
    return { ...q, rate, health: "new" };
  }
  if (rate <= SUSPECT_RATE) return { ...q, rate, health: "suspect" };
  if (rate >= TRIVIAL_RATE) return { ...q, rate, health: "trivial" };
  if (rate < CHANCE_RATE + 0.1) return { ...q, rate, health: "hard" };
  return { ...q, rate, health: "fine" };
}

export const HEALTH_COPY: Record<Health, { label: string; tone: string; note: string }> = {
  suspect: {
    label: "Check the key",
    tone: "danger",
    note: "Almost nobody gets this. A wrong answer key looks exactly like this.",
  },
  hard: {
    label: "Hard",
    tone: "reward",
    note: "Barely above guessing, but enough people get it that the key looks right.",
  },
  fine: { label: "Fine", tone: "success", note: "Separates players as a question should." },
  trivial: {
    label: "Too easy",
    tone: "muted",
    note: "Nearly everyone gets it, so it decides nothing.",
  },
  new: { label: "Not yet judged", tone: "faint", note: "Needs more plays before it means anything." },
};

/** Worst first: the ones worth a human's attention today. */
const ORDER: Health[] = ["suspect", "trivial", "hard", "fine", "new"];

export function sortByAttention(rows: Assessed[]): Assessed[] {
  return [...rows].sort(
    (a, b) =>
      ORDER.indexOf(a.health) - ORDER.indexOf(b.health) ||
      (a.rate ?? 1) - (b.rate ?? 1) ||
      b.timesServed - a.timesServed
  );
}

export interface BankSummary {
  total: number;
  active: number;
  judged: number;
  suspect: number;
  trivial: number;
  /** Across judged questions only — the bank's overall difficulty. */
  meanRate: number | null;
}

export function summarise(rows: Assessed[]): BankSummary {
  const judged = rows.filter((r) => r.health !== "new");
  const rates = judged.map((r) => r.rate ?? 0);
  return {
    total: rows.length,
    active: rows.filter((r) => r.active).length,
    judged: judged.length,
    suspect: rows.filter((r) => r.health === "suspect").length,
    trivial: rows.filter((r) => r.health === "trivial").length,
    meanRate: rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : null,
  };
}
