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
import { useSwapForm } from "@/hooks/swap/useSwapForm";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useSwapErrors, SwapErrorTypes } from "@/hooks/swap/useSwapErrors";
import type { TokenInfo } from "@/hooks/swap/useTokenList";
import { COMMON_TOKENS, TokenSymbol } from "@/constants/tokens";

interface SwapFormProps {
  isWalletConnected: boolean;
}

export const SwapForm = ({ isWalletConnected }: SwapFormProps) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { isOnline } = useNetworkStatus();
  const { error, setError, clearError } = useSwapErrors();
  
  const {
    fromAmount,
    toAmount,
    slippage,
    isRefreshing,
    gasFee,
    selectedTokens,
    isTokenSelectorOpen,
    setIsTokenSelectorOpen,
    setSelectedTokens,
    calculateToAmount,
    handleSwap,
    calculateMinimumReceived,
    refreshPrice,
    handleQuickAmountSelect,
    setSlippage,
    priceImpact,
    route,
  } = useSwapForm();

  const handleSwapClick = () => {
    clearError();
    setIsConfirmationOpen(true);
  };

  const handleConfirmSwap = async () => {
    try {
      await handleSwap();
      setIsConfirmationOpen(false);
    } catch (err) {
      setError({
        type: SwapErrorTypes.UNKNOWN,
        message: err instanceof Error ? err.message : 'An unknown error occurred',
      });
    }
  };

  const handleTokenSelect = (token: TokenInfo) => {
    const tokenSymbol = token.symbol as TokenSymbol;
    if (!(tokenSymbol in COMMON_TOKENS)) {
      setError({
        type: SwapErrorTypes.VALIDATION,
        message: `Invalid token symbol: ${token.symbol}`,
      });
      return;
    }

    setSelectedTokens({
      ...selectedTokens,
      from: tokenSymbol,
    });
    setIsTokenSelectorOpen(false);
  };

  return (
    <div className="space-y-6">
      <SwapErrorDisplay isOnline={isOnline} error={error} />
      
      <SwapFormHeader refreshPrice={refreshPrice} isRefreshing={isRefreshing} />

      <SwapInputSection
        fromToken={selectedTokens.from}
        toToken={selectedTokens.to}
        fromAmount={fromAmount}
        toAmount={toAmount}
        isWalletConnected={isWalletConnected}
        onFromAmountChange={(value) => calculateToAmount(value, selectedTokens.from, selectedTokens.to)}
        onQuickAmountSelect={handleQuickAmountSelect}
        onTokenSelect={() => setIsTokenSelectorOpen(true)}
        calculateMinimumReceived={calculateMinimumReceived}
      />

      <SlippageControl value={slippage.toString()} onChange={(value) => setSlippage(parseFloat(value))} />
      <PriceImpact priceImpact={priceImpact.toString()} />
      
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
        priceImpact={Number(priceImpact)}
        minimumReceived={calculateMinimumReceived()}
        isHighImpact={Number(priceImpact) >= 5}
      />

      <TokenSelector
        isOpen={isTokenSelectorOpen}
        onClose={() => setIsTokenSelectorOpen(false)}
        onSelect={handleTokenSelect}
        currentToken={selectedTokens.from}
      />

      <TransactionHistory />
    </div>
  );
};