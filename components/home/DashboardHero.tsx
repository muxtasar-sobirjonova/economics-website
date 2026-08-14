'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { IconCheck } from "@tabler/icons-react";

export const DashboardHero = ({
  completedAgendaDates,
  completedDates,
  userName,
  currentDay,
  streak,
}: {
  completedAgendaDates: string[],
  completedDates: string[],
  userName: string,
  currentDay?: number,
  streak?: number,
}) => {
  const days = useMemo(() => [
    { short: "M", long: "Mon" },
    { short: "T", long: "Tue" },
    { short: "W", long: "Wed" },
    { short: "T", long: "Thu" },
    { short: "F", long: "Fri" },
    { short: "S", long: "Sat" },
    { short: "S", long: "Sun" },
  ], []);

  const [mounted, setMounted] = useState(false);
  const [todayIndex, setTodayIndex] = useState(0);
  const [todayDate, setTodayDate] = useState(0);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const today = new Date();
    const jsDay = today.getDay();
    const currentTodayIndex = jsDay === 0 ? 6 : jsDay - 1;
    setTodayIndex(currentTodayIndex);
    setTodayDate(today.getDate());

    const hour = today.getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");

    const monday = new Date(today);
    monday.setDate(today.getDate() - currentTodayIndex);

    setWeekDates(days.map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }));
    setMounted(true);
  }, [days]);

  const allCompletedDates = useMemo(
    () => Array.from(new Set([...completedDates, ...completedAgendaDates])),
    [completedDates, completedAgendaDates]
  );

  const clearedThisWeek = mounted
    ? weekDates.filter((d) => allCompletedDates.includes(d)).length
    : 0;

  const firstName = (userName || "").trim().split(" ")[0] || "there";
  const initial = firstName.charAt(0).toUpperCase() || "?";

  return (
    <div className="flex flex-col lg:flex-row lg:items-start justify-between w-full mx-auto gap-s5 max-w-[1200px]">
      {/* Greeting */}
      <div className="w-full lg:flex-1 min-w-0">
        <div className="flex items-center gap-s3">
          <span className="w-11 h-11 rounded-full bg-accent text-on-accent grid place-items-center font-semibold text-h3 shrink-0">
            {initial}
          </span>
          <div className="min-w-0">
            <h1 className="text-h1-sm sm:text-h1 font-semibold text-ink truncate">
              {greeting}, {firstName}
            </h1>
            <p className="text-meta text-muted mt-1">
              {currentDay ? `Day ${currentDay} of 56` : "Your daily plan"}
              {typeof streak === "number" && streak > 0 && (
                <> · <span className="font-mono tabular">{streak}</span>-day streak</>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-s2 mt-s4">
          <Link
            href={currentDay ? `/lessons/${currentDay}/concepts` : "/roadmap"}
            className="px-s5 py-s3 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors min-h-[44px] flex items-center"
          >
            {currentDay ? `Continue day ${currentDay}` : "Start learning"} &rarr;
          </Link>
          <Link
            href="/roadmap"
            className="px-s5 py-s3 rounded-md bg-surface border border-line-strong text-ink text-ui font-medium hover:border-accent hover:text-accent transition-colors min-h-[44px] flex items-center"
          >
            See your plot
          </Link>
        </div>
      </div>

      {/* Week strip */}
      <div className="w-full lg:w-[340px] shrink-0 bg-surface border border-line rounded-lg shadow-sh1 p-s4">
        <div className="flex items-baseline justify-between mb-s3">
          <span className="text-label uppercase text-faint">This week</span>
          <span className="font-mono text-meta text-muted tabular">
            {clearedThisWeek} of 7 cleared
          </span>
        </div>

        <div className="flex justify-between gap-1">
          {days.map((day, i) => {
            const dateStr = weekDates[i];
            const isCleared = mounted && dateStr ? allCompletedDates.includes(dateStr) : false;
            const isToday = mounted && i === todayIndex;
            const isFuture = mounted && i > todayIndex;
            const isMissed = mounted && !isCleared && !isToday && !isFuture;

            let pill = "bg-bg-sunk text-faint border border-line";
            if (isCleared) pill = "bg-success text-white border border-success";
            else if (isToday) pill = "bg-accent-soft text-accent-strong border border-accent font-semibold";
            else if (isMissed) pill = "bg-danger-soft text-danger border border-transparent";

            return (
              <div key={`${day.long}-${i}`} className="flex flex-col items-center gap-s1 min-w-0">
                <span
                  className={`w-9 h-9 rounded-full grid place-items-center text-meta ${pill}`}
                  title={isCleared ? `${day.long} — cleared` : isToday ? `${day.long} — today` : isMissed ? `${day.long} — missed` : day.long}
                >
                  {isCleared ? (
                    <IconCheck size={15} stroke={3} />
                  ) : isToday ? (
                    <span className="font-mono tabular text-[12px]">{todayDate || day.short}</span>
                  ) : (
                    <span className="text-[11px]">{day.short}</span>
                  )}
                </span>
                <span className="text-[10px] text-faint">{day.long}</span>
              </div>
            );
          })}
        </div>

        <Link
          href="/roadmap"
          className="block text-meta text-accent hover:text-accent-strong mt-s3 pt-s3 border-t border-line transition-colors"
        >
          Study today to build your streak &rarr;
        </Link>
      </div>
    </div>
  );
};
