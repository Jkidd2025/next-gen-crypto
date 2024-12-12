import { SwapForm } from "./swap/SwapForm";
import { WalletConnect } from "./swap/WalletConnect";
import { BuyWithCard } from "./swap/BuyWithCard";
import { useState } from "react";

export const TokenSwap = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  return (
    <div className="py-20" id="swap">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary">Swap Tokens</h2>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          {!isWalletConnected ? (
            <WalletConnect onConnect={setIsWalletConnected} />
          ) : (
            <SwapForm isWalletConnected={isWalletConnected} />
          )}
          
          <BuyWithCard />
        </div>
      </div>
    </div>
  );
};