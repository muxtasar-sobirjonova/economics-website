"use client";

import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "Is That's So Econ. free to use?",
    answer: "Yes! Core concepts, articles, and quizzes are entirely free. We believe everyone should have access to fundamental economic knowledge for building businesses.",
  },
  {
    question: "Do I need an economics background to start?",
    answer: "Not at all. That's So Econ. is designed specifically for founders, builders, and curious minds without a formal economics degree. We break down complex theories into practical, easy-to-understand lessons.",
  },
  {
    question: "How do streaks and XP work?",
    answer: "Every day you complete your personalized agenda, your streak increases. You earn XP for reading articles, completing concepts, and passing quizzes. Earn enough XP to climb from Bronze to Silver and Gold leagues!",
  },
  {
    question: "Can I review questions I got wrong?",
    answer: "Yes! Our Mistake Review feature saves every quiz question you get wrong. You can revisit them anytime to learn from your mistakes and reinforce your understanding.",
  },
  {
    question: "How does the notes system work?",
    answer: "While reading any concept or article, you can highlight text and instantly save it as a colored sticky note. Later, in the 'My Notes' section, you can review these notes using our spaced-repetition flashcard system to ensure you actually remember what you learn.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <span className="font-bold text-slate-900 text-lg">{faq.question}</span>
              <IconChevronDown 
                className={`text-brand-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                size={24} 
              />
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
