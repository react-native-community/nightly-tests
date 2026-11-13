'use client';

import { twMerge } from 'tailwind-merge';

import { useSearch } from '~/context/SearchContext';

export default function DisplayModeSelector() {
  const { displayMode, setDisplayMode } = useSearch();

  return (
    <div className="border-border bg-subtle flex gap-0.5 rounded-3xl border p-0.5 max-lg:w-full">
      <button
        type="button"
        onClick={() => setDisplayMode('all')}
        className={twMerge(
          'text-sm font-normal pl-3.5 pr-3 py-1.5 rounded-l-2xl rounded-r-xs text-secondary cursor-pointer transition-colors',
          'max-lg:w-1/2',
          displayMode === 'all' ? 'bg-brand/15 dark:bg-brand/10 text-brand' : 'hover:bg-hover hover:dark:bg-hover/50'
        )}>
        All libraries
      </button>
      <button
        type="button"
        onClick={() => setDisplayMode('failing')}
        className={twMerge(
          'text-sm font-normal pr-3.5 pl-3 py-1.5 rounded-r-2xl rounded-l-xs text-secondary cursor-pointer transition-colors',
          'max-lg:w-1/2',
          displayMode === 'failing'
            ? 'bg-brand/15 dark:bg-brand/10 text-brand'
            : 'hover:bg-hover hover:dark:bg-hover/50'
        )}>
        Failing
      </button>
    </div>
  );
}
