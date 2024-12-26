import { useState, useMemo, useCallback } from 'react';
import { TokenInfo } from '@/types/token-swap';

interface TokenSearchFilters {
  verified?: boolean;
  favorite?: boolean;
  minBalance?: number;
  tags?: string[];
}

interface TokenSearchState {
  searchTerm: string;
  filters: TokenSearchFilters;
  searchResults: TokenInfo[];
  popularTokens: TokenInfo[];
  recentTokens: TokenInfo[];
}

interface UseTokenSearchProps {
  tokens: TokenInfo[];
}

export const useTokenSearch = ({ tokens }: UseTokenSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TokenSearchFilters>({});
  const [recentTokens, setRecentTokens] = useState<TokenInfo[]>([]);

  // Filter and search tokens
  const searchResults = useMemo(() => {
    let result = tokens;

    // Apply filters
    if (filters.verified) {
      result = result.filter(token => token.verified);
    }
    if (filters.favorite) {
      result = result.filter(token => token.favorite);
    }
    if (filters.minBalance !== undefined) {
      result = result.filter(token => 
        token.balance !== undefined && token.balance >= (filters.minBalance || 0)
      );
    }
    if (filters.tags?.length) {
      result = result.filter(token => 
        token.tags?.some(tag => filters.tags?.includes(tag))
      );
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(token => 
        token.symbol.toLowerCase().includes(term) ||
        token.name.toLowerCase().includes(term) ||
        token.mint.toLowerCase() === term
      );
    }

    return result;
  }, [tokens, searchTerm, filters]);

  // Get popular tokens (top 10 by market cap or predefined list)
  const popularTokens = useMemo(() => {
    return tokens
      .filter(token => token.verified)
      .slice(0, 10);
  }, [tokens]);

  // Add token to recent list
  const addToRecent = useCallback((token: TokenInfo) => {
    setRecentTokens(prev => {
      const filtered = prev.filter(t => t.mint !== token.mint);
      return [token, ...filtered].slice(0, 5); // Keep last 5 tokens
    });
  }, []);

  // Reset search state
  const resetSearch = useCallback(() => {
    setSearchTerm('');
    setFilters({});
  }, []);

  return {
    searchTerm,
    filters,
    searchResults,
    popularTokens,
    recentTokens,
    setSearchTerm,
    setFilters,
    resetSearch,
    addToRecent,
  };
};