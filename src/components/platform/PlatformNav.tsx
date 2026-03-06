'use client';

import Link from 'next/link';
import { exportProgress } from '@/lib/progress-export';
import { useRef, useState } from 'react';
import { importProgress } from '@/lib/progress-export';
import SearchButton from './SearchButton';

interface Props {
  lastLessonHref?: string;
}

export default function PlatformNav({ lastLessonHref }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await importProgress(file);
    setImportMsg(result.message);
    setTimeout(() => setImportMsg(null), 4000);
    if (result.success) window.location.reload();
  }

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:shadow-lg focus:text-green-700 focus:font-medium focus:rounded"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-gray-900 hover:text-gray-600 transition-colors"
          >
            <span className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md shadow-sm" aria-hidden />
            <span className="hidden sm:inline">Sustainability Academy</span>
            <span className="sm:hidden">SA</span>
          </Link>

          {/* Search + Nav + Actions */}
          <div className="flex items-center gap-3">
            <SearchButton />
            {lastLessonHref && (
              <Link
                href={lastLessonHref}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm bg-green-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                </svg>
                Continue
              </Link>
            )}

            {/* Progress export/import dropdown */}
            <div className="relative group">
              <button
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Progress settings"
                aria-haspopup="true"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="5" r="1" fill="currentColor" />
                  <circle cx="12" cy="12" r="1" fill="currentColor" />
                  <circle cx="12" cy="19" r="1" fill="currentColor" />
                </svg>
              </button>
              <div
                className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-lg hidden group-focus-within:block group-hover:block z-10 overflow-hidden"
                role="menu"
              >
                <button
                  onClick={exportProgress}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  role="menuitem"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Export progress
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  role="menuitem"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Import progress
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".json"
                  className="sr-only"
                  aria-hidden
                  onChange={handleImport}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {importMsg && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-50"
          role="status"
          aria-live="polite"
        >
          {importMsg}
        </div>
      )}
    </>
  );
}
