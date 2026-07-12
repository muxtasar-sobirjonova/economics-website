import React from "react";

export const LockedNode = ({
  x,
  y,
  line1,
  line2,
}: {
  x: number;
  y: number;
  line1: string;
  line2: string;
}) => (
  <g transform={`translate(${x}, ${y})`} className="opacity-80">
    <circle r="32" fill="#ececf5" stroke="#d4d4e8" strokeWidth="1.5" />
    <rect x="-8" y="-4" width="16" height="12" rx="2" fill="#9ca3af" />
    <path
      d="M-4,-4 v-4 a4,4 0 0,1 8,0 v4"
      fill="none"
      stroke="#9ca3af"
      strokeWidth="2"
    />
    <text y="54" fontSize="13" fill="#475569" fontWeight="500" textAnchor="middle">
      <tspan x="0" dy="0">
        {line1}
      </tspan>
      <tspan x="0" dy="16">
        {line2}
      </tspan>
    </text>
  </g>
);

export const ActiveNode = ({
  x,
  y,
  line1,
  line2,
  onClick,
}: {
  x: number;
  y: number;
  line1: string;
  line2: string;
  onClick: () => void;
}) => (
  <g
    transform={`translate(${x}, ${y})`}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
    role="button"
    tabIndex={0}
    aria-label={`${line1} ${line2}: Unlocked and active`}
    className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-4 focus:ring-indigo-300 rounded-full"
  >
    <circle
      r="46"
      fill="none"
      stroke="#C7D2FE"
      strokeWidth="2.5"
      strokeDasharray="6 4"
      style={{ animation: "dashspin 2s linear infinite" }}
    />
    <circle r="36" fill="#6366F1" />
    <path
      d="M-12,8 L-16,-6 L-6,-2 L0,-10 L6,-2 L16,-6 L12,8 Z"
      fill="white"
      stroke="white"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <g transform="translate(0, -60)">
      <rect
        x="-56"
        y="-14"
        width="112"
        height="26"
        rx="12"
        fill="white"
        stroke="#C7D2FE"
        strokeWidth="1"
      />
      <text y="4" fontSize="11" fill="#6366F1" fontWeight="500" textAnchor="middle">
        Start reading
      </text>
    </g>
    <text y="54" fontSize="13" fill="#475569" fontWeight="500" textAnchor="middle">
      <tspan x="0" dy="0">
        {line1}
      </tspan>
      <tspan x="0" dy="16">
        {line2}
      </tspan>
    </text>
  </g>
);

export const CompletedNode = ({
  x,
  y,
  line1,
  line2,
  onClick,
}: {
  x: number;
  y: number;
  line1: string;
  line2: string;
  onClick: () => void;
}) => (
  <g
    transform={`translate(${x}, ${y})`}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
    role="button"
    tabIndex={0}
    aria-label={`${line1} ${line2}: Completed`}
    className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-4 focus:ring-green-300 rounded-full"
  >
    <circle r="36" fill="#22c55e" />
    <polyline
      points="-10,-2 -2,6 10,-8"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text y="54" fontSize="13" fill="#475569" fontWeight="500" textAnchor="middle">
      <tspan x="0" dy="0">
        {line1}
      </tspan>
      <tspan x="0" dy="16">
        {line2}
      </tspan>
    </text>
  </g>
);
