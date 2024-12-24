import { useSwapForm } from "@/hooks/swap/useSwapForm";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useSwapErrors } from "@/hooks/useSwapErrors";
import { SwapFormContent } from "./SwapFormContent";
import type { TokenInfo } from "@/hooks/swap/useTokenList";
import { TokenSymbol } from "@/constants/tokens";

interface SwapFormProps {
  isWalletConnected: boolean;
}

export const SwapForm = ({ isWalletConnected }: SwapFormProps) => {
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

  const handleTokenSelect = (token: TokenInfo) => {
    const tokenSymbol = token.symbol as TokenSymbol;
    setSelectedTokens({
      ...selectedTokens,
      from: tokenSymbol,
    });
    setIsTokenSelectorOpen(false);
  };

  return (
    <SwapFormContent
      fromAmount={fromAmount}
      toAmount={toAmount}
      slippage={slippage}
      isRefreshing={isRefreshing}
      gasFee={gasFee}
      selectedTokens={selectedTokens}
      isWalletConnected={isWalletConnected}
      isTokenSelectorOpen={isTokenSelectorOpen}
      priceImpact={Number(priceImpact)}
      route={route}
      error={error}
      onTokenSelect={handleTokenSelect}
      onSwap={handleSwap}
      onFromAmountChange={(value) => calculateToAmount(value, selectedTokens.from, selectedTokens.to)}
      onQuickAmountSelect={handleQuickAmountSelect}
      onSlippageChange={setSlippage}
      onRefreshPrice={refreshPrice}
      onTokenSelectorClose={() => setIsTokenSelectorOpen(false)}
      calculateMinimumReceived={calculateMinimumReceived}
    />
  );
};