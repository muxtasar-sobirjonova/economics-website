'use client';
import { BrowserChrome } from './BrowserChrome';
import { IconCheck, IconLock } from '@tabler/icons-react';
import { motion, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion';

export const DashboardMockup = () => (
  <motion.div 
    initial={{ rotate: 2 }}
    whileHover={{ rotate: 0, y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
    className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden text-left flex flex-col h-auto max-h-[520px] w-full max-w-lg mx-auto relative z-10"
  >
    <BrowserChrome />
    <div className="p-10 flex-1 overflow-y-auto flex flex-col">
      {/* ── Header ── */}
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-gray-900 font-[800] text-xl tracking-tight leading-none">
          Today's Agenda
        </h2>
        <div className="text-[13px] font-[500] text-brand-primary bg-[#F3F0FF] px-3 py-1 rounded-full leading-none">
          ~25 min total
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4 flex flex-col gap-2 mt-2">
        <div className="flex justify-between text-xs font-bold text-gray-500">
          <span>Progress</span>
          <span>1 of 3 done</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
           <motion.div 
             className="h-full bg-brand-primary rounded-full" 
             initial={{ width: 0 }}
             whileInView={{ width: "33.33%" }}
             transition={{ duration: 0.6, ease: "circOut" }}
           />
        </div>
      </div>

      {/* ── Items ── */}
      <div className="flex flex-col gap-3 flex-1">
        {/* Concept */}
        <div className="flex items-center py-2 pr-3 pl-3 border-[1.5px] border-gray-100 rounded-2xl group bg-white transition-all hover:shadow-sm hover:border-gray-200 opacity-60">
          <div className="w-1 h-6 rounded-full mr-3 shrink-0 transition-colors group-hover:shadow-[0_0_8px_rgba(123,111,231,0.5)] bg-amber-600" />
          <div className="flex-1 flex items-center flex-wrap gap-2">
            <div className="text-[10px] font-[800] px-2 py-0.5 rounded-md tracking-wider uppercase bg-amber-100 text-amber-600">CONCEPT</div>
            <div className="text-sm font-[600] leading-tight text-gray-900 line-clamp-1 max-w-[200px]">Value Creation</div>
            <div className="bg-gray-50 text-brand-primary font-[500] text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ml-auto">~5 min</div>
          </div>
          <button className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ml-3 cursor-pointer bg-green-700 border-green-700 border-[1.5px] shadow-[0_0_0_3px_rgba(21,128,61,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') {} }}>
            <IconCheck size={20} className="text-white" stroke={3} />
          </button>
        </div>
        
        {/* Article */}
        <div className="flex items-center py-2 pr-3 pl-3 border-[1.5px] border-gray-100 rounded-2xl group bg-white transition-all hover:shadow-sm hover:border-gray-200 opacity-100">
          <div className="w-1 h-6 rounded-full mr-3 shrink-0 transition-colors group-hover:shadow-[0_0_8px_rgba(123,111,231,0.5)] bg-blue-600" />
          <div className="flex-1 flex items-center flex-wrap gap-2">
            <div className="text-[10px] font-[800] px-2 py-0.5 rounded-md tracking-wider uppercase bg-blue-100 text-blue-600">ARTICLE</div>
            <div className="text-sm font-[600] leading-tight text-gray-900 line-clamp-1 max-w-[200px]">AirBnB Case Study</div>
            <div className="bg-gray-50 text-brand-primary font-[500] text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ml-auto">~15 min</div>
          </div>
          <button className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ml-3 cursor-pointer border-gray-200 border-[1.5px] hover:border-[#5C4DE3] hover:bg-[#F3F0FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') {} }}><IconLock size={16} className="text-gray-400" /></button>
        </div>
        
        {/* Quiz */}
        <div className="flex items-center py-2 pr-3 pl-3 border-[1.5px] border-gray-100 rounded-2xl group bg-white transition-all hover:shadow-sm hover:border-gray-200 opacity-100">
          <div className="w-1 h-6 rounded-full mr-3 shrink-0 transition-colors group-hover:shadow-[0_0_8px_rgba(123,111,231,0.5)] bg-purple-600" />
          <div className="flex-1 flex items-center flex-wrap gap-2">
            <div className="text-[10px] font-[800] px-2 py-0.5 rounded-md tracking-wider uppercase bg-purple-100 text-purple-600">QUIZ</div>
            <div className="text-sm font-[600] leading-tight text-gray-900 line-clamp-1 max-w-[200px]">Market Dynamics</div>
            <div className="bg-gray-50 text-brand-primary font-[500] text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ml-auto">~5 min</div>
          </div>
          <button className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ml-3 cursor-pointer border-gray-200 border-[1.5px] hover:border-[#5C4DE3] hover:bg-[#F3F0FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') {} }}><IconLock size={16} className="text-gray-400" /></button>
        </div>
      </div>
    </div>
  </motion.div>
);