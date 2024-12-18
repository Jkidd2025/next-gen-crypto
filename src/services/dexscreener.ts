const DEX_SCREENER_BASE_URL = 'https://api.dexscreener.com/latest/dex';

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
    console.log(`Fetching price data for pair: ${pairAddress}`);
    const response = await fetch(`${DEX_SCREENER_BASE_URL}/pairs/${pairAddress}`);
    
    if (!response.ok) {
      console.error('DEXScreener API response not ok:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('DEXScreener API response:', data);
    
    if (!data.pairs || data.pairs.length === 0) {
      throw new Error('No pair data found');
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchTokenPrice:', error);
    throw error;
  }
};

export const savePriceData = async (data: DexScreenerPairResponse['pairs'][0]) => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    console.log('Saving price data:', data);
    const { error } = await supabase.from('price_data').insert({
      symbol: data.baseToken.symbol,
      price: parseFloat(data.priceUsd),
      volume_24h: data.volume24h,
      market_cap: data.liquidity,
      price_change_24h: data.priceChange24h,
      source: 'dexscreener',
      last_updated: new Date(data.timestamp).toISOString(),
    });

    if (error) {
      console.error('Error saving price data:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in savePriceData:', error);
    throw error;
  }
};