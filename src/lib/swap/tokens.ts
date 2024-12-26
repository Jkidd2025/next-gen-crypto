import { Connection, PublicKey } from '@solana/web3.js';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { TokenInfo, TokenList, TokenListVersion } from '@/types/token-swap';
import { toast } from '@/hooks/use-toast';

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

export async function importToken(
  connection: Connection,
  mintAddress: string
): Promise<TokenInfo | null> {
  try {
    if (!isValidMintAddress(mintAddress)) {
      throw new Error('Invalid mint address');
    }

    // Check if token already exists in cache
    const cachedTokens = getCachedTokenList();
    if (cachedTokens) {
      const existingToken = cachedTokens.find(
        t => t.mint.toLowerCase() === mintAddress.toLowerCase()
      );
      if (existingToken) {
        toast({
          title: "Token already exists",
          description: `${existingToken.symbol} is already in your token list`,
        });
        return existingToken;
      }
    }

    // Validate token before import
    const validation = await validateImportedToken(connection, mintAddress);
    if (!validation.valid) {
      toast({
        title: "Invalid token",
        description: validation.reason || "Failed to validate token",
        variant: "destructive",
      });
      return null;
    }

    // Fetch token metadata
    const mintPubkey = new PublicKey(mintAddress);
    const [metadata] = await Metadata.findByMint(connection, mintPubkey);
    
    if (!metadata) {
      throw new Error('Token metadata not found');
    }

    // Get token supply and decimals
    const mintInfo = await connection.getParsedAccountInfo(mintPubkey);
    if (!mintInfo.value?.data || typeof mintInfo.value.data !== 'object') {
      throw new Error('Invalid mint info');
    }

    const { decimals } = (mintInfo.value.data as any).parsed.info;

    // Create token info
    const newToken: TokenInfo = {
      mint: mintAddress,
      symbol: metadata.data.symbol.trim(),
      name: metadata.data.name.trim(),
      decimals,
      logoURI: metadata.data.uri || '',
      verified: false,
      tags: ['imported'],
      balance: 0,
      usdPrice: 0
    };

    // Add to cached list
    const currentTokens = cachedTokens || [];
    const updatedTokens = [...currentTokens, newToken];
    cacheTokenList(updatedTokens);

    toast({
      title: "Token imported successfully",
      description: `${newToken.symbol} has been added to your token list`,
    });

    return newToken;
  } catch (error) {
    console.error('Error importing token:', error);
    toast({
      title: "Failed to import token",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    return null;
  }
}

export async function validateImportedToken(
  connection: Connection,
  mintAddress: string
): Promise<{ valid: boolean; reason?: string }> {
  try {
    const mintPubkey = new PublicKey(mintAddress);
    
    // Check if account exists
    const accountInfo = await connection.getAccountInfo(mintPubkey);
    if (!accountInfo) {
      return { valid: false, reason: 'Token mint account not found' };
    }

    // Check if it's a valid mint account
    const mintInfo = await connection.getParsedAccountInfo(mintPubkey);
    if (!mintInfo.value?.data || typeof mintInfo.value.data !== 'object') {
      return { valid: false, reason: 'Invalid mint account' };
    }

    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      reason: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

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

export function isValidMintAddress(address: string): boolean {
  try {
    // Basic validation for Solana addresses (base58, 32-44 characters)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
  } catch {
    return false;
  }
}
