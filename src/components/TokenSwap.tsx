import { SwapForm } from "./swap/SwapForm";
import { WalletConnect } from "./swap/WalletConnect";
import { BuyWithCard } from "./swap/BuyWithCard";
import { useState } from "react";
import { PriceChart } from "./swap/PriceChart";
import { MarketStats } from "./swap/MarketStats";
import { ROICalculator } from "./swap/ROICalculator";
import { LiquidityPoolStats } from "./swap/LiquidityPoolStats";

export const TokenSwap = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  return (
    <section id="swap" className="w-full py-6 md:py-10 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Tokens
        </h2>
        
        <div className="space-y-6 md:space-y-8">
          <div className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden min-h-[300px]">
            <PriceChart />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-4 md:p-6">
              <MarketStats />
            </div>
            <div className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-4 md:p-6">
              <LiquidityPoolStats />
            </div>
          </div>

          <div className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-4 md:p-6">
            <ROICalculator />
          </div>
          
          <div className="w-full max-w-xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-4 md:p-6 border border-primary/10">
              {!isWalletConnected ? (
                <WalletConnect onConnect={setIsWalletConnected} />
              ) : (
                <SwapForm isWalletConnected={isWalletConnected} />
              )}
              <BuyWithCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};