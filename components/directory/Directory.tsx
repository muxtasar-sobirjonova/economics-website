"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DirConfig, DirRow } from "@/components/directory/types";

/**
 * A directory: search it, narrow it, open a row.
 *
 * All of the data is on the client, which is the decision worth stating. It is
 * 88 KB for the biggest of them, and it buys a search that answers as you type,
 * filters that combine without a round trip, and a panel that opens instantly —
 * on a page whose entire purpose is browsing that list. The alternative was a
 * URL parameter and a server render per keystroke.
 *
 * What is saved lives in this browser only. It is a convenience, not a record:
 * every read and write is wrapped, because site data can be cleared or blocked
 * and a starred row is not worth a blank page.
 */

const PER_PAGE = 10;

const ic = (d: string, size = 17) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0"
    dangerouslySetInnerHTML={{ __html: d }} />
);

const CHECK = '<path d="M5 12l5 5 9-10"/>';
const STAR = '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>';
const CHEV = '<path d="M9 6l6 6-6 6"/>';
const SEARCH = '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>';

function useSaved(key: string) {
  const [saved, setSaved] = useState<Record<number, true>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      /* private window, blocked storage — the page works without it */
    }
  }, [key]);

  const toggle = (id: number) =>
    setSaved((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* as above */
      }
      return next;
    });

  return { saved, toggle, count: Object.keys(saved).length };
}

