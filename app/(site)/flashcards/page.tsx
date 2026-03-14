'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Question, Topic } from '@/lib/types';
import { useProgress } from '@/components/ProgressContext';

type QuestionWithTopic = Question & { topics: { name: string; color: string } };

function FlashcardContent() {
  const searchParams = useSearchParams();
  const topicFilter = searchParams.get('topic');

  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<QuestionWithTopic[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>(topicFilter ?? 'all');
  const [loading, setLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({ mastered: 0, review: 0, skipped: 0 });

  const { data: progressData, markFlashcardMastered, markAttempted } = useProgress();

  // Fetch topics
  useEffect(() => {
    fetch('/api/topics').then((r) => r.json()).then(setTopics).catch(() => {});
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const url = selectedTopic === 'all' ? '/api/questions' : `/api/questions?topic=${selectedTopic}`;
    const data: QuestionWithTopic[] = await fetch(url).then((r) => r.json()).catch(() => []);
    // Shuffle so flashcard order is varied
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrent(0);
    setFlipped(false);
    setSessionStats({ mastered: 0, review: 0, skipped: 0 });
    setLoading(false);
  }, [selectedTopic]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const q = questions[current];
  const masteredIds = Object.keys(progressData.flashcardMastered).filter((id) => progressData.flashcardMastered[id]);

  function handleMastered() {
    if (!q) return;
    markFlashcardMastered(q.id, true);
    markAttempted(q.id);
    setSessionStats((s) => ({ ...s, mastered: s.mastered + 1 }));
    nextCard();
  }

  function handleReview() {
    if (!q) return;
    markFlashcardMastered(q.id, false);
    markAttempted(q.id);
    setSessionStats((s) => ({ ...s, review: s.review + 1 }));
    nextCard();
  }

  function handleSkip() {
    setSessionStats((s) => ({ ...s, skipped: s.skipped + 1 }));
    nextCard();
  }

  function nextCard() {
    setFlipped(false);
    setTimeout(() => setCurrent((c) => Math.min(c + 1, questions.length - 1)), 150);
  }

  const isLast = current >= questions.length - 1;
  const done = current >= questions.length || (isLast && (sessionStats.mastered + sessionStats.review + sessionStats.skipped) > 0 && !loading);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Header */}
      <div className="px-8 pt-12 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl mx-auto w-full">
        <div>
          <nav className="text-xs text-slate-400 mb-4 font-medium uppercase tracking-widest">
            <Link href="/" className="hover:text-[#0066FF] transition-colors">Home</Link>
            <span className="mx-3 text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-slate-100">Flashcards</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Mastery <span className="font-serif italic font-medium text-[#0066FF] ml-1">Cards</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-md">
            Click the card to flip and reveal the answer. Track your progress across study sessions.
          </p>
        </div>
        <div className="flex gap-4 items-center bg-white dark:bg-slate-900 px-5 py-3 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Mastered</span>
            <span className="text-lg font-black text-[#0066FF] leading-none">{sessionStats.mastered}</span>
          </div>
          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Review</span>
            <span className="text-lg font-black text-amber-500 leading-none">{sessionStats.review}</span>
          </div>
          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total</span>
            <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{masteredIds.length}</span>
          </div>
        </div>
      </div>

      {/* Topic filter - Pill styled */}
      <div className="px-8 pb-10 max-w-5xl mx-auto w-full">
        <div className="flex gap-2.5 flex-wrap">
          <FilterChip label="All Topics" active={selectedTopic === 'all'} onClick={() => setSelectedTopic('all')} />
          {topics.map((t) => (
            <FilterChip key={t.id} label={t.name} active={selectedTopic === t.id} onClick={() => setSelectedTopic(t.id)} />
          ))}
        </div>
      </div>

      <div className="px-6 pb-24 max-w-3xl mx-auto w-full flex-1 flex flex-col items-center">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : questions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 opacity-60">
            <p className="text-6xl mb-6">🃏</p>
            <p className="font-bold text-xl text-slate-900 dark:text-white mb-2">No flashcards found.</p>
            <p className="text-sm max-w-xs">
              Add questions via the <Link href="/admin/questions" className="text-[#0066FF] hover:underline">Admin Panel</Link>.
            </p>
          </div>
        ) : done ? (
          /* Session complete screen (Infographic style) */
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in w-full">
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="88" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" fill="none" />
                <circle 
                  cx="96" cy="96" r="88" 
                  className="stroke-[#0066FF] drop-shadow-md transition-all duration-1000 ease-out" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - (sessionStats.mastered / Math.max(1, sessionStats.mastered + sessionStats.review)))}`}
                  strokeLinecap="round" 
                />
              </svg>
              <div className="flex flex-col items-center justify-center space-y-1">
                <span className="text-5xl font-black text-slate-900 dark:text-white">
                  {Math.round((sessionStats.mastered / Math.max(1, sessionStats.mastered + sessionStats.review)) * 100) || 0}%
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mastery</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Session Complete!</h2>
            <p className="text-slate-500 mb-10">You went through {questions.length} cards today. Great job.</p>
            
            <div className="flex justify-center gap-12 mb-12">
              <div className="text-center">
                <div className="text-4xl font-black text-[#0066FF]">{sessionStats.mastered}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Mastered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-amber-500">{sessionStats.review}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Needs Review</div>
              </div>
            </div>
            
            <button
              onClick={fetchQuestions}
              className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/20"
            >
              Start New Session
            </button>
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col relative pt-4">
            
            {/* The flip card */}
            <div
              className="perspective cursor-pointer select-none mb-10 w-full"
              style={{ minHeight: '380px' }}
              onClick={() => setFlipped((f) => !f)}
              role="button"
              aria-label={flipped ? 'Hide answer' : 'Reveal answer'}
            >
              <div className={`card-inner w-full h-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${flipped ? 'flipped' : ''}`}>
                
                {/* Front — Question */}
                <div className="card-face bg-white dark:bg-[#111] border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-10 flex flex-col shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.1)] transition-shadow">
                  {/* Top tags area */}
                  <div className="flex justify-between items-start mb-auto">
                    <span className="inline-flex px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                      Question {current + 1} / {questions.length}
                    </span>
                    {progressData.flashcardMastered[q.id] && (
                      <span className="inline-flex px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 text-xs font-bold text-green-600 dark:text-green-400 tracking-wider uppercase">
                        ✅ Mastered
                      </span>
                    )}
                  </div>
                  
                  {/* Center Question */}
                  <div className="flex-1 flex flex-col justify-center items-center text-center my-8">
                    <span className="text-sm font-serif italic text-[#0066FF] mb-4">
                      {q.topics?.name}
                    </span>
                    <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-[1.3] balance-text">
                      {q.question_text}
                    </p>
                  </div>
                  
                  {/* Bottom hint */}
                  <div className="mt-auto flex justify-center">
                    <span className="text-sm font-medium text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-5 py-2 rounded-full">
                      Tap anywhere to flip
                    </span>
                  </div>
                </div>

                {/* Back — Answer */}
                <div className="card-face card-back bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 flex flex-col shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none">
                  <div className="mb-6 flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                     <span className="text-xs font-bold text-[#0066FF] uppercase tracking-widest">Model Answer</span>
                     <span className="text-xs font-bold text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800">
                       {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                     </span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <p className="text-base md:text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {q.model_answer}
                    </p>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Action buttons — Pill shaped, distinct */}
            <div className="mt-auto h-16 flex items-center justify-center">
              {flipped ? (
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in">
                   <button
                    onClick={(e) => { e.stopPropagation(); handleSkip(); }}
                    className="px-8 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 font-bold rounded-full transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Skip
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleReview(); }}
                    className="px-8 py-3.5 bg-white dark:bg-[#111] border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-full transition-colors hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
                  >
                    Needs Review
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMastered(); }}
                    className="px-10 py-3.5 bg-[#0066FF] hover:bg-blue-600 text-white font-bold rounded-full transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
                  >
                    Got it!
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-md bg-slate-100 dark:bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-slate-300 dark:bg-slate-600 h-full transition-all duration-500 ease-out"
                    style={{ width: `${((current) / questions.length) * 100}%` }}
                  />
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
        active
          ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20 border border-[#0066FF]'
          : 'bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <FlashcardContent />
    </Suspense>
  );
}
