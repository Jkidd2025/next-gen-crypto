import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { SwapConfirmationDialog } from "./SwapConfirmationDialog";
import { SwapInput } from "./SwapInput";
import { SlippageControl } from "./SlippageControl";
import { PriceImpact } from "./PriceImpact";
import { TransactionHistory } from "./TransactionHistory";
import { TokenSelector } from "./TokenSelector";
import { RouteVisualizer } from "./RouteVisualizer";
import { SwapFormHeader } from "./SwapFormHeader";
import { SwapFormActions } from "./SwapFormActions";
import { useSwapForm } from "@/hooks/swap/useSwapForm";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import type { TokenInfo } from "@/hooks/swap/useTokenList";
import { COMMON_TOKENS, TokenSymbol } from "@/constants/tokens";

interface SwapFormProps {
  isWalletConnected: boolean;
}

export const SwapForm = ({ isWalletConnected }: SwapFormProps) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { isOnline } = useNetworkStatus();
  
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
    setIsConfirmationOpen(true);
  };

  const handleConfirmSwap = async () => {
    await handleSwap();
    setIsConfirmationOpen(false);
  };

  const handleTokenSelect = (token: TokenInfo) => {
    const tokenSymbol = token.symbol as TokenSymbol;
    if (!(tokenSymbol in COMMON_TOKENS)) {
      console.error("Invalid token symbol:", token.symbol);
      return;
    }

    setSelectedTokens(prev => ({
      ...prev,
      from: tokenSymbol,
    }));
    setIsTokenSelectorOpen(false);
  };

  return (
    <div className="space-y-6">
      {!isOnline && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Network Error</AlertTitle>
          <AlertDescription>
            You are currently offline. Some features may not work properly.
          </AlertDescription>
        </Alert>
      )}

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

      <SlippageControl value={slippage} onChange={setSlippage} />
      <PriceImpact priceImpact={String(priceImpact)} />
      
      {route && <RouteVisualizer route={route} tokenMap={COMMON_TOKENS} />}

      <SwapFormActions
        onSwap={handleSwapClick}
        disabled={!fromAmount || !isWalletConnected}
        gasFee={String(gasFee)}
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