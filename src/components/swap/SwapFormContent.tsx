import { useState } from "react";
import { SwapConfirmationDialog } from "./SwapConfirmationDialog";
import { SlippageControl } from "./SlippageControl";
import { PriceImpact } from "./PriceImpact";
import { TransactionHistory } from "./TransactionHistory";
import { TokenSelector } from "./TokenSelector";
import { RouteVisualizer } from "./RouteVisualizer";
import { SwapFormHeader } from "./SwapFormHeader";
import { SwapFormActions } from "./SwapFormActions";
import { SwapErrorDisplay } from "./SwapErrorDisplay";
import { SwapInputSection } from "./SwapInputSection";
import { TokenInfo } from "@/hooks/swap/useTokenList";
import { TokenSymbol, COMMON_TOKENS } from "@/constants/tokens";
import { SwapError } from "@/types/errors";

interface SwapFormContentProps {
  fromAmount: string;
  toAmount: string;
  slippage: number;
  isRefreshing: boolean;
  gasFee: string;
  selectedTokens: {
    from: TokenSymbol;
    to: TokenSymbol;
  };
  isWalletConnected: boolean;
  isTokenSelectorOpen: boolean;
  priceImpact: number;
  route: any;
  error: SwapError | null;
  onTokenSelect: (token: TokenInfo) => void;
  onSwap: () => void;
  onFromAmountChange: (value: string) => void;
  onQuickAmountSelect: (percentage: number) => void;
  onSlippageChange: (value: number) => void;
  onRefreshPrice: () => void;
  onTokenSelectorClose: () => void;
  calculateMinimumReceived: () => string;
}

export const SwapFormContent = ({
  fromAmount,
  toAmount,
  slippage,
  isRefreshing,
  gasFee,
  selectedTokens,
  isWalletConnected,
  isTokenSelectorOpen,
  priceImpact,
  route,
  error,
  onTokenSelect,
  onSwap,
  onFromAmountChange,
  onQuickAmountSelect,
  onSlippageChange,
  onRefreshPrice,
  onTokenSelectorClose,
  calculateMinimumReceived,
}: SwapFormContentProps) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const isHighImpact = priceImpact >= 5;

  const handleSwapClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmSwap = async () => {
    try {
      await onSwap();
      setIsConfirmationOpen(false);
    } catch (err) {
      console.error('Swap failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <SwapErrorDisplay error={error} isOnline={true} />
      
      <SwapFormHeader refreshPrice={onRefreshPrice} isRefreshing={isRefreshing} />

      <SwapInputSection
        fromToken={selectedTokens.from}
        toToken={selectedTokens.to}
        fromAmount={fromAmount}
        toAmount={toAmount}
        isWalletConnected={isWalletConnected}
        onFromAmountChange={onFromAmountChange}
        onQuickAmountSelect={onQuickAmountSelect}
        onTokenSelect={() => setIsConfirmationOpen(true)}
        calculateMinimumReceived={calculateMinimumReceived}
      />

      <SlippageControl 
        value={slippage} 
        onChange={onSlippageChange} 
      />
      
      <PriceImpact priceImpact={priceImpact} />
      
      {route && <RouteVisualizer route={route} tokenMap={COMMON_TOKENS} />}

      <SwapFormActions
        onSwap={handleSwapClick}
        disabled={!fromAmount || !isWalletConnected}
        gasFee={gasFee}
      />

      <SwapConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmSwap}
        fromAmount={fromAmount}
        toAmount={toAmount}
        priceImpact={priceImpact}
        minimumReceived={calculateMinimumReceived()}
        isHighImpact={isHighImpact}
      />

      <TokenSelector
        isOpen={isTokenSelectorOpen}
        onClose={onTokenSelectorClose}
        onSelect={onTokenSelect}
        currentToken={selectedTokens.from}
      />

      <TransactionHistory />
    </div>
  );
};