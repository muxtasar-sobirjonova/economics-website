import React from "react";
import Image from "next/image";
import { Playfair_Display, Lora } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

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
    <div className="flex flex-col w-full">
      <div className="border-b-[2px] border-[#111827]/30 pb-1 mb-6">
        <span className="font-sans font-[700] uppercase text-[11px] tracking-[0.08em] text-gray-600">
          CASE FILE: EVIDENCE Nº{index + 1}
        </span>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 mb-6">
        <h2
          className={`${lora.className} font-[700] text-[#111827] text-xl uppercase leading-[1.4] flex-1`}
        >
          — {block.q}
        </h2>
        <div className="relative w-full h-[200px] xl:w-[140px] xl:h-[140px] shrink-0">
          <Image
            src={`/case${index + 1}.png`}
            alt={`Case ${index + 1}`}
            fill
            sizes="(max-width: 1280px) 100vw, 140px"
            className="object-cover rounded-lg shadow-sm"
          />
        </div>
      </div>
      <p
        className={`${lora.className} text-[#111827] text-[17px] leading-[1.8] font-[400]`}
      >
        {block.a}
      </p>
    </div>
  );
};

export const LessonOneCaseStudy = () => {
  return (
    <>
      <div className="text-center mb-12">
        <h1
          className={`${playfair.className} font-[900] text-[#111827] leading-[1.05] uppercase tracking-[-0.02em] text-[38px] md:text-[48px]`}
        >
          DOMINO'S PIZZA &amp;<br />
          ENTREPRENEURIAL ECONOMICS
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-[64px] items-start">
        <EvidenceBlock index={0} />
        <EvidenceBlock index={1} />
      </div>

      <div className="w-full my-12 mx-auto">
        <blockquote
          className={`${lora.className} italic text-[22px] leading-[1.6] text-gray-600 border-l-[3px] border-brand-primary pl-4 my-6`}
        >
          "Traditional economics explains why Domino's worked.
          Entrepreneurial economics is what Monaghan was doing while
          building it."
        </blockquote>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-[64px] items-start">
        <EvidenceBlock index={2} />
        <EvidenceBlock index={3} />
      </div>

      <div className="w-full my-12" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-[64px] items-start">
        <EvidenceBlock index={4} />
        <EvidenceBlock index={5} />
      </div>
    </>
  );
};
