import { TokenInfo, RaydiumTokenList, TokenListVersion } from '@/types/token-swap';
import { getCachedTokenList, cacheTokenList, getFavoriteTokens } from './token-cache';
export { importToken, validateImportedToken } from './token-import';
export { isValidMintAddress } from './token-validation';
export { getCachedTokenList, cacheTokenList };

const RAYDIUM_API_URL = "https://api.raydium.io/v2/sdk/token/raydium.mainnet.json";
const TOKEN_LIST_VERSION_KEY = "tokenListVersion";

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
      favorite: getFavoriteTokens().includes(token.mint),
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