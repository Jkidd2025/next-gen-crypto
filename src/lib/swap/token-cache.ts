import { TokenInfo } from "@/types/token-swap";

const TOKEN_LIST_CACHE_KEY = "tokenListCache";
const TOKEN_LIST_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function getCachedTokenList(): TokenInfo[] | null {
  try {
    const cached = localStorage.getItem(TOKEN_LIST_CACHE_KEY);
    if (!cached) return null;
    
    const { tokens, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    if (now - timestamp > TOKEN_LIST_CACHE_DURATION) {
      localStorage.removeItem(TOKEN_LIST_CACHE_KEY);
      return null;
    }
    
    return tokens;
  } catch (error) {
    console.error("Error reading token list cache:", error);
    return null;
  }
}

export function cacheTokenList(tokens: TokenInfo[]): void {
  try {
    const cache = {
      tokens,
      timestamp: Date.now()
    };
    localStorage.setItem(TOKEN_LIST_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Error caching token list:", error);
  }
}

export function getFavoriteTokens(): string[] {
  try {
    const favorites = localStorage.getItem('favoriteTokens');
    if (!favorites) return [];
    return JSON.parse(favorites);
  } catch {
    return [];
  }
}