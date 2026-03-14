'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Question, Topic } from '@/lib/types';
import { useProgress } from '@/components/ProgressContext';

type QuestionWithTopic = Question & { topics: { name: string; color: string } };

function PracticeContent() {
  const searchParams = useSearchParams();
  const topicFilter = searchParams.get('topic');
  const isRandom = searchParams.get('mode') === 'random';

  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<QuestionWithTopic[]>([]);
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>(topicFilter ?? 'all');
  const [loading, setLoading] = useState(true);

  const { data: progressData, markAttempted, markCorrect } = useProgress();

  useEffect(() => {
    fetch('/api/topics').then((r) => r.json()).then(setTopics).catch(() => {});
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const url = selectedTopic === 'all' ? '/api/questions' : `/api/questions?topic=${selectedTopic}`;
    const data: QuestionWithTopic[] = await fetch(url).then((r) => r.json()).catch(() => []);
    const shuffled = isRandom ? [...data].sort(() => Math.random() - 0.5) : data;
    setQuestions(shuffled);
    setCurrent(0);
    setRevealed(false);
    setLoading(false);
  }, [selectedTopic, isRandom]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  function onReveal() {
    setRevealed(true);
    const q = questions[current];
    if (q) markAttempted(q.id);
  }

  function onMarkCorrect(correct: boolean) {
    const q = questions[current];
    if (q) markCorrect(q.id, correct);
  }

  function next() {
    setRevealed(false);
    setCurrent((c) => Math.min(c + 1, questions.length - 1));
  }

  function prev() {
    setRevealed(false);
    setCurrent((c) => Math.max(c - 1, 0));
  }

  const q = questions[current];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-8 py-5">
        <nav className="text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-600 dark:text-slate-300">Practice Questions</span>
        </nav>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Practice Questions</h1>
          {questions.length > 0 && (
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {current + 1} / {questions.length}
            </span>
          )}
        </div>

        {/* Topic filter */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <FilterChip label="All Topics" active={selectedTopic === 'all'} onClick={() => setSelectedTopic('all')} />
          {topics.map((t) => (
            <FilterChip key={t.id} label={t.name} active={selectedTopic === t.id} onClick={() => setSelectedTopic(t.id)} />
          ))}
        </div>
      </div>

      <div className="px-8 py-8 max-w-3xl">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">✏</p>
            <p className="font-medium">No questions found.</p>
            <p className="text-sm mt-1">
              Add questions via the{' '}
              <Link href="/admin/questions" className="text-teal-600 hover:underline">Admin Panel</Link>.
            </p>
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
              <span className="text-xs font-medium text-slate-400 shrink-0">{current + 1} of {questions.length}</span>
            </div>

            {/* Question card */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
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
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
                  {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {q.question_type === 'long_answer' ? 'Long Answer' : 'Short Answer'}
                </span>
                {progressData.attempted[q.id] && (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    progressData.correct[q.id]
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                      : 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'
                  }`}>
                    {progressData.correct[q.id] ? '✓ Answered correctly' : '✗ Needs review'}
                  </span>
                )}
              </div>

              {/* Question */}
              <p className="text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed mb-6">
                {q.question_text}
              </p>

              {/* Answer section */}
              {revealed ? (
                <div className="animate-fade-in">
                  <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-5 mb-4">
                    <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-3">
                      Model Answer
                    </p>
                    <pre className="whitespace-pre-wrap text-sm text-teal-900 dark:text-teal-100 font-sans leading-relaxed">
                      {q.model_answer}
                    </pre>
                  </div>
                  {/* Self-assessment */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => onMarkCorrect(true)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        progressData.correct[q.id] === true
                          ? 'bg-green-500 text-white'
                          : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 hover:bg-green-100'
                      }`}
                    >
                      ✓ I got it right
                    </button>
                    <button
                      onClick={() => onMarkCorrect(false)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        progressData.correct[q.id] === false
                          ? 'bg-orange-500 text-white'
                          : 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 hover:bg-orange-100'
                      }`}
                    >
                      ✗ Need to review
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onReveal}
                  className="w-full py-3 border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-xl text-sm font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                >
                  Show Model Answer
                </button>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-5">
              <button
                onClick={prev}
                disabled={current === 0}
                className="px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <button
                onClick={() => { setCurrent(Math.floor(Math.random() * questions.length)); setRevealed(false); }}
                className="px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                🔀 Random
              </button>
              <button
                onClick={next}
                disabled={current === questions.length - 1}
                className="px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
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

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PracticeContent />
    </Suspense>
  );
}
