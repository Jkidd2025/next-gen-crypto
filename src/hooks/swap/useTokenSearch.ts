import { useState, useMemo, useCallback } from 'react';
import { TokenInfo } from '@/types/token-swap';
import { 
  searchTokens, 
  TokenSearchOptions, 
  getPopularTokens, 
  getRecentTokens,
  addToRecentTokens 
} from '@/components/swap/tokens/tokenSearch';

interface UseTokenSearchProps {
  tokens: TokenInfo[];
}

interface TokenSearchState {
  searchTerm: string;
  filters: {
    verified: boolean;
    favorite: boolean;
    tags: string[];
    minBalance?: number;
  };
}

export const useTokenSearch = ({ tokens }: UseTokenSearchProps) => {
  const [state, setState] = useState<TokenSearchState>({
    searchTerm: '',
    filters: {
      verified: false,
      favorite: false,
      tags: [],
    },
  });

  // Memoized filtered and searched tokens
  const searchResults = useMemo(() => {
    const options: TokenSearchOptions = {
      searchTerm: state.searchTerm,
      ...state.filters,
    };
    return searchTokens(tokens, options);
  }, [tokens, state.searchTerm, state.filters]);

  // Memoized popular tokens
  const popularTokens = useMemo(() => {
    return getPopularTokens(tokens);
  }, [tokens]);

  // Memoized recent tokens
  const recentTokens = useMemo(() => {
    return getRecentTokens(tokens);
  }, [tokens]);

  // Update search term
  const setSearchTerm = useCallback((term: string) => {
    setState(prev => ({
      ...prev,
      searchTerm: term,
    }));
  }, []);

  // Update filters
  const setFilters = useCallback((filters: Partial<TokenSearchState['filters']>) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        ...filters,
      },
    }));
  }, []);

  // Reset search and filters
  const resetSearch = useCallback(() => {
    setState({
      searchTerm: '',
      filters: {
        verified: false,
        favorite: false,
        tags: [],
      },
    });
  }, []);

  // Add token to recent list
  const addToRecent = useCallback((token: TokenInfo) => {
    addToRecentTokens(token);
  }, []);

  return {
    searchTerm: state.searchTerm,
    filters: state.filters,
    searchResults,
    popularTokens,
    recentTokens,
    setSearchTerm,
    setFilters,
    resetSearch,
    addToRecent,
  };
};