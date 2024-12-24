import { useState, useCallback } from 'react';
import { useTokenList } from './useTokenList';
import { useSwapActions } from './useSwapActions';
import { TokenSymbol } from '@/types/token';

export const useSwapForm = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<{
    from: TokenSymbol;
    to: TokenSymbol;
  }>({
    from: 'SOL',
    to: 'USDC'
  });

  const { getTokenBySymbol } = useTokenList();

  const {
    isRefreshing,
    calculateToAmount,
    handleSwap,
    calculateMinimumReceived,
    refreshPrice,
    priceImpact,
    route
  } = useSwapActions({
    fromAmount,
    toAmount,
    setFromAmount,
    setToAmount,
    selectedTokens,
    slippage
  });

  const calculateSwapAmount = async (value: string) => {
    try {
      const fromTokenInfo = getTokenBySymbol(selectedTokens.from);
      const toTokenInfo = getTokenBySymbol(selectedTokens.to);

      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error("Invalid token selection");
      }

      const calculatedAmount = await calculateToAmount(value);
      setToAmount(calculatedAmount);
    } catch (error) {
      console.error("Error calculating swap amount:", error);
      setToAmount('0');
      throw error;
    }
  };

  const handleQuickAmountSelect = useCallback((percentage: number) => {
    const mockBalance = 100; // This should come from actual wallet balance
    const amount = (mockBalance * percentage) / 100;
    setFromAmount(amount.toString());
    return amount.toString();
  }, []);

  return {
    fromAmount,
    toAmount,
    slippage,
    isRefreshing,
    selectedTokens,
    isTokenSelectorOpen,
    setIsTokenSelectorOpen,
    setSelectedTokens,
    calculateToAmount: calculateSwapAmount,
    handleSwap,
    calculateMinimumReceived,
    refreshPrice,
    handleQuickAmountSelect,
    setSlippage,
    priceImpact,
    route,
  };
};