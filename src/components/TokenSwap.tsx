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
    <div className="min-h-screen w-full py-4 md:py-8" id="swap">
      <div className="w-full px-4 md:px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 md:mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Tokens
        </h2>
        
        <div className="space-y-4 md:space-y-6">
          {/* Price Chart Section */}
          <div className="w-full overflow-hidden rounded-lg">
            <PriceChart />
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="w-full">
              <MarketStats />
            </div>
            <div className="w-full">
              <LiquidityPoolStats />
            </div>
          </div>

          {/* ROI Calculator Row */}
          <div className="w-full">
            <ROICalculator />
          </div>
          
          {/* Swap Form Section */}
          <div className="w-full max-w-xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-3 md:p-6 border border-primary/10">
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