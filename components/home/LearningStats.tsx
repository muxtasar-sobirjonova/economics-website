'use client';

import { IconFlame, IconCircleCheck, IconTargetArrow, IconStar, IconTrophy } from '@tabler/icons-react';

interface Stat {
  label: string;
  value: string;
  meta: string;
  icon: React.ElementType;
  tone: string;
  toneSoft: string;
}

function StatTile({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  return (
    <div className="bg-surface border border-line rounded-lg shadow-sh1 p-s4 flex flex-col gap-s3">
      <div className="flex items-center gap-s2">
        <span
          className="w-7 h-7 rounded-md grid place-items-center shrink-0"
          style={{ background: stat.toneSoft, color: stat.tone }}
        >
          <Icon size={15} stroke={2.1} />
        </span>
        <span className="text-label uppercase text-faint">{stat.label}</span>
      </div>
      <div className="mt-auto">
        <div className="font-mono text-h2 text-ink tabular leading-none">{stat.value}</div>
        <div className="text-meta text-muted mt-s2">{stat.meta}</div>
      </div>
    </div>
  );
}

export const LearningStats = ({
  backendStreak,
  completedLessonsCount,
  avgQuizScore,
  xpThisWeek,
  totalXP,
}: {
  backendStreak: number;
  completedLessonsCount: number;
  avgQuizScore: number;
  xpThisWeek: number;
  totalXP: number;
}) => {
  const safe = (n: number) => (typeof n === 'number' && !isNaN(n) ? n : 0);

  const stats: Stat[] = [
    {
      label: 'Current streak',
      value: String(safe(backendStreak)),
      meta: safe(backendStreak) === 1 ? 'day in a row' : 'days in a row',
      icon: IconFlame,
      tone: 'var(--reward)',
      toneSoft: 'var(--reward-soft)',
    },
    {
      label: 'Lessons',
      value: String(safe(completedLessonsCount)),
      meta: 'completed of 56',
      icon: IconCircleCheck,
      tone: 'var(--article)',
      toneSoft: 'var(--article-soft)',
    },
    {
      label: 'Avg quiz score',
      value: `${safe(avgQuizScore)}%`,
      meta: safe(avgQuizScore) >= 80 ? 'above the pass mark' : 'pass mark is 80%',
      icon: IconTargetArrow,
      tone: 'var(--success)',
      toneSoft: 'var(--success-soft)',
    },
    {
      label: 'XP this week',
      value: safe(xpThisWeek).toLocaleString(),
      meta: 'since Monday',
      icon: IconStar,
      tone: 'var(--quiz)',
      toneSoft: 'var(--quiz-soft)',
    },
    {
      label: 'Total XP',
      value: safe(totalXP).toLocaleString(),
      meta: 'on this track',
      icon: IconTrophy,
      tone: 'var(--concept)',
      toneSoft: 'var(--concept-soft)',
    },
  ];

  return (
    <section className="w-full mx-auto mt-s6 max-w-[1200px]">
      <h2 className="text-h3 font-semibold text-ink mb-s4">Your learning stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-s3">
        {stats.map((s) => (
          <StatTile key={s.label} stat={s} />
        ))}
      </div>
    </section>
  );
};
