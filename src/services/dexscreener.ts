const DEX_SCREENER_BASE_URL = 'https://api.dexscreener.com/latest';

export interface DexScreenerPairResponse {
  pairs: {
    chainId: string;
    dexId: string;
    pairAddress: string;
    baseToken: {
      address: string;
      name: string;
      symbol: string;
    };
    priceUsd: string;
    volume24h: number;
    priceChange24h: number;
    liquidity: number;
    txns24h: {
      buys: number;
      sells: number;
    };
    timestamp: string;
  }[];
}

export const fetchTokenPrice = async (pairAddress: string): Promise<DexScreenerPairResponse> => {
  try {
    const response = await fetch(`${DEX_SCREENER_BASE_URL}/dex/pairs/${pairAddress}`);
    if (!response.ok) {
      throw new Error('Failed to fetch price data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching price data:', error);
    throw error;
  }
};

export const savePriceData = async (data: DexScreenerPairResponse['pairs'][0]) => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { error } = await supabase.from('price_data').insert({
      symbol: data.baseToken.symbol,
      price: parseFloat(data.priceUsd),
      volume_24h: data.volume24h,
      market_cap: data.liquidity,
      price_change_24h: data.priceChange24h,
      source: 'dexscreener',
      last_updated: new Date(data.timestamp).toISOString(),
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving price data:', error);
    throw error;
  }
};