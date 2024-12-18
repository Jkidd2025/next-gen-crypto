import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTokenPrice } from "@/services/dexscreener";
import { useToast } from "@/hooks/use-toast";

// Test pair address - replace with your actual token pair
const TEST_PAIR_ADDRESS = "0x7213a321F1855CF1779f42c0CD85d3D95291D34C";

export const TestIntegration = () => {
  const [priceData, setPriceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const testPriceData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching price data from DEXScreener...");
      const response = await fetchTokenPrice(TEST_PAIR_ADDRESS);
      console.log("DEXScreener Response:", response);
      
      if (response.pairs && response.pairs.length > 0) {
        setPriceData(response.pairs[0]);
        toast({
          title: "Success",
          description: "Price data fetched successfully",
        });
      } else {
        throw new Error("No price data available");
      }
    } catch (err) {
      console.error("Error fetching price data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch price data");
      toast({
        title: "Error",
        description: "Failed to fetch price data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testPhantomConnection = async () => {
    try {
      console.log("Testing Phantom wallet connection...");
      
      if (!window.solana?.isPhantom) {
        throw new Error("Phantom wallet not found");
      }

      const response = await window.solana.connect();
      console.log("Phantom connection response:", response);
      
      toast({
        title: "Success",
        description: "Phantom wallet connected successfully",
      });
    } catch (err) {
      console.error("Phantom connection error:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Integration Test Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Data Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">DEXScreener Price Data</h3>
            <button
              onClick={testPriceData}
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Test Price Data"}
            </button>
            
            {error && (
              <div className="text-red-500 text-sm">
                Error: {error}
              </div>
            )}
            
            {priceData && (
              <div className="space-y-2">
                <p>Price: ${priceData.priceUsd}</p>
                <p>24h Volume: ${priceData.volume24h?.toLocaleString()}</p>
                <p>24h Change: {priceData.priceChange24h}%</p>
              </div>
            )}
          </div>

          {/* Phantom Wallet Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Phantom Wallet Integration</h3>
            <button
              onClick={testPhantomConnection}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Test Phantom Connection
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};