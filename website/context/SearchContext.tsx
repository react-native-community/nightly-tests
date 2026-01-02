'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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

type SearchContextValue = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
};

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const previousQueryRef = useRef<string>(query);

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
    const searchParamsQuery = searchParams.get('q') ?? '';
    if (query === searchParamsQuery) {
      return;
    }

    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (query) {
      newSearchParams.set('q', query);
    } else {
      newSearchParams.delete('q');
    }

    previousQueryRef.current = query;

    const queryString = newSearchParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [query, pathname, router, searchParams]);

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
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
