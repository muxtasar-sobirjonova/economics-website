'use client';
import { IconBulb, IconClock } from '@tabler/icons-react';
import { motion, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion';

export const ConceptsMockup = () => (
  <div className="bg-[#F8F9FC] rounded-3xl border border-gray-200 shadow-xl overflow-hidden text-left flex flex-col h-[400px] w-full shrink-0 relative">
    <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2 w-full shrink-0 h-6"></div>
    <div className="p-6 flex-1 overflow-y-auto space-y-4 bg-gray-50 flex items-center justify-center gap-6">
       {/* Card 1 */}
       <motion.div 
         className="block shrink-0 w-[260px] min-h-[220px]"
         whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
         transition={{ duration: 0.2, ease: "easeInOut" }}
       >
         <div className="relative w-full h-full min-h-[220px] p-6 rounded-[20px] cursor-pointer bg-white flex flex-col border-y border-r border-gray-100 border-l-[5px] transition-all duration-200 ease-out border-l-green-700 shadow-sm -translate-y-1" role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') {} }}>
           <div className="absolute inset-0 rounded-[20px] bg-white/60 z-20 pointer-events-none" />
           <div className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full flex items-center justify-center shadow-sm bg-green-700">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
           </div>
           <div className="relative z-10 flex flex-col h-full">
             <div className="flex items-start justify-between mb-4">
               <span className="text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-lg text-green-700 bg-green-700/10">LESSON 1</span>
             </div>
             <div className="mb-4"><IconBulb size={24} className="text-gray-600" /></div>
             <h4 className="font-bold text-[15px] leading-tight mb-2 text-[#111827] line-clamp-2">Value Creation</h4>
             <div className="flex flex-col gap-1 mb-2">
               <div className="flex items-center gap-1.5 text-gray-500"><IconClock size={14} /><span className="text-xs font-medium">5-10 mins read</span></div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full flex-shrink-0 bg-gray-300" /><span className="text-xs text-gray-500 font-medium">Completed</span></div>
             </div>
             <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-100">
               <div className="w-2 h-2 rounded-full flex-shrink-0 bg-green-700" />
               <span className="text-[10px] font-bold tracking-wider uppercase text-gray-900">COMPLETED</span>
             </div>
           </div>
         </div>
       </motion.div>
    </div>
  </div>
);