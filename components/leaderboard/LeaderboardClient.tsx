"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LeaderboardRow, LeaderboardUser } from "./LeaderboardRow";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LeaderboardClientProps {
  currentUserId: string;
}

export const LeaderboardClient: React.FC<LeaderboardClientProps> = ({ currentUserId }) => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [myRankInfo, setMyRankInfo] = useState<{rank: number | null, lessonsCompleted: number, totalXP: number, totalUsers: number} | null>(null);
  const [timeLeft, setTimeLeft] = useState<{h: number, m: number, s: number} | null>(null);

  const fetchLeaderboard = useCallback(async (currentPage: number, query: string) => {
    try {
      const endpoint = query 
        ? `/api/leaderboard/search?q=${encodeURIComponent(query)}` 
        : `/api/leaderboard?page=${currentPage}&limit=20`;
      
      const res = await fetch(endpoint);
      const data = await res.json();
      
      if (data.success) {
        setUsers(data.data);
        if (data.pagination) setPagination(data.pagination);
        setError(null);
      } else {
        setError(data.error || "Failed to load leaderboard");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyRank = useCallback(async () => {
    try {
      const res = await fetch("/api/leaderboard/me");
      const data = await res.json();
      if (data.success) {
        setMyRankInfo(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch personal rank", err);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    setLoading(true);
    fetchLeaderboard(page, searchQuery);
    fetchMyRank();

    const intervalId = setInterval(() => {
      fetchLeaderboard(page, searchQuery);
      fetchMyRank();
    }, 60000); // 60s polling

    return () => clearInterval(intervalId);
  }, [page, searchQuery, fetchLeaderboard, fetchMyRank]);

  // Countdown timer for next 12-hour update
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextUpdate = new Date(now);
      nextUpdate.setUTCMilliseconds(0);
      nextUpdate.setUTCSeconds(0);
      nextUpdate.setUTCMinutes(0);

      nextUpdate.setUTCHours(24);

      const diff = nextUpdate.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ h, m, s });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const isCurrentUserVisible = users.some(u => u.id === currentUserId);

  const podium = users.slice(0, 3);
  const rest = users.slice(3);

  // Rank is measured in what people built, so the podium is three plots.
  const Plot = ({ place, user }: { place: 1 | 2 | 3; user: typeof users[number] | undefined }) => {
    if (!user) return <div className="flex-1" />;
    const h = place === 1 ? 66 : place === 2 ? 50 : 40;
    const label = place === 1 ? "Grand champion" : place === 2 ? "Runner up" : "Third place";
    const isMe = user.id === currentUserId;

    return (
      <div className={`flex-1 flex flex-col items-center text-center ${place === 1 ? "" : "pt-s5"}`}>
        <svg viewBox="-80 -110 160 150" className="w-full max-w-[150px]" aria-hidden>
          <polygon points="0,-30 66,0 0,30 -66,0" fill="var(--ground)" stroke="var(--ground-edge)" strokeWidth="1.2" />
          <polygon points="30,10 76,36 4,36 -16,24" fill="var(--vol-shadow)" />
          <polygon points={`-34,${-h} 0,${-h + 20} 0,18 -34,-2`} fill="var(--vol-left)" />
          <polygon points={`0,${-h + 20} 34,${-h} 34,-2 0,18`} fill="var(--vol-right)" />
          <polygon points={`0,${-h - 20} 34,${-h} 0,${-h + 20} -34,${-h}`} fill="var(--vol-top)" />
          <polygon points={`-24,${-h + 11} -13,${-h + 17} -13,${-h + 27} -24,${-h + 21}`} fill="var(--vol-window)" opacity=".85" />
          <polygon points={`13,${-h + 17} 24,${-h + 11} 24,${-h + 21} 13,${-h + 27}`} fill="var(--vol-window)" opacity=".45" />
        </svg>

        <span className="font-mono text-label uppercase text-faint">{label}</span>
        <h3 className={`text-h3 font-semibold mt-1 pb-[3px] truncate w-full px-s2 ${isMe ? "text-accent" : "text-ink"}`}>
          {user.username || "Anonymous"}
        </h3>
        <p className="font-mono text-meta text-muted tabular mt-1">
          {user.lessonsCompleted} days · {user.totalXP.toLocaleString()} XP
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1100px] mx-auto flex flex-col gap-s4">
        <div className="h-64 bg-bg-sunk animate-pulse rounded-lg" />
        <div className="h-72 bg-bg-sunk animate-pulse rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1100px] mx-auto rounded-lg border border-line bg-surface p-s6 text-center">
        <h2 className="text-h3 font-semibold text-ink">Couldn&apos;t load the board</h2>
        <p className="text-meta text-muted mt-s2">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto flex flex-col gap-s4">
      {/* Podium */}
      <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
        <div className="flex items-baseline justify-between gap-s3 mb-s4 flex-wrap">
          <h2 className="text-label uppercase text-faint">This week</h2>
          {timeLeft && (
            <span className="font-mono text-meta text-muted tabular">
              resets in {timeLeft.h}h {timeLeft.m}m
            </span>
          )}
        </div>

        {users.length === 0 ? (
          <div className="py-s7 text-center">
            <h3 className="text-h3 font-semibold text-ink">No learners found</h3>
            <p className="text-meta text-muted mt-s2">Complete a lesson to get on the board.</p>
          </div>
        ) : (
          <div className="flex items-end gap-s2">
            <Plot place={2} user={podium[1]} />
            <Plot place={1} user={podium[0]} />
            <Plot place={3} user={podium[2]} />
          </div>
        )}
      </section>

      {/* Your standing */}
      {myRankInfo && (
        <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
          <h2 className="text-label uppercase text-faint mb-s3">Your standing</h2>
          <div className="flex flex-wrap items-baseline gap-s6">
            <div>
              <div className="font-mono text-h1 text-ink tabular leading-none">
                {myRankInfo.rank ? `#${myRankInfo.rank}` : "\u2014"}
              </div>
              <div className="text-label uppercase text-faint mt-s2">Rank</div>
            </div>
            <div>
              <div className="font-mono text-h2 text-ink tabular leading-none">{myRankInfo.lessonsCompleted}</div>
              <div className="text-label uppercase text-faint mt-s2">Built</div>
            </div>
            <div>
              <div className="font-mono text-h2 text-ink tabular leading-none">{myRankInfo.totalXP.toLocaleString()}</div>
              <div className="text-label uppercase text-faint mt-s2">Total XP</div>
            </div>
          </div>
        </section>
      )}

      {/* Ranked rows */}
      <section className="rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
        <div className="p-s4 border-b border-line">
          <label htmlFor="lb-search" className="sr-only">Search learners</label>
          <input
            id="lb-search"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search learners\u2026"
            className="w-full bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink placeholder:text-faint min-h-[44px]"
          />
        </div>

        <div className="grid grid-cols-[3rem_1fr_auto_auto] gap-s3 px-s4 py-s3 bg-bg-sunk text-label uppercase text-faint">
          <span>Rank</span>
          <span>Learner</span>
          <span className="text-right">Built</span>
          <span className="text-right">Total XP</span>
        </div>

        {rest.length === 0 ? (
          <p className="p-s5 text-meta text-muted text-center">Nobody else on this page yet.</p>
        ) : (
          rest.map((user) => (
            <LeaderboardRow key={user.id} user={user} isCurrentUser={user.id === currentUserId} />
          ))
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between gap-s3 p-s4 border-t border-line">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-s4 py-s2 rounded-md border border-line text-meta text-muted disabled:opacity-40 min-h-[44px]"
            >
              Previous
            </button>
            <span className="font-mono text-meta text-faint tabular">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="px-s4 py-s2 rounded-md border border-line text-meta text-muted disabled:opacity-40 min-h-[44px]"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {!isCurrentUserVisible && myRankInfo?.rank && (
        <p className="text-meta text-faint text-center">
          You are #{myRankInfo.rank} \u2014 keep building to climb into view.
        </p>
      )}
    </div>
  );
};
