import type { GradingMode, AnswerKind } from "./problem";

/**
 * Practice: the bank, on your own, whenever you like.
 *
 * Not a competition and not a duel. No room, no clock, no standing, nothing to
 * compare against — you take a problem, you answer it, you are told how you
 * did and you read the worked solution.
 *
 * That last part is the whole design problem. Practice hands back the answer,
 * so a problem practised is a problem some of a later room already knows. Two
 * things keep that honest, and both are here rather than in a screen:
 *
 *   1. A host can withhold a problem from practice before setting it
 *      (`practiceOpen`), which prevents the leak.
 *   2. Every problem carries a count of how many people have practised it,
 *      which lets a host see the leak they did not prevent.
 *
 * Kept pure so all of it is tested without a database, which this machine
 * cannot reach anyway.
 */

/**
 * AI marking a person can spend in a day.
 *
 * A room has a host who chose to spend the money. Practice has nobody: one
 * student with an afternoon free could run a hundred model calls, and a class
 * of them could run ten thousand. The cap is per person per day and it is not
 * a punishment — it is the difference between a feature with a bill and a
 * feature with an unbounded one. Key-marked problems are free and are not
 * counted against it.
 */
export const DAILY_AI_LIMIT = 15;

/** Long enough for a proper problem, short enough not to be an essay dump. */
export const MAX_PRACTICE_ANSWER = 4000;

export interface PracticeCandidate {
  id: string;
  topic: string;
  answerKind: AnswerKind;
  gradingMode: GradingMode;
  hasKey: boolean;
  hasSolution: boolean;
  practiceOpen: boolean;
}

/**
 * Who marks a practice answer.
 *
 * Deliberately *not* the problem's own grading mode. A room's `HOST` mode
 * means a person reads it afterwards; in practice there is no afterwards and
 * no person, so a problem that would wait for a host is marked by the model
 * against the same worked solution the host would have read.
 *
 * `null` means nothing here could mark it — no key and no solution. Those are
 * never offered, because a practice problem that hands back neither a mark nor
 * a solution is a blank page with extra steps.
 */
export function practiceMode(p: {
  answerKind: AnswerKind;
  hasKey: boolean;
  hasSolution: boolean;
}): "AUTO" | "AI" | null {
  if (p.answerKind !== "OPEN" && p.hasKey) return "AUTO";
  if (p.hasSolution) return "AI";
  return null;
}

/** Can this problem be practised at all. */
export function practisable(p: PracticeCandidate): boolean {
  return p.practiceOpen && practiceMode(p) !== null;
}

export interface PickOptions {
  /** Problems already attempted by this person. One go each. */
  seen: ReadonlySet<string>;
  /** Narrow to one topic, or every topic. */
  topic?: string | null;
  /** How much AI marking they have left today. */
  aiLeft: number;
  /** Injected, so a test can pick deterministically. */
  rand?: () => number;
}

export type PickResult =
  | { problem: PracticeCandidate }
  | { empty: "topic-done" | "all-done" | "ai-spent" };

/**
 * The next problem to serve.
 *
 * Random among what is left rather than in order. Two students working through
 * the bank in the same order would arrive at the same problem at the same
 * time, which is how a practice set becomes a study guide for the room the
 * host is about to open.
 */
export function pickProblem(pool: PracticeCandidate[], opts: PickOptions): PickResult {
  const { seen, topic = null, aiLeft, rand = Math.random } = opts;

  const usable = pool.filter(practisable);
  const unseen = usable.filter((p) => !seen.has(p.id));

  // With the daily allowance gone, only the free ones are still on offer.
  const affordable = aiLeft > 0 ? unseen : unseen.filter((p) => practiceMode(p) === "AUTO");

  const inTopic = topic ? affordable.filter((p) => p.topic === topic) : affordable;

  if (inTopic.length > 0) {
    // Clamped both ends. A caller handing back 1, or a NaN out of a broken
    // source of randomness, must land on a problem rather than on undefined.
    const r = rand();
    const raw = Number.isFinite(r) ? Math.floor(Math.max(0, r) * inTopic.length) : 0;
    return { problem: inTopic[Math.min(Math.max(0, raw), inTopic.length - 1)] };
  }

  // Nothing came back. Say which of the three reasons it was, because "come
  // back tomorrow", "pick another topic" and "you have finished the bank" are
  // three different things to be told.
  if (aiLeft <= 0 && (topic ? unseen.filter((p) => p.topic === topic) : unseen).length > 0) {
    return { empty: "ai-spent" };
  }
  return { empty: topic ? "topic-done" : "all-done" };
}

export interface TopicCount {
  topic: string;
  total: number;
  done: number;
}

/** The topic list, with how far through each one this person is. */
export function topicCounts(
  pool: PracticeCandidate[],
  seen: ReadonlySet<string>
): TopicCount[] {
  const by = new Map<string, TopicCount>();

  for (const p of pool) {
    if (!practisable(p)) continue;
    const row = by.get(p.topic) ?? { topic: p.topic, total: 0, done: 0 };
    row.total += 1;
    if (seen.has(p.id)) row.done += 1;
    by.set(p.topic, row);
  }

  return [...by.values()].sort((a, b) => a.topic.localeCompare(b.topic));
}

/** How much AI marking is left today. Never negative, never a surprise. */
export function aiLeftToday(usedToday: number, limit = DAILY_AI_LIMIT): number {
  const used = Number.isFinite(usedToday) ? Math.max(0, Math.floor(usedToday)) : limit;
  return Math.max(0, limit - used);
}

/** Midnight this morning, by the server's clock. The window the cap counts in. */
export function startOfDay(now: Date): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d;
}

export interface PracticeTotals {
  attempted: number;
  points: number;
  outOf: number;
  /** Full marks, out of the ones something could mark. */
  fullMarks: number;
}

export function totalsOf(
  attempts: { points: number; maxPoints: number }[]
): PracticeTotals {
  let points = 0;
  let outOf = 0;
  let fullMarks = 0;

  for (const a of attempts) {
    points += a.points;
    outOf += a.maxPoints;
    if (a.maxPoints > 0 && a.points >= a.maxPoints) fullMarks += 1;
  }

  return { attempted: attempts.length, points, outOf, fullMarks };
}
