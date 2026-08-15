"use client";

import React from "react";

export interface LeaderboardUser {
  id: string;
  username: string | null;
  profileImage: string | null;
  lessonsCompleted: number;
  totalXP: number;
  rank: number;
}

interface LeaderboardRowProps {
  user: LeaderboardUser;
  isCurrentUser: boolean;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ user, isCurrentUser }) => {
  
  // Format rank to always be two digits (e.g. 04)
  
  // Pseudo-random progress based on XP for visual effect matching the design

  return (
    <div
      className={`grid grid-cols-[3rem_1fr_auto_auto] gap-s3 items-center px-s4 py-s3 border-t border-line ${
        isCurrentUser ? "bg-accent-soft" : ""
      }`}
    >
      <span className={`font-mono text-meta tabular ${isCurrentUser ? "text-accent-strong" : "text-faint"}`}>
        {String(user.rank).padStart(2, "0")}
      </span>

      <span className="flex items-center gap-s3 min-w-0">
        <span className="w-8 h-8 rounded-full grid place-items-center shrink-0 bg-bg-sunk text-muted font-semibold text-meta">
          {(user.username || "?").charAt(0).toUpperCase()}
        </span>
        <span className={`text-ui truncate pb-[2px] ${isCurrentUser ? "text-accent-strong font-semibold" : "text-ink"}`}>
          {isCurrentUser ? "You" : user.username || "Anonymous"}
        </span>
      </span>

      <span className="font-mono text-meta text-muted tabular text-right">{user.lessonsCompleted}</span>
      <span className="font-mono text-meta text-ink tabular text-right">{user.totalXP.toLocaleString()}</span>
    </div>
  );
}
