/**
 * A quiet signature at the foot of the sidebar, in the isometric language the
 * roadmap, the podium and the faculty quarter all speak. It is drawn at a few
 * percent white so it reads as an emboss on the panel rather than a picture —
 * decoration that belongs to this site and claims to be nothing else.
 */
const W = 13;
const D = Math.round(W * 0.571);
const BLOCKS = [
  { x: 22, h: 20 },
  { x: 54, h: 34 },
  { x: 86, h: 14 },
  { x: 118, h: 44 },
  { x: 150, h: 26 },
  { x: 182, h: 17 },
];

export function SidebarSkyline() {
  const base = 58;

  return (
    <svg
      viewBox="0 0 204 76"
      className="w-full h-auto block"
      aria-hidden
      focusable="false"
    >
      <line x1="4" y1={base + D + 2} x2="200" y2={base + D + 2} stroke="rgba(255,255,255,.10)" strokeWidth="1" />
      {BLOCKS.map((b) => (
        <g key={b.x} transform={`translate(${b.x}, ${base})`}>
          <polygon points={`${-W},${-b.h} 0,${-b.h + D} 0,${D} ${-W},0`} fill="rgba(255,255,255,.06)" />
          <polygon points={`0,${-b.h + D} ${W},${-b.h} ${W},0 0,${D}`} fill="rgba(255,255,255,.10)" />
          <polygon points={`0,${-b.h - D} ${W},${-b.h} 0,${-b.h + D} ${-W},${-b.h}`} fill="rgba(255,255,255,.17)" />
        </g>
      ))}
    </svg>
  );
}
