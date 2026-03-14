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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-8 py-5">
        <nav className="text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-600 dark:text-slate-300">Flashcards</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Flashcards</h1>
            <p className="text-xs text-slate-400 mt-0.5">Click the card to flip and reveal the answer</p>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
              <span className="text-base">✅</span> {sessionStats.mastered}
            </span>
            <span className="flex items-center gap-1 text-orange-500 dark:text-orange-400 font-medium">
              <span className="text-base">🔄</span> {sessionStats.review}
            </span>
            <span className="text-slate-400 dark:text-slate-500">
              {masteredIds.length} mastered total
            </span>
          </div>
        </div>

        {/* Topic filter */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <FilterChip label="All Topics" active={selectedTopic === 'all'} onClick={() => setSelectedTopic('all')} />
          {topics.map((t) => (
            <FilterChip key={t.id} label={t.name} active={selectedTopic === t.id} onClick={() => setSelectedTopic(t.id)} />
          ))}
        </div>
      </div>

      <div className="px-8 py-8 max-w-2xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-5xl mb-4">🃏</p>
            <p className="font-medium text-base">No flashcards found.</p>
            <p className="text-sm mt-1">Add questions via the <Link href="/admin/questions" className="text-teal-600 hover:underline">Admin Panel</Link>.</p>
          </div>
        ) : done ? (
          /* Session complete screen */
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Session Complete!</h2>
            <p className="text-slate-400 mb-6">You went through {questions.length} cards.</p>
            <div className="flex justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">{sessionStats.mastered}</div>
                <div className="text-xs text-slate-400 mt-1">Mastered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">{sessionStats.review}</div>
                <div className="text-xs text-slate-400 mt-1">Need Review</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-400">{sessionStats.skipped}</div>
                <div className="text-xs text-slate-400 mt-1">Skipped</div>
              </div>
            </div>
            <button
              onClick={fetchQuestions}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
            >
              🔄 Start New Session
            </button>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 bg-gray-200 dark:bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-teal-500 to-teal-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 shrink-0 font-medium">{current + 1} / {questions.length}</span>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {q.topics && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  {q.topics.name}
                </span>
              )}
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                q.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' :
                q.difficulty === 'hard' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' :
                'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
              }`}>{q.difficulty}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
              </span>
              {progressData.flashcardMastered[q.id] && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-medium">
                  ✅ Previously mastered
                </span>
              )}
            </div>

            {/* The flip card */}
            <div
              className="perspective cursor-pointer select-none mb-6"
              style={{ height: '280px' }}
              onClick={() => setFlipped((f) => !f)}
              role="button"
              aria-label={flipped ? 'Hide answer' : 'Reveal answer'}
            >
              <div className={`card-inner w-full h-full ${flipped ? 'flipped' : ''}`}>
                {/* Front — Question */}
                <div className="card-face bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm">
                  <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-4">Question</p>
                  <p className="text-base font-medium text-slate-800 dark:text-slate-100 text-center leading-relaxed">
                    {q.question_text}
                  </p>
                  <p className="text-xs text-slate-300 dark:text-slate-600 mt-6">Tap to reveal answer →</p>
                </div>

                {/* Back — Answer */}
                <div className="card-face card-back bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-8 flex flex-col items-start justify-center shadow-sm overflow-y-auto">
                  <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-4">Model Answer</p>
                  <p className="text-sm text-teal-900 dark:text-teal-100 leading-relaxed whitespace-pre-wrap">
                    {q.model_answer}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons — only show after flip */}
            {flipped ? (
              <div className="flex gap-3 animate-fade-in">
                <button
                  onClick={handleMastered}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  ✅ Got it!
                </button>
                <button
                  onClick={handleReview}
                  className="flex-1 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  🔄 Review again
                </button>
                <button
                  onClick={handleSkip}
                  className="px-5 py-3 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium rounded-xl transition-colors"
                >
                  Skip
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={() => setFlipped(true)}
                  className="px-8 py-3 border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-xl text-sm font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                >
                  Show Answer
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-teal-600 text-white shadow-sm'
          : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-teal-300'
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
