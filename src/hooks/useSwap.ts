import { useSwapCalculations } from "./swap/useSwapCalculations";
import { useSwapTransactions } from "./swap/useSwapTransactions";
import { useSwapState } from "./swap/useSwapState";
import { useAuth } from "@/components/AuthProvider";

export const useSwap = () => {
  const { user } = useAuth();
  const { isRefreshing, calculateToAmount, calculateMinimumReceived } = useSwapCalculations();
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

  const calculateSwapAmount = async (
    value: string,
    fromToken: string,
    toToken: string
  ) => {
    setFromAmount(value);
    const calculatedAmount = await calculateToAmount(value, fromToken, toToken);
    setToAmount(calculatedAmount);
  };

  const handleSwap = async (fromToken: string, toToken: string) => {
    if (!user?.id) throw new Error("User not authenticated");
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
    gasFee,
    calculateToAmount: calculateSwapAmount,
    handleSwap,
    calculateMinimumReceived: () => calculateMinimumReceived(toAmount, slippage),
    refreshPrice,
    handleQuickAmountSelect,
    setSlippage,
  };
};