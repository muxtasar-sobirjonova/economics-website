"use client";

/**
 * Where you are in a paper.
 *
 * Shared by the written paper and the multiple choice exam, because a student
 * who has sat one should not have to learn the other. Four states, in the
 * order they override one another: where you are, answered, looked at, not yet
 * opened. A flag sits on top of any of them — it is a note about a question
 * rather than a state of it.
 */

export interface NavTile {
  id: string;
  answered: boolean;
  flagged: boolean;
}

export function Navigator({
  tiles,
  index,
  seen,
  onGo,
  noun = "Question",
}: {
  tiles: NavTile[];
  index: number;
  /** Ids that have been on screen. Client state — see the play screens. */
  seen: Set<string>;
  onGo: (index: number) => void;
  noun?: string;
}) {
  return (
    <>
      <div className="flex gap-s2 mt-s2 flex-wrap">
        {tiles.map((t, i) => {
          const here = i === index;
          const viewed = seen.has(t.id);

          const face = here
            ? { background: "var(--accent)", color: "var(--on-accent)", borderColor: "var(--accent)" }
            : t.answered
              ? { background: "var(--success-soft)", color: "var(--success)", borderColor: "var(--success)" }
              : viewed
                ? { background: "var(--raised)", color: "var(--text)", borderColor: "var(--border-strong)" }
                : { background: "var(--raised)", color: "var(--faint)", borderColor: "var(--border)" };

          return (
            <button
              key={t.id}
              onClick={() => onGo(i)}
              aria-label={`${noun} ${i + 1}${
                t.answered ? ", answered" : viewed ? ", seen" : ", not opened"
              }${t.flagged ? ", marked for review" : ""}`}
              aria-current={here ? "true" : undefined}
              className="relative w-11 h-11 rounded-md border font-mono text-meta transition-colors"
              style={{ ...face, fontWeight: here || t.answered ? 600 : 400 }}
            >
              {i + 1}
              {t.flagged && (
                <span
                  aria-hidden
                  className="absolute top-[3px] right-[3px] w-[7px] h-[7px] rounded-full"
                  style={{ background: "var(--reward)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      <p className="text-label uppercase text-faint mt-s2">
        <Key tone="var(--success)" /> answered · <Key tone="var(--border-strong)" /> seen ·{" "}
        <Key tone="var(--reward)" /> marked
      </p>
    </>
  );
}

/** One swatch in the legend. */
function Key({ tone }: { tone: string }) {
  return (
    <span
      aria-hidden
      className="inline-block w-[9px] h-[9px] rounded-sm align-middle"
      style={{ background: tone }}
    />
  );
}
