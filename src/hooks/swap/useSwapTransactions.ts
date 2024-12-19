import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSwapTransactions = () => {
  const { toast } = useToast();
  const gasFee = 0.000005;

  const handleSwap = async (
    fromToken: string,
    toToken: string,
    fromAmount: string,
    toAmount: string,
    slippage: number,
    userId: string
  ) => {
    try {
      // Store the mock transaction in Supabase
      await supabase.from("swap_transactions").insert({
        user_id: userId,
        from_token: fromToken,
        to_token: toToken,
        from_amount: parseFloat(fromAmount),
        to_amount: parseFloat(toAmount),
        slippage: slippage,
        status: "completed",
        gas_fee: gasFee,
      });

      toast({
        title: "Swap Successful",
        description: `Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
      });

      return "mock-transaction-signature";
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

  return {
    handleSwap,
    gasFee,
  };
};