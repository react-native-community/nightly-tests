'use client';

import { twMerge } from 'tailwind-merge';
import { useSearch } from '~/context/SearchContext';

export default function DisplayModeSelector() {
  const { displayMode, setDisplayMode } = useSearch();

  return (
    <div className="flex border border-border rounded-lg p-1 gap-1 bg-subtle">
      <button
        onClick={() => setDisplayMode('all')}
        className={twMerge(
          'text-sm font-normal px-3 py-1 rounded text-secondary cursor-pointer transition-colors',
          displayMode === 'all'
            ? 'bg-brand/15 dark:bg-brand/10 text-brand'
            : 'hover:bg-hover hover:dark:bg-hover/50'
        )}>
        All libraries
      </button>
      <button
        onClick={() => setDisplayMode('failing')}
        className={twMerge(
          'text-sm font-normal px-3 py-1 rounded text-secondary cursor-pointer transition-colors',
          displayMode === 'failing'
            ? 'bg-brand/15 dark:bg-brand/10 text-brand'
            : 'hover:bg-hover hover:dark:bg-hover/50'
        )}>
        Failing
      </button>
    </div>
  );
}
