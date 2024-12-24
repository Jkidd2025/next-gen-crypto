import { SwapForm } from "./swap/SwapForm";
import { WalletConnect } from "./swap/WalletConnect";
import { BuyWithCard } from "./swap/BuyWithCard";
import { useEffect } from "react";
import { PriceChart } from "./swap/PriceChart";
import { MarketStats } from "./swap/MarketStats";
import { ROICalculator } from "./swap/ROICalculator";
import { LiquidityPoolStats } from "./swap/LiquidityPoolStats";
import { useToast } from "@/hooks/use-toast";
import { getConnection } from "@/utils/wallet/connection";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export const TokenSwap = () => {
  const { connected } = useWalletConnection();
  const { toast } = useToast();

  useEffect(() => {
    const initConnection = async () => {
      try {
        await getConnection();
      } catch (error) {
        console.error("Failed to initialize connection:", error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to the network. Please try again later.",
          variant: "destructive"
        });
      }
    };

    initConnection();
  }, [toast]);

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
                <WalletConnect onConnect={() => {}} />
              ) : (
                <SwapForm isWalletConnected={connected} />
              )}
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