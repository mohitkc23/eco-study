'use client';

import { useSidebar } from '@/components/SidebarContext';

export default function SiteContent({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <main
      className="min-h-screen pt-14 transition-all duration-300 ease-in-out bg-neutral-50"
      style={{ marginLeft: open ? '260px' : '0px' }}
    >
      {children}
    </main>
  );
}
