import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin_auth');
  if (auth?.value !== 'authenticated') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold text-slate-800">⚙ Admin Panel</span>
          <span className="text-slate-300">|</span>
          <Link href="/" className="text-slate-500 hover:text-teal-600">← Back to site</Link>
        </div>
        <nav className="flex gap-1">
          {[
            { href: '/admin', label: 'Dashboard' },
            { href: '/admin/topics', label: 'Topics' },
            { href: '/admin/lectures', label: 'Lectures' },
            { href: '/admin/questions', label: 'Questions' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="px-3 py-1.5 text-sm rounded-lg text-slate-600 hover:text-slate-900 hover:bg-gray-100 transition-colors">
              {label}
            </Link>
          ))}
        </nav>
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
