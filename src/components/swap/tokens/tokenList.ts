import { TokenInfo } from "@/types/token-swap";
import { PublicKey } from "@solana/web3.js";

const RAYDIUM_TOKEN_LIST_URL = "https://api.raydium.io/v2/sdk/token/raydium.mainnet.json";
const TOKEN_LIST_VERSION_KEY = "tokenListVersion";
const TOKEN_LIST_CACHE_KEY = "tokenListCache";
const TOKEN_LIST_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface TokenList {
  name: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tokens: TokenInfo[];
}

export interface TokenListWithTimestamp extends TokenList {
  lastUpdated: number;
}

// Validate token mint address
export const isValidMintAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

// Fetch token list from Raydium API
export const fetchTokenList = async (): Promise<TokenList> => {
  try {
    const response = await fetch(RAYDIUM_TOKEN_LIST_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch token list: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching token list:", error);
    throw error;
  }
};

// Get cached token list
export const getCachedTokenList = (): TokenListWithTimestamp | null => {
  try {
    const cached = localStorage.getItem(TOKEN_LIST_CACHE_KEY);
    if (!cached) return null;
    
    const parsedCache: TokenListWithTimestamp = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - parsedCache.lastUpdated > TOKEN_LIST_CACHE_DURATION) {
      localStorage.removeItem(TOKEN_LIST_CACHE_KEY);
      return null;
    }
    
    return parsedCache;
  } catch (error) {
    console.error("Error reading token list cache:", error);
    return null;
  }
};

// Cache token list
export const cacheTokenList = (tokenList: TokenList) => {
  try {
    const tokenListWithTimestamp: TokenListWithTimestamp = {
      ...tokenList,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(TOKEN_LIST_CACHE_KEY, JSON.stringify(tokenListWithTimestamp));
    localStorage.setItem(TOKEN_LIST_VERSION_KEY, JSON.stringify(tokenList.version));
  } catch (error) {
    console.error("Error caching token list:", error);
  }
};

// Check if token list needs update
export const needsUpdate = (newVersion: TokenList["version"]): boolean => {
  try {
    const currentVersionStr = localStorage.getItem(TOKEN_LIST_VERSION_KEY);
    if (!currentVersionStr) return true;
    
    const currentVersion = JSON.parse(currentVersionStr);
    return (
      newVersion.major > currentVersion.major ||
      (newVersion.major === currentVersion.major && newVersion.minor > currentVersion.minor) ||
      (newVersion.major === currentVersion.major && 
       newVersion.minor === currentVersion.minor && 
       newVersion.patch > currentVersion.patch)
    );
  } catch (error) {
    console.error("Error checking token list version:", error);
    return true;
  }
};

// Get token list with caching and version control
export const getTokenList = async (): Promise<TokenInfo[]> => {
  try {
    // Try to get cached list first
    const cached = getCachedTokenList();
    if (cached) {
      return cached.tokens;
    }

    // Fetch new list if no cache or cache expired
    const newList = await fetchTokenList();
    
    // Cache the new list
    cacheTokenList(newList);
    
    return newList.tokens;
  } catch (error) {
    console.error("Error getting token list:", error);
    throw error;
  }
};