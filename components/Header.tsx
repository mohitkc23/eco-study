'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';

export default function Header() {
  const { toggle, open } = useSidebar();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-neutral-200 flex items-center px-4 gap-3">
      {/* Sidebar toggle */}
      <button
        onClick={toggle}
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
        className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
      >
        {open ? (
          // X / close icon
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="3" y1="3" x2="15" y2="15" />
            <line x1="15" y1="3" x2="3" y2="15" />
          </svg>
        ) : (
          // Hamburger icon
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="2" y1="5" x2="16" y2="5" />
            <line x1="2" y1="9" x2="16" y2="9" />
            <line x1="2" y1="13" x2="16" y2="13" />
          </svg>
        )}
      </button>

      {/* Logo / wordmark */}
      <Link href="/" className="flex items-baseline gap-2.5 mr-auto">
        <span className="text-xs font-bold tracking-[0.15em] text-neutral-400 uppercase">IIMV</span>
        <span className="text-sm font-semibold text-neutral-900 tracking-tight">International Economics</span>
      </Link>

      {/* Nav items */}
      <nav className="flex items-center gap-1">
        <NavLink href="/" label="Home" active={pathname === '/'} />
        <NavLink href="/practice" label="Practice" active={pathname.startsWith('/practice')} />
        <Link
          href="/admin"
          className="ml-2 px-3 py-1.5 text-xs font-medium text-neutral-500 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Admin
        </Link>
      </nav>
    </header>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
        active
          ? 'text-neutral-900 font-medium bg-neutral-100'
          : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
      }`}
    >
      {label}
    </Link>
  );
}
