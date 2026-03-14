'use client';

import Link from 'next/link';
import { useProgress } from '@/components/ProgressContext';

export default function HomeClient({ totalQuestions }: { totalQuestions: number }) {
  const { data } = useProgress();
  const attempted = Object.keys(data.attempted).length;
  const correct = Object.keys(data.correct).filter((id) => data.correct[id]).length;
  const pct = totalQuestions > 0 ? Math.round((attempted / totalQuestions) * 100) : 0;

  if (totalQuestions === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center pt-8 border-t border-slate-100 dark:border-white/5">
      <div className="flex items-center gap-4 mb-3 w-full max-w-sm">
        <span className="text-sm font-semibold text-slate-900 dark:text-white shrink-0">Your Progress</span>
        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
          <div
            className="bg-[#0066FF] h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-sm font-bold text-[#0066FF] shrink-0">{pct}%</span>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        You have attempted <strong>{attempted}</strong> questions and answered <strong>{correct}</strong> correctly out of {totalQuestions}.
      </p>
    </div>
  );
}
