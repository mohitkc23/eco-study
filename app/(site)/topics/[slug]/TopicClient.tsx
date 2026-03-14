'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
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
  return (
    <div className="max-w-none text-slate-700 dark:text-slate-300 [&>h2]:text-base [&>h2]:font-bold [&>h2]:text-slate-800 dark:[&>h2]:text-slate-100 [&>h2]:mt-3 [&>h2]:mb-1 [&>h3]:text-sm [&>h3]:font-bold [&>h3]:text-slate-800 dark:[&>h3]:text-slate-100 [&>h3]:mt-3 [&>h3]:mb-1 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:text-sm [&>ul]:text-slate-600 dark:[&>ul]:text-slate-400 [&>p]:text-sm [&>p]:text-slate-600 dark:[&>p]:text-slate-400 [&>p]:leading-relaxed [&>p]:my-2 [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
