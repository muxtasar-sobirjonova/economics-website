/**
 * Pure naming helpers. Kept apart from the data layer because client
 * components import them, and `lib/research/index.ts` pulls in 208 faculty
 * records that must never reach the browser bundle.
 */

/** "Tier 1 - International & Prestigious" → "International & Prestigious". */
export function tierLabel(tier: string): string {
  return tier.replace(/^Tier\s*\d+\s*[-–—]\s*/i, "").trim() || tier;
}

/** "Tier 1 - …" → 1. Sorting and colour both key on the number, not the words. */
export function tierRank(tier: string): number {
  const m = tier.match(/Tier\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : 99;
}

/**
 * Uzbek universities are formally named after a person. The honorific is
 * accurate but it triples the length of every card heading, so it comes off
 * the display name and stays in the record.
 */
export function universityShort(name: string): string {
  return name.replace(/\s+named after\s+.*$/i, "").trim() || name;
}

/**
 * How likely a message is to reach the person, not an inbox. The workbook
 * separates a professor's own published address from a shared faculty line —
 * a real difference in what a student should expect back.
 */
export type Reach = "personal" | "office" | "none";

export function reachOf(contactType: string): Reach {
  const t = contactType.toLowerCase();
  if (t.startsWith("personal")) return "personal";
  if (t.includes("none")) return "none";
  return "office";
}

export const REACH_COPY: Record<Reach, { label: string; tone: string; hint: string }> = {
  personal: {
    label: "Direct",
    tone: "success",
    hint: "Published by the professor — write to them directly.",
  },
  office: {
    label: "Via office",
    tone: "reward",
    hint: "Shared faculty line — address your message to the professor by name.",
  },
  none: {
    label: "No channel",
    tone: "danger",
    hint: "No public contact found; try the university's main office.",
  },
};

/** Initials for the avatar disc, from a Cyrillic-or-Latin full name. */
export function initialsOf(name: string): string {
  const parts = name.replace(/^(Dr|Prof|PhD)\.?\s+/i, "").split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "?").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
}
