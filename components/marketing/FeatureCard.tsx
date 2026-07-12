'use client';
import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass?: string;
  bgClass?: string;
}

export const FeatureCard = ({ icon, title, description, colorClass = "text-brand-primary", bgClass = "bg-[#F5F3FF]" }: FeatureCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative group flex flex-col items-start text-left p-8 bg-white rounded-3xl border border-gray-200 shadow-sm h-full cursor-pointer overflow-hidden" role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') {} }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          /* Dynamic radial gradient based on mouse position (runtime value) */
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(123, 111, 231, 0.08),
              transparent 80%
            )
          `,
        }}
      />
      <div className={`relative z-10 w-14 h-14 ${bgClass} ${colorClass} rounded-2xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="relative z-10 font-bold text-slate-900 text-xl mb-3">{title}</h3>
      <p className="relative z-10 text-gray-600 leading-relaxed text-[15px]">{description}</p>
    </motion.div>
  );
};