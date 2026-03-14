'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Lecture, Topic, Question, SessionMedia } from '@/lib/types';

interface Props {
  topic: Topic;
  lecture: Lecture;
  questions: Question[];
  media: SessionMedia[];
}

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function LectureClient({ topic, lecture, questions, media }: Props) {
  const [activeTab, setActiveTab] = useState<'notes' | 'pdf'>('notes');
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const hasPdf = !!lecture.pdf_filename;
  const hasNotes = !!lecture.notes_md;
  const videos = media.filter((m) => m.media_type === 'youtube');
  const images = media.filter((m) => m.media_type === 'image');

  function toggleReveal(id: string) {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-5">
        <nav className="text-xs text-neutral-400 mb-2 flex items-center gap-1.5">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span>›</span>
          <Link href={`/topics/${topic.slug}`} className="hover:text-teal-600">{topic.name}</Link>
          <span>›</span>
          <span className="text-neutral-600">{lecture.title}</span>
        </nav>

        <div className="flex items-start justify-between gap-4">
          <div>
            {lecture.session_number && (
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-1">
                Session {lecture.session_number}
              </p>
            )}
            <h1 className="text-xl font-bold text-neutral-900">{lecture.title}</h1>
          </div>
          <Link
            href={`/topics/${topic.slug}`}
            className="shrink-0 text-sm text-neutral-500 hover:text-neutral-800 border border-neutral-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            ← Topic Overview
          </Link>
        </div>

        {(hasNotes || hasPdf) && (
          <div className="flex gap-0 mt-5 border-b -mb-5">
            {hasNotes && (
              <TabBtn active={activeTab === 'notes'} onClick={() => setActiveTab('notes')}>
                Notes
              </TabBtn>
            )}
            {hasPdf && (
              <TabBtn active={activeTab === 'pdf'} onClick={() => setActiveTab('pdf')}>
                Lecture Slides
              </TabBtn>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <>
            {hasNotes ? (
              <article className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8">
                <div className="prose prose-neutral prose-sm max-w-none prose-headings:font-semibold prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-p:leading-relaxed prose-li:text-neutral-700 prose-strong:text-neutral-900 prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:rounded prose-code:text-neutral-700 prose-table:text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{lecture.notes_md}</ReactMarkdown>
                </div>
              </article>
            ) : (
              <div className="text-center py-20 text-neutral-400">
                <p className="text-3xl mb-3">📝</p>
                <p className="font-medium">No notes added yet.</p>
                {hasPdf && (
                  <button onClick={() => setActiveTab('pdf')} className="mt-3 text-sm text-teal-600 hover:underline">
                    View PDF slides →
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* PDF TAB */}
        {activeTab === 'pdf' && hasPdf && (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
              <span className="text-xs text-neutral-400">{lecture.pdf_filename}</span>
              <a href={`/pdfs/${lecture.pdf_filename}`} target="_blank" rel="noopener noreferrer"
                className="text-xs text-teal-600 hover:underline">
                Open full screen ↗
              </a>
            </div>
            <iframe src={`/pdfs/${lecture.pdf_filename}`} className="w-full" style={{ height: '80vh' }} title={lecture.title} />
          </div>
        )}

        {/* VIDEOS */}
        {videos.length > 0 && (
          <section className="mt-10">
            <SectionHeading>Videos</SectionHeading>
            <div className="space-y-6">
              {videos.map((v) => {
                const vid = extractYouTubeId(v.url);
                if (!vid) return null;
                return (
                  <div key={v.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${vid}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={v.caption ?? 'Video'}
                      />
                    </div>
                    {v.caption && (
                      <p className="px-5 py-3 text-sm text-neutral-500 border-t border-neutral-100">{v.caption}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* IMAGES */}
        {images.length > 0 && (
          <section className="mt-10">
            <SectionHeading>Figures & Diagrams</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((img) => (
                <div key={img.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.caption ?? 'Figure'} className="w-full object-contain max-h-80" />
                  {img.caption && (
                    <p className="px-4 py-2.5 text-xs text-neutral-500 border-t border-neutral-100">{img.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PRACTICE QUESTIONS */}
        {questions.length > 0 && (
          <section className="mt-10">
            <SectionHeading count={questions.length}>Practice Questions</SectionHeading>
            <div className="space-y-4">
              {questions.map((q, i) => (
                <div key={q.id} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-5">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700' :
                      q.difficulty === 'hard' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                    }`}>{q.difficulty}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500">{q.marks} marks</span>
                  </div>
                  <p className="text-sm font-medium text-neutral-800 mb-3">
                    <span className="text-neutral-400 mr-1.5">Q{i + 1}.</span>{q.question_text}
                  </p>
                  {revealedIds.has(q.id) ? (
                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-sm">
                      <p className="text-[10px] font-bold text-teal-500 uppercase tracking-widest mb-2">Model Answer</p>
                      <div className="prose prose-sm prose-teal max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{q.model_answer}</ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => toggleReveal(q.id)}
                      className="text-sm text-teal-600 border border-teal-200 rounded-lg px-4 py-2 hover:bg-teal-50 transition-colors">
                      Show Answer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
        active ? 'border-teal-600 text-teal-700' : 'border-transparent text-neutral-500 hover:text-neutral-800'
      }`}>
      {children}
    </button>
  );
}

function SectionHeading({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <h2 className="text-base font-semibold text-neutral-700 mb-4 flex items-center gap-2">
      {children}
      {count !== undefined && <span className="text-xs font-normal text-neutral-400">({count})</span>}
    </h2>
  );
}
