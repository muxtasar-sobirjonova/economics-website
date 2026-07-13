"use client";

import Link from 'next/link';
import { IconRocket, IconChevronDown } from '@tabler/icons-react';
import { DashboardMockup } from './DashboardMockup';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export const MarketingHero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const mockupY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="py-20 md:py-32 relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          style={{ y: textY }}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center justify-center text-center mb-16"
        >
        
        {/* Screen reader only text for the split headline */}
        <span className="sr-only" id="hero-heading">Master Entrepreneurial Economics, One Concept at a Time.</span>
        
        <motion.h1 
          variants={fadeUp}
          aria-hidden="true"
          className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8 break-words max-w-4xl mx-auto flex flex-wrap justify-center gap-x-[16px] md:gap-x-[20px]"
        >
          <span>Master</span>
          <span>Entrepreneurial</span>
          <span>Economics,</span>
          <span className="text-brand-primary">One</span>
          <span className="text-brand-primary">Concept</span>
          <span className="text-brand-primary">at</span>
          <span className="text-brand-primary">a</span>
          <span className="text-brand-primary">Time.</span>
        </motion.h1>
        
        <motion.p variants={fadeUp} className="text-xl text-gray-600 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
          Learn core concepts, apply them through real-world case studies, and build a notebook you'll actually use. <strong className="text-slate-900">Constantly updated with fresh case studies and interactive lessons.</strong>
        </motion.p>
        
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full sm:w-auto">
          <Link href="/login" className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-[#2A2A5E] transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center hover:scale-105 active:scale-95 duration-200 btn-shimmer group relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-brand-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
            <span className="relative z-10 group-hover:scale-105 transition-transform duration-200 block">Start learning today</span>
          </Link>
          <Link href="#roadmap" className="w-full sm:w-auto px-10 py-4 bg-transparent text-gray-600 rounded-full font-bold text-lg hover:bg-gray-50 hover:text-slate-900 transition-colors flex items-center justify-center hover:scale-105 active:scale-95 duration-200 focus:outline-none focus:ring-4 focus:ring-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
            Take a Quick Tour
          </Link>
        </motion.div>
        
        <motion.div variants={fadeUp} className="mt-6 flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full shadow-sm">
          <IconRocket size={16} className="text-brand-primary" aria-hidden="true" />
          <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">Engineered for aspiring founders</span>
        </motion.div>
      </motion.div>
      
      <motion.div 
        style={{ y: mockupY }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 80, damping: 20 }}
        className="flex justify-center w-full relative max-w-4xl mx-auto"
      >
        <DashboardMockup />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1, duration: 1 }}
        className="w-full flex justify-center mt-20"
      >
        <IconChevronDown size={32} className="text-gray-600 animate-bounce" aria-hidden="true" />
      </motion.div>
    </div>
  </section>
  );
};
