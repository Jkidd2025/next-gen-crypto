import { useState, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import { TokenInfo, TokenSearchFilters } from '@/types/token-swap';
import { isValidMintAddress } from '@/lib/swap/tokens';

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
    minBalance: undefined
  });

  // Initialize Fuse for fuzzy search
  const fuse = useMemo(() => new Fuse(tokens, {
    keys: ['symbol', 'name', 'mint'],
    threshold: 0.3,
    distance: 100,
    includeScore: true
  }), [tokens]);

  const searchResults = useMemo(() => {
    let results = [...tokens];

    // Apply filters first
    if (filters.verified) {
      results = results.filter(t => t.verified);
    }
    if (filters.favorite) {
      results = results.filter(t => t.favorite);
    }
    if (filters.hasBalance) {
      results = results.filter(t => (t.balance || 0) > 0);
    }
    if (filters.minBalance !== undefined) {
      results = results.filter(t => (t.balance || 0) >= (filters.minBalance || 0));
    }
    if (filters.tags?.length) {
      results = results.filter(t => 
        filters.tags?.some(tag => t.tags?.includes(tag))
      );
    }

    // Apply search if term exists
    if (searchTerm) {
      if (isValidMintAddress(searchTerm)) {
        results = results.filter(t => 
          t.mint.toLowerCase() === searchTerm.toLowerCase()
        );
      } else {
        const fuseResults = fuse.search(searchTerm);
        results = fuseResults
          .filter(result => result.score && result.score < 0.6) // Only include good matches
          .map(result => result.item);
      }
    }

    return results;
  }, [tokens, searchTerm, filters, fuse]);

  const popularTokens = useMemo(() => {
    return tokens
      .filter(t => t.verified)
      .sort((a, b) => {
        const aValue = (a.usdPrice || 0) * (a.balance || 0);
        const bValue = (b.usdPrice || 0) * (b.balance || 0);
        return bValue - aValue;
      })
      .slice(0, 10);
  }, [tokens]);

  const recentTokens = useMemo(() => {
    try {
      const recents = JSON.parse(localStorage.getItem('recentTokens') || '[]') as string[];
      return recents
        .map(mint => tokens.find(t => t.mint === mint))
        .filter((token): token is TokenInfo => token !== undefined)
        .slice(0, 5);
    } catch {
      return [];
    }
  }, [tokens]);

  const addToRecent = useCallback((token: TokenInfo) => {
    try {
      const recents = JSON.parse(localStorage.getItem('recentTokens') || '[]') as string[];
      const updated = [
        token.mint,
        ...recents.filter(mint => mint !== token.mint)
      ].slice(0, 5);
      localStorage.setItem('recentTokens', JSON.stringify(updated));
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
      minBalance: undefined
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