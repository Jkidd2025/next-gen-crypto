import { useState } from 'react';
import { useSwapCalculations } from './useSwapCalculations';
import { useSwapTransactions } from './useSwapTransactions';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export const useSwapForm = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState({
    from: "SOL",
    to: "MEME",
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const { isRefreshing, calculateToAmount, calculateMinimumReceived, priceImpact, route } = useSwapCalculations();
  const { handleSwap: executeSwap, gasFee } = useSwapTransactions();

  const handleQuickAmountSelect = (percentage: number) => {
    // Mock balance calculation - will be replaced with real balance
    const mockBalance = 100;
    const amount = (mockBalance * percentage) / 100;
    setFromAmount(amount.toString());
    return amount.toString();
  };

  const calculateSwapAmount = async (
    value: string,
    fromToken: string,
    toToken: string
  ) => {
    setFromAmount(value);
    const calculatedAmount = await calculateToAmount(value, fromToken, toToken);
    setToAmount(calculatedAmount);
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
      await executeSwap(
        selectedTokens.from,
        selectedTokens.to,
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
    priceImpact,
    route,
  };
};