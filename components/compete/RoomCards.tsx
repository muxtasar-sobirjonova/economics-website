import Link from "next/link";

/**
 * The rooms you can walk into.
 *
 * A card rather than a list row: a room is a thing you decide to enter, and
 * the three facts that decide it — who is hosting, how long it is, whether it
 * has started without you — do not fit on one line at a readable size.
 */

export interface RoomRow {
  code: string;
  title: string;
  status: "LOBBY" | "RUNNING" | "ENDED";
  format: "QUIZ" | "PROBLEMS";
  questionCount: number;
  hostName: string | null;
  players: number;
}

function Icon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2.2} strokeLinecap="round" aria-hidden className="shrink-0">
      <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

export function RoomCards({ rooms, empty }: { rooms: RoomRow[]; empty: string }) {
  if (rooms.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line p-s6 text-center text-meta text-muted">
        {empty}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-s4">
      {rooms.map((r) => {
        const open = r.status === "LOBBY";
        const live = r.status !== "ENDED";

        return (
          <div
            key={r.code}
            className="rounded-xl border border-line bg-surface shadow-sh1 p-s4 flex flex-col gap-s4"
            style={{ opacity: live ? 1 : 0.7 }}
          >
            <div className="flex items-center gap-s3 min-w-0">
              <span
                className="w-10 h-10 rounded-lg grid place-items-center font-bold text-h3 shrink-0"
                style={{
                  background: live ? "var(--accent-soft)" : "var(--bg-sunk)",
                  color: live ? "var(--accent-strong)" : "var(--muted)",
                }}
                aria-hidden
              >
                {r.title.trim()[0]?.toUpperCase() ?? "?"}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-ui font-semibold text-ink leading-snug break-words">
                  {r.title}
                </span>
                <small className="block text-meta text-muted truncate">
                  Hosted by {r.hostName || "Anonymous"}
                </small>
              </span>

              <span
                className="inline-flex items-center gap-s2 text-label font-semibold rounded-full px-s3 py-0.5 shrink-0"
                style={
                  open
                    ? { background: "var(--success-soft)", color: "var(--success)" }
                    : { background: "var(--bg-sunk)", color: "var(--muted)" }
                }
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${open ? "animate-pulse" : ""}`}
                  style={{ background: "currentColor" }}
                  aria-hidden
                />
                {open ? "Open" : r.status === "RUNNING" ? "Started" : "Finished"}
              </span>
            </div>

            <div className="flex items-center gap-s4 pt-s3 border-t border-line text-meta text-muted">
              <span className="inline-flex items-center gap-s2 whitespace-nowrap">
                <Icon />
                {r.questionCount} {r.format === "PROBLEMS" ? "problems" : "questions"}
              </span>
              <span className="whitespace-nowrap">
                {r.players} {r.players === 1 ? "player" : "players"}
              </span>

              <Link
                href={`/compete/${r.code}`}
                className="ml-auto inline-flex items-center min-h-[44px] px-s4 rounded-lg text-meta font-semibold transition-colors"
                style={
                  open
                    ? { background: "var(--accent)", color: "var(--on-accent)" }
                    : { border: "1px solid var(--border)", color: "var(--accent-strong)" }
                }
              >
                {open ? "Join" : "Open"}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
