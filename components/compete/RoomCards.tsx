import Link from "next/link";

/**
 * The rooms you can walk into.
 *
 * A card rather than a list row: a room is a thing you decide to enter, and
 * the facts that decide it — who is hosting, how long it is, how many people
 * are already in, whether it started without you — do not fit on one line at a
 * readable size.
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

/**
 * Up to three overlapping discs, then the count.
 *
 * Blank discs rather than initials: the room list carries how many people have
 * joined and not who they are, and inventing a letter for each would be
 * inventing a person.
 */
function Faces({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-s2 whitespace-nowrap">
      <span className="flex" aria-hidden>
        {Array.from({ length: Math.min(3, n) }, (_, i) => (
          <span
            key={i}
            className="w-[26px] h-[26px] rounded-full border-2 border-white -ml-2 first:ml-0"
            style={{ background: "var(--accent-soft)" }}
          />
        ))}
      </span>
      {n} joined
    </span>
  );
}

export function RoomCards({ rooms, empty }: { rooms: RoomRow[]; empty: string }) {
  if (rooms.length === 0) {
    return (
      <div className="border border-line rounded-lg bg-surface py-s7 px-s5 text-center text-meta text-muted">
        <b className="block text-ui text-ink mb-s1">No open rooms</b>
        {empty}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-s4">
      {rooms.map((r) => {
        const open = r.status === "LOBBY";

        return (
          <div
            key={r.code}
            className="rounded-lg border border-line p-s5 flex flex-col gap-s4 min-h-[178px]"
            style={{ background: open ? "var(--surface)" : "var(--bg-sunk)" }}
          >
            <div className="flex items-center gap-s3 min-w-0">
              <span
                className="w-10 h-10 rounded-md grid place-items-center font-reading font-semibold text-h3 shrink-0"
                style={{
                  background: open ? "var(--accent-soft)" : "var(--surface)",
                  color: open ? "var(--accent-strong)" : "var(--muted)",
                }}
                aria-hidden
              >
                {r.title.trim()[0]?.toUpperCase() ?? "?"}
              </span>

              <span className="min-w-0 flex-1">
                <h3 className="font-reading text-h3 font-semibold leading-snug text-ink break-words">
                  {r.title}
                </h3>
                <small className="block text-meta text-muted truncate">
                  Hosted by {r.hostName || "Anonymous"}
                </small>
              </span>

              <span
                className="text-label font-semibold rounded-sm px-s2 py-1 shrink-0 whitespace-nowrap"
                style={
                  open
                    ? { background: "var(--success-soft)", color: "var(--success)" }
                    : { background: "var(--surface)", color: "var(--muted)", border: "1px dashed var(--border-strong)" }
                }
              >
                {open ? "Open" : r.status === "RUNNING" ? "Started" : "Finished"}
              </span>
            </div>

            <div className="flex items-center gap-s4 mt-auto pt-s4 border-t border-line text-meta text-muted">
              <span className="whitespace-nowrap">
                {r.questionCount} {r.format === "PROBLEMS" ? "problems" : "questions"}
              </span>

              {open ? <Faces n={r.players} /> : <span>In progress</span>}

              {open ? (
                <Link
                  href={`/compete/${r.code}`}
                  className="ml-auto inline-flex items-center min-h-[44px] px-s4 rounded-md text-meta font-semibold transition-colors"
                  style={{ background: "var(--accent)", color: "var(--on-accent)" }}
                >
                  Join
                </Link>
              ) : (
                <Link
                  href={`/compete/${r.code}`}
                  className="ml-auto inline-flex items-center min-h-[44px] px-s4 rounded-md border border-line bg-surface text-meta font-semibold transition-colors"
                  style={{ color: "var(--muted)" }}
                >
                  Closed
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
