import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTopicBySlug, getLecturesByTopic, getQuestionsByTopic } from '@/lib/db';

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) notFound();

  const [lectures, questions] = await Promise.all([
    getLecturesByTopic(topic.id),
    getQuestionsByTopic(topic.id),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <nav className="text-xs text-slate-400 mb-3">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-600">{topic.name}</span>
        </nav>
        <div className="flex items-start justify-between">
          <div>
            {topic.sessions && (
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-widest">{topic.sessions}</span>
            )}
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{topic.name}</h1>
            {topic.description && <p className="text-slate-500 text-sm mt-1">{topic.description}</p>}
          </div>
          <Link
            href={`/practice?topic=${topic.id}`}
            className="shrink-0 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            ✏ Practice ({questions.length} Qs)
          </Link>
        </div>
      </div>

      <div className="px-8 py-8 max-w-4xl">
        {/* Lectures */}
        <section>
          <h2 className="text-base font-semibold text-slate-700 mb-4">
            Lectures <span className="text-slate-400 font-normal">({lectures.length})</span>
          </h2>

          {lectures.length === 0 ? (
            <p className="text-slate-400 text-sm">No lectures added yet.</p>
          ) : (
            <div className="space-y-3">
              {lectures.map((lecture, idx) => (
                <Link key={lecture.id} href={`/topics/${topic.slug}/${lecture.id}`}>
                  <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-sm transition-all">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 text-sm">{lecture.title}</p>
                      <div className="flex gap-3 mt-1">
                        {lecture.pdf_filename && (
                          <span className="text-xs text-slate-400">📄 PDF available</span>
                        )}
                        {lecture.notes_md && (
                          <span className="text-xs text-slate-400">📝 Notes available</span>
                        )}
                      </div>
                    </div>
                    <span className="text-slate-400 text-sm shrink-0">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Questions preview */}
        {questions.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-700">
                Practice Questions <span className="text-slate-400 font-normal">({questions.length})</span>
              </h2>
              <Link
                href={`/practice?topic=${topic.id}`}
                className="text-sm text-teal-600 hover:underline"
              >
                Start practice →
              </Link>
            </div>
            <div className="space-y-2">
              {questions.slice(0, 3).map((q) => (
                <div key={q.id} className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      q.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{q.difficulty}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{q.marks} marks</span>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2">{q.question_text}</p>
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
