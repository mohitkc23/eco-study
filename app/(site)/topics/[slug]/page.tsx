import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTopicBySlug, getLecturesByTopic, getQuestionsByTopic } from '@/lib/db';
import TopicClient from './TopicClient';

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) notFound();

  const [lectures, questions] = await Promise.all([
    getLecturesByTopic(topic.id),
    getQuestionsByTopic(topic.id),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-8 py-6">
        <nav className="text-xs text-slate-400 mb-3">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-600 dark:text-slate-300">{topic.name}</span>
        </nav>
        <div className="flex items-start justify-between gap-4">
          <div>
            {topic.sessions && (
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">{topic.sessions}</span>
            )}
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{topic.name}</h1>
            {topic.description && (
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{topic.description}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0 flex-wrap justify-end">
            <Link
              href={`/practice?topic=${topic.id}`}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              ✏ Practice ({questions.length} Qs)
            </Link>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 max-w-4xl">
        {/* Lectures */}
        <section>
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-4">
            Lectures <span className="text-slate-400 font-normal">({lectures.length})</span>
          </h2>

          {lectures.length === 0 ? (
            <p className="text-slate-400 text-sm">No lectures added yet.</p>
          ) : (
            <TopicClient lectures={lectures} topicSlug={topic.slug} />
          )}
        </section>

        {/* Questions preview */}
        {questions.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">
                Practice Questions <span className="text-slate-400 font-normal">({questions.length})</span>
              </h2>
              <Link href={`/practice?topic=${topic.id}`} className="text-sm text-teal-600 hover:underline">
                Start practice →
              </Link>
            </div>
            <div className="space-y-2">
              {questions.slice(0, 3).map((q) => (
                <div key={q.id} className="p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl">
                  <div className="flex gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      q.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' :
                      q.difficulty === 'hard' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' :
                      'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
                    }`}>{q.difficulty}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{q.marks} marks</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{q.question_text}</p>
                </div>
              ))}
              {questions.length > 3 && (
                <Link
                  href={`/practice?topic=${topic.id}`}
                  className="block text-center text-sm text-teal-600 hover:underline py-2"
                >
                  + {questions.length - 3} more questions
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
