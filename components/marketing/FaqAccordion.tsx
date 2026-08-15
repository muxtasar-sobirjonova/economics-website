"use client";

import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "Do I need any economics background?",
    answer: "No. Day 1 assumes nothing. The first chapter builds the vocabulary the other seven use.",
  },
  {
    question: "What happens if I miss a day?",
    answer: "Nothing is lost. Your streak resets, but the plan simply picks up where you left off \u2014 the next unfinished day is still waiting on the roadmap.",
  },
  {
    question: "Can I take more than one track?",
    answer: "Yes. Each track keeps its own progress, XP and roadmap, so switching never costs you anything on the track you leave.",
  },
  {
    question: "Why do failed quizzes cost a heart?",
    answer: "Hearts make an attempt worth something. You have five, one regenerates every four hours, and a day only counts as cleared at 8 out of 10.",
  },
  {
    question: "How do notes and highlights work?",
    answer: "Select any line while reading and pick a colour. Saved notes land in My Notes, where they come back as flashcards with the lesson they came from attached.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-s2">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question} className="rounded-lg border border-line bg-surface overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-s4 text-left px-s5 py-s4 min-h-[56px]"
            >
              <span className="text-ui font-medium text-ink">{faq.question}</span>
              <IconChevronDown
                size={18}
                className={`shrink-0 text-faint transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <p className="px-s5 pb-s5 text-meta text-muted max-w-[62ch]">{faq.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
