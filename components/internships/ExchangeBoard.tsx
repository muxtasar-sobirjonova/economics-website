import React from "react";
import Link from "next/link";
import {
  getBoardSummary,
  getRegionStats,
  getCategoryStats,
  getFeaturedByTier,
  queryOrganisations,
} from "@/lib/internships";
import { BoardFilters } from "@/components/internships/BoardFilters";
import { RegionMap } from "@/components/internships/RegionMap";

const TIER_TONE: Record<string, string> = {
  "Top Tier": "reward",
  "Tier Two": "article",
  "Tier Three": "concept",
  "Resources & Programs": "quiz",
};

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="px-s4 py-s3 border-b border-r border-line sm:border-b-0 last:border-r-0 sm:flex-1 sm:min-w-[128px] min-w-0">
      <div className="text-label uppercase text-faint">{label}</div>
      <div className="font-mono text-h2 text-ink tabular leading-none mt-s2">{value}</div>
      {hint && <div className="text-meta text-muted mt-s2">{hint}</div>}
    </div>
  );
}

/** Opens the organisation's address in Google Maps. */
function mapsUrl(parts: (string | null)[]) {
  const q = parts.filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export interface BoardParams {
  region?: string;
  category?: string;
  q?: string;
  page?: string;
}

export function ExchangeBoard({ searchParams }: { searchParams?: BoardParams }) {
  const summary = getBoardSummary();
  const regions = getRegionStats();
  const categories = getCategoryStats();
  const tiers = getFeaturedByTier();

  const region = searchParams?.region;
  const category = searchParams?.category;
  const q = searchParams?.q;
  const page = parseInt(searchParams?.page ?? "1", 10) || 1;

  const board = queryOrganisations({ region, category, search: q, page, perPage: 24 });

  const deepest = regions.slice(0, 3);
  const filtered = Boolean(region || category || q);

  const withParams = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { region, category, q, ...patch };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    const s = p.toString();
    return s ? `/internships?${s}` : "/internships";
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
              style={{ background: "var(--reward)" }}
            />
            <span className="font-mono text-label uppercase" style={{ color: "var(--reward)" }}>
              Market open · internship exchange, Uzbekistan
            </span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-s5">
            <div className="min-w-0">
              <h1 className="text-h1 md:text-display font-semibold text-ink text-balance max-w-[16ch]">
                Track where opportunity is trading.
              </h1>
              <p className="text-ui text-muted mt-s4 max-w-[52ch]">
                Every region, every sector — who is hiring interns, how to reach
                them, and where to apply. Compiled from public registries and
                company sources.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex w-full sm:w-auto border border-line rounded-lg bg-surface shadow-sh1 overflow-hidden">
              <Stat label="Organisations" value={summary.totalOrgs.toLocaleString()} />
              <Stat label="Regions" value={String(summary.regions)} />
              <Stat label="Featured" value={String(summary.featured)} />
              <Stat
                label="With contact"
                value={summary.withContact.toLocaleString()}
                hint={`${Math.round((summary.withContact / summary.totalOrgs) * 100)}% reachable`}
              />
            </div>
          </div>
        </header>

        {/* ── Deepest markets ──────────────────────────────────────────── */}
        <section>
          <div className="flex items-baseline gap-s4 mb-s2">
            <h2 className="text-h2 font-semibold text-ink whitespace-nowrap">Deepest markets</h2>
            <span className="h-px bg-line flex-1" />
          </div>
          <p className="text-meta text-muted mb-s4">
            The regions with the most internship-ready organisations on the board.
          </p>

          <div className="grid sm:grid-cols-3 gap-s3">
            {deepest.map((r) => (
              <Link
                key={r.region}
                href={withParams({ region: r.region, category: undefined, q: undefined })}
                className="rounded-lg p-s5 border border-transparent transition-transform hover:-translate-y-[2px]"
                style={{ background: "var(--bg-sunk)" }}
              >
                <span className="font-mono text-label uppercase text-faint">{r.symbol}</span>
                <h3 className="text-h3 font-semibold text-ink mt-s2">{r.region}</h3>
                <div className="flex items-end justify-between mt-s4">
                  <span className="font-mono text-h1 text-ink tabular leading-none">{r.total}</span>
                  <span className="text-meta text-muted text-right">
                    {r.topCategory}
                    <span className="block font-mono text-[11px] text-faint tabular">
                      {r.withContact} reachable
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── The full board ───────────────────────────────────────────── */}
        <section>
          <div className="flex items-baseline gap-s4 mb-s2">
            <h2 className="text-h2 font-semibold text-ink whitespace-nowrap">The full board</h2>
            <span className="h-px bg-line flex-1" />
          </div>
          <p className="text-meta text-muted mb-s4">
            All {summary.regions} regions. Pick one to open its listings.
          </p>

          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-s4 items-start">
            <RegionMap
              regions={regions.map((r) => ({
                region: r.region,
                symbol: r.symbol,
                total: r.total,
                topCategory: r.topCategory,
              }))}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-s2">
            {regions.map((r) => {
              const on = region === r.region;
              return (
                <Link
                  key={r.region}
                  href={on ? withParams({ region: undefined }) : withParams({ region: r.region })}
                  aria-current={on ? "true" : undefined}
                  className={`rounded-md border p-s3 transition-colors ${
                    on
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:border-line-strong"
                  }`}
                >
                  <span className="font-mono text-label uppercase text-faint">{r.symbol}</span>
                  <span className={`block text-meta font-medium mt-1 truncate ${on ? "text-accent-strong" : "text-ink"}`}>
                    {r.region.replace(/\s+region$/i, "")}
                  </span>
                  <span className="font-mono text-h3 text-ink tabular block mt-s2">{r.total}</span>
                </Link>
              );
            })}
            </div>
          </div>
        </section>

        {/* ── Listings ─────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-baseline gap-s4 mb-s4">
            <h2 className="text-h2 font-semibold text-ink whitespace-nowrap">
              {region ? region : "All organisations"}
            </h2>
            <span className="h-px bg-line flex-1" />
            <span className="font-mono text-meta text-muted tabular whitespace-nowrap">
              {board.total.toLocaleString()} found
            </span>
          </div>

          <BoardFilters categories={categories} />

          {filtered && (
            <div className="mt-s3">
              <Link href="/internships" className="text-meta text-accent hover:text-accent-strong">
                Clear filters
              </Link>
            </div>
          )}

          {board.results.length === 0 ? (
            <div className="mt-s5 rounded-lg border border-line bg-surface p-s7 text-center">
              <h3 className="text-h3 font-semibold text-ink">Nothing matches that</h3>
              <p className="text-meta text-muted mt-s2">
                Try a different region, sector or search term.
              </p>
            </div>
          ) : (
            <ul className="mt-s5 grid md:grid-cols-2 gap-s3 list-none p-0 m-0">
              {board.results.map((o) => (
                <li key={o.id} className="rounded-lg border border-line bg-surface shadow-sh1 p-s4">
                  <div className="flex items-start justify-between gap-s3">
                    <div className="min-w-0">
                      <h3 className="text-ui font-semibold text-ink">{o.name}</h3>
                      <p className="text-meta text-muted mt-1">
                        {o.city || o.region}
                        {o.address ? ` · ${o.address}` : ""}
                      </p>
                    </div>
                    <span className="text-label uppercase px-s2 py-1 rounded-sm bg-bg-sunk text-muted shrink-0">
                      {o.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-s3 mt-s3 pt-s3 border-t border-line">
                    {o.email && (
                      <a href={`mailto:${o.email}`} className="inline-flex items-center min-h-[44px] font-mono text-meta text-accent hover:text-accent-strong break-all">
                        {o.email}
                      </a>
                    )}
                    {o.phone && (
                      <span className="inline-flex items-center min-h-[44px] font-mono text-meta text-muted tabular">{o.phone}</span>
                    )}
                    {!o.email && !o.phone && (
                      <span className="text-meta text-faint">No public contact listed</span>
                    )}
                    {(o.address || o.city) && (
                      <a
                        href={mapsUrl([o.name, o.address, o.city, o.region, "Uzbekistan"])}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center min-h-[44px] text-meta text-accent hover:text-accent-strong"
                      >
                        Map ↗
                      </a>
                    )}
                    {o.sourceUrl && (
                      <a
                        href={o.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center min-h-[44px] text-meta text-faint hover:text-ink ml-auto"
                      >
                        Source ↗
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {board.totalPages > 1 && (
            <nav className="flex items-center justify-between gap-s3 mt-s5" aria-label="Pagination">
              <Link
                href={withParams({ page: String(Math.max(1, board.page - 1)) })}
                aria-disabled={board.page <= 1}
                className={`px-s4 py-s2 rounded-md border border-line text-meta min-h-[44px] flex items-center ${
                  board.page <= 1 ? "opacity-40 pointer-events-none" : "text-muted hover:text-ink"
                }`}
              >
                Previous
              </Link>
              <span className="font-mono text-meta text-faint tabular">
                Page {board.page} of {board.totalPages}
              </span>
              <Link
                href={withParams({ page: String(Math.min(board.totalPages, board.page + 1)) })}
                aria-disabled={board.page >= board.totalPages}
                className={`px-s4 py-s2 rounded-md border border-line text-meta min-h-[44px] flex items-center ${
                  board.page >= board.totalPages ? "opacity-40 pointer-events-none" : "text-muted hover:text-ink"
                }`}
              >
                Next
              </Link>
            </nav>
          )}
        </section>

        {/* ── Featured ─────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-baseline gap-s4 mb-s2">
            <h2 className="text-h2 font-semibold text-ink whitespace-nowrap">Verified desks</h2>
            <span className="h-px bg-line flex-1" />
          </div>
          <p className="text-meta text-muted mb-s4">
            Organisations with a confirmed internship route, checked against a
            named source.
          </p>

          <div className="flex flex-col gap-s5">
            {tiers.map(({ tier, companies }) => (
              <div key={tier}>
                <div className="flex items-center gap-s3 mb-s3">
                  <span
                    className="text-label uppercase px-s2 py-1 rounded-sm"
                    style={{
                      background: `var(--${TIER_TONE[tier]}-soft)`,
                      color: `var(--${TIER_TONE[tier]})`,
                    }}
                  >
                    {tier}
                  </span>
                  <span className="font-mono text-meta text-faint tabular">{companies.length}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-s3">
                  {companies.map((c) => (
                    <article key={c.name} className="rounded-lg border border-line bg-surface shadow-sh1 p-s4">
                      <div className="flex items-start justify-between gap-s3">
                        <h3 className="text-ui font-semibold text-ink">{c.name}</h3>
                        {c.website && (
                          <a
                            href={c.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center min-h-[44px] text-meta text-accent hover:text-accent-strong shrink-0"
                          >
                            Visit ↗
                          </a>
                        )}
                      </div>
                      <p className="text-meta text-muted mt-1">{c.sector} · {c.region}</p>
                      {c.notes && <p className="text-meta text-ink mt-s3">{c.notes}</p>}
                      {c.address && (
                        <a
                          href={mapsUrl([c.name, c.address, c.region, "Uzbekistan"])}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center min-h-[44px] text-meta text-accent hover:text-accent-strong mt-s2"
                        >
                          Map ↗
                        </a>
                      )}
                      {(c.email || c.phone) && (
                        <p className="font-mono text-meta text-muted mt-s3 pt-s3 border-t border-line break-all">
                          {[c.email, c.phone].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="text-meta text-faint border-t border-line pt-s4">
          Compiled from public registries and company sources for a regional
          internship-placement project. Contact details change — always check the
          organisation&apos;s own site before applying.
        </p>
      </div>
    </div>
  );
}
