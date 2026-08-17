"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

/** Search and category live in the URL, so a filtered board is shareable. */
export function BoardFilters({ categories }: { categories: { name: string; count: number }[] }) {
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

  const setCategory = (name: string) => {
    const next = new URLSearchParams(params.toString());
    if (name && name !== params.get("category")) next.set("category", name);
    else next.delete("category");
    push(next);
  };

  const active = params.get("category");

  return (
    <div className="flex flex-col gap-s3">
      <form onSubmit={onSearch} className="flex gap-s2">
        <label htmlFor="org-search" className="sr-only">Search organisations</label>
        <input
          id="org-search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search by name, city or sector…"
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
        {categories.map((c) => {
          const on = active === c.name;
          return (
            <button
              key={c.name}
              onClick={() => setCategory(c.name)}
              aria-pressed={on}
              className={`flex items-center gap-s2 px-s3 py-s2 rounded-md border text-meta transition-colors min-h-[44px] ${
                on
                  ? "border-transparent bg-accent-soft text-accent-strong"
                  : "border-line text-muted hover:text-ink hover:border-line-strong"
              }`}
            >
              {c.name}
              <span className="font-mono text-[11px] tabular opacity-70">{c.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
