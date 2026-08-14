"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { LeaderboardRow, LeaderboardUser } from "./LeaderboardRow";
import { Search, ChevronLeft, ChevronRight, Trophy, AlertCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <div className="w-full max-w-5xl mx-auto pb-16 px-4 sm:px-6 lg:px-8 mt-6">
      
      {/* Header Section */}
      <div className="w-full mb-8">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#8c7df0] uppercase mb-2 drop-shadow-sm">
          THAT&apos;S SO ECON — GLOBAL RANKINGS
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#2b1f5e] font-serif mb-2 leading-tight tracking-tight">
          Lessons in. Rank out.
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <p className="text-muted font-medium text-sm max-w-xl">
            Ranked strictly by lessons completed. XP is just bragging rights. New updates roll out every 24 hours.
          </p>

          {/* Countdown Timer */}
          {timeLeft && (
            <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0 bg-surface p-3.5 rounded-2xl border border-line shadow-sm">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#8c7df0] uppercase drop-shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Next Update In
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <div className="bg-[#f5f3ff] text-[#2b1f5e] font-bold px-2 py-1 rounded-lg text-sm ring-1 ring-[#ebe6ff] w-8 text-center shadow-inner">
                  {timeLeft.h.toString().padStart(2, '0')}
                </div>
                <span className="text-[#8c7df0] font-bold pb-0.5">:</span>
                <div className="bg-[#f5f3ff] text-[#2b1f5e] font-bold px-2 py-1 rounded-lg text-sm ring-1 ring-[#ebe6ff] w-8 text-center shadow-inner">
                  {timeLeft.m.toString().padStart(2, '0')}
                </div>
                <span className="text-[#8c7df0] font-bold pb-0.5">:</span>
                <div className="bg-[#f5f3ff] text-[#2b1f5e] font-bold px-2 py-1 rounded-lg text-sm ring-1 ring-[#ebe6ff] w-8 text-center shadow-inner">
                  {timeLeft.s.toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#8c7df0]" />
          </div>
          <input
            type="text"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={handleSearch}
            className="block w-full pl-10 pr-4 py-2.5 text-sm border border-line/60 rounded-xl leading-5 bg-surface shadow-sm placeholder-[#b4aee8] focus:outline-none focus:ring-2 focus:ring-[#8c7df0] focus:border-transparent font-medium text-[#2b1f5e] transition-all"
          />
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted bg-surface rounded-3xl shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <p className="font-medium text-lg">{error}</p>
        </div>
      ) : loading ? (
        <div className="space-y-4 pt-2 bg-surface rounded-3xl p-8 shadow-sm">
          <div className="h-64 bg-bg-sunk rounded-3xl animate-pulse mb-8"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-bg animate-pulse">
              <div className="w-12 h-12 bg-slate-200 rounded-full shrink-0"></div>
              <div className="w-48 h-6 bg-slate-200 rounded-md"></div>
              <div className="ml-auto w-24 h-10 bg-slate-200 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted bg-surface rounded-3xl shadow-sm p-8">
          <Trophy className="w-20 h-20 text-slate-200 mb-6" />
          <p className="text-2xl font-extrabold text-[#2b1f5e] tracking-tight">No learners found</p>
          <p className="text-base mt-2 font-medium">Complete a lesson to get on the board!</p>
        </div>
      ) : (
        <div className="w-full relative mt-4">
          {/* Podium for Top 3 */}
          {users.length > 0 && (
            <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-8 mb-8 relative">
              
              {/* 2nd Place */}
              {users[1] && (
                <div className="flex flex-col items-center w-full max-w-[280px] md:max-w-none md:w-[30%] order-2 md:order-1 relative">
                  <div className="relative mb-3">
                    <div className="w-16 h-16 rounded-full bg-[#CBD5E1] flex items-center justify-center text-white text-2xl font-bold overflow-hidden relative border-[3px] border-white shadow-sm">
                      {users[1].profileImage ? (
                        <Image src={users[1].profileImage} alt={users[1].username || ""} fill className="object-cover" />
                      ) : (
                        users[1].username?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                  </div>
                  <div className="text-center mb-4 min-h-[48px]">
                    <h3 className="font-bold text-[#2f2759] text-lg leading-tight truncate w-full px-2">{users[1].username || "Anonymous"}</h3>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#94A3B8] uppercase mt-1">RUNNER UP</p>
                  </div>
                  <div className="w-full bg-gradient-to-b from-[#94A3B8] to-white rounded-3xl md:rounded-b-none md:rounded-t-3xl pt-8 pb-6 flex flex-col items-center justify-between h-auto md:h-[160px] gap-4 md:gap-0 shadow-sm md:shadow-none">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-extrabold text-white leading-none mb-1 font-serif">{users[1].lessonsCompleted}</span>
                      <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase">Lessons</span>
                    </div>
                    <span className="text-sm font-bold text-[#94A3B8] mt-4">{users[1].totalXP} XP</span>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {users[0] && (
                <div className="flex flex-col items-center w-full max-w-[280px] md:max-w-none md:w-[35%] order-1 md:order-2 relative z-10 md:-mb-6">
                  <div className="relative mb-3">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#B8A4FF] to-[#A78BFA] flex items-center justify-center text-white text-3xl font-bold overflow-hidden relative border-[3px] border-white ring-4 ring-[#8c7df0] shadow-sm">
                      {users[0].profileImage ? (
                        <Image src={users[0].profileImage} alt={users[0].username || ""} fill className="object-cover" />
                      ) : (
                        users[0].username?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    {users[0].id === currentUserId && (
                      <div className="absolute -top-1 -right-6 bg-[#8c7df0] text-white text-[9px] font-black px-2 py-1 rounded transform uppercase tracking-widest shadow-sm">
                        YOU
                      </div>
                    )}
                  </div>
                  <div className="text-center mb-4 min-h-[48px]">
                    <h3 className="font-bold text-[#2f2759] text-xl leading-tight truncate w-full px-2">{users[0].username || "Anonymous"}</h3>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#cda434] uppercase mt-1">GRAND CHAMPION</p>
                  </div>
                  <div className="w-full bg-gradient-to-b from-[#8c7df0] to-white rounded-3xl md:rounded-b-none md:rounded-t-3xl pt-10 pb-8 flex flex-col items-center justify-between h-auto md:h-[210px] gap-4 md:gap-0 shadow-sm md:shadow-none">
                    <div className="flex flex-col items-center">
                      <span className="text-5xl font-extrabold text-white leading-none mb-1 font-serif">{users[0].lessonsCompleted}</span>
                      <span className="text-[11px] font-bold tracking-widest text-white/90 uppercase">Lessons</span>
                    </div>
                    <span className="text-[15px] font-bold text-[#8c7df0] mt-4">{users[0].totalXP} XP</span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {users[2] && (
                <div className="flex flex-col items-center w-full max-w-[280px] md:max-w-none md:w-[30%] order-3 md:order-3 relative">
                  <div className="relative mb-3">
                    <div className="w-16 h-16 rounded-full bg-[#FDBA74] flex items-center justify-center text-white text-2xl font-bold overflow-hidden relative border-[3px] border-white shadow-sm">
                      {users[2].profileImage ? (
                        <Image src={users[2].profileImage} alt={users[2].username || ""} fill className="object-cover" />
                      ) : (
                        users[2].username?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                  </div>
                  <div className="text-center mb-4 min-h-[48px]">
                    <h3 className="font-bold text-[#2f2759] text-lg leading-tight truncate w-full px-2">{users[2].username || "Anonymous"}</h3>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#D97706] uppercase mt-1">THIRD PLACE</p>
                  </div>
                  <div className="w-full bg-gradient-to-b from-[#f59e0b] to-white rounded-3xl md:rounded-b-none md:rounded-t-3xl pt-8 pb-6 flex flex-col items-center justify-between h-auto md:h-[130px] gap-4 md:gap-0 shadow-sm md:shadow-none">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-extrabold text-white leading-none mb-1 font-serif">{users[2].lessonsCompleted}</span>
                      <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase">Lessons</span>
                    </div>
                    <span className="text-sm font-bold text-[#f59e0b] mt-4">{users[2].totalXP} XP</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* List Header */}
          {users.length > 3 && (
            <div className="flex items-center py-4 px-2 sm:px-6 mb-2">
              <div className="w-12 shrink-0 font-bold text-[10px] tracking-widest text-[#c2c4d6] uppercase">
                Rank /
              </div>
              <div className="flex-1 font-bold text-[10px] tracking-widest text-[#c2c4d6] uppercase ml-1">
                Trader
              </div>
              <div className="hidden md:block w-24 shrink-0 font-bold text-[10px] tracking-widest text-[#c2c4d6] uppercase mr-12 text-center">
                Progress
              </div>
              <div className="w-16 sm:w-24 shrink-0 font-bold text-[10px] tracking-widest text-[#c2c4d6] uppercase text-center">
                Lessons
              </div>
              <div className="w-16 sm:w-20 shrink-0 font-bold text-[10px] tracking-widest text-[#c2c4d6] uppercase text-right">
                XP
              </div>
            </div>
          )}

          {/* Leaderboard List (Rank 4+) */}
          <div className="flex flex-col pb-4">
            <AnimatePresence>
              {users.slice(3).map((user) => (
                <LeaderboardRow 
                  key={user.id} 
                  user={user} 
                  isCurrentUser={user.id === currentUserId} 
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!searchQuery && pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12 mb-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-3 rounded-full border border-[#ebe6ff] bg-surface text-[#8c7df0] hover:bg-[#f5f3ff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-[#b4aee8] tracking-widest uppercase">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="p-3 rounded-full border border-[#ebe6ff] bg-surface text-[#8c7df0] hover:bg-[#f5f3ff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Floating Personal Stats (if not visible in current view) */}
      {!loading && !searchQuery && !isCurrentUserVisible && myRankInfo?.rank && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[90%] sm:max-w-md bg-surface border-2 border-[#8c7df0] p-4 rounded-2xl shadow-2xl flex justify-between items-center z-50"
        >
          <div>
            <p className="text-[10px] text-[#b4aee8] font-bold uppercase tracking-widest mb-0.5">Your Standing</p>
            <p className="font-extrabold text-xl text-[#2b1f5e] tracking-tight">#{myRankInfo.rank} <span className="text-[#b4aee8] text-sm font-medium ml-1">overall</span></p>
          </div>
          <div className="text-right flex items-center gap-4">
             <div>
              <p className="text-[10px] text-[#b4aee8] font-bold uppercase tracking-widest mb-0.5">Lessons</p>
              <p className="font-extrabold text-xl text-[#2b1f5e]">{myRankInfo.lessonsCompleted}</p>
            </div>
            <div className="h-6 w-[1px] bg-[#ebe6ff]"></div>
            <div>
              <p className="text-[10px] text-[#b4aee8] font-bold uppercase tracking-widest mb-0.5">Total XP</p>
              <p className="font-extrabold text-xl text-[#32c98d]">
                +{myRankInfo.totalXP}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
