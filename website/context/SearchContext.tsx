'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useCallback, useContext, useMemo } from 'react';

import { DisplayMode } from '~/types/data-types';

function parseDisplayMode(value: string | null): DisplayMode {
  return value === 'failing' ? 'failing' : 'all';
}

type SearchContextValue = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  displayMode: DisplayMode;
  setDisplayMode: Dispatch<SetStateAction<DisplayMode>>;
};

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const displayMode = parseDisplayMode(searchParams.get('mode'));

  const updateSearchParams = useCallback(
    (update: (params: URLSearchParams) => void) => {
      const currentSearchParams = searchParams.toString();
      const nextSearchParams = new URLSearchParams(currentSearchParams);
      update(nextSearchParams);

      const queryString = nextSearchParams.toString();
      if (queryString === currentSearchParams) {
        return;
      }

      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  const setQuery = useCallback<Dispatch<SetStateAction<string>>>(
    action => {
      const currentQuery = searchParams.get('q') ?? '';
      const nextQuery = typeof action === 'function' ? action(currentQuery) : action;

      updateSearchParams(params => {
        if (nextQuery) {
          params.set('q', nextQuery);
        } else {
          params.delete('q');
        }
      });
    },
    [searchParams, updateSearchParams]
  );

  const setDisplayMode = useCallback<Dispatch<SetStateAction<DisplayMode>>>(
    action => {
      const currentDisplayMode = parseDisplayMode(searchParams.get('mode'));
      const nextDisplayMode = typeof action === 'function' ? action(currentDisplayMode) : action;

      updateSearchParams(params => {
        if (nextDisplayMode === 'all') {
          params.delete('mode');
        } else {
          params.set('mode', nextDisplayMode);
        }
      });
    },
    [searchParams, updateSearchParams]
  );

  const value = useMemo(
    () => ({ query, setQuery, displayMode, setDisplayMode }),
    [displayMode, query, setDisplayMode, setQuery]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);

  if (!ctx) {
    throw new Error('useSearch must be used within a SearchProvider');
  }

  return ctx;
}
