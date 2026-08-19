import React from "react";
import Link from "next/link";
import {
  getRegisterSummary,
  getUniversityStats,
  getTierStats,
  getUniversityTierStats,
  getReachCounts,
  getCityStats,
  queryProfessors,
  tierLabel,
  tierRank,
  universityShort,
  reachOf,
  REACH_COPY,
  initialsOf,
} from "@/lib/research";
import { RegisterFilters } from "@/components/research/RegisterFilters";
import { FacultyLadder } from "@/components/research/FacultyLadder";
import { StatStrip } from "@/components/common/StatStrip";

/** Tier 1 reads as the most established, so it takes the warmest tone. */
/** Tiers are ordinal, so they share one hue in three steps — see globals.css. */
function toneOf(tier: string) {
  return `tier-${Math.min(3, tierRank(tier))}`;
}

export interface RegisterParams {
  tier?: string;
  university?: string;
  city?: string;
  reach?: string;
  q?: string;
  page?: string;
}

export function ResearchRegister({ searchParams }: { searchParams?: RegisterParams }) {
  const summary = getRegisterSummary();
  const universities = [...getUniversityStats()].sort((a, b) => b.total - a.total);
  const tiers = getTierStats();
  const uniByTier = getUniversityTierStats();
  const reachCounts = getReachCounts();
  const cities = getCityStats();

  const tier = searchParams?.tier;
  const university = searchParams?.university;
  const city = searchParams?.city;
  const reach = searchParams?.reach;
  const q = searchParams?.q;
  const page = parseInt(searchParams?.page ?? "1", 10) || 1;

  const register = queryProfessors({ tier, university, city, reach, search: q, page, perPage: 24 });

  const filtered = Boolean(tier || university || city || reach || q);
  const heading = university ? universityShort(university) : tier ? tierLabel(tier) : city || "All faculty";

  const withParams = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { tier, university, city, reach, q, ...patch };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    const s = p.toString();
    return s ? `/research?${s}` : "/research";
  };

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[1180px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s6">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header>
          <div className="flex items-center gap-s2 mb-s3">
            <span
              aria-hidden
              className="w-[7px] h-[7px] rounded-full animate-ringpulse"
              style={{ background: "var(--article)" }}
            />
            <span className="font-mono text-label uppercase" style={{ color: "var(--article)" }}>
              Register open · university faculty, Uzbekistan
            </span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-s5">
            <div className="min-w-0">
              <h1 className="text-h1 md:text-display font-semibold text-ink text-balance max-w-[17ch]">
                Find who is already doing the research.
              </h1>
              <p className="text-ui text-muted mt-s4 max-w-[52ch]">
                Faculty across Uzbekistan&apos;s universities, with the contact
                each one actually publishes — so a research question reaches a
                person, not a form.
              </p>
            </div>

            <StatStrip
              tiles={[
                {
                  label: "Professors",
                  value: String(summary.total),
                  caption: `${tiers[0]?.count ?? 0} at tier 1`,
                  segments: tiers.map((t) => ({
                    label: tierLabel(t.name),
                    value: t.count,
                    tone: toneOf(t.name),
                    href: withParams({ tier: t.name, university: undefined }),
                  })),
                },
                {
                  label: "Universities",
                  value: String(summary.universities),
                  caption: `${uniByTier[uniByTier.length - 1]?.count ?? 0} regional, holding ${tiers[tiers.length - 1]?.count ?? 0}`,
                  segments: uniByTier.map((u) => ({
                    label: `${tierLabel(u.tier)} institutions`,
                    value: u.count,
                    tone: toneOf(u.tier),
                    href: withParams({ tier: u.tier, university: undefined }),
                  })),
                },
                {
                  label: "Cities",
                  value: String(summary.cities),
                  caption: `${Math.round(((cities[0]?.count ?? 0) / summary.total) * 100)}% in ${cities[0]?.name}`,
                  segments: cities.map((c) => ({
                    label: c.name,
                    value: c.count,
                    href: withParams({ city: c.name, university: undefined }),
                  })),
                },
                {
                  label: "Direct contact",
                  value: String(summary.direct),
                  caption: `${Math.round((summary.direct / summary.total) * 100)}% publish their own`,
                  segments: (["personal", "office", "none"] as const).map((r) => ({
                    label: REACH_COPY[r].label,
                    value: reachCounts[r],
                    tone: REACH_COPY[r].tone,
                    href: withParams({ reach: r, university: undefined }),
                  })),
                },
              ]}
            />
          </div>
        </header>

        {/* ── Universities ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-baseline gap-s4 mb-s2">
            <h2 className="text-h2 font-semibold text-ink whitespace-nowrap">Where the depth is</h2>
            <span className="h-px bg-line flex-1" />
          </div>
          <p className="text-meta text-muted mb-s4">
            All {summary.universities} universities, largest first. Pick one to open its faculty.
          </p>

          <FacultyLadder
            rows={universities.map((u) => ({
              university: u.university,
              short: u.short,
              city: u.city,
              tier: tierRank(u.tier),
              total: u.total,
              direct: u.direct,
              topDepartment: u.topDepartment,
              href: withParams({
                university: university === u.university ? undefined : u.university,
                page: undefined,
              }),
            }))}
            selected={university}
          />
        </section>

        {/* ── Listings ─────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-baseline gap-s4 mb-s4">
            <h2 className="text-h2 font-semibold text-ink min-w-0 break-words">{heading}</h2>
            <span className="h-px bg-line flex-1" />
            <span className="font-mono text-meta text-muted tabular whitespace-nowrap">
              {register.total.toLocaleString()} found
            </span>
          </div>

          <RegisterFilters
            tiers={tiers.map((t) => ({ value: t.name, label: tierLabel(t.name), count: t.count }))}
            cities={cities.map((c) => ({ value: c.name, label: c.name, count: c.count }))}
            reaches={(["personal", "office", "none"] as const).map((r) => ({
              value: r,
              label: REACH_COPY[r].label,
              count: reachCounts[r],
              tone: REACH_COPY[r].tone,
            }))}
          />

          <p className="text-meta text-muted mt-s3">
            {REACH_COPY.personal.label} means the professor published the address
            themselves. Say what you study and what you want to work on in the
            first two lines.
          </p>

          {filtered && (
            <div className="mt-s3">
              <Link href="/research" className="inline-flex items-center min-h-[44px] text-meta text-accent hover:text-accent-strong">
                Clear filters
              </Link>
            </div>
          )}

          {register.results.length === 0 ? (
            <div className="mt-s5 rounded-lg border border-line bg-surface p-s7 text-center">
              <h3 className="text-h3 font-semibold text-ink">Nothing matches that</h3>
              <p className="text-meta text-muted mt-s2">
                Try a different university, city or search term.
              </p>
            </div>
          ) : (
            <ul className="mt-s5 grid md:grid-cols-2 gap-s3 list-none p-0 m-0">
              {register.results.map((p) => {
                const copy = REACH_COPY[reachOf(p.contactType)];
                return (
                  <li key={p.id} className="rounded-lg border border-line bg-surface shadow-sh1 p-s4 flex flex-col">
                    <div className="flex items-start gap-s3">
                      <span
                        aria-hidden
                        className="w-10 h-10 rounded-full grid place-items-center shrink-0 font-semibold text-meta bg-bg-sunk text-muted"
                      >
                        {initialsOf(p.name)}
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-ui font-semibold text-ink break-words">{p.name}</h3>
                        {p.title && <p className="text-meta text-muted mt-1">{p.title}</p>}
                      </div>

                      <span
                        className="text-label uppercase px-s2 py-1 rounded-sm shrink-0"
                        style={{ background: `var(--${copy.tone}-soft)`, color: `var(--${copy.tone})` }}
                      >
                        {copy.label}
                      </span>
                    </div>

                    <p className="text-meta text-muted mt-s3">
                      {universityShort(p.university)}
                      {p.city ? ` · ${p.city}` : ""}
                    </p>
                    {p.department && (
                      <p className="text-meta text-faint mt-1 break-words">{p.department}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-s3 mt-s3 pt-s3 border-t border-line">
                      {p.email && (
                        <a
                          href={`mailto:${p.email}?subject=${encodeURIComponent("Student research inquiry")}`}
                          className="inline-flex items-center min-h-[44px] font-mono text-meta text-accent hover:text-accent-strong break-all"
                        >
                          {p.email}
                        </a>
                      )}
                      {p.phone && (
                        <a
                          href={`tel:${p.phone.replace(/\s+/g, "")}`}
                          className="inline-flex items-center min-h-[44px] font-mono text-meta text-muted hover:text-ink"
                        >
                          {p.phone}
                        </a>
                      )}
                      {!p.email && !p.phone && (
                        <span className="inline-flex items-center min-h-[44px] text-meta text-faint">
                          No public channel
                        </span>
                      )}
                      {p.sourceUrl && (
                        <a
                          href={p.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center min-h-[44px] text-meta text-faint hover:text-ink ml-auto"
                        >
                          Source ↗
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {register.totalPages > 1 && (
            <nav className="flex items-center justify-between gap-s3 mt-s5" aria-label="Pagination">
              <Link
                href={withParams({ page: String(Math.max(1, register.page - 1)) })}
                aria-disabled={register.page <= 1}
                className={`px-s4 py-s2 rounded-md border border-line text-meta min-h-[44px] flex items-center ${
                  register.page <= 1 ? "opacity-40 pointer-events-none" : "text-muted hover:text-ink"
                }`}
              >
                Previous
              </Link>
              <span className="font-mono text-meta text-faint tabular">
                Page {register.page} of {register.totalPages}
              </span>
              <Link
                href={withParams({ page: String(Math.min(register.totalPages, register.page + 1)) })}
                aria-disabled={register.page >= register.totalPages}
                className={`px-s4 py-s2 rounded-md border border-line text-meta min-h-[44px] flex items-center ${
                  register.page >= register.totalPages ? "opacity-40 pointer-events-none" : "text-muted hover:text-ink"
                }`}
              >
                Next
              </Link>
            </nav>
          )}

          <p className="text-meta text-faint mt-s5">
            Contacts were sourced from each university&apos;s own site in August
            2026. If a line has moved, the Source link is the page it came from.
          </p>
        </section>
      </div>
    </div>
  );
}
