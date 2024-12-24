import { useState } from 'react';
import { useTokenUtils } from './useTokenUtils';
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

  const { getTokenBySymbol } = useTokenUtils();

  const {
    isRefreshing,
    calculateToAmount,
    handleSwap,
    calculateMinimumReceived,
    refreshPrice,
    priceImpact,
    route,
    gasFee
  } = useSwapActions({
    fromAmount,
    toAmount,
    setFromAmount,
    setToAmount,
    selectedTokens,
    slippage
  });

  const handleQuickAmountSelect = (percentage: number) => {
    const mockBalance = 100;
    const amount = (mockBalance * percentage) / 100;
    const amountString = amount.toString();
    setFromAmount(amountString);
    calculateToAmount(amountString);
    return amountString;
  };

  return {
    fromAmount,
    toAmount,
    slippage,
    isRefreshing,
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
    gasFee
  };
};