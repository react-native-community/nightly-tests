"use client";

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

type SearchContextValue = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
};

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: PropsWithChildren) {
  const [query, setQuery] = useState("");

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);

  if (!ctx) {
    throw new Error("useSearch must be used within a SearchProvider");
  }

  return ctx;
}
