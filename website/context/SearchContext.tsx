'use client';

import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [displayMode, setDisplayMode] = useState<DisplayMode>(() =>
    parseDisplayMode(searchParams.get('mode'))
  );
  const previousQueryRef = useRef<string>(query);
  const previousDisplayModeRef = useRef<DisplayMode>(displayMode);

  useEffect(() => {
    const searchParamsQuery = searchParams.get('q') ?? '';
    if (
      searchParamsQuery === previousQueryRef.current ||
      searchParamsQuery === query
    ) {
      return;
    }

    setQuery(searchParamsQuery);
  }, [searchParams, query]);

  useEffect(() => {
    const searchParamsDisplayMode = parseDisplayMode(searchParams.get('mode'));
    if (
      searchParamsDisplayMode === previousDisplayModeRef.current ||
      searchParamsDisplayMode === displayMode
    ) {
      return;
    }

    setDisplayMode(searchParamsDisplayMode);
  }, [displayMode, searchParams]);

  useEffect(() => {
    const searchParamsQuery = searchParams.get('q') ?? '';
    const searchParamsDisplayMode = searchParams.get('mode');
    const expectedDisplayModeParam = displayMode === 'all' ? null : displayMode;

    if (
      query === searchParamsQuery &&
      searchParamsDisplayMode === expectedDisplayModeParam
    ) {
      return;
    }

    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (query) {
      newSearchParams.set('q', query);
    } else {
      newSearchParams.delete('q');
    }

    if (displayMode === 'all') {
      newSearchParams.delete('mode');
    } else {
      newSearchParams.set('mode', displayMode);
    }

    previousQueryRef.current = query;
    previousDisplayModeRef.current = displayMode;

    const queryString = newSearchParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [displayMode, query, pathname, router, searchParams]);

  return (
    <SearchContext.Provider
      value={{ query, setQuery, displayMode, setDisplayMode }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);

  if (!ctx) {
    throw new Error('useSearch must be used within a SearchProvider');
  }

  return ctx;
}
