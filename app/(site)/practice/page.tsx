'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Question, Topic } from '@/lib/types';

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

  // Fetch topics
  useEffect(() => {
    fetch('/api/topics').then((r) => r.json()).then(setTopics).catch(() => {});
  }, []);

  // Fetch questions based on filter
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <nav className="text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-600">Practice Questions</span>
        </nav>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">Practice Questions</h1>
          {questions.length > 0 && (
            <span className="text-sm text-slate-500">
              {current + 1} / {questions.length}
            </span>
          )}
        </div>

        {/* Topic filter */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <FilterChip
            label="All Topics"
            active={selectedTopic === 'all'}
            onClick={() => setSelectedTopic('all')}
          />
          {topics.map((t) => (
            <FilterChip
              key={t.id}
              label={t.name}
              active={selectedTopic === t.id}
              onClick={() => setSelectedTopic(t.id)}
            />
          ))}
        </div>
      </div>

      <div className="px-8 py-8 max-w-3xl">
        {loading ? (
          <div className="text-center py-16 text-slate-400">Loading questions...</div>
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
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
              <div
                className="bg-teal-500 h-1.5 rounded-full transition-all"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              {/* Tags */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {q.topics && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {q.topics.name}
                  </span>
                )}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  q.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>{q.difficulty}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                  {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                  {q.question_type === 'long_answer' ? 'Long Answer' : 'Short Answer'}
                </span>
              </div>

              {/* Question */}
              <p className="text-base font-medium text-slate-800 leading-relaxed mb-6">
                {q.question_text}
              </p>

              {/* Answer section */}
              {revealed ? (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
                  <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">
                    Model Answer
                  </p>
                  <pre className="whitespace-pre-wrap text-sm text-teal-900 font-sans leading-relaxed">
                    {q.model_answer}
                  </pre>
                </div>
              ) : (
                <button
                  onClick={() => setRevealed(true)}
                  className="w-full py-3 border-2 border-dashed border-teal-300 rounded-xl text-sm font-medium text-teal-600 hover:bg-teal-50 transition-colors"
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
                className="px-5 py-2 text-sm font-medium text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <button
                onClick={() => { setCurrent(Math.floor(Math.random() * questions.length)); setRevealed(false); }}
                className="px-5 py-2 text-sm font-medium text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                🔀 Random
              </button>
              <button
                onClick={next}
                disabled={current === questions.length - 1}
                className="px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
          ? 'bg-teal-600 text-white'
          : 'bg-white border border-gray-200 text-slate-600 hover:border-teal-300'
      }`}
    >
      {label}
    </button>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-400">Loading...</div>}>
      <PracticeContent />
    </Suspense>
  );
}
