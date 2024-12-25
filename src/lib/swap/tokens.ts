import { TokenInfo, TokenBalance } from '@/types/token-swap';
import { PublicKey } from '@solana/web3.js';
import { supabase } from "@/integrations/supabase/client";

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
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('is_active', true)
      .order('symbol');

    if (error) {
      throw error;
    }

    return data.map(token => ({
      mint: token.mint_address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      logoURI: token.logo_uri,
      verified: token.is_active
    }));
  } catch (error) {
    console.error('Error fetching token list:', error);
    throw error;
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
    // Check if the string is a valid Solana public key
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}