export function Directory({ config, storageKey }: { config: DirConfig; storageKey: string }) {
  const [q, setQ] = useState("");
  const [place, setPlace] = useState("");
  const [groups, setGroups] = useState<string[]>([]);
  const [band, setBand] = useState("");
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [onlySaved, setOnlySaved] = useState(false);
  const [sort, setSort] = useState<"best" | "az" | "place">("best");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<"place" | "group" | null>(null);
  const [picked, setPicked] = useState<DirRow | null>(null);

  const { saved, toggle, count: savedCount } = useSaved(storageKey);

  const reset = () => {
    setQ(""); setPlace(""); setGroups([]); setBand(""); setOn({}); setOnlySaved(false);
    setSort("best"); setPage(1);
  };

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();

    const out = config.rows.filter((r) => {
      if (place && r.place !== place) return false;
      if (groups.length && !groups.includes(r.group)) return false;
      if (band && r.flags[band] !== true) return false;
      if (onlySaved && !saved[r.id]) return false;
      for (const t of config.toggles) if (on[t.key] && !r.flags[t.key]) return false;
      if (!needle) return true;
      return `${r.title} ${r.subtitle} ${r.group} ${r.place}`.toLowerCase().includes(needle);
    });

    out.sort((a, b) =>
      sort === "az"
        ? a.title.localeCompare(b.title)
        : sort === "place"
          ? a.place.localeCompare(b.place) || a.title.localeCompare(b.title)
          : a.rank - b.rank || a.title.localeCompare(b.title)
    );

    return out;
  }, [config.rows, config.toggles, q, place, groups, band, on, onlySaved, saved, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const current = Math.min(page, pages);
  const from = (current - 1) * PER_PAGE;
  const slice = rows.slice(from, from + PER_PAGE);

  // Any change to the filters starts again at the top.
  useEffect(() => { setPage(1); }, [q, place, groups, band, on, onlySaved, sort]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (picked) setPicked(null);
      else if (open) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [picked, open]);

  const chips = useMemo(() => {
    const shown = config.groups.slice(0, 6).map((g) => g.name);
    groups.forEach((g) => { if (!shown.includes(g)) shown.push(g); });
    return shown;
  }, [config.groups, groups]);

  const toggleGroup = (name: string) =>
    setGroups((prev) => (prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name]));

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[880px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6">
        <header>
          <h1 className="text-h1 font-bold tracking-tight text-ink pb-[3px]">{config.title}</h1>
          <p className="text-meta text-muted mt-s2 max-w-[62ch]">{config.sub}</p>
        </header>

        {/* ── Stats ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-s3 mt-s5">
          {config.stats.map((s) => (
            <div key={s.label} className="bg-bg-sunk border border-line rounded-lg px-s4 py-s3 flex items-center gap-s3 min-w-0">
              <span className="hidden sm:grid w-9 h-9 rounded-lg place-items-center shrink-0 bg-surface border border-line" style={{ color: "var(--accent-strong)" }}>
                {ic(s.icon)}
              </span>
              <span className="min-w-0">
                <span className="block text-meta text-muted leading-tight">{s.label}</span>
                <b className="block text-h3 font-bold text-ink leading-tight tabular">{s.value}</b>
              </span>
            </div>
          ))}
        </div>

        {/* ── Finder ──────────────────────────────────────────────────── */}
        <section className="mt-s5 bg-surface border border-line rounded-xl shadow-sh1 p-s3">
          <div className="flex flex-col sm:flex-row gap-s3">
            <div className="relative flex-1 min-w-0">
              <span className="absolute left-s4 top-1/2 -translate-y-1/2 text-faint pointer-events-none">
                {ic(SEARCH, 18)}
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="search"
                placeholder={`Search by name, ${config.placeNoun} or ${config.groupNoun.toLowerCase()}`}
                aria-label="Search"
                autoComplete="off"
                className="w-full min-h-[44px] pl-[42px] pr-s4 bg-bg-sunk border border-line rounded-lg text-ui text-ink placeholder:text-faint focus:outline-none focus:bg-raised focus:border-accent transition-colors"
              />
            </div>

            <Dropdown
              label={place || `All ${config.placePlural}`}
              active={Boolean(place)}
              expanded={open === "place"}
              onToggle={() => setOpen(open === "place" ? null : "place")}
            />
          </div>

          <div className="flex gap-s2 mt-s3 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] pb-0.5">
            <Chip on={groups.length === 0} onClick={() => setGroups([])}>
              All {config.groupNoun.toLowerCase()}s
            </Chip>
            {chips.map((name) => (
              <Chip key={name} on={groups.includes(name)} onClick={() => toggleGroup(name)}
                count={config.groups.find((g) => g.name === name)?.count}>
                {name}
              </Chip>
            ))}
            <Chip dashed on={false} onClick={() => setOpen(open === "group" ? null : "group")}>
              More {config.groupNoun.toLowerCase()}s ▾
            </Chip>
          </div>

          {config.bands && (
            <div className="flex gap-s2 mt-s2 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] pb-0.5">
              {config.bands.options.map((o) => (
                <Chip key={o.name} on={band === o.name} count={o.count}
                  onClick={() => setBand(band === o.name ? "" : o.name)}>
                  {o.name}
                </Chip>
              ))}
            </div>
          )}
        </section>

        {/* ── Bar ─────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-s3 mt-s5 mb-s3">
          <h2 className="text-ui font-bold text-ink">
            {onlySaved ? "Saved" : config.title}
            <span className="text-meta text-muted font-medium ml-s2">
              {rows.length ? `${from + 1}–${from + slice.length} of ${rows.length}` : "0 found"}
            </span>
          </h2>

          <div className="flex flex-wrap items-center gap-s2">
            {config.toggles.map((t) => (
              <Toggle key={t.key} on={Boolean(on[t.key])} icon={t.icon}
                onClick={() => setOn((p) => ({ ...p, [t.key]: !p[t.key] }))}>
                {t.label}
              </Toggle>
            ))}
            <Toggle on={onlySaved} icon={STAR} onClick={() => setOnlySaved((v) => !v)}>
              {savedCount ? `Saved (${savedCount})` : "Saved"}
            </Toggle>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              aria-label="Sort"
              className="min-h-[36px] border border-line rounded-lg px-s2 text-meta bg-surface text-ink"
            >
              <option value="best">Best first</option>
              <option value="az">A to Z</option>
              <option value="place">{config.sortByPlace}</option>
            </select>
          </div>
        </div>

        {/* ── List ────────────────────────────────────────────────────── */}
        <div className="bg-surface border border-line rounded-xl shadow-sh1 overflow-hidden">
          {slice.length === 0 ? (
            <div className="p-s6 text-center text-meta text-muted">
              <b className="block text-ui text-ink mb-s1">Nothing matches</b>
              Try a different search, or{" "}
              <button onClick={reset} className="text-accent hover:text-accent-strong font-semibold min-h-[44px]">
                clear all filters
              </button>
              .
            </div>
          ) : (
            slice.map((r) => (
              <div
                key={r.id}
                role="button"
                tabIndex={0}
                onClick={() => setPicked(r)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPicked(r); }
                }}
                className="grid grid-cols-[40px_minmax(0,1fr)_auto_16px] sm:grid-cols-[40px_minmax(0,1fr)_auto_40px_16px] gap-s3 items-center px-s4 py-s3 border-b border-line last:border-b-0 cursor-pointer hover:bg-bg-sunk transition-colors"
              >
                <span className="w-10 h-10 rounded-lg grid place-items-center font-bold shrink-0"
                  style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }} aria-hidden>
                  {r.initial}
                </span>

                <span className="min-w-0">
                  {/* The name truncates; the badge does not. A row whose state
                      reads "D…" has lost the only thing it was there to say. */}
                  <b className="flex items-center gap-s2 text-ui font-semibold text-ink leading-snug min-w-0">
                    <span className="truncate">{r.title}</span>
                    {r.badge && r.badge.tone === "strong" && (
                      <span className="text-label font-semibold rounded px-1.5 py-[1px] shrink-0"
                        style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}>
                        {r.badge.label}
                      </span>
                    )}
                  </b>
                  <small className="block text-meta text-muted truncate">{r.subtitle}</small>
                </span>

                <span className="hidden sm:inline-block text-meta rounded-full border border-line px-s3 py-0.5 whitespace-nowrap"
                  style={{ color: "var(--accent-strong)", background: "var(--bg-sunk)" }}>
                  {r.badge && r.badge.tone !== "strong" ? r.badge.label : r.group}
                </span>

                <button
                  onClick={(e) => { e.stopPropagation(); toggle(r.id); }}
                  aria-pressed={Boolean(saved[r.id])}
                  aria-label={saved[r.id] ? `Unsave ${r.title}` : `Save ${r.title}`}
                  className="w-10 h-10 rounded-lg grid place-items-center transition-colors"
                  style={{ color: saved[r.id] ? "var(--accent)" : "var(--border-strong)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth={2} strokeLinejoin="round"
                    stroke="currentColor" fill={saved[r.id] ? "currentColor" : "none"} aria-hidden
                    dangerouslySetInnerHTML={{ __html: STAR }} />
                </button>

                <span className="hidden sm:block" style={{ color: "var(--border-strong)" }}>{ic(CHEV, 16)}</span>
              </div>
            ))
          )}
        </div>

        {pages > 1 && (
          <nav className="flex justify-center items-center gap-s2 mt-s5 flex-wrap" aria-label="Pages">
            <Page onClick={() => setPage(current - 1)} disabled={current < 2} label="Previous page">‹</Page>
            {pageNumbers(current, pages).map((n, i) =>
              n === 0 ? (
                <span key={`gap${i}`} className="text-muted">…</span>
              ) : (
                <Page key={n} onClick={() => setPage(n)} current={n === current}>{n}</Page>
              )
            )}
            <Page onClick={() => setPage(current + 1)} disabled={current >= pages} label="Next page">›</Page>
          </nav>
        )}
      </div>

      {open && (
        <Popover
          title={open === "place" ? `All ${config.placePlural}` : `All ${config.groupNoun.toLowerCase()}s`}
          single={open === "place"}
          options={open === "place" ? config.places : config.groups}
          selected={open === "place" ? (place ? [place] : []) : groups}
          onPick={(name) => {
            if (open === "place") { setPlace(place === name ? "" : name); setOpen(null); }
            else toggleGroup(name);
          }}
          onClear={() => (open === "place" ? setPlace("") : setGroups([]))}
          onClose={() => setOpen(null)}
        />
      )}

      {picked && (
        <Drawer
          row={picked}
          saved={Boolean(saved[picked.id])}
          onSave={() => toggle(picked.id)}
          onClose={() => setPicked(null)}
        />
      )}
    </div>
  );
}

