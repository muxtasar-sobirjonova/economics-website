"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createProblemCompetitionAction,
  retireProblemAction,
  setPracticeOpenAction,
  getProblemAction,
} from "@/app/actions/problems";
import type { ProblemSummary } from "@/lib/compete/problemService";
import { MAX_PROBLEMS, MIN_MINUTES, MAX_MINUTES } from "@/lib/compete/problemService";
import { ProblemEditor, type Draft } from "@/components/compete/ProblemEditor";
import { BulkPaste } from "@/components/compete/BulkPaste";
import { FocusChoice } from "@/components/compete/FocusChoice";
import { Rich } from "@/components/compete/Rich";
import type { FocusPolicy } from "@/lib/compete/setup";

/**
 * The problem bank, as a workspace.
 *
 * Two panels, because the two jobs it has are different ones: triaging a bank
 * of 179 is scanning a list, and deciding whether a problem is any good is
 * reading the whole thing. The old page could only do the first — it showed
 * 140 characters a row and there was no way to read a problem at all without
 * opening the editor.
 *
 * The full statement is fetched when a row is chosen rather than sent with the
 * list, for the reason the list sends a preview in the first place: 179 full
 * statements is most of a megabyte to draw a page of titles.
 *
 * `ProblemPicker` still exists and is still what the host form on `/compete`
 * uses. That one is embedded in a page and picks a set; this one owns a screen
 * and manages a bank. Making one component do both would have been a worse
 * component than two.
 */

const KIND_LABEL: Record<string, string> = {
  NUMERIC: "number",
  SHORT: "short",
  OPEN: "written",
};

const MODE_LABEL: Record<string, string> = {
  AUTO: "a key",
  AI: "the model",
  HOST: "you",
};

/** Enough of the id to quote when something is wrong with one. */
const shortId = (id: string) => id.slice(-6).toUpperCase();

