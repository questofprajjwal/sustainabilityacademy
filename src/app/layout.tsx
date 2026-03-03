import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sustainability Academy — Learn Sustainability',
  description:
    'Expert-authored courses covering the full spectrum of sustainability — climate science, carbon markets, ESG, clean energy, biodiversity, circular economy, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        {children}
      </body>
    </html>
  );
}
