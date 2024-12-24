import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  return useQuery({
    queryKey: ["tokenPrices", tokens],
    queryFn: async (): Promise<TokenPriceResponse> => {
      try {
        const endpoints = [
          "https://price.jup.ag/v4/price",
          "https://quote-api.jup.ag/v4/price",
        ];

        let lastError: Error | null = null;

        for (const endpoint of endpoints) {
          try {
            const tokenList = tokens.map(t => encodeURIComponent(t)).join(",");
            const url = `${endpoint}?ids=${tokenList}`;
            
            console.log("Fetching prices from:", url);

            const response = await fetch(url, {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              signal: AbortSignal.timeout(5000),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Price data received:", data);

            if (!data.data) {
              throw new Error("Invalid price data format");
            }

            return data.data;
          } catch (error) {
            console.warn(`Failed to fetch from ${endpoint}:`, error);
            lastError = error as Error;
            continue;
          }
        }

        throw lastError || new Error("All price endpoints failed");
      } catch (error) {
        console.error("Token price fetch error:", error);

        toast({
          title: "Price Update Failed",
          description: "Using cached prices. Will retry automatically.",
          variant: "destructive",
        });

        return {};
      }
    },
    refetchInterval: 30000,
    staleTime: 15000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData: (previousData) => previousData || {},
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};