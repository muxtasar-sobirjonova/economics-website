/**
 * Choosing the question of the day.
 *
 * Deterministic from the date, so everyone gets the same one and nobody needs
 * a scheduled job to pick it. Pure, so the choice can be tested.
 */

/** YYYY-MM-DD in a fixed zone. The site's players are all in one. */
export const DAY_ZONE = "Asia/Tashkent";

export function dayKey(now: Date = new Date(), zone: string = DAY_ZONE): string {
  // en-CA formats as YYYY-MM-DD, which sorts and compares as a plain string.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** A small stable hash. Not for security — only to spread days over the bank. */
export function hashDay(day: string): number {
  let h = 2166136261;
  for (let i = 0; i < day.length; i++) {
    h ^= day.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * The same day always picks the same question, and consecutive days walk the
 * bank rather than landing near each other.
 *
 * Ids are sorted first: the caller's query order is not stable, and a question
 * of the day that changes when the database feels like reordering rows would
 * be a strange thing to explain.
 */
export function pickDailyQuestionId(activeIds: string[], day: string): string | null {
  if (activeIds.length === 0) return null;
  const sorted = [...activeIds].sort();
  return sorted[hashDay(day) % sorted.length];
}
