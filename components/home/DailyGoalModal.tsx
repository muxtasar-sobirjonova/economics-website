'use client';

import { useState, useEffect, useTransition } from 'react';
import { setDailyTimeGoalAction } from "@/app/actions/user";
import { triggerConfetti } from '@/lib/confetti';

export const DailyGoalModal = ({ currentGoal }: { currentGoal: number }) => {
  const [showDailyGoalModal, setShowDailyGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleOpen = () => setShowDailyGoalModal(true);
    window.addEventListener('openDailyGoalModal', handleOpen);
    return () => window.removeEventListener('openDailyGoalModal', handleOpen);
  }, []);

  useEffect(() => {
    // If dailyTimeGoal is at default (60) and user hasn't seen the modal yet
    if (currentGoal === 60 && !localStorage.getItem('hasSeenDailyGoalModal')) {
      const t = setTimeout(() => setShowDailyGoalModal(true), 500);
      return () => clearTimeout(t);
    } else {
      setShowDailyGoalModal(false);
    }
  }, [currentGoal]);

  const handleSetDailyGoal = (minutes: number) => {
    setSelectedGoal(minutes);
    localStorage.setItem('hasSeenDailyGoalModal', 'true');
    
    startTransition(async () => {
      try {
        await setDailyTimeGoalAction(minutes);
        triggerConfetti();
        setTimeout(() => setShowDailyGoalModal(false), 1500);
      } catch (err) {
        console.error(err);
      }
    });
  };

  if (!showDailyGoalModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-[500px] w-full mx-4">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-tight">
            Your Personal Entrepreneurship Economics Teacher
          </h1>
          <button 
            onClick={() => {
              localStorage.setItem('hasSeenDailyGoalModal', 'true');
              setShowDailyGoalModal(false);
            }}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold p-2"
          >
            ✕
          </button>
        </div>
        <p className="text-slate-900/70 text-[15px] mb-8 leading-relaxed">
          How much time can you commit to learning each day? We'll build
          your daily agenda around your goal.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[60, 90, 120, 180].map((mins) => {
            const label =
              mins === 60
                ? "1 hour"
                : mins === 90
                  ? "1.5 hours"
                  : mins === 120
                    ? "2 hours"
                    : "3 hours";
            return (
              <button
                key={mins}
                disabled={isPending}
                onClick={() => handleSetDailyGoal(mins)}
                className={`p-6 border-2 rounded-2xl font-bold text-base transition-all ${selectedGoal === mins ? 'border-[#6B5FE4] bg-[#6B5FE4]/10 text-[#6B5FE4]' : 'border-black/5 bg-white text-slate-900'} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <p className="text-slate-900/50 text-[13px] text-center">
          You can change this anytime in Settings
        </p>
      </div>
    </div>
  );
};
