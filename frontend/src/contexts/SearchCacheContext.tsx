import React, { createContext, useContext, useState, useEffect } from 'react';
import { ResultItem } from '../components/ResultCard';

export interface SearchMeta {
  query: string;
  detectedType: string;
  count: number;
}

export interface CachedSearchState {
  query: string;
  activeCategory: string;
  results: ResultItem[];
  lyricsFingerprint: any | null;
  searchMeta: SearchMeta | null;
  hasSearched: boolean;
  searchType: 'text' | 'lyrics' | 'audio' | 'image';
  timestamp: number;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  category: string;
  searchType: 'text' | 'lyrics' | 'audio' | 'image';
  count: number;
  timestamp: number;
  results: ResultItem[];
  lyricsFingerprint?: any | null;
}

interface SearchCacheContextType {
  cachedState: CachedSearchState;
  searchHistory: SearchHistoryItem[];
  setCachedState: (updater: (prev: CachedSearchState) => CachedSearchState) => void;
  saveSearchResult: (
    query: string,
    results: ResultItem[],
    category?: string,
    meta?: SearchMeta | null,
    lyricsFp?: any | null,
    type?: 'text' | 'lyrics' | 'audio' | 'image'
  ) => void;
  restoreFromHistory: (item: SearchHistoryItem) => void;
  clearSearch: () => void;
  clearHistory: () => void;
  removeHistoryItem: (id: string) => void;
}

const STORAGE_KEY = 'elsamee3_search_cache_v2';
const HISTORY_KEY = 'elsamee3_search_history_v2';

const defaultState: CachedSearchState = {
  query: '',
  activeCategory: 'all',
  results: [],
  lyricsFingerprint: null,
  searchMeta: null,
  hasSearched: false,
  searchType: 'text',
  timestamp: Date.now(),
};

const SearchCacheContext = createContext<SearchCacheContextType | undefined>(undefined);

export const SearchCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize state from sessionStorage if available
  const [cachedState, setCachedStateInternal] = useState<CachedSearchState>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...defaultState, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Failed to parse search cache from sessionStorage:', e);
    }
    return defaultState;
  });

  // 2. Initialize history from localStorage
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse search history:', e);
    }
    return [];
  });

  // Sync state to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cachedState));
    } catch (e) {
      console.warn('Failed to write to sessionStorage:', e);
    }
  }, [cachedState]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistory));
    } catch (e) {
      console.warn('Failed to write search history to localStorage:', e);
    }
  }, [searchHistory]);

  const setCachedState = (updater: (prev: CachedSearchState) => CachedSearchState) => {
    setCachedStateInternal((prev) => {
      const next = updater(prev);
      return next;
    });
  };

  const saveSearchResult = (
    query: string,
    results: ResultItem[],
    category: string = 'all',
    meta: SearchMeta | null = null,
    lyricsFp: any | null = null,
    type: 'text' | 'lyrics' | 'audio' | 'image' = 'text'
  ) => {
    const newState: CachedSearchState = {
      query,
      activeCategory: category,
      results,
      lyricsFingerprint: lyricsFp,
      searchMeta: meta || {
        query,
        detectedType: type,
        count: results.length,
      },
      hasSearched: true,
      searchType: type,
      timestamp: Date.now(),
    };

    setCachedStateInternal(newState);

    // Also push to search history (max 15 items, no consecutive duplicates)
    if (query.trim()) {
      const historyEntry: SearchHistoryItem = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        query: query.trim(),
        category,
        searchType: type,
        count: results.length,
        timestamp: Date.now(),
        results,
        lyricsFingerprint: lyricsFp,
      };

      setSearchHistory((prev) => {
        const filtered = prev.filter((item) => item.query.toLowerCase() !== query.trim().toLowerCase());
        return [historyEntry, ...filtered].slice(0, 15);
      });
    }
  };

  const restoreFromHistory = (item: SearchHistoryItem) => {
    setCachedStateInternal({
      query: item.query,
      activeCategory: item.category || 'all',
      results: item.results || [],
      lyricsFingerprint: item.lyricsFingerprint || null,
      searchMeta: {
        query: item.query,
        detectedType: item.searchType,
        count: (item.results || []).length,
      },
      hasSearched: true,
      searchType: item.searchType,
      timestamp: Date.now(),
    });
  };

  const clearSearch = () => {
    const cleared: CachedSearchState = {
      query: '',
      activeCategory: 'all',
      results: [],
      lyricsFingerprint: null,
      searchMeta: null,
      hasSearched: false,
      searchType: 'text',
      timestamp: Date.now(),
    };
    setCachedStateInternal(cleared);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      // ignore
    }
  };

  const removeHistoryItem = (id: string) => {
    setSearchHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <SearchCacheContext.Provider
      value={{
        cachedState,
        searchHistory,
        setCachedState,
        saveSearchResult,
        restoreFromHistory,
        clearSearch,
        clearHistory,
        removeHistoryItem,
      }}
    >
      {children}
    </SearchCacheContext.Provider>
  );
};

export const useSearchCache = () => {
  const context = useContext(SearchCacheContext);
  if (!context) {
    throw new Error('useSearchCache must be used within a SearchCacheProvider');
  }
  return context;
};
