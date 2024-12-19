import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { createSwapTransaction, getTokenBalance } from "@/utils/solana";

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
      // In production, this should fetch real-time price from a DEX
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
    if (!window.solana || !window.solana.publicKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const fromAmount = parseFloat(state.fromAmount);
      const balance = await getTokenBalance(window.solana.publicKey.toString());
      
      if (balance < fromAmount) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough tokens for this swap",
          variant: "destructive",
        });
        return;
      }

      const transaction = await createSwapTransaction(
        window.solana.publicKey.toString(),
        toToken,
        fromAmount,
        state.slippage
      );

      const signed = await window.solana.signTransaction(transaction);
      const signature = await window.solana.sendTransaction(signed);

      console.log('Transaction sent:', signature);

      // Store the transaction in Supabase
      await supabase.from("swap_transactions").insert({
        user_id: user?.id,
        from_token: fromToken,
        to_token: toToken,
        from_amount: fromAmount,
        to_amount: parseFloat(state.toAmount),
        slippage: state.slippage,
        status: "completed",
        gas_fee: state.gasFee,
      });

      toast({
        title: "Swap Successful",
        description: `Swapped ${state.fromAmount} ${fromToken} for ${state.toAmount} ${toToken}`,
      });

      return signature;
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
    // Calculate amount based on wallet balance
    getTokenBalance(window.solana?.publicKey?.toString() || "")
      .then(balance => {
        const amount = (balance * percentage) / 100;
        calculateToAmount(amount.toString(), "SOL", "MEME");
      })
      .catch(console.error);
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