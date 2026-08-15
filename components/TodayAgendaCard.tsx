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

type Kind = "CONCEPT" | "ARTICLE" | "QUIZ";

const KIND_STYLE: Record<Kind, { bar: string; chip: string; text: string; time: string }> = {
  CONCEPT: { bar: "var(--concept)", chip: "var(--concept-soft)", text: "var(--concept)", time: "5–10 min" },
  ARTICLE: { bar: "var(--article)", chip: "var(--article-soft)", text: "var(--article)", time: "5–20 min" },
  QUIZ:    { bar: "var(--quiz)",    chip: "var(--quiz-soft)",    text: "var(--quiz)",    time: "10 min" },
};

function kindOf(item: AgendaItem, index: number): Kind {
  const tag = item.tag ? item.tag.toUpperCase() : "";
  const title = item.title.toUpperCase();
  if (tag.includes("CONCEPT") || title.includes("CONCEPT") || (item.itemType === "LESSON" && index === 0)) return "CONCEPT";
  if (tag.includes("ARTICLE") || title.includes("READ") || title.includes("ARTICLE") || item.itemType === "LESSON") return "ARTICLE";
  return "QUIZ";
}

export default function TodayAgendaCard({ initialItems }: TodayAgendaCardProps) {
  const items = initialItems;

  const completedCount = items.filter((item) => item.isCompleted).length;
  const totalCount = items.length;
  const totalAgendaMinutes = items.reduce((acc, item) => acc + (item.timeEstimate || 0), 0);
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const allDone = totalCount > 0 && completedCount === totalCount;

  return (
    <section className="flex flex-col w-full lg:flex-[1.5] bg-surface border border-line rounded-lg shadow-sh1 p-s4 lg:p-s5">
      <div className="flex items-baseline justify-between gap-s3 mb-s3">
        <div className="flex items-baseline gap-s3 min-w-0">
          <h2 className="text-h2 font-semibold text-ink">Today&apos;s Agenda</h2>
          {totalCount > 0 && (
            <span className="text-label uppercase text-faint whitespace-nowrap hidden sm:inline">
              up to {totalAgendaMinutes} minutes
            </span>
          )}
        </div>
        {totalCount > 0 && (
          <span className="font-mono text-meta text-muted tabular whitespace-nowrap">
            {completedCount} / {totalCount} done
          </span>
        )}
      </div>

      {totalCount > 0 && (
        <div className="h-1 w-full bg-bg-sunk rounded-sm overflow-hidden mb-s4">
          <div
            className="h-full bg-accent rounded-sm transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {items.length > 0 ? (
        <motion.ul
          className="flex flex-col gap-s2 flex-1 list-none p-0 m-0"
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
        >
          {items.map((item, index) => {
            const kind = kindOf(item, index);
            const style = KIND_STYLE[kind];

            const row = (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
                }}
                className={`flex items-center gap-s3 p-s3 rounded-md border bg-raised transition-colors min-h-[56px] ${
                  item.isCompleted
                    ? "border-line opacity-70"
                    : "border-line hover:border-line-strong hover:shadow-sh1"
                }`}
              >
                <span
                  aria-hidden
                  className="w-[3px] self-stretch rounded-sm shrink-0"
                  style={{ background: style.bar }}
                />

                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-s2 mb-[3px]">
                    <span
                      className="text-label uppercase font-semibold px-[6px] py-[3px] rounded-sm"
                      style={{ background: style.chip, color: style.text }}
                    >
                      {kind}
                    </span>
                    <span className="font-mono text-[11px] text-faint tabular">{style.time}</span>
                  </span>
                  <span className={`block text-ui font-medium text-ink truncate ${item.isCompleted ? "line-through decoration-faint" : ""}`}>
                    {item.title}
                  </span>
                </span>

                <span
                  className={`w-7 h-7 rounded-full grid place-items-center shrink-0 border ${
                    item.isCompleted
                      ? "bg-success border-success"
                      : "bg-bg-sunk border-line"
                  }`}
                >
                  {item.isCompleted && <IconCheck size={16} className="text-white" stroke={3} />}
                </span>
              </motion.div>
            );

            return (
              <li key={item.id}>
                {item.url ? (
                  <Link href={item.url} className="block rounded-md">
                    {row}
                  </Link>
                ) : (
                  row
                )}
              </li>
            );
          })}
        </motion.ul>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-s6 flex-1">
          <h3 className="text-h3 font-semibold text-ink">All caught up</h3>
          <p className="text-meta text-muted mt-s2 max-w-[36ch]">
            You&apos;ve finished today&apos;s agenda. Come back tomorrow to keep the streak alive.
          </p>
        </div>
      )}

      {totalCount > 0 && (
        <p className="text-meta text-faint mt-s3 pt-s3 border-t border-line">
          {allDone
            ? "Day cleared. Your plot has a new building on the roadmap."
            : "Clear all of them and today puts up its building on the plot."}
        </p>
      )}
    </section>
  );
}
