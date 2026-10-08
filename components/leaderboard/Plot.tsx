/**
 * A plot of land with something built on it.
 *
 * The podium is three plots, not three medals: the board ranks people by what
 * they have built, so the tallest block belongs to whoever built most. Drawn
 * as flat polygons rather than an image, so it carries its own colour and
 * costs nothing to load.
 */

type Metal = "gold" | "silver" | "bronze";

const MED: Record<Metal, { top: string; left: string; right: string; plot: string; field: string }> = {
  gold:   { top: "#fbebb8", left: "#efcd6e", right: "#c99b3e", plot: "#d9b45c", field: "#fffaf0" },
  silver: { top: "#e9ecf6", left: "#d0d5e6", right: "#a9aec6", plot: "#bcc1d7", field: "#f8f9fc" },
  bronze: { top: "#f9e2d1", left: "#efc3a5", right: "#cf966b", plot: "#d9b9a2", field: "#fdf6f0" },
};

const pts = (a: [number, number][]) => a.map(([x, y]) => `${x},${y}`).join(" ");

export function Plot({ metal, height }: { metal: Metal; height: number }) {
  const c = MED[metal];
  const x = 90;
  const y = 172;
  const sx = 36;
  const sy = 18;
  const h = height;
  const flag = "#d9a13a";

  return (
    <svg viewBox="0 0 180 216" aria-hidden className="w-[min(210px,100%)] h-auto block">
      {metal === "gold" && (
        <ellipse cx="90" cy="172" rx="104" ry="58" fill="#f3d27a" opacity=".28" />
      )}

      {/* The shadow the block throws across its own plot. */}
      <polygon points={pts([[x + 10, y + 40], [x + 108, y + 8], [x + 84, y + 40]])} fill="#1f1b3a" opacity=".07" />

      {/* The plot. */}
      <polygon
        points={pts([[x - 85, y], [x, y - 42], [x + 85, y], [x, y + 42]])}
        fill={c.field}
        stroke={c.plot}
        strokeWidth="1.5"
      />

      {/* Two walls and a roof. */}
      <polygon points={pts([[x - sx, y - h], [x, y + sy - h], [x, y + sy], [x - sx, y]])} fill={c.left} />
      <polygon points={pts([[x, y + sy - h], [x + sx, y - h], [x + sx, y], [x, y + sy]])} fill={c.right} />
      <polygon points={pts([[x - sx, y - h], [x, y - sy - h], [x + sx, y - h], [x, y + sy - h]])} fill={c.top} />

      {/* Two pennants on the roof. */}
      <polygon points={pts([[x - 27, y - h + 14], [x - 18, y - h + 19], [x - 18, y - h + 29], [x - 27, y - h + 24]])} fill={flag} opacity=".85" />
      <polygon points={pts([[x + 18, y - h + 19], [x + 27, y - h + 14], [x + 27, y - h + 24], [x + 18, y - h + 29]])} fill={flag} opacity=".6" />
    </svg>
  );
}

export const BADGE: Record<Metal, { bg: string; edge: string; ink: string }> = {
  gold:   { bg: "#fbebb8", edge: "#d9b45c", ink: "#7a5a12" },
  silver: { bg: "#eceef6", edge: "#bcc1d7", ink: "#5b6075" },
  bronze: { bg: "#f9e2d1", edge: "#d9a57f", ink: "#7a4a2a" },
};

export type { Metal };
