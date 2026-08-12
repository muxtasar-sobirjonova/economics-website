"use client";

import { IconCheck } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";

export interface AgendaItem {
  id: string;
  itemType: "LESSON" | "QUIZ";
  itemId: string;
  title: string;
  tag: string;
  timeEstimate: number;
  isCompleted: boolean;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  description?: string;
  url?: string;
}

interface TodayAgendaCardProps {
  initialItems: AgendaItem[];
}

export default function TodayAgendaCard({ initialItems }: TodayAgendaCardProps) {
  const items = initialItems;

  const completedCount = items.filter(item => item.isCompleted).length;
  const totalCount = items.length;
  const totalAgendaMinutes = items.reduce((acc, item) => acc + (item.timeEstimate || 0), 0);
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div
      className="flex flex-col w-full lg:flex-[1.5] bg-white p-4 lg:p-6 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-visible"
    >
      {/* ── Header ── */}
      <div className="flex justify-between items-end mb-1 shrink-0">
        <h2 className="text-gray-900 font-[800] text-lg lg:text-xl tracking-tight leading-none">
          Today&apos;s Agenda
        </h2>
        <div className="text-[11px] lg:text-[12px] font-[600] text-[#5A4FBD] bg-[#F3F0FF] px-2 lg:px-3 py-1 rounded-full leading-none">
          up to {totalAgendaMinutes} minutes
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-3 flex flex-col gap-1.5 mt-2 shrink-0">
        <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wide">
          <span>Progress</span>
          <span>{completedCount} of {totalCount} done</span>
        </div>
        <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
           <div className="h-full bg-brand-primary rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* ── Items ── */}
      <div className="flex flex-col gap-3 flex-1">
        {items.length > 0 ? (
          <motion.div 
            className="flex flex-col gap-3 flex-1"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
          {items.map((item, index) => {
            let theme;
            
            const tag = item.tag ? item.tag.toUpperCase() : "";
            const title = item.title.toUpperCase();
            
            if (tag.includes("CONCEPT") || title.includes("CONCEPT") || (item.itemType === "LESSON" && index === 0)) {
              theme = { bg: "#fef3c7", text: "#d97706", label: "CONCEPT" };
            } else if (tag.includes("ARTICLE") || title.includes("READ") || title.includes("ARTICLE") || item.itemType === "LESSON") {
              theme = { bg: "#dbeafe", text: "#2563eb", label: "ARTICLE" };
            } else {
              theme = { bg: "#f3e8ff", text: "#9333ea", label: "QUIZ" };
            }

            let timeText = `~${item.timeEstimate} min`;
            if (theme.label === "CONCEPT") timeText = "5-10 min";
            else if (theme.label === "ARTICLE") timeText = "5-20 min";
            else if (theme.label === "QUIZ") timeText = "10 min";
            
            const accentColor = theme.text;
            const badgeBg = theme.bg;
            const badgeText = theme.text;
            const badgeLabelDisplay = theme.label;
            
            const innerCard = (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10, scale: 0.98 },
                  visible: { opacity: item.isCompleted ? 0.6 : 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                }}
                animate={{ opacity: item.isCompleted ? 0.6 : 1 }}
                layout
                className="flex items-center py-2 px-2.5 lg:px-3 border-[1.5px] border-gray-100 rounded-2xl group bg-white transition-colors hover:shadow-sm hover:border-brand-primary/50 cursor-pointer"
              >
                {/* Left accent */}
                <motion.div
                  layout
                  className="w-1 h-6 rounded-full mr-3 shrink-0 transition-colors group-hover:shadow-[0_0_8px_rgba(123,111,231,0.5)]"
                  style={{ backgroundColor: accentColor }}
                />

                <div className="flex-1 flex items-center flex-wrap gap-2">
                  {/* Badge */}
                  <motion.div layout
                    className="text-[10px] font-[800] px-2 py-0.5 rounded-md tracking-wider uppercase"
                    style={{ backgroundColor: badgeBg, color: badgeText }}
                  >
                    {badgeLabelDisplay}
                  </motion.div>

                  {/* Title */}
                  <motion.div layout className="text-xs lg:text-sm font-[600] leading-tight text-gray-900 line-clamp-1 max-w-[160px] sm:max-w-[200px]">
                    {item.title}
                  </motion.div>
                  
                  {/* Time Pill */}
                  <motion.div layout className="bg-gray-50 text-brand-primary font-[500] text-[10px] lg:text-[11px] px-1.5 lg:px-2 py-0.5 rounded-full whitespace-nowrap ml-auto">
                    {timeText}
                  </motion.div>
                </div>

                {/* Completion circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ml-3 ${
                    item.isCompleted
                      ? "bg-green-700 border-green-700 border-[1.5px] shadow-[0_0_0_3px_rgba(21,128,61,0.15)]"
                      : "border-gray-200 border-[1.5px] bg-gray-50"
                  }`}
                >
                  {item.isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <IconCheck size={20} className="text-white" stroke={3} />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );

            return item.url ? (
              <Link key={item.id} href={item.url} className="block outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded-2xl">
                {innerCard}
              </Link>
            ) : (
              <div key={item.id}>
                {innerCard}
              </div>
            );
          })}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center flex-1">
            <h3 className="text-slate-900 font-bold text-lg">
              All caught up!
            </h3>
            <p className="text-[rgba(26,26,62,0.5)] text-sm mt-2">
              You&apos;ve finished your agenda for today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
