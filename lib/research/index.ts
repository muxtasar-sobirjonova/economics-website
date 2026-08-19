import professorsRaw from "./professors.json";
import { tierRank, reachOf, universityShort } from "./labels";

/**
 * Imported only from server components — the JSON below never reaches the
 * client bundle.
 *
 * Like the internship board, the faculty register is a compiled snapshot of
 * the research workbook rather than database rows: read-only reference data
 * that changes a few times a year, so the page needs no migration and no
 * query per request. Regenerate with scripts/compile-directory-data.py.
 */

export interface Professor {
  id: number;
  tier: string;
  university: string;
  name: string;
  title: string | null;
  department: string | null;
  city: string | null;
  email: string | null;
  phone: string | null;
  contactType: string;
  sourceUrl: string | null;
}

export const professors = professorsRaw as Professor[];

export { tierLabel, tierRank, universityShort, reachOf, REACH_COPY, initialsOf } from "./labels";

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

export interface UniversityStat {
  university: string;
  short: string;
  tier: string;
  city: string;
  total: number;
  direct: number;
  topDepartment: string;
}

export function getUniversityStats(): UniversityStat[] {
  const byName: Record<string, Professor[]> = {};
  professors.forEach((p) => {
    (byName[p.university] ||= []).push(p);
  });

  return Object.keys(byName)
    .map((university) => {
      const list = byName[university];
      const departments = tally(
        list.filter((p) => p.department),
        (p) => p.department as string
      );
      return {
        university,
        short: universityShort(university),
        tier: list[0].tier,
        city: list[0].city ?? "—",
        total: list.length,
        direct: list.filter((p) => reachOf(p.contactType) === "personal").length,
        topDepartment: departments[0]?.name ?? "Various",
      };
    })
    .sort(
      (a, b) =>
        tierRank(a.tier) - tierRank(b.tier) ||
        b.total - a.total ||
        a.short.localeCompare(b.short)
    );
}

export function getTierStats() {
  return tally(professors, (p) => p.tier).sort((a, b) => tierRank(a.name) - tierRank(b.name));
}

export function getCityStats() {
  return tally(
    professors.filter((p) => p.city),
    (p) => p.city as string
  );
}

export function getRegisterSummary() {
  return {
    total: professors.length,
    universities: getUniversityStats().length,
    cities: getCityStats().length,
    direct: professors.filter((p) => reachOf(p.contactType) === "personal").length,
    reachable: professors.filter((p) => p.email || p.phone).length,
  };
}

export interface ProfessorQuery {
  tier?: string;
  university?: string;
  city?: string;
  /** "direct" narrows to professors who publish their own address. */
  reach?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

/** Server-side filtering, paging and search over the snapshot. */
export function queryProfessors({
  tier,
  university,
  city,
  reach,
  search,
  page = 1,
  perPage = 24,
}: ProfessorQuery) {
  const needle = search?.trim().toLowerCase();

  const filtered = professors.filter((p) => {
    if (tier && p.tier !== tier) return false;
    if (university && p.university !== university) return false;
    if (city && p.city !== city) return false;
    if (reach === "direct" && reachOf(p.contactType) !== "personal") return false;
    if (needle) {
      const hay = `${p.name} ${p.title ?? ""} ${p.department ?? ""} ${p.university} ${p.city ?? ""}`.toLowerCase();
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
