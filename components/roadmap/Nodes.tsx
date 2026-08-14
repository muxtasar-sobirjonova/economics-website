import React from "react";

/** Node geometry is shared so the connecting path can meet the circles exactly. */
export const NODE_R = 30;

type NodeProps = {
  x: number;
  y: number;
  line1: string;
  line2: string;
  onClick?: () => void;
};

const Label = ({ line1, line2, tone }: { line1: string; line2: string; tone: string }) => (
  <text
    y={NODE_R + 22}
    fontSize="12.5"
    fill={tone}
    textAnchor="middle"
    style={{ fontFamily: "var(--font-literata), Georgia, serif" }}
  >
    <tspan x="0" dy="0">{line1}</tspan>
    {line2 ? <tspan x="0" dy="15">{line2}</tspan> : null}
  </text>
);

/** Bare ground — the day exists but is not reachable yet. */
export const LockedNode = ({ x, y, line1, line2 }: NodeProps) => (
  <g transform={`translate(${x}, ${y})`} aria-label={`${line1} ${line2}: locked`}>
    <circle r={NODE_R} fill="var(--ground)" stroke="var(--ground-edge)" strokeWidth="1.5" />
    <rect x="-7" y="-3" width="14" height="11" rx="2" fill="var(--faint)" />
    <path d="M-3.5,-3 v-3.5 a3.5,3.5 0 0,1 7,0 v3.5" fill="none" stroke="var(--faint)" strokeWidth="1.8" />
    <Label line1={line1} line2={line2} tone="var(--faint)" />
  </g>
);

/** A foundation with dashed intent — this is where you are. */
export const ActiveNode = ({ x, y, line1, line2, onClick }: NodeProps) => (
  <g
    transform={`translate(${x}, ${y})`}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.();
      }
    }}
    role="button"
    tabIndex={0}
    aria-label={`${line1} ${line2}: ready to start`}
    className="cursor-pointer focus:outline-none"
  >
    <circle
      r={NODE_R + 10}
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.5"
      opacity="0.5"
      className="animate-ringpulse"
      style={{ transformOrigin: "center" }}
    />
    <circle r={NODE_R} fill="var(--accent)" />
    <path
      d="M-5,-7 L7,0 L-5,7 Z"
      fill="var(--on-accent)"
      strokeLinejoin="round"
    />
    <Label line1={line1} line2={line2} tone="var(--text)" />
  </g>
);

/** A completed day carries a volume. */
export const CompletedNode = ({ x, y, line1, line2, onClick }: NodeProps) => (
  <g
    transform={`translate(${x}, ${y})`}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.();
      }
    }}
    role="button"
    tabIndex={0}
    aria-label={`${line1} ${line2}: completed`}
    className="cursor-pointer focus:outline-none"
  >
    <circle r={NODE_R} fill="var(--success)" />
    <polyline
      points="-9,-1 -3,5 9,-7"
      fill="none"
      stroke="#fff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Label line1={line1} line2={line2} tone="var(--muted)" />
  </g>
);
