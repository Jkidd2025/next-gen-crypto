import { useState, useMemo, useCallback } from 'react';
import { TokenInfo, TokenSearchFilters } from '@/types/token-swap';

interface UseTokenSearchProps {
  tokens: TokenInfo[];
}

export function useTokenSearch({ tokens }: UseTokenSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TokenSearchFilters>({
    verified: false,
    favorite: false,
    hasBalance: false,
    tags: [],
  });

  const searchResults = useMemo(() => {
    let results = [...tokens];

    // Apply filters
    if (filters.verified) {
      results = results.filter(token => token.verified);
    }
    if (filters.favorite) {
      results = results.filter(token => token.favorite);
    }
    if (filters.hasBalance) {
      results = results.filter(token => token.balance && token.balance > 0);
    }
    if (filters.tags?.length) {
      results = results.filter(token => 
        filters.tags?.some(tag => token.tags?.includes(tag))
      );
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(token => 
        token.symbol.toLowerCase().includes(term) ||
        token.name.toLowerCase().includes(term) ||
        token.mint.toLowerCase() === term
      );

      // Sort by relevance
      results.sort((a, b) => {
        const aSymbol = a.symbol.toLowerCase();
        const bSymbol = b.symbol.toLowerCase();
        const aExact = aSymbol === term;
        const bExact = bSymbol === term;
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        const aStarts = aSymbol.startsWith(term);
        const bStarts = bSymbol.startsWith(term);
        
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        return 0;
      });
    }

    return results;
  }, [tokens, searchTerm, filters]);

  const popularTokens = useMemo(() => {
    return tokens
      .filter(token => token.verified)
      .sort((a, b) => (b.balance || 0) - (a.balance || 0))
      .slice(0, 10);
  }, [tokens]);

  const recentTokens = useMemo(() => {
    try {
      const recentMints = JSON.parse(localStorage.getItem('recentTokens') || '[]') as string[];
      return recentMints
        .map(mint => tokens.find(token => token.mint === mint))
        .filter((token): token is TokenInfo => token !== undefined)
        .slice(0, 5);
    } catch {
      return [];
    }
  }, [tokens]);

  const addToRecent = useCallback((token: TokenInfo) => {
    try {
      const recentMints = JSON.parse(localStorage.getItem('recentTokens') || '[]') as string[];
      const updatedMints = [
        token.mint,
        ...recentMints.filter(mint => mint !== token.mint)
      ].slice(0, 10);
      localStorage.setItem('recentTokens', JSON.stringify(updatedMints));
    } catch (error) {
      console.error('Error updating recent tokens:', error);
    }
  }, []);

  const resetSearch = useCallback(() => {
    setSearchTerm('');
    setFilters({
      verified: false,
      favorite: false,
      hasBalance: false,
      tags: [],
    });
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    searchResults,
    popularTokens,
    recentTokens,
    resetSearch,
    addToRecent,
  };
}