'use client';

import Link from 'next/link';
import { exportProgress } from '@/lib/progress-export';
import { useRef, useState } from 'react';
import { importProgress } from '@/lib/progress-export';

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

      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-gray-900 hover:text-green-700 transition-colors flex-shrink-0"
          >
            <span className="text-xl" aria-hidden>🌿</span>
            <span className="hidden sm:inline">Sustainability Academy</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {lastLessonHref && (
              <Link
                href={lastLessonHref}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <span aria-hidden>▶</span> Continue Learning
              </Link>
            )}

            {/* Progress export/import dropdown */}
            <div className="relative group">
              <button
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Progress settings"
                aria-haspopup="true"
              >
                ⚙
              </button>
              <div
                className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-focus-within:block group-hover:block z-10"
                role="menu"
              >
                <button
                  onClick={exportProgress}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg"
                  role="menuitem"
                >
                  ⬇ Export Progress
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-b-lg"
                  role="menuitem"
                >
                  ⬆ Import Progress
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
