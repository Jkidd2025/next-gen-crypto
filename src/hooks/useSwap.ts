import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { initJupiter, getRoutes, executeSwap } from "@/services/jupiter";
import { PublicKey } from "@solana/web3.js";

export const useSwap = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [gasFee, setGasFee] = useState(0.000005);
  const { toast } = useToast();
  const { user } = useAuth();

  const calculateToAmount = async (value: string, fromToken: string, toToken: string) => {
    if (!value) {
      setToAmount("");
      return;
    }

    setIsRefreshing(true);
    setFromAmount(value);

    try {
      const userPublicKey = new PublicKey(""); // TODO: Get from wallet
      const jupiter = await initJupiter(userPublicKey);
      const routes = await getRoutes(
        jupiter,
        fromToken,
        toToken,
        parseFloat(value),
        slippage
      );

      if (routes.length > 0) {
        const bestRoute = routes[0];
        setSelectedRoute(bestRoute);
        setToAmount(bestRoute.outAmount.toString());
      }
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

  const handleSwap = async (fromToken: string, toToken: string) => {
    if (!selectedRoute) return;

    try {
      const userPublicKey = new PublicKey(""); // TODO: Get from wallet
      const jupiter = await initJupiter(userPublicKey);
      const txid = await executeSwap(jupiter, selectedRoute, userPublicKey);

      await supabase.from("swap_transactions").insert({
        user_id: user?.id,
        from_token: fromToken,
        to_token: toToken,
        from_amount: parseFloat(fromAmount),
        to_amount: parseFloat(toAmount),
        slippage,
        status: "completed",
        gas_fee: gasFee,
        swap_route: selectedRoute,
      });

      toast({
        title: "Swap Successful",
        description: `Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
      });

      return txid;
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
      calculateToAmount(fromAmount, "SOL", "MEME");
    }
  };

  const handleQuickAmountSelect = (percentage: number) => {
    // TODO: Implement based on wallet balance
    const amount = (1000 * percentage) / 100;
    calculateToAmount(amount.toString(), "SOL", "MEME");
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