'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type SidebarCtx = { open: boolean; toggle: () => void };
const SidebarContext = createContext<SidebarCtx>({ open: true, toggle: () => {} });

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebar');
    if (saved !== null) setOpen(saved === 'open');
  }, []);

  function toggle() {
    setOpen((v) => {
      localStorage.setItem('sidebar', !v ? 'open' : 'closed');
      return !v;
    });
  }

  return (
    <SidebarContext.Provider value={{ open, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}
