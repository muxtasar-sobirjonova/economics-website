'use client';
import { motion, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion';

export const ArticlesMockup = () => (
  <div className="bg-[#F8F9FC] rounded-3xl border border-gray-200 shadow-xl overflow-hidden text-left flex flex-col h-[400px] w-full shrink-0 relative">
    <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2 w-full shrink-0 h-6"></div>
    <div className="p-6 flex-1 flex items-center justify-center bg-gray-50 flex-nowrap overflow-x-auto snap-x px-6 gap-4">
       <motion.div 
         whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
         className="w-[280px] group block bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col cursor-pointer shrink-0 snap-center" role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') {} }}
       >
         <div className="mb-4">
           <span className="inline-block bg-[rgba(200,217,230,0.4)] text-[#4ebdd5] text-xs font-bold px-2 py-1 rounded-full">Network Effects</span>
         </div>
         <h2 className="font-semibold text-[#0096a5] text-lg leading-snug mb-2 group-hover:text-[#4ebdd5] transition-colors">How AirBnB Hacked Network Effects</h2>
         <p className="text-[#4ebdd5] text-sm mt-2 line-clamp-3 mb-6 flex-1">Understanding the critical mass required for a two-sided marketplace to become defensible.</p>
         <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
           <span className="text-[#4ebdd5] text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">Read more <span className="ml-1">→</span></span>
         </div>
       </motion.div>
       <motion.div 
         whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
         className="w-[280px] group block bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col cursor-pointer shrink-0 snap-center" role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') {} }}
       >
         <div className="mb-4">
           <span className="inline-block bg-purple-50 text-purple-600 text-xs font-bold px-2 py-1 rounded-full">Unit Economics</span>
         </div>
         <h2 className="font-semibold text-purple-700 text-lg leading-snug mb-2 group-hover:text-purple-500 transition-colors">Why Uber Still Bleeds Cash</h2>
         <p className="text-purple-500 text-sm mt-2 line-clamp-3 mb-6 flex-1">A deep dive into structural margins and why growth doesn't always equal profitability.</p>
         <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
           <span className="text-purple-600 text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">Read more <span className="ml-1">→</span></span>
         </div>
       </motion.div>
       <motion.div 
         whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
         className="w-[280px] group block bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col cursor-pointer shrink-0 snap-center" role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') {} }}
       >
         <div className="mb-4">
           <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">Monopoly</span>
         </div>
         <h2 className="font-semibold text-blue-700 text-lg leading-snug mb-2 group-hover:text-blue-500 transition-colors">Competition is for Losers</h2>
         <p className="text-blue-500 text-sm mt-2 line-clamp-3 mb-6 flex-1">Why capturing 100% of a small market is better than 1% of a large market.</p>
         <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
           <span className="text-blue-600 text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">Read more <span className="ml-1">→</span></span>
         </div>
       </motion.div>
    </div>
  </div>
);