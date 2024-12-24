import { useSwapCalculations } from './swap/useSwapCalculations';
import { useSwapTransactions } from './swap/useSwapTransactions';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useSwapState } from './swap/useSwapState';
import { findTokenInfo } from '@/utils/swap';

interface SwapHookReturn {
  fromAmount: string;
  toAmount: string;
  slippage: number;
  isRefreshing: boolean;
  gasFee: string;
  selectedTokens: {
    from: string;
    to: string;
  };
  isTokenSelectorOpen: boolean;
  setIsTokenSelectorOpen: (isOpen: boolean) => void;
  setSelectedTokens: (tokens: { from: string; to: string }) => void;
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
  const { user } = useAuth();
  const { toast } = useToast();
  const { isRefreshing, calculateToAmount, calculateMinimumReceived, priceImpact, route } = useSwapCalculations();
  const { handleSwap: executeSwap, gasFee } = useSwapTransactions();
  const {
    fromAmount,
    setFromAmount,
    toAmount,
    setToAmount,
    slippage,
    setSlippage,
    isTokenSelectorOpen,
    setIsTokenSelectorOpen,
    selectedTokens,
    setSelectedTokens,
    handleQuickAmountSelect,
  } = useSwapState();

  const calculateSwapAmount = async (
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

      const calculatedAmount = await calculateToAmount(
        value,
        fromTokenInfo.address,
        toTokenInfo.address
      );
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
      calculateSwapAmount(fromAmount, selectedTokens.from, selectedTokens.to);
    }
  };

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
    calculateToAmount: calculateSwapAmount,
    handleSwap,
    calculateMinimumReceived: () => calculateMinimumReceived(toAmount, slippage),
    refreshPrice,
    handleQuickAmountSelect,
    setSlippage,
    priceImpact: String(priceImpact),
    route,
  };
};