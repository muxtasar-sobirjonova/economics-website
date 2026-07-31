"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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
  const [showTelegram, setShowTelegram] = useState(false);
  
  // Format rank to always be two digits (e.g. 04)
  const formattedRank = user.rank.toString().padStart(2, '0');
  
  // Pseudo-random progress based on XP for visual effect matching the design
  const progressPercent = Math.max(10, (user.totalXP % 100));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center py-4 px-2 sm:px-6 relative group transition-colors rounded-xl ${isCurrentUser ? "bg-[#f5f3ff] ring-1 ring-[#8c7df0]" : "bg-white"}`}
    >
      {/* Rank */}
      <div className="w-12 shrink-0 font-bold text-lg text-[#c2c4d6]">
        {formattedRank}
      </div>
      
      {/* Avatar & Name */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative shrink-0">
          <div 
            onClick={() => setShowTelegram(!showTelegram)}
            className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer bg-[#bca6fc] text-white transition-transform hover:scale-105"
          >
            {user.profileImage ? (
              <Image src={user.profileImage} alt={user.username || "User"} fill className="object-cover" />
            ) : (
              <span className="font-bold text-lg">{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</span>
            )}
          </div>

        </div>
        
        <div className="font-bold text-[#2f2759] truncate pr-4 text-[15px]">
          {user.username || "Anonymous Learner"}
          {isCurrentUser && <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-[#8c7df0] text-white uppercase tracking-wider relative -top-0.5">You</span>}
        </div>
      </div>
      
      {/* Progress Bar (Hidden on very small screens) */}
      <div className="hidden md:flex w-24 shrink-0 mr-12">
        <div className="h-1.5 w-full bg-[#ebe6ff] rounded-full overflow-hidden">
           <div className="h-full bg-[#8c7df0] rounded-full" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
      
      {/* Lessons */}
      <div className="w-16 sm:w-24 shrink-0 font-bold text-[#2f2759] text-center text-[15px]">
        {user.lessonsCompleted}
      </div>
      
      {/* XP */}
      <div className="w-16 sm:w-20 shrink-0 font-bold text-[#32c98d] text-right text-[15px]">
        +{user.totalXP}
      </div>
    </motion.div>
  );
};
