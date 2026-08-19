/**
 * Pure naming helpers, kept apart from the data layer on purpose: the client
 * map imports these, and `lib/internships/index.ts` pulls in 700 organisation
 * records that must never reach the browser bundle.
 */

/**
 * Names the initialism rule reads wrongly. Karakalpakstan would come out
 * "ROK" from "Republic of Karakalpakstan" — the two words that carry no
 * meaning win over the one that does.
 */
const SYMBOL_OVERRIDES: Record<string, string> = {
  "Republic of Karakalpakstan": "KKP",
};

/**
 * Short symbol for a region, in the market language of the board.
 * "Tashkent city" and "Tashkent region" must not both come out as TAS, so a
 * city keeps a trailing C.
 */
export function regionSymbol(region: string): string {
  const override = SYMBOL_OVERRIDES[region];
  if (override) return override;

  const isCity = /\s+city$/i.test(region);
  const cleaned = region.replace(/\s+(region|city)$/i, "");
  const parts = cleaned.split(/[\s-]+/).filter(Boolean);
  const base = parts.length > 1
    ? parts.map((p) => p[0]).join("")
    : cleaned.slice(0, 3);
  return (base + (isCity ? "C" : "")).toUpperCase().slice(0, 4);
}

/**
 * The name as a reader wants it on a card: "Andijan region" and "Republic of
 * Karakalpakstan" both carry boilerplate that says nothing once you know you
 * are looking at a list of regions. "Tashkent city" keeps its word, because
 * dropping it would make it collide with "Tashkent region".
 */
export function regionLabel(region: string): string {
  if (/\s+city$/i.test(region)) return region;
  return region.replace(/^Republic of\s+/i, "").replace(/\s+region$/i, "");
}
