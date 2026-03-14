'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import { useTheme } from './ThemeContext';
import SearchModal from './SearchModal';

export default function Header() {
  const { toggle, open } = useSidebar();
  const { dark, toggle: toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white dark:bg-slate-900 border-b border-neutral-200 dark:border-slate-700/80 flex items-center px-4 gap-3 shadow-sm">
      {/* Sidebar toggle */}
      <button
        onClick={toggle}
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
        className="p-2 rounded-lg text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="3" y1="3" x2="15" y2="15" /><line x1="15" y1="3" x2="3" y2="15" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="2" y1="5" x2="16" y2="5" /><line x1="2" y1="9" x2="16" y2="9" /><line x1="2" y1="13" x2="16" y2="13" />
          </svg>
        )}
      </button>

      {/* Logo */}
      <Link href="/" className="flex items-baseline gap-2.5 mr-auto">
        <span className="text-xs font-bold tracking-[0.15em] text-neutral-400 dark:text-slate-500 uppercase">IIMV</span>
        <span className="text-sm font-semibold text-neutral-900 dark:text-slate-100 tracking-tight">International Economics</span>
      </Link>

      {/* Search */}
      <SearchModal />

      {/* Nav */}
      <nav className="flex items-center gap-1">
        <NavLink href="/" label="Home" active={pathname === '/'} />
        <NavLink href="/practice" label="Practice" active={pathname.startsWith('/practice')} />
        <NavLink href="/flashcards" label="Flashcards" active={pathname.startsWith('/flashcards')} />
        <Link
          href="/admin"
          className="ml-1 px-3 py-1.5 text-xs font-medium text-neutral-500 dark:text-slate-400 border border-neutral-200 dark:border-slate-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-slate-800 transition-colors"
        >
          Admin
        </Link>
      </nav>

      {/* Dark mode toggle */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="p-2 rounded-lg text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
      >
        {dark ? (
          // Sun icon
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          // Moon icon
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
    </header>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
        active
          ? 'text-neutral-900 dark:text-slate-100 font-medium bg-neutral-100 dark:bg-slate-800'
          : 'text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100 hover:bg-neutral-50 dark:hover:bg-slate-800/50'
      }`}
    >
      {label}
    </Link>
  );
}
