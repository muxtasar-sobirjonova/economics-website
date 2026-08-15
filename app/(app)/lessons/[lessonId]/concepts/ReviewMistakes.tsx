"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for mistakes - you can replace this with your actual data source
const mistakes = [
  {
    id: 1,
    term: "Opportunity Cost",
    mistake: "You forgot to consider the value of the next best alternative.",
  },
  {
    id: 2,
    term: "Supply and Demand",
    mistake:
      "You confused a shift in the demand curve with a movement along it.",
  },
  {
    id: 3,
    term: "Elasticity",
    mistake: "You miscalculated the price elasticity of demand.",
  },
  {
    id: 4,
    term: "Comparative Advantage",
    mistake:
      "You didn't correctly identify which party had the comparative advantage.",
  },
  {
    id: 5,
    term: "Inflation",
    mistake: "You mixed up nominal and real interest rates.",
  },
];

export default function ReviewMistakesComponent() {
  const [currentMistakeIndex, setCurrentMistakeIndex] = useState(0);

  const handleNextMistake = () => {
    if (currentMistakeIndex < mistakes.length - 1) {
      setCurrentMistakeIndex(currentMistakeIndex + 1);
    } else {
      // You can add logic here for when all mistakes are reviewed,
      // like navigating to a summary page.
      alert("Great job! You've reviewed all your mistakes.");
    }
  };

  const currentMistake = mistakes[currentMistakeIndex];

  return (
    <div className="review-mistakes-container bg-[#FDFBF7] min-h-screen w-full font-sans flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <p className="text-[#111827] font-semibold">Reviewing Mistake</p>
          <p className="text-lg font-bold text-[#4ebdd5]">
            {currentMistakeIndex + 1}/{mistakes.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMistake.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <h3 className="text-lg font-bold text-[#111827] mb-2">
              {currentMistake.term}
            </h3>
            <p className="text-[#4B5563]">{currentMistake.mistake}</p>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={handleNextMistake}
          className="w-full mt-6 bg-brand-primary text-white font-[500] py-3 px-4 rounded-xl hover:bg-brand-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#4ebdd5] focus:ring-opacity-50"
        >
          Got it — mark reviewed
        </button>
      </div>
    </div>
  );
}