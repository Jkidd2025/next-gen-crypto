import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useSwapCalculations } from './useSwapCalculations';
import { useSwapTransactions } from './useSwapTransactions';
import { findTokenInfo } from '@/utils/swap';
import type { TokenSymbol } from '@/types/token';

interface SwapActionsReturn {
  isRefreshing: boolean;
  calculateToAmount: (value: string, fromToken: string, toToken: string) => Promise<void>;
  handleSwap: () => Promise<void>;
  calculateMinimumReceived: () => string;
  refreshPrice: () => void;
  priceImpact: string;
  route: any[];
  gasFee: string;
}

export const useSwapActions = (
  fromAmount: string,
  toAmount: string,
  setFromAmount: (value: string) => void,
  setToAmount: (value: string) => void,
  selectedTokens: { from: TokenSymbol; to: TokenSymbol },
  slippage: number
): SwapActionsReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isRefreshing, calculateToAmount: calcAmount, calculateMinimumReceived, priceImpact, route } = useSwapCalculations();
  const { handleSwap: executeSwap, gasFee } = useSwapTransactions();

  const calculateToAmount = async (
    value: string,
    fromToken: string,
    toToken: string
  ) => {
    try {
      setFromAmount(value);
      const fromTokenInfo = findTokenInfo(fromToken);
      const toTokenInfo = findTokenInfo(toToken);

      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error("Invalid token selection");
      }

      const calculatedAmount = await calcAmount(value, fromTokenInfo.address, toTokenInfo.address);
      setToAmount(calculatedAmount);
    } catch (error) {
      console.error("Error calculating swap amount:", error);
      toast({
        title: "Error",
        description: "Failed to calculate swap amount. Please try again.",
        variant: "destructive",
      });
      setToAmount("0");
    }
  };

  const handleSwap = async () => {
    if (!user?.id) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to proceed with the swap",
        variant: "destructive",
      });
      return;
    }

    try {
      const fromTokenInfo = findTokenInfo(selectedTokens.from);
      const toTokenInfo = findTokenInfo(selectedTokens.to);

      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error("Invalid token selection");
      }

      await executeSwap(
        fromTokenInfo.address,
        toTokenInfo.address,
        fromAmount,
        toAmount,
        slippage,
        user.id
      );
      
      toast({
        title: "Swap successful",
        description: `Successfully swapped ${fromAmount} ${selectedTokens.from} for ${toAmount} ${selectedTokens.to}`,
      });
    } catch (error) {
      toast({
        title: "Swap failed",
        description: error instanceof Error ? error.message : "An error occurred during the swap",
        variant: "destructive",
      });
    }
  };

  const refreshPrice = () => {
    if (fromAmount) {
      calculateToAmount(fromAmount, selectedTokens.from, selectedTokens.to);
    }
  };

  return {
    isRefreshing,
    calculateToAmount,
    handleSwap,
    calculateMinimumReceived,
    refreshPrice,
    priceImpact: String(priceImpact),
    route,
    gasFee
  };
};