export function ProblemWorkspace({
  problems,
  mayWrite,
  mayHost,
  available,
}: {
  problems: ProblemSummary[];
  mayWrite: boolean;
  mayHost: boolean;
  available: boolean;
}) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shownCount, setShownCount] = useState(60);

  /** What fills the right panel. */
  const [pane, setPane] = useState<"detail" | "room" | "write" | "paste" | "edit">("detail");
  const [editing, setEditing] = useState<Draft | null>(null);

  const [detail, setDetail] = useState<Draft | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(45);
  const [timed, setTimed] = useState(true);
  const [access, setAccess] = useState<"OPEN" | "LINK">("OPEN");
  const [focusPolicy, setFocusPolicy] = useState<FocusPolicy>("LOCK");
  const [focusAllowance, setFocusAllowance] = useState(2);

  const topics = useMemo(() => [...new Set(problems.map((p) => p.topic))].sort(), [problems]);
  const byId = useMemo(() => new Map(problems.map((p) => [p.id, p])), [problems]);

  /**
   * What the filters leave.
   *
   * A picked problem always survives: it is in the set being built, and
   * watching it vanish because the search changed is how a room gets opened
   * with the wrong questions in it.
   */
  const matching = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return problems.filter((p) => {
      if (picked.includes(p.id)) return true;
      if (topicFilter && p.topic !== topicFilter) return false;
      if (!needle) return true;
      return p.title.toLowerCase().includes(needle) || p.preview.toLowerCase().includes(needle);
    });
  }, [problems, topicFilter, query, picked]);

  const shown = matching.slice(0, shownCount);
  const marks = picked.reduce((sum, id) => sum + (byId.get(id)?.maxPoints ?? 0), 0);
  const selected = selectedId ? byId.get(selectedId) : undefined;

  // The statement arrives when a row is chosen. Guarded against arriving after
  // a second row has been chosen, which would show one problem's text under
  // another's title.
  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }

    let current = true;
    setLoadingDetail(true);
    setDetailError(null);

    getProblemAction(selectedId)
      .then((res) => {
        if (!current) return;
        if (res.ok) setDetail(res.data);
        else setDetailError(res.error);
      })
      .finally(() => {
        if (current) setLoadingDetail(false);
      });

    return () => {
      current = false;
    };
  }, [selectedId]);

  const pickRandom = (count: number) => {
    const pool = matching.filter((p) => p.active && !picked.includes(p.id));
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    // Shuffled first, then least-used first: random within a usage band, so the
    // unused half of the bank is spent before anything is set twice.
    pool.sort((a, b) => a.timesUsed - b.timesUsed);
    const room = Math.max(0, MAX_PROBLEMS - picked.length);
    setPicked((list) => [...list, ...pool.slice(0, Math.min(count, room)).map((p) => p.id)]);
  };

  const toggle = (id: string) =>
    setPicked((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  const retire = (id: string, active: boolean) =>
    start(async () => {
      await retireProblemAction(id, active);
      router.refresh();
    });

  const practice = (id: string, open: boolean) =>
    start(async () => {
      await setPracticeOpenAction(id, open);
      router.refresh();
    });

  const edit = (id: string) =>
    start(async () => {
      const res = await getProblemAction(id);
      if (!res.ok) return setDetailError(res.error);
      setEditing(res.data);
      setPane("edit");
    });

  const openRoom = () => {
    setError(null);
    start(async () => {
      const res = await createProblemCompetitionAction({
        title,
        problemIds: picked,
        durationMinutes: timed ? minutes : null,
        access,
        focusPolicy,
        focusAllowance,
      });
      if (!res.ok) return setError(res.error);
      router.push(`/compete/${res.data.code}`);
    });
  };

  if (!available) {
    return (
      <div className="p-s5">
        <p className="text-meta text-muted max-w-[58ch]">
          The problem tables are not in the database yet. Run{" "}
          <code className="font-mono">
            prisma/migrations/20260909_add_problem_competitions/migration.sql
          </code>{" "}
          in the Supabase SQL editor, then reload this page.
        </p>
      </div>
    );
  }

  const active = problems.filter((p) => p.active).length;

  return (
    <div className="theme-v2 h-full min-h-0 flex flex-col bg-bg">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="h-14 shrink-0 border-b border-line bg-surface px-s4 md:px-s5 flex items-center justify-between gap-s3">
        <div className="flex items-center gap-s3 min-w-0">
          <Link
            href="/compete"
            aria-label="Back to competitions"
            className="text-faint hover:text-ink transition-colors shrink-0 min-h-[44px] grid place-items-center -ml-s2 px-s2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-ui font-semibold text-ink truncate">Problems</h1>
          <span className="hidden sm:inline shrink-0 text-meta px-s2 py-0.5 rounded-full bg-bg-sunk text-muted font-medium">
            {active} live
          </span>
        </div>

        {mayWrite && (
          <div className="flex items-center gap-s2 shrink-0">
            <button
              onClick={() => setPane("paste")}
              className="hidden sm:inline-flex items-center min-h-[44px] px-s3 text-meta font-medium text-muted hover:text-ink hover:bg-bg-sunk rounded-md transition-colors"
            >
              Paste a paper
            </button>
            <button
              onClick={() => setPane("write")}
              className="min-h-[44px] px-s4 text-meta font-semibold rounded-md transition-colors inline-flex items-center gap-1.5"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Write one
            </button>
          </div>
        )}
      </header>

      {/* ── Two panels ──────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <List
          problems={problems}
          shown={shown}
          matching={matching}
          topics={topics}
          query={query}
          setQuery={(v) => {
            setQuery(v);
            setShownCount(60);
          }}
          topicFilter={topicFilter}
          setTopicFilter={(v) => {
            setTopicFilter(v);
            setShownCount(60);
          }}
          picked={picked}
          pickRandom={pickRandom}
          mayHost={mayHost}
          selectedId={selectedId}
          setSelectedId={(id) => {
            setSelectedId(id);
            setPane("detail");
          }}
          setShownCount={setShownCount}
          marks={marks}
          onSetUpRoom={() => setPane("room")}
          hiddenOnMobile={Boolean(selectedId) || pane !== "detail"}
        />

        <main
          className={`flex-1 min-w-0 bg-raised overflow-y-auto flex-col ${
            selectedId || pane !== "detail" ? "flex" : "hidden md:flex"
          }`}
        >
          {pane === "write" && mayWrite && (
            <Pane title="A new problem" onBack={() => setPane("detail")}>
              <ProblemEditor topics={topics} onDone={() => setPane("detail")} />
            </Pane>
          )}

          {pane === "paste" && mayWrite && (
            <Pane title="Paste a whole paper" onBack={() => setPane("detail")}>
              <BulkPaste kind="PROBLEMS" onDone={() => setPane("detail")} />
            </Pane>
          )}

          {pane === "edit" && editing && (
            <Pane title={`Editing ${shortId(editing.id ?? "")}`} onBack={() => setPane("detail")}>
              <ProblemEditor
                key={editing.id}
                initial={editing}
                topics={topics}
                onDone={() => {
                  setEditing(null);
                  setPane("detail");
                }}
              />
            </Pane>
          )}

          {pane === "room" && mayHost && (
            <Pane title="Open a room" onBack={() => setPane("detail")}>
              <RoomForm
                picked={picked}
                byId={byId}
                marks={marks}
                title={title}
                setTitle={setTitle}
                minutes={minutes}
                setMinutes={setMinutes}
                timed={timed}
                setTimed={setTimed}
                access={access}
                setAccess={setAccess}
                focusPolicy={focusPolicy}
                setFocusPolicy={setFocusPolicy}
                focusAllowance={focusAllowance}
                setFocusAllowance={setFocusAllowance}
                error={error}
                pending={pending}
                onOpen={openRoom}
                onClear={() => {
                  setPicked([]);
                  setPane("detail");
                }}
              />
            </Pane>
          )}

          {pane === "detail" &&
            (selected ? (
              <Detail
                summary={selected}
                draft={detail}
                loading={loadingDetail}
                error={detailError}
                picked={picked.includes(selected.id)}
                pickedAt={picked.indexOf(selected.id)}
                full={picked.length >= MAX_PROBLEMS}
                mayWrite={mayWrite}
                mayHost={mayHost}
                pending={pending}
                onBack={() => setSelectedId(null)}
                onToggle={() => toggle(selected.id)}
                onEdit={() => edit(selected.id)}
                onRetire={() => retire(selected.id, !selected.active)}
                onPractice={() => practice(selected.id, !selected.practiceOpen)}
              />
            ) : (
              <div className="flex-1 grid place-items-center p-s6">
                <p className="text-meta text-faint max-w-[36ch] text-center">
                  Choose a problem on the left to read it in full.
                </p>
              </div>
            ))}
        </main>
      </div>
    </div>
  );
}

/* ── The left panel ───────────────────────────────────────────────────── */

function List({
  problems, shown, matching, topics, query, setQuery, topicFilter, setTopicFilter,
  picked, pickRandom, mayHost, selectedId, setSelectedId,
  setShownCount, marks, onSetUpRoom, hiddenOnMobile,
}: {
  problems: ProblemSummary[];
  shown: ProblemSummary[];
  matching: ProblemSummary[];
  topics: string[];
  query: string;
  setQuery: (v: string) => void;
  topicFilter: string;
  setTopicFilter: (v: string) => void;
  picked: string[];
  pickRandom: (n: number) => void;
  mayHost: boolean;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  setShownCount: (fn: (n: number) => number) => void;
  marks: number;
  onSetUpRoom: () => void;
  hiddenOnMobile: boolean;
}) {
  const chip = (on: boolean) =>
    on
      ? { borderColor: "var(--accent)", background: "var(--accent-soft)", color: "var(--accent-strong)" }
      : { borderColor: "transparent", color: "var(--muted)" };

  return (
    <section
      className={`w-full md:w-[420px] lg:w-[460px] shrink-0 border-r border-line bg-surface flex-col min-h-0 ${
        hiddenOnMobile ? "hidden md:flex" : "flex"
      }`}
    >
      <div className="p-s3 border-b border-line flex flex-col gap-s3 shrink-0">
        <label className="relative block">
          <span className="sr-only">Search the bank</span>
          <svg
            className="w-4 h-4 absolute left-s3 top-1/2 -translate-y-1/2 text-faint pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or opening line"
            autoComplete="off"
            className="w-full min-h-[40px] pl-9 pr-s3 text-meta bg-bg-sunk border border-line rounded-md text-ink placeholder:text-faint focus:bg-raised focus:outline-none focus:border-accent transition-colors"
          />
        </label>

        <div className="flex items-center justify-between gap-s3">
          <div className="flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            <button
              onClick={() => setTopicFilter("")}
              aria-pressed={topicFilter === ""}
              className="shrink-0 min-h-[32px] px-s2 rounded border text-meta font-medium transition-colors"
              style={chip(topicFilter === "")}
            >
              All {problems.length}
            </button>
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setTopicFilter(topicFilter === t ? "" : t)}
                aria-pressed={topicFilter === t}
                className="shrink-0 min-h-[32px] px-s2 rounded border text-meta transition-colors whitespace-nowrap"
                style={chip(topicFilter === t)}
              >
                {t}
              </button>
            ))}
          </div>

          {mayHost && (
            <span className="shrink-0 text-meta text-faint whitespace-nowrap">
              Draw{" "}
              {[5, 10].map((n, i) => (
                <span key={n}>
                  {i > 0 && " · "}
                  <button
                    onClick={() => pickRandom(n)}
                    disabled={picked.length >= MAX_PROBLEMS}
                    className="text-muted hover:text-accent font-semibold disabled:opacity-40 transition-colors"
                  >
                    {n}
                  </button>
                </span>
              ))}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {shown.length === 0 ? (
          <p className="text-meta text-muted p-s4">
            {problems.length === 0
              ? "No problems yet. Write one — a paper of them is what a problem room needs before anything else here matters."
              : "Nothing matches that. Try fewer words, or clear the topic."}
          </p>
        ) : (
          <ul className="list-none m-0 p-0">
            {shown.map((p) => {
              const at = picked.indexOf(p.id);
              const on = selectedId === p.id;

              return (
                <li key={p.id}>
                  <button
                    onClick={() => setSelectedId(p.id)}
                    aria-current={on ? "true" : undefined}
                    className="w-full text-left p-s4 border-b border-line border-l-2 transition-colors"
                    style={{
                      borderLeftColor: on ? "var(--accent)" : "transparent",
                      background: on ? "var(--accent-soft)" : "transparent",
                      opacity: p.active ? 1 : 0.55,
                    }}
                  >
                    <span className="flex items-center justify-between gap-s2 mb-1.5">
                      <span className="font-mono text-label font-semibold text-muted">
                        {shortId(p.id)}
                      </span>
                      <span
                        className="text-label font-medium px-1.5 py-0.5 rounded shrink-0"
                        style={
                          at >= 0
                            ? { background: "var(--accent)", color: "var(--on-accent)" }
                            : { background: "var(--accent-soft)", color: "var(--accent-strong)" }
                        }
                      >
                        {at >= 0 ? `#${at + 1} in the set` : `${p.maxPoints} marks`}
                      </span>
                    </span>

                    <span className="block text-meta font-semibold text-ink leading-snug line-clamp-2">
                      {p.title}
                    </span>
                    <span className="block text-meta text-muted mt-1 line-clamp-2 leading-relaxed">
                      {p.preview}
                    </span>

                    <span className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-label text-faint">
                      <span className="uppercase font-semibold tracking-wider text-muted">
                        {p.topic}
                      </span>
                      <span aria-hidden>•</span>
                      <span>
                        {p.timesUsed === 0 ? "never set" : `set ${p.timesUsed}×`}
                      </span>
                      {p.timesPractised > 0 && (
                        <>
                          <span aria-hidden>•</span>
                          <span style={{ color: "var(--danger)" }}>
                            {p.timesPractised} solved it
                          </span>
                        </>
                      )}
                      {!p.active && (
                        <>
                          <span aria-hidden>•</span>
                          <span>retired</span>
                        </>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {matching.length > shown.length && (
          <button
            onClick={() => setShownCount((n) => n + 60)}
            className="w-full min-h-[48px] text-meta text-muted hover:text-ink transition-colors"
          >
            Show {Math.min(60, matching.length - shown.length)} more of{" "}
            {matching.length - shown.length}
          </button>
        )}
      </div>

      {mayHost && picked.length > 0 && (
        <div className="shrink-0 border-t border-line p-s3 flex items-center justify-between gap-s3 bg-bg-sunk">
          <span className="text-meta text-muted min-w-0 truncate">
            {picked.length} picked · {marks} marks
          </span>
          <button
            onClick={onSetUpRoom}
            className="shrink-0 min-h-[40px] px-s4 rounded-md text-meta font-semibold transition-colors"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            Open a room
          </button>
        </div>
      )}
    </section>
  );
}

/* ── The right panel ──────────────────────────────────────────────────── */

function Pane({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="h-12 shrink-0 border-b border-line px-s4 md:px-s5 flex items-center gap-s3">
        <button
          onClick={onBack}
          className="text-meta text-muted hover:text-ink transition-colors min-h-[44px] -ml-s2 px-s2"
        >
          ← Back
        </button>
        <span className="text-meta font-semibold text-ink truncate">{title}</span>
      </div>
      <div className="p-s4 md:p-s5 max-w-[760px] w-full">{children}</div>
    </>
  );
}

function Detail({
  summary, draft, loading, error, picked, pickedAt, full, mayWrite, mayHost,
  pending, onBack, onToggle, onEdit, onRetire, onPractice,
}: {
  summary: ProblemSummary;
  draft: Draft | null;
  loading: boolean;
  error: string | null;
  picked: boolean;
  pickedAt: number;
  full: boolean;
  mayWrite: boolean;
  mayHost: boolean;
  pending: boolean;
  onBack: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onRetire: () => void;
  onPractice: () => void;
}) {
  const pill = "text-label font-semibold px-s2 py-0.5 rounded border";

  return (
    <>
      <div className="min-h-12 shrink-0 border-b border-line px-s4 md:px-s5 py-s2 flex flex-wrap items-center justify-between gap-s2">
        <div className="flex items-center gap-s2 min-w-0">
          <button
            onClick={onBack}
            className="md:hidden text-meta text-muted hover:text-ink min-h-[44px] -ml-s2 px-s2"
          >
            ← Back
          </button>
          <span className="font-mono text-label font-bold text-muted bg-bg-sunk px-s2 py-0.5 rounded">
            {shortId(summary.id)}
          </span>
          <span className="text-label text-faint truncate">
            marked by {MODE_LABEL[summary.gradingMode] ?? "you"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {mayHost && (
            <button
              onClick={onToggle}
              disabled={!summary.active || (!picked && full)}
              className="min-h-[36px] px-s3 text-meta font-medium rounded transition-colors disabled:opacity-40"
              style={
                picked
                  ? { background: "var(--accent-soft)", color: "var(--accent-strong)" }
                  : { color: "var(--muted)" }
              }
            >
              {picked ? `#${pickedAt + 1} — take out` : "Add to the set"}
            </button>
          )}
          {mayWrite && (
            <>
              <button
                onClick={onEdit}
                disabled={pending}
                className="min-h-[36px] px-s3 text-meta font-medium text-muted hover:text-ink hover:bg-bg-sunk rounded transition-colors disabled:opacity-40"
              >
                Edit
              </button>
              <button
                onClick={onPractice}
                disabled={pending}
                title={
                  summary.practiceOpen
                    ? "Stop it being handed out for practice — for a problem you are saving for a paper"
                    : "Offer it for practice again"
                }
                className="min-h-[36px] px-s3 text-meta font-medium text-muted hover:text-ink hover:bg-bg-sunk rounded transition-colors disabled:opacity-40"
              >
                {summary.practiceOpen ? "Close practice" : "Open practice"}
              </button>
              <button
                onClick={onRetire}
                disabled={pending}
                className="min-h-[36px] px-s3 text-meta font-medium rounded transition-colors hover:bg-[var(--danger-soft)] disabled:opacity-40"
                style={{ color: "var(--danger)" }}
              >
                {summary.active ? "Retire" : "Restore"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-s4 md:p-s5 max-w-[760px] w-full flex flex-col gap-s4">
        <h2 className="text-h2 font-semibold text-ink tracking-tight leading-snug break-words">
          {summary.title}
        </h2>

        <div className="flex flex-wrap items-center gap-s2">
          <span
            className={pill}
            style={{ background: "var(--accent-soft)", color: "var(--accent-strong)", borderColor: "transparent" }}
          >
            {summary.topic}
          </span>
          <span
            className={pill}
            style={{ background: "var(--bg-sunk)", color: "var(--muted)", borderColor: "transparent" }}
          >
            {summary.maxPoints} marks
          </span>
          <span className={pill} style={{ color: "var(--faint)", borderColor: "var(--border)" }}>
            {KIND_LABEL[summary.answerKind] ?? "written"} answer
          </span>
          {!summary.practiceOpen && (
            <span className={pill} style={{ color: "var(--danger)", borderColor: "var(--border)" }}>
              closed to practice
            </span>
          )}
          {summary.gradingMode === "AI" && !summary.hasSolution && (
            <span className={pill} style={{ color: "var(--danger)", borderColor: "var(--border)" }}>
              no solution — the model has nothing to mark against
            </span>
          )}
        </div>

        {error && (
          <p className="text-meta" style={{ color: "var(--danger)" }}>
            {error}
          </p>
        )}

        {loading && !draft && (
          <div className="rounded-md bg-bg-sunk animate-pulse" style={{ height: "10rem" }} aria-hidden />
        )}

        {draft && (
          <>
            <div className="rounded-md bg-read-bg border border-line px-s3 py-s4 md:px-s5 md:py-s5">
              <Rich source={draft.statement} />
            </div>

            {draft.solution ? (
              <section className="rounded-md border border-line bg-bg-sunk p-s4 flex flex-col gap-s2">
                <h3 className="text-label uppercase text-faint">
                  The worked solution — what the model marks against
                </h3>
                <Rich source={draft.solution} size="compact" />
              </section>
            ) : (
              <p className="text-meta text-faint">No worked solution written.</p>
            )}

            {(draft.numericValue || draft.acceptedAnswers) && (
              <p className="text-meta text-muted">
                <span className="text-label uppercase text-faint">Key · </span>
                {draft.numericValue
                  ? `${draft.numericValue}${draft.numericTolerance !== "0" ? ` ± ${draft.numericTolerance}` : ""}`
                  : draft.acceptedAnswers}
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}

function RoomForm({
  picked, byId, marks, title, setTitle, minutes, setMinutes, timed, setTimed,
  access, setAccess, focusPolicy, setFocusPolicy, focusAllowance, setFocusAllowance,
  error, pending, onOpen, onClear,
}: {
  picked: string[];
  byId: Map<string, ProblemSummary>;
  marks: number;
  title: string;
  setTitle: (v: string) => void;
  minutes: number;
  setMinutes: (n: number) => void;
  timed: boolean;
  setTimed: (fn: (v: boolean) => boolean) => void;
  access: "OPEN" | "LINK";
  setAccess: (v: "OPEN" | "LINK") => void;
  focusPolicy: FocusPolicy;
  setFocusPolicy: (p: FocusPolicy) => void;
  focusAllowance: number;
  setFocusAllowance: (n: number) => void;
  error: string | null;
  pending: boolean;
  onOpen: () => void;
  onClear: () => void;
}) {
  if (picked.length === 0) {
    return <p className="text-meta text-muted">Nothing is picked yet.</p>;
  }

  return (
    <div className="flex flex-col gap-s4">
      <span className="text-label uppercase text-faint">
        {picked.length} {picked.length === 1 ? "problem" : "problems"} · {marks} marks · in this
        order
      </span>

      <ol className="list-decimal pl-s5 text-meta text-muted flex flex-col gap-1">
        {picked.map((id) => (
          <li key={id} className="break-words">
            {byId.get(id)?.title ?? "Problem"} · {byId.get(id)?.maxPoints ?? 0}
          </li>
        ))}
      </ol>

      <label className="flex flex-col gap-s2">
        <span className="text-label uppercase text-faint">Name</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          placeholder="Round one — micro"
          className="bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink placeholder:text-faint min-h-[44px]"
        />
      </label>

      <div className="grid sm:grid-cols-2 gap-s4">
        <label className="flex flex-col gap-s2">
          <span className="text-label uppercase text-faint">Who can join</span>
          <select
            value={access}
            onChange={(e) => setAccess(e.target.value === "LINK" ? "LINK" : "OPEN")}
            className="bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink min-h-[44px]"
          >
            <option value="OPEN">Anyone — listed here</option>
            <option value="LINK">Only people with the code</option>
          </select>
        </label>

        <label className="flex flex-col gap-s2">
          <span className="text-label uppercase text-faint">
            {timed ? `Time · ${minutes} minutes for the whole set` : "No clock"}
          </span>
          <input
            type="range"
            min={MIN_MINUTES}
            max={MAX_MINUTES}
            step={5}
            value={minutes}
            disabled={!timed}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="min-h-[44px] accent-[var(--accent)] disabled:opacity-40"
          />
          <button
            type="button"
            onClick={() => setTimed((v) => !v)}
            className="text-meta text-accent hover:text-accent-strong text-left min-h-[24px]"
          >
            {timed ? "Take the clock off — I will close it myself" : "Put a clock on it"}
          </button>
        </label>
      </div>

      <FocusChoice
        policy={focusPolicy}
        setPolicy={setFocusPolicy}
        allowance={focusAllowance}
        setAllowance={setFocusAllowance}
      />

      {error && (
        <p className="text-meta" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-s3">
        <button
          onClick={onOpen}
          disabled={pending}
          className="inline-flex items-center min-h-[48px] px-s5 rounded-md text-ui font-semibold transition-colors disabled:opacity-60"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        >
          {pending ? "Opening…" : "Open it"}
        </button>
        <button
          onClick={onClear}
          className="inline-flex items-center min-h-[48px] px-s5 rounded-md border border-line text-ui text-muted hover:text-ink transition-colors"
        >
          Clear the set
        </button>
      </div>
    </div>
  );
}
