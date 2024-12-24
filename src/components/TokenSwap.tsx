import { SwapForm } from "./swap/SwapForm";
import { WalletConnect } from "./swap/WalletConnect";
import { BuyWithCard } from "./swap/BuyWithCard";
import { useEffect, useState, useCallback } from "react";
import { PriceChart } from "./swap/PriceChart";
import { MarketStats } from "./swap/MarketStats";
import { ROICalculator } from "./swap/ROICalculator";
import { LiquidityPoolStats } from "./swap/LiquidityPoolStats";
import { useToast } from "@/hooks/use-toast";
import { Connection } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertTriangle } from "lucide-react";
import { ConnectionProvider } from "@/utils/solana/ConnectionProvider";

export const TokenSwap = () => {
  const { connected, connecting } = useWallet();
  const { toast } = useToast();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const conn = await ConnectionProvider.getReliableConnection();
      setConnection(conn);
      toast({
        title: "Connected",
        description: "Successfully connected to Solana network",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Solana';
      setError(errorMessage);
      console.error('Connection error:', err);
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    initializeConnection();
  }, [initializeConnection]);

  const handleRetryConnection = () => {
    initializeConnection();
  };

  const handleWalletConnect = (isConnected: boolean) => {
    if (isConnected) {
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    }
  };

  if (isLoading || connecting) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            {connecting ? "Connecting wallet..." : "Connecting to Solana network..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button
            onClick={handleRetryConnection}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-6 md:py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#F97316] bg-clip-text text-transparent">
          Token Swap
        </h2>
        
        <div className="grid gap-6 md:gap-8">
          <div className="max-w-xl mx-auto w-full">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-4 md:p-6 border border-primary/10">
              {!connected ? (
                <WalletConnect onConnect={handleWalletConnect} />
              ) : (
                <SwapForm isWalletConnected={connected} />
              )}
            </div>
            
            <div className="mt-4">
              <BuyWithCard />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
            <PriceChart />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-4 md:p-6">
              <MarketStats />
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-4 md:p-6">
              <LiquidityPoolStats />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-4 md:p-6">
            <ROICalculator />
          </div>
        </div>
      </div>
    </section>
  );
};