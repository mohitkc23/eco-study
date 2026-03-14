'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Topic, Question } from '@/lib/types';

type Result =
  | { type: 'topic'; id: string; slug: string; name: string; description: string | null }
  | { type: 'question'; id: string; topicId: string; text: string; topicName: string };

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Open on Ctrl+K / Cmd+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Auto-focus input when open
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Search
  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const [topicsRes, questionsRes] = await Promise.all([
        fetch('/api/topics').then((r) => r.json()),
        fetch('/api/questions').then((r) => r.json()),
      ]);

      const lower = q.toLowerCase();
      const topicResults: Result[] = (topicsRes as Topic[])
        .filter((t) => t.name.toLowerCase().includes(lower) || t.description?.toLowerCase().includes(lower))
        .map((t) => ({ type: 'topic', id: t.id, slug: t.slug, name: t.name, description: t.description }));

      const questionResults: Result[] = (questionsRes as (Question & { topics: { name: string } })[])
        .filter((q2) => q2.question_text.toLowerCase().includes(lower))
        .slice(0, 5)
        .map((q2) => ({
          type: 'question',
          id: q2.id,
          topicId: q2.topic_id,
          text: q2.question_text,
          topicName: q2.topics?.name ?? '',
        }));

      setResults([...topicResults, ...questionResults]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 200);
    return () => clearTimeout(t);
  }, [query, search]);

  // Keyboard navigation in results
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && results[selected]) navigate(results[selected]);
  }

  function navigate(r: Result) {
    setOpen(false);
    if (r.type === 'topic') router.push(`/topics/${r.slug}`);
    else router.push(`/practice?topic=${r.topicId}`);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
        aria-label="Search (Ctrl+K)"
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="9" cy="9" r="6" /><path d="m15 15 3 3" />
        </svg>
        <span>Search…</span>
        <kbd className="ml-2 text-[10px] px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded font-mono text-slate-400">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 search-overlay bg-black/40" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-400 shrink-0">
            <circle cx="9" cy="9" r="6" /><path d="m15 15 3 3" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={onKeyDown}
            placeholder="Search topics, questions…"
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm outline-none"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          <kbd className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-slate-400 shrink-0">Esc</kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="py-2 max-h-72 overflow-y-auto">
            {results.map((r, i) => (
              <li key={r.id}>
                <button
                  onClick={() => navigate(r)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selected ? 'bg-teal-50 dark:bg-teal-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-base shrink-0">{r.type === 'topic' ? '📚' : '✏'}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                      {r.type === 'topic' ? r.name : r.text}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {r.type === 'topic' ? 'Topic' : `Question · ${r.topicName}`}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query && !loading && results.length === 0 && (
          <div className="py-10 text-center text-slate-400 text-sm">No results for "{query}"</div>
        )}

        {!query && (
          <div className="py-6 text-center text-slate-400 text-xs">Type to search topics and questions</div>
        )}

        <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2 flex gap-4 text-[10px] text-slate-400">
          <span><kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">↵</kbd> select</span>
          <span><kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
