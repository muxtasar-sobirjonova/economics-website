'use client';

import { IconFlame, IconCircleCheck, IconTrophy, IconStar } from '@tabler/icons-react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

export const LearningStats = ({ 
  backendStreak,
  completedLessonsCount,
  avgQuizScore,
  xpThisWeek,
  totalXP
}: { 
  backendStreak: number,
  completedLessonsCount: number,
  avgQuizScore: number,
  xpThisWeek: number,
  totalXP: number
}) => {
  return (
    <div className="w-full mx-auto mt-8 max-w-[1200px]">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-gray-900 font-extrabold text-base tracking-tight">
          Your Learning Stats
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="bg-white rounded-3xl p-4 flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300 active:scale-[0.97] active:translate-y-0 cursor-pointer shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <IconFlame size={18} className="text-amber-500" stroke={2.5} />
            </div>
            <span className="font-bold text-slate-900 text-[13px] whitespace-nowrap">Current Streak</span>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none"><AnimatedNumber value={backendStreak} /> <span className="text-[13px] font-bold text-gray-500">days</span></div>
        </div>

        <div className="bg-white rounded-3xl p-4 flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300 active:scale-[0.97] active:translate-y-0 cursor-pointer shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <IconCircleCheck size={18} className="text-blue-500" stroke={2.5} />
            </div>
            <span className="font-bold text-slate-900 text-[13px] whitespace-nowrap">Lessons</span>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none"><AnimatedNumber value={completedLessonsCount} /> <span className="text-[13px] font-bold text-gray-500">completed</span></div>
        </div>

        <div className="bg-white rounded-3xl p-4 flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300 active:scale-[0.97] active:translate-y-0 cursor-pointer shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <IconTrophy size={18} className="text-emerald-500" stroke={2.5} />
            </div>
            <span className="font-bold text-slate-900 text-[13px] whitespace-nowrap">Avg Quiz Score</span>
          </div>
          <div className="flex items-end gap-2 leading-none">
            <div className="text-2xl font-black text-slate-900">
              <AnimatedNumber value={avgQuizScore} /><span className="text-[13px] font-bold text-gray-500">%</span>
            </div>
            {avgQuizScore > 0 && ( <>
              <div className="flex items-end gap-0.5 mb-0.5 h-4 ml-auto">
                 {[40, 60, 50, 80, 90, 75, 100].map((h, i) => (
                    <div key={i} className="w-[3px] bg-emerald-500 rounded-t-sm opacity-80" style={{ height: `${h}%` }}></div>
                 ))}
              </div>
            </>)}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300 active:scale-[0.97] active:translate-y-0 cursor-pointer shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F5F3FF] flex items-center justify-center shrink-0">
              <IconStar size={18} className="text-[#8B5CF6]" stroke={2.5} />
            </div>
            <span className="font-bold text-slate-900 text-[13px] whitespace-nowrap">XP This Week</span>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none"><AnimatedNumber value={xpThisWeek} /> <span className="text-[13px] font-bold text-gray-500">XP</span></div>
        </div>

        <div className="bg-white rounded-3xl p-4 flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300 active:scale-[0.97] active:translate-y-0 cursor-pointer shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
              <IconStar size={18} className="text-pink-500" stroke={2.5} />
            </div>
            <span className="font-bold text-slate-900 text-[13px] whitespace-nowrap">Total XP</span>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none"><AnimatedNumber value={totalXP} /> <span className="text-[13px] font-bold text-gray-500">XP</span></div>
        </div>
      </div>
    </div>
  );
};
