"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
  count: number;
  /** Reach chips carry the colour their kind uses everywhere else. */
  tone?: string;
}

/**
 * Search, tier, city and reach all live in the URL, so a filtered register is
 * shareable and works before the JavaScript lands.
 */
export function RegisterFilters({
  tiers,
  cities,
  reaches,
}: {
  tiers: Option[];
  cities: Option[];
  reaches: Option[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [term, setTerm] = useState(params.get("q") ?? "");

  useEffect(() => {
    setTerm(params.get("q") ?? "");
  }, [params]);

  const push = (next: URLSearchParams) => {
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (term.trim()) next.set("q", term.trim());
    else next.delete("q");
    push(next);
  };

  const toggle = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value && next.get(key) !== value) next.set(key, value);
    else next.delete(key);
    push(next);
  };

  const chip = (on: boolean) =>
    `flex items-center gap-s2 px-s3 py-s2 rounded-md border text-meta transition-colors min-h-[44px] ${
      on
        ? "border-transparent bg-accent-soft text-accent-strong"
        : "border-line text-muted hover:text-ink hover:border-line-strong"
    }`;

  return (
    <div className="flex flex-col gap-s3">
      <form onSubmit={onSearch} className="flex gap-s2">
        <label htmlFor="prof-search" className="sr-only">Search faculty</label>
        <input
          id="prof-search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search by name, department or field…"
          className="flex-1 min-w-0 bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink placeholder:text-faint min-h-[44px]"
        />
        <button
          type="submit"
          className="px-s4 py-s2 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors min-h-[44px] shrink-0"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-s2">
        {reaches.map((r) => {
          const on = params.get("reach") === r.value;
          return (
            <button
              key={r.value}
              onClick={() => toggle("reach", r.value)}
              aria-pressed={on}
              className={chip(on)}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: `var(--${r.tone})` }}
                aria-hidden
              />
              {r.label}
              <span className="font-mono text-[11px] tabular opacity-70">{r.count}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-s2">
        {tiers.map((t) => (
          <button
            key={t.value}
            onClick={() => toggle("tier", t.value)}
            aria-pressed={params.get("tier") === t.value}
            className={chip(params.get("tier") === t.value)}
          >
            {t.label}
            <span className="font-mono text-[11px] tabular opacity-70">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-s2">
        {cities.map((c) => (
          <button
            key={c.value}
            onClick={() => toggle("city", c.value)}
            aria-pressed={params.get("city") === c.value}
            className={chip(params.get("city") === c.value)}
          >
            {c.label}
            <span className="font-mono text-[11px] tabular opacity-70">{c.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
