"use client";

import React, { useState, useRef } from "react";
import { Playfair_Display, Lora } from "next/font/google";
import BackButton from "@/components/BackButton";
import ArticleActions from "@/components/ArticleActions";
import Link from "next/link";
import Image from "next/image";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export default function MagazineArticle({
  article,
  params,
}: {
  article: { title?: string } | null;
  params: { slug: string };
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress || 0);
    }
  };



  const hardcodedBlocks = [
    {
      q: "WHY DID ONE AVERAGE PIZZA BEAT HUNDREDS OF BETTER ONES?",
      a: "In the early 1960s, the American pizza market was crowded, competitive, and by every conventional measure, already figured out. Hundreds of pizzerias operated across every major city. Competition was fierce. Prices were settled. And yet, one small shop in Ypsilanti, Michigan went on to become one of the most recognized food businesses in the world — not because it made better pizza, but because its founder looked at a functioning market and found a problem nobody else had bothered to solve. People wanted pizza at home. They wanted it fast. Tom Monaghan made that the entire point of his business. Thirty minutes or it was free.",
    },
    {
      q: "SO WHAT DOES A PIZZA DELIVERY PROMISE HAVE TO DO WITH ECONOMICS?",
      a: "Everything. The decision Monaghan made was not a marketing trick. It was a resource allocation decision. Every dollar, every hire, every store location, every menu choice was pointed at one outcome — speed. Stores opened near universities because students ordered late and lived close together. Menus stayed small so kitchens could move faster. Delivery drivers were the core of the operation, not an afterthought. Each of these was a deliberate economic choice, made under constraint, based on a specific theory about what customers valued most and what competitors had failed to notice.",
    },
    {
      q: "BUT ISN'T THAT JUST WHAT ALL BUSINESSES DO?",
      a: "Traditional economics would say yes — markets are full of businesses competing, allocating resources, and responding to what customers want. And that is true. But traditional economics studies this process from above, after the decisions have already been made. It explains why Domino's worked in hindsight. It maps the competitive advantage, traces the growth, identifies the moment the model started to scale. What it cannot do is put you inside the decision before it was made — when the outcome was uncertain, the resources were thin, and there was no data yet to confirm the idea was right.",
    },
    {
      q: "THEN WHAT KIND OF ECONOMICS ACTUALLY LIVES IN THAT MOMENT?",
      a: "Entrepreneurial economics does. It is the study of how individuals identify problems worth solving, assess whether those problems represent real opportunities, and decide how to act on them with whatever limited resources they actually have. It takes the same core principles of traditional economics — scarcity, trade-offs, value, allocation — and applies them at the level of one person, making one decision, before the outcome is known. The logic is identical to what drives large markets and national economies. The difference is that here, the stakes are personal and the clock is always running.",
    },
    {
      q: "WHY DOES THAT DISTINCTION MATTER?",
      a: "Because the questions an entrepreneur has to answer are different from the ones a traditional economist studies. A government choosing between machines and workers to clean city streets has data, committees, and time. An entrepreneur deciding whether to build a business around an unproven insight has none of that. They are not optimizing a system that already exists — they are trying to build one from scratch, without knowing yet whether anyone will show up. Entrepreneurial economics takes that challenge seriously. It does not just describe markets. It equips the person trying to create one.",
    },
    {
      q: "SO WHAT WAS MONAGHAN ACTUALLY DOING WHEN HE BUILT DOMINO'S?",
      a: "He was reading the market more clearly than everyone already operating inside it. He understood that time was a resource his customers were spending, that they valued speed more than any competitor had recognized, and that if he organized his entire business around that single insight, he could win a market everyone else thought was already taken. Thousands of people looked at the pizza industry in the 1960s and saw no room for a new player. One person looked at the same industry and saw an unanswered question. The economics were always there. It just took a different kind of thinking to find them.",
    },
  ];

  const EvidenceBlock = ({ index }: { index: number }) => {
    const block = hardcodedBlocks[index];
    return (
      <div className="w-full flex-1 flex flex-col">
        <div className="mb-6">
          <span
            className="font-sans font-[800] italic uppercase text-sm tracking-wider text-[#0096a5] border-b-[3px] border-tropic pb-0.5 inline-block"
            style={{ fontVariant: "small-caps" }}
          >
            CASE FILE: EVIDENCE Nº{index + 1}
          </span>
          <h2
            className={`${lora.className} font-[700] text-[#0096a5] text-xl md:text-[22px] uppercase leading-snug mt-3`}
          >
            — {block.q}
          </h2>
        </div>
        <div className="w-full aspect-[4/3] mb-6 relative">
          <Image 
            src={`/case${index + 1}.png`} 
            alt={`Case ${index + 1} Illustration`} 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)]" 
          />
        </div>
        <p
          className={`${lora.className} text-[#0096a5] text-[17px] md:text-lg leading-[1.8] font-[400] max-w-full break-words`}
        >
          {block.a}
        </p>
      </div>
    );
  };

  return (
    <div
      className="flex-1 overflow-y-auto bg-[#FFF7E6] relative"
      ref={scrollContainerRef}
      onScroll={handleScroll}
    >
      <div className="sticky top-0 left-0 w-full z-[100] bg-[#FFF7E6] pt-6 pb-4 px-8 border-b border-sky-blue">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <BackButton />
          <ArticleActions />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent">
          <div
            className="h-full bg-[#1a3d2b] transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-[1100px] mx-auto px-8 md:px-12 pt-10 pb-[80px]">
        <div className="text-center mb-16 pt-8">
          <h1
            className={`${playfair.className} text-[44px] md:text-[52px] font-[900] text-[#0096a5] leading-[1.1] uppercase tracking-tight`}
          >
            {article?.title || "DOMINO'S PIZZA & ENTREPRENEURIAL ECONOMICS"}
          </h1>
          <div className="text-center text-gray-400 font-sans font-[500] text-[13px] mt-6 tracking-wide uppercase">
            ESTIMATED READING TIME (10-20 MIN) • DAY 01 — Lesson 1: What is
            entrepreneurship economics?
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            <EvidenceBlock index={0} />
            <EvidenceBlock index={1} />
          </div>

          <div className="w-full my-16 text-center px-4 max-w-[800px] mx-auto">
            <div className="w-full h-[1px] bg-[#0096a5] mb-8" />
            <p
              className={`${lora.className} italic text-[22px] leading-[1.6] text-[#0096a5]`}
              style={{ fontStyle: "italic" }}
            >
              <em>
                "Traditional economics explains why Domino's worked.
                Entrepreneurial economics is what Monaghan was doing while
                building it."
              </em>
            </p>
            <div className="w-full h-[1px] bg-[#0096a5] mt-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            <EvidenceBlock index={2} />
            <EvidenceBlock index={3} />
          </div>

          <hr className="border-none border-t border-sky-blue my-[2.5rem] w-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            <EvidenceBlock index={4} />
            <EvidenceBlock index={5} />
          </div>

          <hr className="border-none border-t border-sky-blue my-[2.5rem] w-full" />

          <div className="mt-8 bg-[#0096a5] rounded-xl p-8 md:p-[2rem] w-full">
            <div className="text-center mb-8">
              <span className="font-sans text-[#c44d41] font-[800] tracking-[0.2em] text-sm uppercase">
                VERDICT
              </span>
            </div>
            <p
              className={`${lora.className} text-[#FAF6EF] text-lg md:text-xl leading-[1.9] font-[400] text-center mb-10 max-w-[800px] mx-auto`}
            >
              Thousands of people looked at the pizza industry in 1960 and saw
              no room for a new player. One person looked at the same industry
              and saw an unanswered question. The economics were always there.
              It just took a different kind of thinking to find them.
            </p>
            <div className="w-full h-[1px] bg-[#3a3a30] mb-6" />
            <div className="text-center">
              <span className="font-sans text-[#FAF6EF] font-[600] tracking-[0.15em] text-[11px] uppercase">
                CASE CLOSED — DAY 01 — ENTREPRENEURIAL ECONOMICS
              </span>
            </div>
          </div>

          <div className="mt-12 flex justify-center pb-8 w-full">
            <Link href={`/articles/${params.slug}?tab=quizzes`}>
              <button className="bg-[#4F46E5] text-white px-[2rem] py-[1rem] rounded-lg font-serif font-[400] text-base transition-all hover:bg-[#4F46E5] border-none cursor-pointer active:scale-95 active:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                Take the Quiz
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
