import Link from 'next/link';
import { getTopicsWithCounts } from '@/lib/db';

const TOPIC_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'balance-of-payments': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'history-trade-mercantilism': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'basis-for-trade': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'empirical-trade-theories': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  'gains-terms-of-trade': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  'tariffs-quotas-trade-policy': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'capital-flows-crises': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'exchange-rates-open-economy': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
};

const DEFAULT_COLOR = { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };

export default async function HomePage() {
  const topics = await getTopicsWithCounts().catch(() => []);
  const totalLectures = topics.reduce((s, t) => s + t.lecture_count, 0);
  const totalQuestions = topics.reduce((s, t) => s + t.question_count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-slate-900 text-white px-8 py-10">
        <p className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-2">
          IIM Visakhapatnam · MBA 2025–27
        </p>
        <h1 className="text-3xl font-bold mb-2">International Economics</h1>
        <p className="text-slate-400 text-sm">Prof. Kalyan Kolukuluri · 20 Sessions</p>

        {/* Stats row */}
        <div className="flex gap-6 mt-6">
          <Stat value={topics.length} label="Topics" />
          <Stat value={totalLectures} label="Lectures" />
          <Stat value={totalQuestions} label="Questions" />
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-8 py-6 flex gap-3 border-b border-gray-200 bg-white">
        <Link
          href="/practice"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          ✏ Practice Questions
        </Link>
        <Link
          href="/practice?mode=random"
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
        >
          🔀 Random Question
        </Link>
      </div>

      {/* Topics grid */}
      <div className="px-8 py-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-5">Course Topics</h2>

        {topics.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">📚</p>
            <p className="font-medium">No topics yet.</p>
            <p className="text-sm mt-1">
              Go to the{' '}
              <Link href="/admin" className="text-teal-600 hover:underline">Admin Panel</Link>{' '}
              to add topics and lectures.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => {
              const color = TOPIC_COLORS[topic.slug] ?? DEFAULT_COLOR;
              return (
                <Link key={topic.id} href={`/topics/${topic.slug}`}>
                  <div className={`rounded-xl border ${color.border} ${color.bg} p-5 hover:shadow-md transition-shadow cursor-pointer h-full`}>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-xs font-semibold uppercase tracking-widest ${color.text}`}>
                        {topic.sessions ?? 'Study Material'}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-base leading-snug mb-3">{topic.name}</h3>
                    {topic.description && (
                      <p className="text-xs text-slate-600 mb-4 line-clamp-2">{topic.description}</p>
                    )}
                    <div className="flex gap-4 mt-auto">
                      <span className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{topic.lecture_count}</span> lectures
                      </span>
                      <span className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{topic.question_count}</span> questions
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400 uppercase tracking-wide">{label}</div>
    </div>
  );
}
