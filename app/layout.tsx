import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'International Economics — IIMV',
  description: 'Study portal for International Economics, IIM Visakhapatnam MBA 2025–27. Practice questions, flashcards, and lecture notes.',
  keywords: 'International Economics, IIMV, MBA, IIM Visakhapatnam, study, flashcards, practice questions',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                const d = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (t === 'dark' || (!t && d)) document.documentElement.classList.add('dark');
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
