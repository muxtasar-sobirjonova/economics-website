import organisationsRaw from "./organisations.json";
import featuredRaw from "./featured.json";

/**
 * Imported only from server components — the JSON below never reaches the
 * client bundle.
 *
 * The internship board reads from a compiled snapshot of the research
 * workbook rather than the database: the records are read-only reference data,
 * they change a few times a year, and keeping them out of Postgres means the
 * page needs no migration and no query on every request.
 */

export interface Organisation {
  id: number;
  region: string;
  name: string;
  category: string;
  city: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  sourceUrl: string | null;
}

export type Tier = "Top Tier" | "Tier Two" | "Tier Three" | "Resources & Programs";

export interface FeaturedCompany {
  tier: Tier;
  name: string;
  sector: string;
  region: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  notes: string | null;
  source: string | null;
}

export const organisations = organisationsRaw as Organisation[];
export const featured = featuredRaw as FeaturedCompany[];

/**
 * Short symbol for a region, in the market language of the board.
 * "Tashkent city" and "Tashkent region" must not both come out as TAS, so a
 * city keeps a trailing C.
 */
export function regionSymbol(region: string): string {
  const isCity = /\s+city$/i.test(region);
  const cleaned = region.replace(/\s+(region|city)$/i, "");
  const parts = cleaned.split(/[\s-]+/).filter(Boolean);
  const base = parts.length > 1
    ? parts.map((p) => p[0]).join("")
    : cleaned.slice(0, 3);
  return (base + (isCity ? "C" : "")).toUpperCase().slice(0, 4);
}

export interface RegionStat {
  region: string;
  symbol: string;
  total: number;
  withContact: number;
  topCategory: string;
  categories: { name: string; count: number }[];
}

function tally<T>(items: T[], key: (t: T) => string) {
  const counts: Record<string, number> = {};
  items.forEach((it) => {
    const k = key(it);
    counts[k] = (counts[k] ?? 0) + 1;
  });
  return Object.keys(counts)
    .map((name) => ({ name, count: counts[name] }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getRegionStats(): RegionStat[] {
  const byRegion: Record<string, Organisation[]> = {};
  organisations.forEach((o) => {
    (byRegion[o.region] ||= []).push(o);
  });

  return Object.keys(byRegion)
    .map((region) => {
      const list = byRegion[region];
      const categories = tally(list, (o: Organisation) => o.category);
      return {
        region,
        symbol: regionSymbol(region),
        total: list.length,
        withContact: list.filter((o: Organisation) => o.email || o.phone).length,
        topCategory: categories[0]?.name ?? "Other",
        categories,
      };
    })
    .sort((a, b) => b.total - a.total || a.region.localeCompare(b.region));
}

export function getCategoryStats() {
  return tally(organisations, (o) => o.category);
}

export function getBoardSummary() {
  const stats = getRegionStats();
  return {
    totalOrgs: organisations.length,
    regions: stats.length,
    featured: featured.length,
    withContact: organisations.filter((o) => o.email || o.phone).length,
    categories: getCategoryStats().length,
  };
}

export interface OrgQuery {
  region?: string;
  category?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

/** Server-side filtering, paging and search over the snapshot. */
export function queryOrganisations({
  region,
  category,
  search,
  page = 1,
  perPage = 24,
}: OrgQuery) {
  const needle = search?.trim().toLowerCase();

  const filtered = organisations.filter((o) => {
    if (region && o.region !== region) return false;
    if (category && o.category !== category) return false;
    if (needle) {
      const hay = `${o.name} ${o.city ?? ""} ${o.address ?? ""} ${o.category}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);

  return {
    total: filtered.length,
    page: current,
    totalPages,
    results: filtered.slice((current - 1) * perPage, current * perPage),
  };
}

const TIER_ORDER: Tier[] = ["Top Tier", "Tier Two", "Tier Three", "Resources & Programs"];

export function getFeaturedByTier() {
  return TIER_ORDER
    .map((tier) => ({ tier, companies: featured.filter((f) => f.tier === tier) }))
    .filter((g) => g.companies.length > 0);
}
