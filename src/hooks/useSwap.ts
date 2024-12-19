import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface SwapState {
  fromAmount: string;
  toAmount: string;
  slippage: number;
  isRefreshing: boolean;
  gasFee: number;
}

export const useSwap = () => {
  const [state, setState] = useState<SwapState>({
    fromAmount: "",
    toAmount: "",
    slippage: 0.5,
    isRefreshing: false,
    gasFee: 0.000005,
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const calculateToAmount = async (
    value: string,
    fromToken: string,
    toToken: string
  ) => {
    if (!value) {
      setState(prev => ({ ...prev, toAmount: "" }));
      return;
    }

    setState(prev => ({ ...prev, isRefreshing: true, fromAmount: value }));

    try {
      // Temporary mock calculation while Jupiter is removed
      const mockRate = 1.5;
      const calculatedAmount = parseFloat(value) * mockRate;
      setState(prev => ({
        ...prev,
        toAmount: calculatedAmount.toString(),
      }));
    } catch (error) {
      console.error('Error calculating amount:', error);
      toast({
        title: "Error",
        description: "Failed to calculate swap amount",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, isRefreshing: false }));
    }
  };

  const handleSwap = async (fromToken: string, toToken: string) => {
    try {
      // Store the mock transaction in Supabase
      await supabase.from("swap_transactions").insert({
        user_id: user?.id,
        from_token: fromToken,
        to_token: toToken,
        from_amount: parseFloat(state.fromAmount),
        to_amount: parseFloat(state.toAmount),
        slippage: state.slippage,
        status: "completed",
        gas_fee: state.gasFee,
      });

      toast({
        title: "Swap Successful",
        description: `Swapped ${state.fromAmount} ${fromToken} for ${state.toAmount} ${toToken}`,
      });

      return "mock-txid";
    } catch (error) {
      console.error('Error executing swap:', error);
      toast({
        title: "Swap Failed",
        description: "There was an error processing your swap",
        variant: "destructive",
      });
      throw error;
    }
  };

  const calculateMinimumReceived = () => {
    if (!state.toAmount) return "0";
    const amount = parseFloat(state.toAmount);
    return (amount * (1 - state.slippage / 100)).toFixed(6);
  };

  const refreshPrice = () => {
    if (state.fromAmount) {
      calculateToAmount(state.fromAmount, "SOL", "MEME");
    }
  };

  const handleQuickAmountSelect = (percentage: number) => {
    // Mock implementation
    const amount = (1000 * percentage) / 100;
    calculateToAmount(amount.toString(), "SOL", "MEME");
  };

  const setSlippage = (value: number) => {
    setState(prev => ({ ...prev, slippage: value }));
  };

  return {
    fromAmount: state.fromAmount,
    toAmount: state.toAmount,
    slippage: state.slippage,
    isRefreshing: state.isRefreshing,
    gasFee: state.gasFee,
    calculateToAmount,
    handleSwap,
    calculateMinimumReceived,
    refreshPrice,
    handleQuickAmountSelect,
    setSlippage,
  };
};