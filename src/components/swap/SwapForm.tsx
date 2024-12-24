import { useState } from "react";
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
import { COMMON_TOKENS, TokenSymbol } from "@/constants/tokens";

interface SwapFormProps {
  isWalletConnected: boolean;
}

type SelectedTokens = {
  from: TokenSymbol;
  to: TokenSymbol;
};

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

    const newSelectedTokens: SelectedTokens = {
      ...selectedTokens,
      from: tokenSymbol,
    };
    setSelectedTokens(newSelectedTokens);
    setIsTokenSelectorOpen(false);
  };

  // Convert price impact to number for comparison
  const priceImpactNumber = Number(priceImpact);

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
        minimumReceived={fromAmount ? calculateMinimumReceived() : undefined}
        onTokenSelect={() => setIsTokenSelectorOpen(true)}
      />

      <SlippageControl 
        value={typeof slippage === 'number' ? slippage.toString() : slippage} 
        onChange={(value) => setSlippage(Number(value))} 
      />
      
      <PriceImpact 
        priceImpact={priceImpactNumber.toString()} 
      />
      
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
        priceImpact={priceImpactNumber}
        minimumReceived={calculateMinimumReceived()}
        isHighImpact={priceImpactNumber >= 5}
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