import { useState } from 'react';
import { useSwapCalculations } from './swap/useSwapCalculations';
import { useSwapTransactions } from './swap/useSwapTransactions';
import { useAuth } from '@/components/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { COMMON_TOKENS, TokenSymbol } from '@/constants/tokens';

interface SwapState {
  fromAmount: string;
  toAmount: string;
  selectedTokens: {
    from: TokenSymbol;
    to: TokenSymbol;
  };
  slippage: number;
}

export const useSwap = () => {
  const { user } = useAuth();
  const { isRefreshing, calculateToAmount, calculateMinimumReceived, priceImpact, route } = useSwapCalculations();
  const { handleSwap: executeSwap, gasFee } = useSwapTransactions();

  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [selectedTokens, setSelectedTokens] = useState<SwapState['selectedTokens']>({
    from: "SOL",
    to: "USDC"
  });
  const [slippage, setSlippage] = useState<number>(0.5);

  // Add proper query handling for token prices
  const { data: tokenPrices, isLoading: isPriceLoading } = useQuery({
    queryKey: ['tokenPrices'],
    queryFn: async () => {
      // Mock price data while external API integration is pending
      return {
        SOL: 100,
        USDC: 1,
        USDT: 1
      };
    },
    retry: 3,
    staleTime: 30000, // 30 seconds
  });

  const handleQuickAmountSelect = (percentage: number): string => {
    const mockBalance = 100;
    const amount = (mockBalance * percentage) / 100;
    const amountString = amount.toString();
    setFromAmount(amountString);
    return amountString;
  };

  const calculateSwapAmount = async (
    value: string,
    fromToken: TokenSymbol,
    toToken: TokenSymbol
  ) => {
    if (!tokenPrices) return "0";
    
    setFromAmount(value);
    const fromTokenInfo = COMMON_TOKENS[fromToken];
    const toTokenInfo = COMMON_TOKENS[toToken];

    if (!fromTokenInfo || !toTokenInfo) {
      throw new Error("Invalid token selection");
    }

    const calculatedAmount = await calculateToAmount(
      value,
      fromTokenInfo.address,
      toTokenInfo.address
    );
    setToAmount(calculatedAmount);
  };

  const handleSwap = async () => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }
    if (!tokenPrices) {
      throw new Error("Price data not available");
    }
    
    const fromTokenInfo = COMMON_TOKENS[selectedTokens.from];
    const toTokenInfo = COMMON_TOKENS[selectedTokens.to];

    if (!fromTokenInfo || !toTokenInfo) {
      throw new Error("Invalid token selection");
    }

    return executeSwap(
      fromTokenInfo.address,
      toTokenInfo.address,
      fromAmount,
      toAmount,
      slippage,
      user.id
    );
  };

  const refreshPrice = () => {
    if (fromAmount) {
      calculateSwapAmount(fromAmount, selectedTokens.from, selectedTokens.to);
    }
  };

  return {
    fromAmount,
    toAmount,
    slippage,
    isRefreshing,
    isPriceLoading,
    gasFee,
    calculateToAmount: calculateSwapAmount,
    handleSwap,
    calculateMinimumReceived: () => calculateMinimumReceived(toAmount, slippage),
    refreshPrice,
    handleQuickAmountSelect,
    setSlippage,
    priceImpact,
    route,
    selectedTokens,
    setSelectedTokens,
    setFromAmount,
    setToAmount
  };
};