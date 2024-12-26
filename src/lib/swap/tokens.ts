import { TokenInfo, TokenBalance } from '@/types/token-swap';
import { PublicKey } from '@solana/web3.js';
import { supabase } from "@/integrations/supabase/client";

const RAYDIUM_API_URL = "https://api.raydium.io/v2/sdk/token/raydium.mainnet.json";
const TOKEN_LIST_CACHE_KEY = "tokenList";
const TOKEN_LIST_VERSION_KEY = "tokenListVersion";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface RaydiumTokenList {
  name: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tokens: TokenInfo[];
}

export async function getTokenBalance(
  mint: string,
  owner: PublicKey
): Promise<TokenBalance> {
  try {
    // Mock implementation - will be replaced with actual balance fetching
    return {
      mint,
      amount: 1000000000,
      decimals: 9,
      uiAmount: 1.0
    };
  } catch (error) {
    console.error('Error fetching token balance:', error);
    throw error;
  }
}

export async function getTokenList(): Promise<TokenInfo[]> {
  try {
    // Try to get cached list first
    const cached = getCachedTokenList();
    if (cached) {
      return cached;
    }

    // Fetch new list if no cache
    const tokens = await fetchRaydiumTokenList();
    cacheTokenList(tokens);
    return tokens;
  } catch (error) {
    console.error('Error getting token list:', error);
    return [];
  }
}

export async function fetchRaydiumTokenList(): Promise<TokenInfo[]> {
  try {
    const response = await fetch(RAYDIUM_API_URL);
    if (!response.ok) throw new Error('Failed to fetch Raydium token list');
    
    const data: RaydiumTokenList = await response.json();
    return data.tokens.map(token => ({
      ...token,
      verified: true, // Raydium tokens are verified
    }));
  } catch (error) {
    console.error('Error fetching Raydium token list:', error);
    return []; // Return empty array instead of throwing
  }
}

export function getCachedTokenList(): TokenInfo[] | null {
  try {
    const cached = localStorage.getItem(TOKEN_LIST_CACHE_KEY);
    const timestamp = localStorage.getItem(TOKEN_LIST_VERSION_KEY);
    
    if (!cached || !timestamp) return null;
    
    const age = Date.now() - Number(timestamp);
    if (age > CACHE_DURATION) {
      localStorage.removeItem(TOKEN_LIST_CACHE_KEY);
      localStorage.removeItem(TOKEN_LIST_VERSION_KEY);
      return null;
    }
    
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

export function cacheTokenList(tokens: TokenInfo[]): void {
  try {
    localStorage.setItem(TOKEN_LIST_CACHE_KEY, JSON.stringify(tokens));
    localStorage.setItem(TOKEN_LIST_VERSION_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error caching token list:', error);
  }
}

export async function getTokenInfo(mint: string): Promise<TokenInfo | null> {
  try {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('mint_address', mint)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      mint: data.mint_address,
      symbol: data.symbol,
      name: data.name,
      decimals: data.decimals,
      logoURI: data.logo_uri,
      verified: data.is_active
    };
  } catch (error) {
    console.error('Error fetching token info:', error);
    return null;
  }
}

export async function getTokenPrice(symbol: string): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from('price_data')
      .select('price')
      .eq('symbol', symbol)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return data?.price || null;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return null;
  }
}

export function isValidMintAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}