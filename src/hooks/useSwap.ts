import { useSwapCalculations } from "./swap/useSwapCalculations";
import { useSwapTransactions } from "./swap/useSwapTransactions";
import { useSwapState } from "./swap/useSwapState";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";

export interface SwapRoute {
  marketInfos: {
    amm: {
      label: string;
    };
    inputMint: string;
    outputMint: string;
  }[];
}

export const useSwap = () => {
  const { user } = useAuth();
  const { isRefreshing, calculateToAmount, calculateMinimumReceived, priceImpact, route } = useSwapCalculations();
  const { handleSwap: executeSwap, gasFee } = useSwapTransactions();
  const {
    fromAmount,
    toAmount,
    slippage,
    setFromAmount,
    setToAmount,
    setSlippage,
    handleQuickAmountSelect,
  } = useSwapState();

  // Add proper query handling for token prices
  const { data: tokenPrices, isLoading: isPriceLoading } = useQuery({
    queryKey: ['tokenPrices'],
    queryFn: async () => {
      // Mock price data while external API integration is pending
      return {
        SOL: 100,
        MEME: 0.1
      };
    },
    retry: 3,
    staleTime: 30000, // 30 seconds
  });

  const calculateSwapAmount = async (
    value: string,
    fromToken: string,
    toToken: string
  ) => {
    if (!tokenPrices) return "0";
    
    setFromAmount(value);
    const calculatedAmount = await calculateToAmount(value, fromToken, toToken);
    setToAmount(calculatedAmount);
  };

  const handleSwap = async (fromToken: string, toToken: string) => {
    if (!user?.id) throw new Error("User not authenticated");
    if (!tokenPrices) throw new Error("Price data not available");
    
    return executeSwap(fromToken, toToken, fromAmount, toAmount, slippage, user.id);
  };

  const refreshPrice = () => {
    if (fromAmount) {
      calculateSwapAmount(fromAmount, "SOL", "MEME");
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
  };
};