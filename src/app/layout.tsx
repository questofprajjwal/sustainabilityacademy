import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sustainability Academy — Learn Sustainability',
  description:
    'Expert-authored courses covering the full spectrum of sustainability — climate science, carbon markets, ESG, clean energy, biodiversity, circular economy, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SGMKCB3SRY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SGMKCB3SRY');
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        {children}
      </body>
    </html>
  );
}
