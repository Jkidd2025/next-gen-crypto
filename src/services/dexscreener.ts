import { useQuery } from "@tanstack/react-query";

const DEX_SCREENER_BASE_URL = "https://api.dexscreener.com/latest/dex";

interface TokenPrice {
  priceUsd: string;
  volume24h: string;
  marketCap: string;
  priceChange24h: string;
}

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    symbol: string;
  };
  priceUsd: string;
  priceChange: {
    h24: number;
  };
  volume: {
    h24: number;
  };
  txns: {
    h24: {
      buys: number;
      sells: number;
    };
  };
}

interface DexScreenerResponse {
  pairs: DexScreenerPair[];
}

const fetchTokenData = async (tokenAddress: string): Promise<TokenPrice> => {
  const response = await fetch(
    `${DEX_SCREENER_BASE_URL}/pairs/ethereum/${tokenAddress}`
  );
  const data: DexScreenerResponse = await response.json();

  if (!data.pairs || data.pairs.length === 0) {
    throw new Error("No pairs found for this token");
  }

  const pair = data.pairs[0];
  return {
    priceUsd: pair.priceUsd || "0",
    volume24h: (pair.volume?.h24 || 0).toString(),
    marketCap: "0", // DEXScreener doesn't provide market cap directly
    priceChange24h: (pair.priceChange?.h24 || 0).toString(),
  };
};

export const useTokenPrice = (tokenAddress: string) => {
  return useQuery({
    queryKey: ["tokenPrice", tokenAddress],
    queryFn: () => fetchTokenData(tokenAddress),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};