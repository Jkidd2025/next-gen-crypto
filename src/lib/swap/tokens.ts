import { TokenInfo, TokenBalance } from "@/types/token-swap";
import { COMMON_BASES } from "./constants";
import { supabase } from "@/integrations/supabase/client";

export const getTokenBalance = async (
  mint: string,
  walletAddress: string
): Promise<TokenBalance | null> => {
  try {
    // Mock implementation - will be replaced with actual balance fetching
    return {
      mint,
      amount: 1000000000,
      decimals: 9,
      uiAmount: 1.0,
    };
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return null;
  }
};

export const getTokenInfo = async (mint: string): Promise<TokenInfo | null> => {
  try {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('mint_address', mint)
      .single();

    if (error) throw error;

    if (!data) return null;

    return {
      mint: data.mint_address,
      symbol: data.symbol,
      name: data.name,
      decimals: data.decimals,
      logoURI: data.logo_uri,
      verified: data.is_active,
    };
  } catch (error) {
    console.error("Error fetching token info:", error);
    return null;
  }
};

export const getCommonBases = (): TokenInfo[] => {
  return COMMON_BASES;
};