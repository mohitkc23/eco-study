'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Lecture } from '@/lib/types';

export default function TopicClient({ lectures, topicSlug }: { lectures: Lecture[]; topicSlug: string }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggle(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-3">
      {lectures.map((lecture, idx) => {
        const isOpen = expanded === lecture.id;
        const hasNotes = !!lecture.notes_md;

        return (
          <div
            key={lecture.id}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-teal-200 dark:hover:border-teal-800 transition-colors"
          >
            {/* Header row */}
            <div className="flex items-center gap-4 p-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-500 dark:text-slate-400 shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{lecture.title}</p>
                <div className="flex gap-3 mt-1">
                  {lecture.pdf_filename && (
                    <span className="text-xs text-slate-400">📄 PDF available</span>
                  )}
                  {hasNotes && (
                    <span className="text-xs text-slate-400">📝 Notes available</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {hasNotes && (
                  <button
                    onClick={() => toggle(lecture.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      isOpen
                        ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600'
                    }`}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? '▲ Hide Notes' : '▼ Show Notes'}
                  </button>
                )}
                <Link
                  href={`/topics/${topicSlug}/${lecture.id}`}
                  className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:border-teal-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Full view →
                </Link>
              </div>
            </div>

            {/* Accordion notes */}
            {isOpen && hasNotes && (
              <div className="border-t border-gray-100 dark:border-slate-800 px-6 py-5 bg-slate-50 dark:bg-slate-900/50 animate-fade-in">
                <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                  <NoteRenderer content={lecture.notes_md!} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function NoteRenderer({ content }: { content: string }) {
  // Simple markdown-to-HTML renderer for basic formatting
  const lines = content.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) return <h3 key={i} className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-3 mb-1">{line.slice(3)}</h3>;
        if (line.startsWith('# '))  return <h2 key={i} className="text-base font-bold text-slate-800 dark:text-slate-100 mt-3 mb-1">{line.slice(2)}</h2>;
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="text-sm ml-4 list-disc text-slate-600 dark:text-slate-400">{line.slice(2)}</li>;
        if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-sm font-semibold text-slate-700 dark:text-slate-300">{line.slice(2, -2)}</p>;
        if (line.trim() === '') return <div key={i} className="h-1" />;
        return <p key={i} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{line}</p>;
      })}
    </div>
  );
}
