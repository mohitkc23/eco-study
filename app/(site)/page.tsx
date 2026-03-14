import Link from 'next/link';
import { getTopicsWithCounts, getAllQuestionsWithTopic } from '@/lib/db';
import HomeClient from './HomeClient';

const TOPIC_COLORS: Record<string, { bg: string; text: string; border: string; darkBg: string; darkText: string; darkBorder: string }> = {
  'balance-of-payments':       { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   darkBg: 'dark:bg-blue-950/40',   darkText: 'dark:text-blue-400',   darkBorder: 'dark:border-blue-800' },
  'history-trade-mercantilism':{ bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  darkBg: 'dark:bg-amber-950/40',  darkText: 'dark:text-amber-400',  darkBorder: 'dark:border-amber-800' },
  'basis-for-trade':           { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', darkBg: 'dark:bg-emerald-950/40', darkText: 'dark:text-emerald-400', darkBorder: 'dark:border-emerald-800' },
  'empirical-trade-theories':  { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', darkBg: 'dark:bg-violet-950/40',  darkText: 'dark:text-violet-400', darkBorder: 'dark:border-violet-800' },
  'gains-terms-of-trade':      { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',   darkBg: 'dark:bg-teal-950/40',   darkText: 'dark:text-teal-400',   darkBorder: 'dark:border-teal-800' },
  'tariffs-quotas-trade-policy':{ bg: 'bg-rose-50',  text: 'text-rose-700',   border: 'border-rose-200',   darkBg: 'dark:bg-rose-950/40',   darkText: 'dark:text-rose-400',   darkBorder: 'dark:border-rose-800' },
  'capital-flows-crises':      { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', darkBg: 'dark:bg-orange-950/40', darkText: 'dark:text-orange-400', darkBorder: 'dark:border-orange-800' },
  'exchange-rates-open-economy':{ bg: 'bg-cyan-50',  text: 'text-cyan-700',   border: 'border-cyan-200',   darkBg: 'dark:bg-cyan-950/40',   darkText: 'dark:text-cyan-400',   darkBorder: 'dark:border-cyan-800' },
};
const DEFAULT_COLOR = { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', darkBg: 'dark:bg-slate-800/50', darkText: 'dark:text-slate-400', darkBorder: 'dark:border-slate-700' };

export default async function HomePage() {
  const topics = await getTopicsWithCounts().catch(() => []);
  const allQuestions = await getAllQuestionsWithTopic().catch(() => []);
  const totalLectures = topics.reduce((s, t) => s + t.lecture_count, 0);
  const totalQuestions = topics.reduce((s, t) => s + t.question_count, 0);

  // Build a map of topicId → questionIds for progress display
  const topicQuestionIds: Record<string, string[]> = {};
  for (const q of allQuestions) {
    if (!topicQuestionIds[q.topic_id]) topicQuestionIds[q.topic_id] = [];
    topicQuestionIds[q.topic_id].push(q.id);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] selection:bg-blue-100 selection:text-blue-900">
      
      {/* ── Scenekit-style Hero ─────────────────────────────────────── */}
      <div className="pt-24 pb-16 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* "Review" badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="flex gap-0.5 text-amber-400">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
          </span>
          IIM Visakhapatnam MBA 2025–27
        </div>

        {/* Huge centered headline */}
        <h1 className="text-5xl md:text-[5rem] font-bold tracking-[-0.04em] text-slate-900 dark:text-white leading-[1.05] mb-6">
          Master International Economics
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Capture the core concepts of trade, mercantilism, and open-economy macro. 
          Practice with model answers and session notes — all in one place.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Link
            href="/practice"
            className="px-8 py-3.5 bg-[#0066FF] hover:bg-blue-600 text-white font-medium text-lg rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
          >
            Start Practicing for Free
          </Link>
        </div>
      </div>

      {/* Progress summary (client-side) */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <HomeClient totalQuestions={totalQuestions} />
      </div>

      {/* ── Scenekit-style Bento Grid ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center text-slate-900 dark:text-white mb-12">
          Course Topics
        </h2>

        {topics.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
             <p className="text-4xl mb-3">📚</p>
             <p className="font-medium">No topics yet.</p>
             <p className="text-sm mt-1">
               Go to the <Link href="/admin" className="text-blue-600 hover:underline">Admin Panel</Link> to add topics.
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, i) => {
              const color = TOPIC_COLORS[topic.slug] ?? DEFAULT_COLOR;
              
              // We make the first item span 2 columns on large screens to give a "bento" feel
              const isLarge = i === 0 || i === 3; 

              return (
                <Link 
                  key={topic.id} 
                  href={`/topics/${topic.slug}`}
                  className={`group relative overflow-hidden rounded-[2rem] p-8 transition-transform hover:-translate-y-1 ${color.bg} ${color.darkBg} ${isLarge ? 'md:col-span-2 lg:col-span-2' : ''}`}
                >
                  {/* Inner content */}
                  <div className="relative z-10 h-full flex flex-col">
                    <span className={`inline-flex self-start text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 bg-white/50 dark:bg-black/20 rounded-full backdrop-blur-sm mb-4 ${color.text} ${color.darkText}`}>
                      {topic.sessions ?? 'Study Material'}
                    </span>
                    
                    <h3 className="font-bold text-slate-900 dark:text-white text-2xl lg:text-3xl tracking-tight leading-tight mb-3">
                      {topic.name}
                    </h3>
                    
                    {topic.description && (
                      <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300 mb-8 max-w-sm leading-relaxed">
                        {topic.description}
                      </p>
                    )}

                    <div className="mt-auto flex items-center gap-6 pt-4 border-t border-black/5 dark:border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{topic.lecture_count}</span>
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Lectures</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{topic.question_count}</span>
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Questions</span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative background circle */}
                  <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white/30 dark:bg-white/5 blur-3xl pointer-events-none transition-transform group-hover:scale-110" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
