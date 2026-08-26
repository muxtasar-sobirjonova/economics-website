import React from "react";

/**
 * The duel as two buildings.
 *
 * Every other page in this site says what it means in isometric blocks — the
 * roadmap, the podium, the sidebar. A duel is two people building the same
 * thing side by side, so it draws as two towers, one floor per correct answer.
 *
 * Only ever shown once both scores are known. During play your own score is
 * deliberately unknown to you, so there would be nothing honest to draw.
 */

const W = 34;
const D = Math.round(W * 0.571);
const FLOOR = 13;
const BASE_Y = 168;

function Tower({
  x,
  score,
  total,
  tone,
  name,
  won,
}: {
  x: number;
  score: number;
  total: number;
  tone: string;
  name: string;
  won: boolean;
}) {
  // A zero score still gets a plot, or the loser simply vanishes.
  const height = Math.max(score, 0) * FLOOR;
  const top = BASE_Y - height;

  return (
    <g transform={`translate(${x}, 0)`}>
      {/* Ground */}
      <polygon
        points={`0,${BASE_Y - D} ${W + 16},${BASE_Y} 0,${BASE_Y + D} ${-W - 16},${BASE_Y}`}
        fill="var(--ground)"
        stroke="var(--ground-edge)"
        strokeWidth="1"
      />

      {height > 0 && (
        <>
          <polygon points={`${-W},${top + D} 0,${top + 2 * D} 0,${BASE_Y + D} ${-W},${BASE_Y}`} fill={tone} opacity=".62" />
          <polygon points={`0,${top + 2 * D} ${W},${top + D} ${W},${BASE_Y} 0,${BASE_Y + D}`} fill={tone} opacity=".85" />
          <polygon points={`0,${top} ${W},${top + D} 0,${top + 2 * D} ${-W},${top + D}`} fill={tone} />

          {/* One line per correct answer, so the score is countable. */}
          {Array.from({ length: Math.max(0, score - 1) }, (_, i) => {
            const y = BASE_Y - (i + 1) * FLOOR;
            return (
              <polyline
                key={i}
                points={`${-W},${y} 0,${y + D} ${W},${y}`}
                fill="none"
                stroke="var(--surface)"
                strokeWidth="1"
                opacity=".45"
              />
            );
          })}
        </>
      )}

      <text
        x="0"
        y={top - 14}
        textAnchor="middle"
        className="font-mono"
        fontSize="22"
        fontWeight="600"
        fill={won ? tone : "var(--muted)"}
      >
        {score}
      </text>

      <text x="0" y={BASE_Y + 36} textAnchor="middle" fontSize="12" fill="var(--text)">
        {name.length > 16 ? name.slice(0, 15) + "…" : name}
      </text>
      <title>{`${name}: ${score} of ${total}`}</title>
    </g>
  );
}

export function DuelTowers({
  yourScore,
  theirScore,
  total,
  opponentName,
}: {
  yourScore: number;
  theirScore: number;
  total: number;
  opponentName: string;
}) {
  return (
    <svg viewBox="0 0 300 222" className="w-full max-w-[320px] mx-auto h-auto block" role="img"
      aria-label={`You scored ${yourScore} of ${total}, ${opponentName} scored ${theirScore}`}>
      <Tower
        x={82}
        score={yourScore}
        total={total}
        tone="var(--accent)"
        name="You"
        won={yourScore >= theirScore}
      />
      <Tower
        x={218}
        score={theirScore}
        total={total}
        tone="var(--muted)"
        name={opponentName}
        won={theirScore >= yourScore}
      />
    </svg>
  );
}
