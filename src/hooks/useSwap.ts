import { useSwapState } from './swap/useSwapState';
import { useSwapActions } from './swap/useSwapActions';
import type { TokenSymbol } from '@/types/token';

interface SwapHookReturn {
  fromAmount: string;
  toAmount: string;
  slippage: number;
  isRefreshing: boolean;
  gasFee: string;
  selectedTokens: {
    from: TokenSymbol;
    to: TokenSymbol;
  };
  isTokenSelectorOpen: boolean;
  setIsTokenSelectorOpen: (isOpen: boolean) => void;
  setSelectedTokens: (tokens: { from: TokenSymbol; to: TokenSymbol }) => void;
  calculateToAmount: (value: string, fromToken: string, toToken: string) => Promise<void>;
  handleSwap: () => Promise<void>;
  calculateMinimumReceived: () => string;
  refreshPrice: () => void;
  handleQuickAmountSelect: (percentage: number) => string;
  setSlippage: (value: number) => void;
  priceImpact: string;
  route: any[];
}

export const useSwap = (): SwapHookReturn => {
  const {
    fromAmount,
    toAmount,
    slippage,
    selectedTokens,
    isTokenSelectorOpen,
    setFromAmount,
    setToAmount,
    setSlippage,
    setIsTokenSelectorOpen,
    setSelectedTokens,
    handleQuickAmountSelect,
  } = useSwapState();

  const {
    isRefreshing,
    calculateToAmount,
    handleSwap,
    calculateMinimumReceived,
    refreshPrice,
    priceImpact,
    route,
    gasFee
  } = useSwapActions(
    fromAmount,
    toAmount,
    setFromAmount,
    setToAmount,
    selectedTokens,
    slippage
  );

  return {
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
  };
};