import { TokenInfo, RaydiumTokenList } from '@/types/token-swap';

const RAYDIUM_API_URL = "https://api.raydium.io/v2/sdk/token/raydium.mainnet.json";
const TOKEN_LIST_VERSION_KEY = "tokenListVersion";
const TOKEN_LIST_CACHE_KEY = "tokenListCache";
const TOKEN_LIST_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchRaydiumTokenList(): Promise<TokenInfo[]> {
  try {
    const response = await fetch(RAYDIUM_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch token list: ${response.statusText}`);
    }
    
    const data: RaydiumTokenList = await response.json();
    
    // Add version check
    const currentVersion = localStorage.getItem(TOKEN_LIST_VERSION_KEY);
    if (currentVersion) {
      const current = JSON.parse(currentVersion);
      if (!needsUpdate(data.version, current)) {
        const cached = getCachedTokenList();
        if (cached) return cached;
      }
    }
    
    // Process and enhance token data
    const tokens = data.tokens.map(token => ({
      ...token,
      verified: true,
      favorite: isFavoriteToken(token.mint),
      balance: 0, // Will be updated later
      usdPrice: 0, // Will be updated later
    }));

    // Cache the new token list
    cacheTokenList(tokens);
    localStorage.setItem(TOKEN_LIST_VERSION_KEY, JSON.stringify(data.version));
    
    return tokens;
  } catch (error) {
    console.error('Error fetching Raydium token list:', error);
    return [];
  }
}

// Version comparison utility
function needsUpdate(newVersion: RaydiumTokenList['version'], currentVersion: RaydiumTokenList['version']): boolean {
  if (newVersion.major !== currentVersion.major) {
    return newVersion.major > currentVersion.major;
  }
  if (newVersion.minor !== currentVersion.minor) {
    return newVersion.minor > currentVersion.minor;
  }
  return newVersion.patch > currentVersion.patch;
}

// Get cached token list
export function getCachedTokenList(): TokenInfo[] | null {
  try {
    const cached = localStorage.getItem(TOKEN_LIST_CACHE_KEY);
    if (!cached) return null;
    
    const { tokens, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is expired
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

// Cache token list with timestamp
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

// Check if token is in favorites
function isFavoriteToken(mint: string): boolean {
  try {
    const favorites = localStorage.getItem('favoriteTokens');
    if (!favorites) return false;
    return JSON.parse(favorites).includes(mint);
  } catch {
    return false;
  }
}

// Validate token mint address
export function isValidMintAddress(address: string): boolean {
  try {
    // Basic validation for Solana addresses (base58, 32-44 characters)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
  } catch {
    return false;
  }
}