import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider } from '@/components/SidebarContext';
import { getTopics } from '@/lib/db';
import SiteContent from './SiteContent';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const topics = await getTopics().catch(() => []);

  return (
    <SidebarProvider>
      <Header />
      <Sidebar topics={topics} />
      <SiteContent>{children}</SiteContent>
    </SidebarProvider>
  );
}
