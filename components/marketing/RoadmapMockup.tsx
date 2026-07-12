'use client';
import { IconBook, IconCheck, IconLock } from '@tabler/icons-react';
import { motion, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion';

export const RoadmapMockup = () => (
  <div className="bg-[#F8F9FC] rounded-3xl border border-gray-200 shadow-xl relative w-full h-auto max-h-[520px] flex flex-col overflow-hidden text-left z-10 mx-auto group">
    <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2 w-full shrink-0 h-6"></div>
    <div className="flex-1 flex overflow-hidden">
      <div className="w-[60px] md:w-[80px] bg-[#362A5C] shrink-0 flex flex-col items-center py-6 border-r border-gray-200 z-20">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-brand-primary text-white font-bold text-lg flex items-center justify-center mb-8 shadow-sm"><IconBook size={20} /></div>
        <div className="w-full flex flex-col gap-4 px-3 opacity-60">
          <div className="w-full h-6 md:h-8 rounded-lg bg-white/10"></div>
          <div className="w-full h-6 md:h-8 rounded-lg bg-white/20 border-l-4 border-white"></div>
          <div className="w-full h-6 md:h-8 rounded-lg bg-white/10 mt-4"></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-white flex relative">
        <div className="flex-1 flex flex-col items-center pt-8 pb-12 relative px-4">
          <motion.div 
            whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)", scale: 1.01 }} 
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full max-w-sm bg-purple-100 rounded-3xl p-6 text-left relative overflow-hidden mb-16 shadow-sm border border-purple-200 cursor-pointer" role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') {} }}
          >
            <div className="text-[#362A5C] text-xs font-bold uppercase tracking-wider mb-2">Chapter 1</div>
            <h3 className="text-xl font-black text-slate-900 leading-tight mb-3">Foundations of<br/>Entrepreneurship Economics</h3>
            <p className="text-sm text-[#362A5C] leading-relaxed max-w-[85%]">Understand what entrepreneurship economics is, why entrepreneurs exist, and how businesses create, deliver, and capture value in the economy.</p>
            <button className="absolute top-6 right-6 bg-white text-brand-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">Start &rarr;</button>
          </motion.div>
          <div className="relative w-full max-w-xs flex flex-col items-center mt-4">
            <div className="relative z-10 flex flex-col items-center -ml-16">
              <button className="bg-white text-brand-primary border border-gray-200 shadow-sm text-[10px] font-bold px-3 py-1 rounded-full mb-3 absolute -top-10 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">Start reading</button>
              <motion.div 
                whileHover={{ y: -2, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-20 h-20 rounded-full border border-dashed border-brand-primary flex items-center justify-center p-2 mb-2 bg-white cursor-pointer" role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') {} }}
              >
                 <div className="w-full h-full rounded-full bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30 text-white">
                   <IconCheck size={28} />
                 </div>
              </motion.div>
              <div className="text-xs font-bold text-slate-900 text-center max-w-[120px]">What Is Entrepreneurship Economics?</div>
            </div>
            <svg className="absolute top-[80px] left-1/2 -ml-16 w-32 h-24 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 10 0 C 10 50, 90 50, 90 100" fill="none" stroke="#C4B5FD" strokeWidth="2" strokeDasharray="6,4" />
            </svg>
            <div className="relative z-10 flex flex-col items-center mt-8 ml-20">
              <div className="w-16 h-16 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center mb-2 shadow-sm">
                 <IconLock size={20} className="text-gray-400" />
              </div>
              <div className="text-xs font-bold text-gray-500 text-center max-w-[120px]">Why Do Entrepreneurs Exist?<br/><span className="text-[10px] font-normal text-gray-400 mt-1 block">Unlocks after Chapter 1</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);