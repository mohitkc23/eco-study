import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'International Economics — IIMV',
  description: 'Study portal for International Economics, IIM Visakhapatnam',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
