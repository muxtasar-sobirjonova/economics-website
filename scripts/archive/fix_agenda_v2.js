const fs = require('fs');

let code = fs.readFileSync('components/TodayAgendaCard.tsx', 'utf8');

// Completely rewrite the component to match the user's exact specifications
const newComponent = `"use client";

import { useEffect, useState, useCallback } from "react";
import { IconCheck } from "@tabler/icons-react";

interface AgendaItem {
  id: string;
  itemType: "LESSON" | "QUIZ";
  itemId: string;
  title: string;
  tag: string;
  timeEstimate: number;
  isCompleted: boolean;
}

interface AgendaData {
  date: string;
  currentDay: number;
  items: AgendaItem[];
  completedCount: number;
  totalCount: number;
}

interface TodayAgendaCardProps {
  userId: string | null;
  onAgendaUpdated?: () => void;
}

export default function TodayAgendaCard({ userId, onAgendaUpdated }: TodayAgendaCardProps) {
  const [agenda, setAgenda] = useState<AgendaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  const fetchAgenda = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(\`/api/agenda/today?userId=\${userId}\`);
      if (!res.ok) throw new Error("Failed to fetch agenda");
      const data = await res.json();
      setAgenda(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchAgenda();
    }
  }, [userId, fetchAgenda]);

  const handleToggleComplete = async (item: AgendaItem) => {
    if (completing) return;
    setCompleting(item.itemId);

    try {
      const endpoint = item.itemType === "LESSON" ? "/api/lessons/complete" : "/api/quizzes/complete";
      const payload = item.itemType === "LESSON"
        ? { userId, lessonId: item.itemId, xpEarned: 10 }
        : { userId, quizId: item.itemId, score: 100, xpEarned: 10 };

      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await fetch("/api/agenda/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, agendaItemId: item.id }),
      });

      await fetchAgenda();
      if (onAgendaUpdated) onAgendaUpdated();
    } catch (err) {
      console.error(err);
      await fetchAgenda();
    } finally {
      setCompleting(null);
    }
  };

  if (loading || !userId) {
    return (
      <div className="flex flex-col" style={{ flex: "1.5", backgroundColor: "white", padding: "24px", borderRadius: "16px" }}>
        <div className="flex justify-between items-center mb-6">
          <div className="h-7 w-40 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-4 w-28 bg-gray-100 rounded-full animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center py-3 border border-gray-100 rounded-[28px] gap-4 mb-3 px-3">
            <div className="w-1 h-8 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-6 w-16 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-5 flex-1 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
            <div className="w-7 h-7 bg-gray-100 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // Force exactly 3 items matching the exact requested themes
  const displayItems = agenda?.items ? agenda.items.slice(0, 3) : [];
  
  // Pad if we have less than 3
  while (displayItems.length < 3) {
    displayItems.push({
      id: \`dummy-\${displayItems.length}\`,
      itemType: displayItems.length === 2 ? "QUIZ" : "LESSON",
      itemId: \`dummy-\${displayItems.length}\`,
      title: displayItems.length === 0 ? "Concept Overview" : displayItems.length === 1 ? "Article Reading" : "Knowledge Check",
      tag: displayItems.length === 0 ? "CONCEPT" : displayItems.length === 1 ? "ARTICLE" : "QUIZ",
      timeEstimate: displayItems.length === 0 ? 10 : 20,
      isCompleted: false
    });
  }

  const completedCount = displayItems.filter(i => i.isCompleted).length;
  const totalCount = 3;

  return (
    <div
      className="flex flex-col"
      style={{
        flex: "1.5",
        backgroundColor: "transparent", // Clean flush background
      }}
    >
      {/* ── Header ── */}
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-[#111111] font-[800] text-[20px] tracking-tight leading-none">
          Today's Agenda
        </h2>
        <div className="text-[13px] font-[600] text-[#6B7280] leading-none mb-[2px]">
          {completedCount} of {totalCount} completed
        </div>
      </div>
      <div className="h-[3px] bg-[#EEF2FF] rounded-full w-full mb-6" />

      {/* ── Items ── */}
      <div className="flex flex-col gap-3">
        {displayItems.map((item, index) => {
          let theme;
          let timeText;
          let qtyText;
          
          if (index === 0) {
            theme = { bg: "#fef3c7", text: "#d97706", label: "CONCEPT" };
            timeText = "~10 min";
            qtyText = "1 Concept";
          } else if (index === 1) {
            theme = { bg: "#dbeafe", text: "#2563eb", label: "ARTICLE" };
            timeText = "~20 min";
            qtyText = "1 Article";
          } else {
            theme = { bg: "#f3e8ff", text: "#9333ea", label: "QUIZ" };
            timeText = "~20 min";
            qtyText = "1 Quiz";
          }

          const accentColor = theme.text;
          const badgeBg = theme.bg;
          const badgeText = theme.text;
          const badgeLabel = theme.label;
          const isThisCompleting = completing === item.itemId;

          return (
            <div
              key={item.id}
              className="flex items-center py-[10px] pr-3 pl-[10px] border-[1.5px] border-[#F3F4F6] rounded-[32px] group bg-white transition-opacity"
              style={{ opacity: item.isCompleted ? 0.6 : 1 }}
            >
              {/* Left accent */}
              <div
                className="w-[4px] h-[34px] rounded-full mr-4 shrink-0"
                style={{ backgroundColor: accentColor }}
              />

              {/* Badge */}
              <div 
                className="text-[11px] font-[800] px-3 py-[6px] rounded-[8px] mr-4 tracking-wide"
                style={{ backgroundColor: badgeBg, color: badgeText }}
              >
                {badgeLabel}
              </div>

              {/* Title */}
              <div className="text-[15px] font-[700] flex-1 mr-4 leading-tight text-[#111111]">
                {item.title}
              </div>

              {/* Pills */}
              <div className="flex items-center gap-2 mr-4 shrink-0">
                <div className="bg-[#F8F9FA] text-[#7B6FE7] font-[600] text-[13px] px-[14px] py-[6px] rounded-full">
                  {qtyText}
                </div>
                <div className="bg-[#F8F9FA] text-[#7B6FE7] font-[600] text-[13px] px-[14px] py-[6px] rounded-full">
                  {timeText}
                </div>
              </div>

              {/* Completion circle */}
              <button
                disabled={isThisCompleting}
                onClick={() => handleToggleComplete(item)}
                aria-label={item.isCompleted ? "Mark incomplete" : "Mark complete"}
                className={\`w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 transition-all duration-200 \${
                  isThisCompleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                } \${
                  item.isCompleted
                    ? "bg-[#7B6FE7] border-[#7B6FE7] border-2 shadow-[0_0_0_4px_rgba(123,111,231,0.15)]"
                    : "border-[#E5E7EB] border-[2px] hover:border-[#7B6FE7]"
                }\`}
              >
                {item.isCompleted && <IconCheck size={18} color="white" stroke={3.5} />}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Progress bar ── */}
      <div className="mt-6 pt-5">
        <div className="flex justify-between text-[13px] text-[#1A1A3E] font-[700] mb-3">
          <span>Day {agenda?.currentDay ?? 1} progress</span>
          <span>{Math.round((completedCount / totalCount) * 100)}%</span>
        </div>
        <div className="w-full h-[6px] bg-[#EEF2FF] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4F46E5] rounded-full transition-all duration-500"
            style={{ width: \`\${(completedCount / totalCount) * 100}%\` }}
          />
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('components/TodayAgendaCard.tsx', newComponent, 'utf8');
console.log('Done replacing agenda component');
