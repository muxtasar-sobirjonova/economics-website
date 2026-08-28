/**
 * Join codes.
 *
 * Read aloud in a classroom and typed on a phone, so no two characters in the
 * alphabet may be mistaken for each other. Only one member of each confusable
 * pair survives — dropping both would be wasteful, keeping both would produce
 * codes people mistype.
 */
export const CONFUSABLE_PAIRS: [string, string][] = [
  ["O", "0"],
  ["I", "1"],
  ["I", "L"],
  ["1", "L"],
  ["S", "5"],
  ["B", "8"],
  ["Z", "2"],
  ["G", "6"],
  ["Q", "O"],
];

export const CODE_ALPHABET = "ACDEFHJKMNPQRTUVWXY2346789";
export const CODE_LENGTH = 6;

export function generateCode(random: () => number = Math.random): string {
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    out += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)];
  }
  return out;
}

/**
 * What someone typed, turned into what we stored — or null.
 *
 * Lower case, spaces and dashes are all forgiven. A character outside the
 * alphabet is not: silently mapping it would send a player to a competition
 * they did not mean to join.
 */
export function normaliseCode(input: string): string | null {
  const cleaned = (input ?? "").toUpperCase().replace(/[\s-]/g, "");
  if (cleaned.length !== CODE_LENGTH) return null;
  for (const ch of cleaned) {
    if (!CODE_ALPHABET.includes(ch)) return null;
  }
  return cleaned;
}
