'use client'
import { createContext, useContext, useState } from 'react';
import { SearchResultItem } from '@/types';

type SearchContextType = {
  cachedResults: SearchResultItem[];
  setCachedResults: (results: SearchResultItem[]) => void;
  query: string;
  setQuery: (query: string) => void;
};

const SearchContext = createContext<SearchContextType>({
  cachedResults: [],
  setCachedResults: () => { },
  query: '',
  setQuery: () => { },
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [cachedResults, setCachedResults] = useState<SearchResultItem[]>([]);
  const [query, setQuery] = useState('');

  return (
    <SearchContext.Provider value={{ cachedResults, setCachedResults, query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  return useContext(SearchContext);
}