import { useState, useMemo } from "react";
import { SwapFormHeader } from "./SwapFormHeader";
import { SwapInputsSection } from "./SwapInputsSection";
import { SlippageControl } from "./SlippageControl";
import { PriceImpact } from "./PriceImpact";
import { RouteVisualizer } from "./RouteVisualizer";
import { SwapConfirmationDialog } from "./SwapConfirmationDialog";
import { useTokenList } from "@/hooks/swap/useTokenList";
import { useSwapForm } from "@/hooks/swap/useSwapForm";
import { useTokenPrices } from "@/hooks/swap/useTokenPrices";
import { Token } from "@/types/web3";

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
    selectedTokens,
    isRefreshing,
    gasFee,
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

  const tokenMap = useMemo(() => {
    if (!tokenList) return {};
    return tokenList.reduce((acc: Record<string, Token>, token: Token) => {
      acc[token.symbol] = token;
      return acc;
    }, {});
  }, [tokenList]);

  const handleConfirmSwap = async () => {
    await handleSwap();
    setIsConfirmationOpen(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 bg-card rounded-lg shadow-lg">
      <SwapFormHeader refreshPrice={refreshPrice} isRefreshing={isRefreshing} />

      <div className="flex justify-between items-center mb-4">
        {tokenPrices && tokenPrices[selectedTokens.from] && (
          <div className="text-sm text-muted-foreground">
            ${tokenPrices[selectedTokens.from].price.toFixed(2)}
          </div>
        )}
        {tokenPrices && tokenPrices[selectedTokens.to] && (
          <div className="text-sm text-muted-foreground">
            ${tokenPrices[selectedTokens.to].price.toFixed(2)}
          </div>
        )}
      </div>

      <SwapInputsSection
        fromAmount={fromAmount}
        toAmount={toAmount}
        selectedTokens={selectedTokens}
        onTokenSelect={setSelectedTokens}
        onAmountChange={calculateToAmount}
        onQuickAmountSelect={handleQuickAmountSelect}
        tokenList={tokenList}
        isWalletConnected={isWalletConnected}
      />

      <SlippageControl value={slippage} onChange={setSlippage} />
      <PriceImpact priceImpact={String(priceImpact)} />
      
      {route && <RouteVisualizer route={route} tokenMap={tokenMap} />}

      <SwapConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        fromAmount={fromAmount}
        toAmount={toAmount}
        selectedTokens={selectedTokens}
        slippage={slippage}
        minimumReceived={calculateMinimumReceived()}
        gasFee={gasFee}
        onConfirm={handleConfirmSwap}
      />
    </div>
  );
};