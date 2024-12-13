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
    <div className="py-20" id="swap">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Swap Tokens
        </h2>
        
        <div className="space-y-8">
          {/* Price Chart Section */}
          <PriceChart />
          
          {/* Stats Row */}
          <div className="grid md:grid-cols-3 gap-4">
            <ROICalculator />
            <MarketStats />
            <LiquidityPoolStats />
          </div>
          
          {/* Swap Form Section */}
          <div className="max-w-xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-primary/10">
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
    </div>
  );
};