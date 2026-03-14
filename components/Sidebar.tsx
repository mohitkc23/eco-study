'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import type { Topic } from '@/lib/types';

const TOPIC_ICONS: Record<string, string> = {
  'balance-of-payments': '⚖',
  'history-trade-mercantilism': '🏛',
  'basis-for-trade': '🔄',
  'empirical-trade-theories': '📊',
  'gains-terms-of-trade': '📈',
  'tariffs-quotas-trade-policy': '🛃',
  'capital-flows-crises': '💸',
  'exchange-rates-open-economy': '💱',
};

export default function Sidebar({ topics }: { topics: Topic[] }) {
  const { open } = useSidebar();
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-14 left-0 h-[calc(100vh-56px)] bg-white border-r border-neutral-200 overflow-hidden transition-all duration-300 ease-in-out z-40"
      style={{ width: open ? '260px' : '0px' }}
    >
      <div className="w-[260px] h-full overflow-y-auto py-4">
        {/* Main nav */}
        <div className="px-3 mb-4 space-y-0.5">
          <SideItem href="/" label="Home" active={pathname === '/'} />
          <SideItem href="/practice" label="Practice Questions" active={pathname.startsWith('/practice')} />
        </div>

        <div className="px-4 mb-2">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-neutral-400 uppercase">Course Topics</p>
        </div>

        <div className="px-3 space-y-0.5">
          {topics.map((topic) => {
            const isActive = pathname.startsWith(`/topics/${topic.slug}`);
            return (
              <Link
                key={topic.id}
                href={`/topics/${topic.slug}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <span className="shrink-0 text-base leading-none">{TOPIC_ICONS[topic.slug] ?? '📚'}</span>
                <span className="truncate leading-snug">{topic.name}</span>
              </Link>
            );
          })}

          {topics.length === 0 && (
            <p className="px-3 py-2 text-xs text-neutral-400">No topics yet.</p>
          )}
        </div>
      </div>
    </aside>
  );
}

function SideItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? 'bg-neutral-100 text-neutral-900 font-medium'
          : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
      }`}
    >
      {label}
    </Link>
  );
}
