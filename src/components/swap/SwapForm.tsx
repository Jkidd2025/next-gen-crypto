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
import { useSwapForm } from "@/hooks/swap/useSwapForm";
import type { TokenInfo } from "@/hooks/swap/useTokenList";
import { useTokenPrices } from "@/hooks/swap/useTokenPrices";

interface SwapFormProps {
  isWalletConnected: boolean;
}

export const SwapForm = ({ isWalletConnected }: SwapFormProps) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  
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

  const { data: tokenPrices } = useTokenPrices([selectedTokens.from, selectedTokens.to]);

  const handleSwapClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmSwap = async () => {
    await handleSwap();
    setIsConfirmationOpen(false);
  };

  const handleTokenSelect = (token: TokenInfo) => {
    setSelectedTokens((prev) => ({
      ...prev,
      from: token.symbol,
    }));
    setIsTokenSelectorOpen(false);
  };

  return (
    <div className="space-y-6">
      <SwapFormHeader refreshPrice={refreshPrice} isRefreshing={isRefreshing} />

      {tokenPrices && tokenPrices[selectedTokens.from] && (
        <div className="text-sm text-muted-foreground">
          Price: ${tokenPrices[selectedTokens.from].price.toFixed(2)}
        </div>
      )}

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
      
      {route && <RouteVisualizer route={route} tokenMap={{}} />}

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