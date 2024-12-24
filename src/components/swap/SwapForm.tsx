import { useState, useMemo, useCallback } from "react";
import { SwapConfirmationDialog } from "./SwapConfirmationDialog";
import { SwapInput } from "./SwapInput";
import { SlippageControl } from "./SlippageControl";
import { PriceImpact } from "./PriceImpact";
import { TransactionHistory } from "./TransactionHistory";
import { TokenSelector } from "./TokenSelector";
import { RouteVisualizer } from "./RouteVisualizer";
import { SwapFormHeader } from "./SwapFormHeader";
import { SwapFormActions } from "./SwapFormActions";
import { SwapErrorDisplay } from "./SwapErrorDisplay";
import { useSwapForm } from "@/hooks/swap/useSwapForm";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useSwapErrors } from "@/hooks/swap/useSwapErrors";
import { SwapErrorTypes } from "@/types/errors";
import type { TokenInfo } from "@/hooks/swap/useTokenList";
import type { TokenSymbol } from "@/types/token";
import { COMMON_TOKENS } from "@/constants/tokens";

interface SwapFormProps {
  isWalletConnected: boolean;
}

interface SelectedTokens {
  from: TokenSymbol;
  to: TokenSymbol;
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

  const { priceImpactNumber, isHighImpact } = useMemo(() => {
    const number = parseFloat(priceImpact);
    return {
      priceImpactNumber: number,
      isHighImpact: number >= 5
    };
  }, [priceImpact]);

  // Memoize handlers
  const handleSwapClick = useCallback(() => {
    clearError();
    setIsConfirmationOpen(true);
  }, [clearError]);

  const handleConfirmSwap = useCallback(async () => {
    try {
      await handleSwap();
      setIsConfirmationOpen(false);
    } catch (err) {
      setError({
        type: SwapErrorTypes.UNKNOWN,
        message: err instanceof Error ? err.message : 'An unknown error occurred',
      });
    }
  }, [handleSwap, setError]);

  const handleTokenSelect = useCallback((token: TokenInfo) => {
    const tokenSymbol = token.symbol as TokenSymbol;
    if (!(tokenSymbol in COMMON_TOKENS)) {
      setError({
        type: SwapErrorTypes.VALIDATION,
        message: `Invalid token symbol: ${token.symbol}`,
      });
      return;
    }

    setSelectedTokens((prev: SelectedTokens): SelectedTokens => ({
      ...prev,
      from: tokenSymbol,
    }));
    setIsTokenSelectorOpen(false);
  }, [setError, setSelectedTokens, setIsTokenSelectorOpen]);

  const minimumReceived = useMemo(() => {
    if (!fromAmount) return "0";
    return calculateMinimumReceived();
  }, [fromAmount, calculateMinimumReceived]);

  return (
    <div className="space-y-6">
      <SwapErrorDisplay isOnline={isOnline} error={error} />
      
      <SwapFormHeader refreshPrice={refreshPrice} isRefreshing={isRefreshing} />

      <SwapInput
        label={`From (${selectedTokens.from})`}
        value={fromAmount}
        onChange={(value) => calculateToAmount(value, selectedTokens.from, selectedTokens.to)}
        isWalletConnected={isWalletConnected}
        onQuickAmountSelect={handleQuickAmountSelect}
        showQuickAmounts={true}
        onTokenSelect={() => setIsTokenSelectorOpen(true)}
      />

      <SwapInput
        label={`To (${selectedTokens.to})`}
        value={toAmount}
        readOnly={true}
        minimumReceived={calculateMinimumReceived()}
        onTokenSelect={() => setIsTokenSelectorOpen(true)}
      />

      <SlippageControl 
        value={slippage} 
        onChange={setSlippage} 
      />
      
      <PriceImpact 
        priceImpact={priceImpact} 
      />
      
      {route && <RouteVisualizer route={{ marketInfos: route }} tokenMap={COMMON_TOKENS} />}

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
        priceImpact={parseFloat(priceImpact)}
        minimumReceived={calculateMinimumReceived()}
        isHighImpact={parseFloat(priceImpact) >= 5}
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
