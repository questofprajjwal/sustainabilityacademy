'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';

interface SearchEntry {
  courseId: string;
  courseTitle: string;
  courseIcon: string;
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  snippet: string;
  headings: string[];
}

interface Props {
  onClose: () => void;
}

let cachedIndex: SearchEntry[] | null = null;

function lessonIdToUrl(id: string): string {
  return id.replace('.', '_');
}

export default function SearchModal({ onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [fuse, setFuse] = useState<Fuse<SearchEntry> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load index on mount
  useEffect(() => {
    async function load() {
      if (!cachedIndex) {
        try {
          const res = await fetch('/search-index.json');
          cachedIndex = await res.json();
        } catch {
          cachedIndex = [];
        }
      }
      setFuse(
        new Fuse(cachedIndex!, {
          keys: [
            { name: 'lessonTitle', weight: 0.4 },
            { name: 'headings', weight: 0.3 },
            { name: 'snippet', weight: 0.2 },
            { name: 'courseTitle', weight: 0.1 },
          ],
          threshold: 0.4,
          includeMatches: true,
        })
      );
    }
    load();
    inputRef.current?.focus();
  }, []);

  // Global Cmd+K listener (also handles Escape)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Search on query change
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      setSelectedIdx(0);
      return;
    }
    const hits = fuse.search(query, { limit: 10 }).map(r => r.item);
    setResults(hits);
    setSelectedIdx(0);
  }, [query, fuse]);

  const navigate = useCallback(
    (entry: SearchEntry) => {
      router.push(`/courses/${entry.courseId}/${lessonIdToUrl(entry.lessonId)}`);
      onClose();
    },
    [router, onClose]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      navigate(results[selectedIdx]);
    }
  }

  // Group results by course
  const grouped: Record<string, SearchEntry[]> = {};
  for (const r of results) {
    if (!grouped[r.courseId]) grouped[r.courseId] = [];
    grouped[r.courseId].push(r);
  }

  let flatIdx = 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search lessons"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search all lessons..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
            autoComplete="off"
          />
          <kbd className="text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {query.trim() && results.length === 0 && fuse && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {Object.entries(grouped).map(([courseId, entries]) => (
            <div key={courseId}>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                {entries[0].courseIcon} {entries[0].courseTitle}
              </div>
              {entries.map(entry => {
                const idx = flatIdx++;
                return (
                  <button
                    key={`${entry.courseId}-${entry.lessonId}`}
                    onClick={() => navigate(entry)}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                      idx === selectedIdx ? 'bg-green-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {entry.lessonTitle}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {entry.moduleTitle}
                      </p>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                        {entry.snippet.slice(0, 100)}...
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        {results.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex gap-4 text-xs text-gray-400">
            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono">↵</kbd> open</span>
            <span><kbd className="font-mono">esc</kbd> close</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Global Cmd+K hook - call this from a parent component
 * to register the keyboard shortcut.
 */
export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);
}
