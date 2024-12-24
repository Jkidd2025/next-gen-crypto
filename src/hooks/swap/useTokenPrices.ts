import { useQuery } from "@tanstack/react-query";

interface TokenPrice {
  price: number;
  volume24h: number;
  priceChange24h: number;
}

interface TokenPriceResponse {
  [key: string]: TokenPrice;
}

const JUPITER_PRICE_API = "https://price.jup.ag/v4/price";

export const useTokenPrices = (tokens: string[]) => {
  return useQuery({
    queryKey: ["tokenPrices", tokens],
    queryFn: async (): Promise<TokenPriceResponse> => {
      const tokenList = tokens.join(",");
      const response = await fetch(`${JUPITER_PRICE_API}?ids=${tokenList}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch token prices");
      }

      const data = await response.json();
      return data.data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
  });
};