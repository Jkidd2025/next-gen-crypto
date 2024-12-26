import { TokenInfo, RaydiumTokenList, TokenListVersion } from '@/types/token-swap';

const RAYDIUM_API_URL = "https://api.raydium.io/v2/sdk/token/raydium.mainnet.json";
const TOKEN_LIST_VERSION_KEY = "tokenListVersion";
const TOKEN_LIST_CACHE_KEY = "tokenListCache";
const TOKEN_LIST_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function compareVersions(a: TokenListVersion, b: TokenListVersion): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;
  return a.timestamp - b.timestamp;
}

export async function checkForUpdates(): Promise<boolean> {
  try {
    const response = await fetch(RAYDIUM_API_URL);
    if (!response.ok) return false;
    
    const data: RaydiumTokenList = await response.json();
    const latestVersion = {
      ...data.version,
      timestamp: Date.now()
    };
    
    const currentVersionStr = localStorage.getItem(TOKEN_LIST_VERSION_KEY);
    if (!currentVersionStr) return true;
    
    const currentVersion = JSON.parse(currentVersionStr);
    return compareVersions(latestVersion, currentVersion) > 0;
  } catch (error) {
    console.error('Error checking for token list updates:', error);
    return false;
  }
}

export async function fetchRaydiumTokenList(): Promise<TokenInfo[]> {
  try {
    const needsUpdate = await checkForUpdates();
    if (!needsUpdate) {
      const cached = getCachedTokenList();
      if (cached) return cached;
    }

    const response = await fetch(RAYDIUM_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch token list: ${response.statusText}`);
    }
    
    const data: RaydiumTokenList = await response.json();
    
    // Process and enhance token data
    const tokens = data.tokens.map(token => ({
      ...token,
      verified: true,
      favorite: isFavoriteToken(token.mint),
      balance: 0,
      usdPrice: 0,
    }));

    // Cache the new token list and version
    cacheTokenList(tokens);
    localStorage.setItem(TOKEN_LIST_VERSION_KEY, JSON.stringify({
      ...data.version,
      timestamp: Date.now()
    }));
    
    return tokens;
  } catch (error) {
    console.error('Error fetching Raydium token list:', error);
    return [];
  }
}

function getCachedTokenList(): TokenInfo[] | null {
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

function cacheTokenList(tokens: TokenInfo[]): void {
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

function isFavoriteToken(mint: string): boolean {
  try {
    const favorites = localStorage.getItem('favoriteTokens');
    if (!favorites) return false;
    return JSON.parse(favorites).includes(mint);
  } catch {
    return false;
  }
}

export function isValidMintAddress(address: string): boolean {
  try {
    // Basic validation for Solana addresses (base58, 32-44 characters)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
  } catch {
    return false;
  }
}