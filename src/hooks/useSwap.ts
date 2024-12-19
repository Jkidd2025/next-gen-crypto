import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export const useSwap = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [gasFee, setGasFee] = useState(0.000005);
  const { toast } = useToast();
  const { user } = useAuth();

  const calculateToAmount = async (value: string) => {
    if (!value) {
      setToAmount("");
      return;
    }

    setIsRefreshing(true);
    setFromAmount(value);

    try {
      // Temporary mock calculation while Jupiter is removed
      const mockRate = 1.5;
      const calculatedAmount = parseFloat(value) * mockRate;
      setToAmount(calculatedAmount.toString());
    } catch (error) {
      console.error('Error calculating amount:', error);
      toast({
        title: "Error",
        description: "Failed to calculate swap amount",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSwap = async () => {
    try {
      // Store the mock transaction in Supabase
      await supabase.from("swap_transactions").insert({
        user_id: user?.id,
        from_token: "SOL",
        to_token: "MEME",
        from_amount: parseFloat(fromAmount),
        to_amount: parseFloat(toAmount),
        slippage,
        status: "completed",
        gas_fee: gasFee,
      });

      toast({
        title: "Swap Successful",
        description: `Swapped ${fromAmount} SOL for ${toAmount} MEME`,
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
    if (!toAmount) return "0";
    const amount = parseFloat(toAmount);
    return (amount * (1 - slippage / 100)).toFixed(6);
  };

  const refreshPrice = () => {
    if (fromAmount) {
      calculateToAmount(fromAmount);
    }
  };

  const handleQuickAmountSelect = (percentage: number) => {
    // Mock implementation
    const amount = (1000 * percentage) / 100;
    calculateToAmount(amount.toString());
  };

  return {
    fromAmount,
    toAmount,
    slippage,
    isRefreshing,
    gasFee,
    calculateToAmount,
    handleSwap,
    calculateMinimumReceived,
    refreshPrice,
    handleQuickAmountSelect,
    setSlippage,
  };
};