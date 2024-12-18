import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTokenPrice } from "@/services/dexscreener";

// Replace with your actual token pair address
const TOKEN_PAIR_ADDRESS = "0x7213a321F1855CF1779f42c0CD85d3D95291D34C";

export const PriceTracker = () => {
  const { data: priceData, isError } = useQuery({
    queryKey: ['token-price'],
    queryFn: async () => {
      const response = await fetchTokenPrice(TOKEN_PAIR_ADDRESS);
      if (response.pairs && response.pairs.length > 0) {
        await savePriceData(response.pairs[0]);
        return response.pairs[0];
      }
      throw new Error('No price data available');
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isError) {
    console.error("Failed to fetch price data");
  }

  return (
    <div className="py-20 bg-white" id="price">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary">Live Price</h2>
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/5 to-background">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent mb-2">
                    ${priceData?.priceUsd || '0.000000'}
                  </p>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                </div>
                
                <div className="text-center">
                  <p className={`text-lg font-semibold flex items-center justify-center ${
                    (priceData?.priceChange24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {(priceData?.priceChange24h || 0) >= 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(priceData?.priceChange24h || 0).toFixed(2)}%
                  </p>
                  <p className="text-sm text-muted-foreground">24h Change</p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    ${(priceData?.volume24h || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Price data from DEX Screener • Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};