/* ── Pieces ─────────────────────────────────────────────────────────────── */

function pageNumbers(current: number, pages: number): number[] {
  const set = [1, current - 1, current, current + 1, pages]
    .filter((n, i, a) => n >= 1 && n <= pages && a.indexOf(n) === i)
    .sort((a, b) => a - b);

  const out: number[] = [];
  let prev = 0;
  for (const n of set) {
    if (n - prev > 1) out.push(0); // an ellipsis
    out.push(n);
    prev = n;
  }
  return out;
}

function Page({
  children, onClick, current, disabled, label,
}: {
  children: React.ReactNode; onClick: () => void; current?: boolean;
  disabled?: boolean; label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-current={current ? "page" : undefined}
      aria-label={label}
      className="min-w-[40px] min-h-[40px] px-s2 border rounded-lg font-semibold text-meta transition-colors disabled:opacity-40"
      style={
        current
          ? { background: "var(--accent)", borderColor: "var(--accent)", color: "var(--on-accent)" }
          : { borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }
      }
    >
      {children}
    </button>
  );
}

function Chip({
  children, on, onClick, count, dashed,
}: {
  children: React.ReactNode; on: boolean; onClick: () => void;
  count?: number; dashed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className="shrink-0 min-h-[40px] px-s4 rounded-full border text-meta font-medium inline-flex items-center gap-s2 whitespace-nowrap transition-colors"
      style={
        on
          ? { background: "var(--accent)", borderColor: "var(--accent)", color: "var(--on-accent)" }
          : {
              borderColor: "var(--border)",
              borderStyle: dashed ? "dashed" : "solid",
              background: dashed ? "var(--bg-sunk)" : "var(--surface)",
              color: dashed ? "var(--accent-strong)" : "var(--text)",
            }
      }
    >
      {children}
      {count !== undefined && (
        <em className="not-italic text-label" style={{ color: on ? "rgba(255,255,255,.8)" : "var(--muted)" }}>
          {count}
        </em>
      )}
    </button>
  );
}

