import { useState } from "react";
import { SwapConfirmationDialog } from "./SwapConfirmationDialog";
import { SlippageControl } from "./SlippageControl";
import { PriceImpact } from "./PriceImpact";
import { TransactionHistory } from "./TransactionHistory";
import { TokenSelector } from "./TokenSelector";
import { RouteVisualizer } from "./RouteVisualizer";
import { SwapFormHeader } from "./SwapFormHeader";
import { SwapFormActions } from "./SwapFormActions";
import { SwapInputsSection } from "./SwapInputsSection";
import { useSwapForm } from "@/hooks/swap/useSwapForm";
import { useTokenList } from "@/hooks/swap/useTokenList";
import { useMemo } from "react";

interface SwapFormProps {
  isWalletConnected: boolean;
}

export const SwapForm = ({ isWalletConnected }: SwapFormProps) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { data: tokenList } = useTokenList();
  
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

  const tokenMap = useMemo(() => {
    if (!tokenList) return {};
    return tokenList.reduce((acc, token) => {
      acc[token.address] = token;
      return acc;
    }, {} as Record<string, typeof tokenList[0]>);
  }, [tokenList]);

  const handleSwapClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmSwap = async () => {
    await handleSwap();
    setIsConfirmationOpen(false);
  };

  return (
    <div className="space-y-6">
      <SwapFormHeader refreshPrice={refreshPrice} isRefreshing={isRefreshing} />

      <SwapInputsSection
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

      <SlippageControl value={slippage} onChange={setSlippage} />
      <PriceImpact priceImpact={priceImpact} />
      
      {route && <RouteVisualizer route={route} tokenMap={tokenMap} />}

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
        priceImpact={typeof priceImpact === 'number' ? priceImpact : 0}
        minimumReceived={calculateMinimumReceived()}
        isHighImpact={typeof priceImpact === 'number' ? priceImpact >= 5 : false}
      />

      <TokenSelector
        isOpen={isTokenSelectorOpen}
        onClose={() => setIsTokenSelectorOpen(false)}
        onSelect={(token) => {
          setSelectedTokens((prev) => ({
            ...prev,
            from: token.symbol,
          }));
          setIsTokenSelectorOpen(false);
        }}
        currentToken={selectedTokens.from}
      />

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Transaction History</h3>
        <TransactionHistory />
      </div>
    </div>
  );
};