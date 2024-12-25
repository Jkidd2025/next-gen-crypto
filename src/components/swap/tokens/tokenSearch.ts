import { TokenInfo } from "@/types/token-swap";

// Token search and filter types
export interface TokenFilters {
  verified?: boolean;
  favorite?: boolean;
  tags?: string[];
  minBalance?: number;
}

export interface TokenSearchOptions extends TokenFilters {
  searchTerm: string;
  limit?: number;
}

// Fuzzy search scoring function
const getSearchScore = (token: TokenInfo, searchTerm: string): number => {
  const searchLower = searchTerm.toLowerCase();
  const symbolScore = token.symbol.toLowerCase().includes(searchLower) ? 100 : 0;
  const nameScore = token.name.toLowerCase().includes(searchLower) ? 50 : 0;
  const addressScore = token.mint.toLowerCase().includes(searchLower) ? 25 : 0;
  
  // Exact matches get higher scores
  const exactSymbolMatch = token.symbol.toLowerCase() === searchLower ? 200 : 0;
  const exactNameMatch = token.name.toLowerCase() === searchLower ? 100 : 0;
  const exactAddressMatch = token.mint.toLowerCase() === searchLower ? 50 : 0;
  
  return symbolScore + nameScore + addressScore + exactSymbolMatch + exactNameMatch + exactAddressMatch;
};

// Apply filters to tokens
export const filterTokens = (tokens: TokenInfo[], filters: TokenFilters): TokenInfo[] => {
  return tokens.filter(token => {
    if (filters.verified && !token.verified) return false;
    if (filters.favorite && !token.favorite) return false;
    if (filters.tags?.length && !filters.tags.some(tag => token.tags?.includes(tag))) return false;
    if (filters.minBalance !== undefined && (!token.balance || token.balance < filters.minBalance)) return false;
    return true;
  });
};

// Search and filter tokens
export const searchTokens = (
  tokens: TokenInfo[],
  { searchTerm, limit = 50, ...filters }: TokenSearchOptions
): TokenInfo[] => {
  if (!searchTerm && Object.keys(filters).length === 0) {
    return tokens.slice(0, limit);
  }

  // First apply filters
  let filteredTokens = filterTokens(tokens, filters);

  // If there's a search term, score and sort tokens
  if (searchTerm) {
    const scoredTokens = filteredTokens.map(token => ({
      token,
      score: getSearchScore(token, searchTerm),
    }));

    // Sort by score (highest first) and filter out zero scores
    filteredTokens = scoredTokens
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.token);
  }

  return filteredTokens.slice(0, limit);
};

// Get popular tokens (by balance and verification)
export const getPopularTokens = (tokens: TokenInfo[], limit = 10): TokenInfo[] => {
  return tokens
    .filter(token => token.verified)
    .sort((a, b) => {
      // Sort by balance if available, otherwise by verification status
      if (a.balance && b.balance) return b.balance - a.balance;
      if (a.balance) return -1;
      if (b.balance) return 1;
      return 0;
    })
    .slice(0, limit);
};

// Get recent tokens from local storage
export const getRecentTokens = (tokens: TokenInfo[], limit = 5): TokenInfo[] => {
  try {
    const recentMints = JSON.parse(localStorage.getItem('recentTokens') || '[]') as string[];
    return recentMints
      .map(mint => tokens.find(token => token.mint === mint))
      .filter((token): token is TokenInfo => token !== undefined)
      .slice(0, limit);
  } catch {
    return [];
  }
};

// Add token to recent list
export const addToRecentTokens = (token: TokenInfo) => {
  try {
    const recentMints = JSON.parse(localStorage.getItem('recentTokens') || '[]') as string[];
    const updatedMints = [
      token.mint,
      ...recentMints.filter(mint => mint !== token.mint)
    ].slice(0, 10); // Keep last 10 tokens
    localStorage.setItem('recentTokens', JSON.stringify(updatedMints));
  } catch (error) {
    console.error('Error updating recent tokens:', error);
  }
};