function Toggle({
  children, on, onClick, icon,
}: {
  children: React.ReactNode; on: boolean; onClick: () => void; icon: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className="min-h-[36px] px-s3 rounded-full border text-meta inline-flex items-center gap-s2 whitespace-nowrap transition-colors"
      style={
        on
          ? { background: "var(--accent-soft)", borderColor: "var(--accent)", color: "var(--accent-strong)", fontWeight: 600 }
          : { borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }
      }
    >
      {ic(icon, 14)}
      {children}
    </button>
  );
}

function Dropdown({
  label, active, expanded, onToggle,
}: {
  label: string; active: boolean; expanded: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-haspopup="listbox"
      aria-expanded={expanded}
      className="min-h-[44px] px-s4 border rounded-lg font-semibold text-ui inline-flex items-center gap-s2 whitespace-nowrap shrink-0 transition-colors max-w-full"
      style={
        active || expanded
          ? { borderColor: "var(--accent)", background: "var(--accent-soft)", color: "var(--accent-strong)" }
          : { borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }
      }
    >
      <span className="truncate">{label}</span>
      <span className="text-muted">▾</span>
    </button>
  );
}

function Popover({
  title, options, selected, single, onPick, onClear, onClose,
}: {
  title: string;
  options: { name: string; count: number }[];
  selected: string[];
  single: boolean;
  onPick: (name: string) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const max = options.reduce((n, o) => Math.max(n, o.count), 1);
  const list = options.filter((o) => o.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-s5"
      style={{ background: "rgba(36,31,64,.35)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full sm:max-w-[420px] max-h-[82vh] bg-surface rounded-t-xl sm:rounded-xl shadow-sh3 flex flex-col overflow-hidden"
      >
        <div className="p-s3 border-b border-line">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}`}
            aria-label={`Search ${title}`}
            autoFocus
            className="w-full min-h-[40px] px-s3 bg-bg-sunk border border-line rounded-lg text-ui text-ink placeholder:text-faint focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-s2">
          {list.length === 0 ? (
            <p className="p-s5 text-center text-meta text-muted">Nothing matches that.</p>
          ) : (
            list.map((o) => {
              const on = selected.includes(o.name);
              return (
                <button
                  key={o.name}
                  role={single ? "option" : "checkbox"}
                  aria-checked={on}
                  aria-selected={single ? on : undefined}
                  onClick={() => onPick(o.name)}
                  className="w-full grid grid-cols-[20px_1fr_auto] gap-s3 items-center text-left px-s3 py-s2 min-h-[44px] rounded-lg hover:bg-bg-sunk transition-colors"
                >
                  <span
                    className="w-5 h-5 grid place-items-center border shrink-0"
                    style={{
                      borderRadius: single ? "50%" : 6,
                      background: on ? "var(--accent)" : "transparent",
                      borderColor: on ? "var(--accent)" : "var(--border-strong)",
                      color: "#fff",
                    }}
                    aria-hidden
                  >
                    {on && ic(CHECK, 12)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-ui text-ink truncate">{o.name}</span>
                    <span className="block h-1 rounded-full mt-1 overflow-hidden" style={{ background: "var(--bg-sunk)" }}>
                      <span className="block h-full rounded-full"
                        style={{ width: `${(o.count / max) * 100}%`, background: on ? "var(--accent)" : "var(--border-strong)" }} />
                    </span>
                  </span>
                  <small className="text-meta text-muted tabular">{o.count}</small>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-s4 p-s3 border-t border-line bg-bg-sunk">
          <button onClick={onClear} className="text-meta font-semibold min-h-[44px]" style={{ color: "var(--accent-strong)" }}>
            Clear
          </button>
          <span className="ml-auto text-meta text-muted">
            {selected.length ? `${selected.length} selected` : "None selected"}
          </span>
          <button
            onClick={onClose}
            className="min-h-[44px] px-s5 rounded-lg text-meta font-semibold"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function Drawer({
  row, saved, onSave, onClose,
}: {
  row: DirRow; saved: boolean; onSave: () => void; onClose: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      /* clipboard refused — the value is on screen to select by hand */
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end"
      style={{ background: "rgba(36,31,64,.35)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={row.title}
        className="w-full sm:w-[420px] max-h-[88vh] sm:max-h-none bg-surface overflow-y-auto p-s5 rounded-t-xl sm:rounded-none shadow-sh3"
      >
        <div className="flex gap-s3 items-start">
          <span className="w-12 h-12 rounded-lg grid place-items-center font-bold text-h3 shrink-0"
            style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }} aria-hidden>
            {row.initial}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-h3 font-bold text-ink leading-snug break-words">{row.title}</h2>
            <p className="text-meta text-muted mt-s1 break-words">{row.subtitle}</p>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="w-10 h-10 border border-line rounded-lg text-h3 leading-none shrink-0 text-muted hover:bg-bg-sunk transition-colors">
            ×
          </button>
        </div>

        <div className="flex flex-wrap gap-s2 mt-s3">
          <span className="text-meta rounded-full border border-line px-s3 py-0.5" style={{ color: "var(--accent-strong)", background: "var(--bg-sunk)" }}>
            {row.group}
          </span>
          <span className="text-meta rounded-full border border-line px-s3 py-0.5" style={{ color: "var(--accent-strong)", background: "var(--bg-sunk)" }}>
            {row.place}
          </span>
          {row.badge && (
            <span className="text-meta rounded-full px-s3 py-0.5 font-semibold"
              style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}>
              {row.badge.label}
            </span>
          )}
        </div>

        {row.note && (
          <div className="mt-s5 rounded-lg p-s4" style={{ background: "var(--bg-sunk)" }}>
            <b className="flex items-center gap-s2 text-ui" style={{ color: "var(--accent-strong)" }}>
              {ic(CHECK, 16)}
              {row.note.title}
            </b>
            <p className="text-meta text-muted mt-s1">{row.note.body}</p>
          </div>
        )}

        <div className="mt-s5 border border-line rounded-lg overflow-hidden">
          {row.fields.map((f) => (
            <div key={f.label} className="grid grid-cols-[84px_1fr_auto] gap-s3 items-center px-s4 py-s3 border-b border-line last:border-b-0">
              <span className="text-meta text-muted">{f.label}</span>
              <span className="text-ui break-words" style={{ color: f.value ? "var(--text)" : "var(--faint)" }}>
                {f.value || "Not listed"}
              </span>
              {f.value && f.copy ? (
                <button onClick={() => copy(f.value!)}
                  className="min-h-[36px] px-s3 border border-line rounded-lg text-meta font-semibold shrink-0"
                  style={{ color: "var(--accent-strong)" }}>
                  {copied === f.value ? "Copied" : "Copy"}
                </button>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-s3 mt-s5">
          <button onClick={onSave} aria-pressed={saved}
            className="flex-1 min-h-[44px] rounded-lg border text-ui font-semibold transition-colors"
            style={{ borderColor: "var(--accent)", color: "var(--accent-strong)", background: saved ? "var(--accent-soft)" : "var(--surface)" }}>
            {saved ? "Saved" : "Save"}
          </button>
          <a
            href={row.mailto ? `mailto:${row.mailto}` : row.sourceUrl || "#"}
            target={row.mailto ? undefined : "_blank"}
            rel={row.mailto ? undefined : "noreferrer"}
            className="flex-1 min-h-[44px] rounded-lg text-ui font-semibold grid place-items-center"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            {row.mailto ? "Write email" : "Open source"}
          </a>
        </div>
      </aside>
    </div>
  );
}
