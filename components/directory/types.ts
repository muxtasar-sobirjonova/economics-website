/**
 * One directory, twice.
 *
 * Internships and Research are the same page: a few thousand rows of reference
 * data, a search, two kinds of filter, and a panel that opens with the contact
 * details. They were two components that had drifted apart; this is the shape
 * both of them hand over, so the next directory is a mapping function rather
 * than a third copy.
 */

export interface DirField {
  label: string;
  value: string | null;
  /** Show a copy button. For an address or a phone number somebody will paste. */
  copy?: boolean;
}

export interface DirRow {
  id: number;
  title: string;
  /** The line under the title: an address, or a role and a university. */
  subtitle: string;
  /** What goes in the tile — a letter, or initials. */
  initial: string;
  /** The facet the chips filter on: a sector, or a university. */
  group: string;
  /** The facet the dropdown filters on: a region, or a city. */
  place: string;
  /** A short state, shown on the row and in the panel. */
  badge?: { label: string; tone: "strong" | "soft" | "none" };
  /** Named booleans the toggles filter on. */
  flags: Record<string, boolean>;
  fields: DirField[];
  /** What the panel says this row's contact situation means. */
  note?: { title: string; body: string } | null;
  mailto?: string | null;
  sourceUrl?: string | null;
  /** Lower sorts first under "Best first". */
  rank: number;
}

export interface DirFacet {
  name: string;
  count: number;
}

export interface DirConfig {
  title: string;
  sub: string;
  stats: { label: string; value: number; icon: string }[];
  rows: DirRow[];
  groups: DirFacet[];
  places: DirFacet[];
  /** "Sector", "University" — what the chips are. */
  groupNoun: string;
  /** "region", "city" — what the dropdown is. */
  placeNoun: string;
  /** Spelled out rather than derived: the plural of "city" is not "citys". */
  placePlural: string;
  toggles: { key: string; label: string; icon: string }[];
  /** Extra single-select chip rows, like the research tiers. */
  bands?: { label: string; key: string; options: DirFacet[] };
  sortByPlace: string;
}
