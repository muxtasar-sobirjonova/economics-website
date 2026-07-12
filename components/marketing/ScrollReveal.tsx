'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const ScrollReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ type: "spring", stiffness: 80, damping: 20, delay }}
    className={className}
  >
    {children}
  </motion.div>
);