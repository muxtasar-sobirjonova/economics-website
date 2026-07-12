'use client';
import { motion, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion';

export const FlashcardMockup = () => (
  <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.04)] w-full text-center relative overflow-hidden flex flex-col h-[480px]">
    <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2 w-full shrink-0 h-6"></div>
    <div className="relative flex flex-col items-center justify-center flex-1 p-6 overflow-hidden">
      
      {/* Counter */}
      <div className="text-sm font-[700] text-gray-600 text-center mb-6">
         Card 1 of 2
      </div>

      {/* The Stack */}
      <div className="relative w-full max-w-[460px] h-[220px] flex items-center justify-center shrink-0 mb-8 mx-auto">
         {/* Ghost 2 */}
         <div className="absolute w-full max-w-[420px] h-[200px] rounded-xl opacity-35 z-[8] bg-brand-yellow translate-y-5 scale-95" />
         {/* Ghost 1 */}
         <div className="absolute w-full max-w-[420px] h-[200px] rounded-xl opacity-60 z-[9] bg-brand-yellow translate-y-2.5 scale-[0.97]" />

         {/* Active Card */}
         <motion.div 
           whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }} 
           transition={{ duration: 0.2, ease: "easeInOut" }}
           className="absolute w-full max-w-[420px] min-h-[200px] rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex flex-col z-[10] cursor-grab text-left bg-brand-yellow"
         >
            <div className="text-[15px] leading-[1.8] text-gray-900 font-sans flex-1 overflow-hidden">
              <span className="font-bold">In simple terms</span>, entrepreneurial economics is the science of turning problems into opportunities and opportunities into value.
            </div>
            <div className="mt-4 flex justify-between items-center shrink-0">
              <span className="text-[10px] text-gray-400">Lesson 1 - What Is Entrepreneurship Economics?</span>
            </div>
         </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center shrink-0 w-full max-w-[360px] mx-auto scale-90">
         <button className="flex-1 bg-red-50 border-2 border-red-500 text-red-500 rounded-xl py-3 font-[700] text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
           ↻ Review Again
         </button>
         <button className="flex-1 bg-green-50 border-2 border-green-500 text-green-500 rounded-xl py-3 font-[700] text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
           ✓ Memorized
         </button>
      </div>

      {/* Left/Right Overlays (decorative only for the mockup to look like the real UI's empty spaces) */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center opacity-50">
        <div className="text-green-500 font-[700] text-[10px]">✓ Memorized</div>
      </div>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center opacity-50">
        <div className="text-red-500 font-[700] text-[10px]">↻ Review Again</div>
      </div>
    </div>
  </div>
);