"use client";

import React from "react";

interface WeekProgressProps {
  history: { date: string; score: number }[];
}

export default function WeekProgress({ history }: WeekProgressProps) {
  // Generate the last 7 days including today
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="flex items-center justify-between gap-2 w-full max-w-sm">
      {days.map((date, idx) => {
        const dateString = date.toISOString().split("T")[0];
        const activity = history.find((h) => h.date === dateString);

        let bgColor = "bg-gray-100";
        let ringColor = "ring-gray-100";

        if (activity) {
          if (activity.score >= 80) {
            bgColor = "bg-green-500";
            ringColor = "ring-green-100";
          } else if (activity.score >= 50) {
            bgColor = "bg-indigo-400";
            ringColor = "ring-indigo-100";
          } else {
            bgColor = "bg-indigo-300";
            ringColor = "ring-indigo-100";
          }
        } else if (idx === 6) {
          // today
          ringColor = "ring-indigo-100 ring-2";
          bgColor = "bg-white border-2 border-dashed border-gray-300";
        }

        return (
          <div key={dateString} className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">
              {dayLabels[date.getDay()]}
            </span>
            <div
              title={activity ? `Score: ${activity.score}%` : "No activity"}
              className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ${ringColor} ${bgColor}`}
            >
              {activity && (
                <svg
                  className="w-5 h-5 text-white opacity-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
