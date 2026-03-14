import Link from 'next/link';
import { getTopicsWithCounts } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export default async function AdminDashboard() {
  const topics = await getTopicsWithCounts().catch(() => []);
  const { count: totalQuestions } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });
  const { count: totalLectures } = await supabase
    .from('lectures')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Topics" value={topics.length} href="/admin/topics" color="bg-teal-50 text-teal-700" />
        <StatCard label="Lectures" value={totalLectures ?? 0} href="/admin/lectures" color="bg-blue-50 text-blue-700" />
        <StatCard label="Questions" value={totalQuestions ?? 0} href="/admin/questions" color="bg-violet-50 text-violet-700" />
      </div>

      {/* Topic overview table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Topics Overview</h2>
          <Link href="/admin/topics" className="text-sm text-teal-600 hover:underline">Manage →</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-slate-500 uppercase">
            <tr>
              <th className="text-left px-5 py-3">Topic</th>
              <th className="text-left px-5 py-3">Sessions</th>
              <th className="text-center px-5 py-3">Lectures</th>
              <th className="text-center px-5 py-3">Questions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {topics.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-slate-800">{t.name}</td>
                <td className="px-5 py-3 text-slate-500">{t.sessions ?? '—'}</td>
                <td className="px-5 py-3 text-center text-slate-600">{t.lecture_count}</td>
                <td className="px-5 py-3 text-center text-slate-600">{t.question_count}</td>
              </tr>
            ))}
            {topics.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                  No topics yet. <Link href="/admin/topics" className="text-teal-600 hover:underline">Add one →</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, href, color }: { label: string; value: number; href: string; color: string }) {
  return (
    <Link href={href}>
      <div className={`rounded-xl p-5 ${color} hover:opacity-90 transition-opacity`}>
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-sm font-medium mt-1 opacity-80">{label}</div>
      </div>
    </Link>
  );
}
