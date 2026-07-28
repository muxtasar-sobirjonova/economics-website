'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Lightbulb, BookOpen, Brain } from "lucide-react";
import { IconCheck, IconX } from "@tabler/icons-react";

export const DashboardHero = ({ 
  completedAgendaDates, 
  completedDates,
  userName,
  activeTrackName = "Entrepreneurship Economics"
}: { 
  completedAgendaDates: string[], 
  completedDates: string[],
  userName: string,
  activeTrackName?: string
}) => {
  const days = useMemo(() => ["M", "T", "W", "T", "F", "S", "S"], []);

  const [mounted, setMounted] = useState(false);
  const [todayIndex, setTodayIndex] = useState(0);
  const [weekDates, setWeekDates] = useState<string[]>([]);

  useEffect(() => {
    const today = new Date();
    const jsDay = today.getDay();
    const currentTodayIndex = jsDay === 0 ? 6 : jsDay - 1;
    setTodayIndex(currentTodayIndex);

    const monday = new Date(today);
    monday.setDate(today.getDate() - currentTodayIndex);

    const dates = days.map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });
    setWeekDates(dates);
    setMounted(true);
  }, [days]);

  const allCompletedDates = Array.from(new Set([...completedDates, ...completedAgendaDates]));

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full mx-auto gap-12 max-w-[1200px]">
      {/* Left col */}
      <div className="w-full lg:flex-1 max-w-[600px] flex flex-col justify-start items-start text-left">
        <div className="flex items-center gap-4 mb-5 lg:mb-6">
           <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-tr from-brand-primary to-indigo-400 flex items-center justify-center text-white font-extrabold text-2xl lg:text-3xl shadow-lg border-4 border-white shrink-0">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
           </div>
           <div className="flex flex-col">
              <h1 className="text-slate-900 tracking-tight text-3xl lg:text-4xl font-extrabold leading-[1.1] mb-1.5">
                {userName || 'Student'}
              </h1>
              <p className="text-gray-600 text-[15px] lg:text-[16px] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Studying {activeTrackName}
              </p>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4 mb-6 lg:mb-8 w-full">
          <Link href="/roadmap" className="flex-1 flex">
            <button
              className="w-full bg-brand-primary text-white font-medium text-sm lg:text-[15px] tracking-wide py-3 px-6 lg:py-3.5 lg:px-8 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-brand-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              Continue Learning
            </button>
          </Link>
          <Link href="/saved" className="flex-1 flex">
            <button
              className="w-full bg-white text-brand-primary font-medium text-sm lg:text-[15px] tracking-wide py-3 px-6 lg:py-3.5 lg:px-6 rounded-2xl hover:bg-[#F3F0FF] transition-all border-2 border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              Review Notes
            </button>
          </Link>
        </div>

        {/* Features Row */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-6">
          <div className="flex items-center gap-2 text-slate-900 text-[13px] font-bold">
            <Lightbulb size={16} color="#EAB308" /> Concepts
          </div>
          <div className="flex items-center gap-2 text-slate-900 text-[13px] font-bold">
            <BookOpen size={16} color="#3B82F6" /> Articles
          </div>
          <div className="flex items-center gap-2 text-slate-900 text-[13px] font-bold">
            <Brain size={16} color="#8B5CF6" /> Quizzes
          </div>
          <div className="flex items-center gap-2 text-slate-900 text-[13px] font-bold">
            <span className="text-[15px]">📝</span> My Notes
          </div>
        </div>
      </div>

      {/* Right col: This Week Card */}
      <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-3">

        <div
          className="bg-white flex flex-col justify-between rounded-3xl p-5 lg:p-8 border-none shadow-sm h-full"
        >
          <div>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-lg tracking-tight">
                🔥 This Week
              </div>
              {/* 'X of 7 days' badge */}
              <div className="bg-[#F3F0FF] text-brand-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                {weekDates.filter(d => allCompletedDates.includes(d)).length} of 7 days
              </div>
            </div>

            {/* Day Circles - synced with streak */}
            <div className="flex justify-between items-center px-1 gap-1 min-h-12">
              {mounted ? days.map((day, i) => {
                const isCompleted = weekDates[i]
                  ? allCompletedDates.includes(weekDates[i])
                  : false;
                const isToday = i === todayIndex;
                const isMissed = i < todayIndex && !isCompleted;

                return (
                  <div key={i} className="flex flex-col items-center gap-2 relative group cursor-default" aria-label={`${day} ${isCompleted ? 'completed' : isMissed ? 'missed' : isToday ? 'today' : 'upcoming'}`}>
                    <span className="font-bold text-xs text-slate-500" aria-hidden="true">
                      {day}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-transparent border-[1.5px] border-green-500 text-green-500"
                          : isMissed
                            ? "bg-red-50 border-none text-red-300"
                            : isToday
                              ? "bg-transparent border-[1.5px] border-brand-primary"
                              : "bg-transparent border-[1.5px] border-dashed border-indigo-200"
                      }`}
                      aria-hidden="true"
                    >
                      {isCompleted && <IconCheck size={18} stroke={3} />}
                      {isMissed && <IconX size={16} stroke={3} />}
                    </div>
                    
                    {/* Tooltip */}
                    {(isCompleted || isToday) && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg" aria-hidden="true">
                        {isToday && !isCompleted ? "Study today!" : `${isCompleted ? "Completed lessons" : "On track"}`}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#1A1A3E]"></div>
                      </div>
                    )}
                  </div>
                );
              }) : (
                <div className="flex justify-between items-center w-full px-1 gap-1">
                  {days.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <span className="font-bold text-xs text-slate-300">{day}</span>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="text-center w-full mt-8">
            <Link href="/roadmap">
              <button className="bg-transparent p-0 border-none rounded-none text-brand-primary font-medium text-[13px] hover:underline transition-all active:scale-95 active:opacity-90 flex items-center justify-center gap-1.5 mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                Study today to build your streak <span className="text-sm leading-none mb-0.5">→</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
