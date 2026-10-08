import Link from "next/link";
import type { RoomRow } from "@/components/compete/RoomCards";

/**
 * The rooms you sat, and what they came to.
 *
 * Three figures above the list because one mark on its own says nothing — a
 * 13 is good or bad depending on the paper, and the only comparison a student
 * has is their own other rooms. The bar on each row is against their best, for
 * the same reason.
 */

export interface PlayedRow extends RoomRow {
  myScore: number;
  myFinished: boolean;
  myDisqualified: boolean;
}

function Tile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-line rounded-lg px-s4 py-s3 flex items-center gap-s3 min-w-0">
      <span
        className="w-9 h-9 rounded-lg grid place-items-center shrink-0"
        style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}
        aria-hidden
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-meta text-muted leading-tight">{label}</span>
        <b className="block text-h3 font-bold text-ink leading-tight tabular">{value}</b>
      </span>
    </div>
  );
}

const svg = (d: string) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

export function PlayedResults({ rows }: { rows: PlayedRow[] }) {
  if (rows.length === 0) return null;

  const ended = rows.filter((r) => r.status === "ENDED" && !r.myDisqualified);
  const total = ended.reduce((n, r) => n + r.myScore, 0);
  const best = ended.reduce((n, r) => Math.max(n, r.myScore), 0);
  const average = ended.length ? (total / ended.length).toFixed(1) : "—";

  return (
    <div className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
      <div className="grid grid-cols-3 gap-s3 p-s4 bg-bg-sunk border-b border-line">
        <Tile label="Total marks" value={total} icon={svg("M5 20V10M12 20V4M19 20v-7")} />
        <Tile label="Best room" value={best} icon={svg("M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z")} />
        <Tile label="Average" value={average} icon={svg("M3 12h4l3-8 4 16 3-8h4")} />
      </div>

      <ul className="list-none m-0 p-0">
        {rows.map((r) => {
          const isBest = best > 0 && r.myScore === best && r.status === "ENDED" && !r.myDisqualified;

          return (
            <li key={r.code}>
              <Link
                href={`/compete/${r.code}`}
                className="grid grid-cols-[36px_minmax(0,1fr)_auto] sm:grid-cols-[36px_minmax(0,1fr)_84px_120px_auto] gap-s4 items-center px-s4 py-s3 border-b border-line last:border-b-0 transition-colors hover:bg-bg-sunk"
                style={isBest ? { background: "var(--accent-soft)" } : undefined}
              >
                <span
                  className="w-9 h-9 rounded-lg grid place-items-center font-bold text-meta shrink-0"
                  style={
                    isBest
                      ? { background: "var(--accent)", color: "var(--on-accent)" }
                      : { background: "var(--bg-sunk)", color: "var(--accent-strong)" }
                  }
                  aria-hidden
                >
                  {r.title.trim()[0]?.toUpperCase() ?? "?"}
                </span>

                <span className="min-w-0">
                  <b className="block text-ui font-semibold text-ink leading-snug break-words">
                    {r.title}
                    {isBest && (
                      <span
                        className="text-label font-semibold rounded px-1.5 py-[1px] ml-s2 align-middle"
                        style={{ background: "var(--accent)", color: "var(--on-accent)" }}
                      >
                        Best
                      </span>
                    )}
                  </b>
                  <small className="block text-meta text-muted truncate">
                    {r.hostName || "Anonymous"}
                    {r.myDisqualified
                      ? " · disqualified"
                      : r.status === "ENDED"
                        ? ""
                        : r.myFinished
                          ? " · submitted, still open"
                          : " · still open"}
                  </small>
                </span>

                <span className="hidden sm:block text-meta text-muted rounded-full border border-line px-s3 py-0.5 justify-self-start whitespace-nowrap">
                  {r.questionCount} {r.format === "PROBLEMS" ? "problems" : "questions"}
                </span>

                <span className="hidden sm:block h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-sunk)" }}>
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: best > 0 ? `${Math.round((r.myScore / best) * 100)}%` : "0%",
                      background: isBest ? "var(--accent)" : "var(--border-strong)",
                    }}
                  />
                </span>

                {/* Only once the room has ended: a mark shown while others are
                    still writing is a mark shown to the room. */}
                <span
                  className="text-right font-bold text-ui tabular shrink-0"
                  style={{
                    color: r.myDisqualified
                      ? "var(--danger)"
                      : isBest
                        ? "var(--accent)"
                        : "var(--text)",
                    textDecoration: r.myDisqualified ? "line-through" : undefined,
                  }}
                >
                  {r.status === "ENDED" ? r.myScore : r.myFinished ? "sent" : "open"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
