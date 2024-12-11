import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { SwapConfirmationDialog } from "./SwapConfirmationDialog";
import { SwapInput } from "./SwapInput";
import { SlippageControl } from "./SlippageControl";
import { PriceImpactWarning } from "./PriceImpactWarning";

interface SwapFormProps {
  isWalletConnected: boolean;
}

export const SwapForm = ({ isWalletConnected }: SwapFormProps) => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const calculatePriceImpact = (amount: string): number => {
    return parseFloat(amount) * 0.2;
  };

  const calculateMinimumReceived = (): string => {
    const minimumAmount = parseFloat(toAmount) * (1 - slippage / 100);
    return minimumAmount.toFixed(6);
  };

  const calculateToAmount = (value: string) => {
    setFromAmount(value);
    setToAmount((parseFloat(value) * 1000).toString());
  };

  const handleQuickAmountSelect = (percentage: number) => {
    const maxAmount = 10;
    const amount = (maxAmount * percentage / 100).toString();
    calculateToAmount(amount);
  };

  const priceImpact = calculatePriceImpact(fromAmount);
  const isHighImpact = priceImpact > 5;

  const handleSwapClick = () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }
    setIsConfirmationOpen(true);
  };

  const handleConfirmSwap = async () => {
    try {
      const { error } = await supabase.from('swap_transactions').insert({
        user_id: user?.id,
        from_token: 'SOL',
        to_token: 'MEME',
        from_amount: parseFloat(fromAmount),
        to_amount: parseFloat(toAmount),
        slippage: slippage,
        status: 'completed'
      });

      if (error) throw error;

      toast({
        title: "Swap Successful",
        description: `Swapped ${fromAmount} SOL for ${toAmount} MEME`,
      });
    } catch (error) {
      toast({
        title: "Swap Failed",
        description: "There was an error processing your swap",
        variant: "destructive",
      });
    }
    setIsConfirmationOpen(false);
  };

  return (
    <div className="space-y-6">
      <SwapInput
        label="From (SOL)"
        value={fromAmount}
        onChange={calculateToAmount}
        isWalletConnected={isWalletConnected}
        onQuickAmountSelect={handleQuickAmountSelect}
        showQuickAmounts={true}
      />

      <SwapInput
        label="To (MEME)"
        value={toAmount}
        readOnly={true}
        minimumReceived={fromAmount ? calculateMinimumReceived() : undefined}
      />

      <SlippageControl
        value={slippage}
        onChange={setSlippage}
      />

      <PriceImpactWarning
        isHighImpact={isHighImpact}
        fromAmount={fromAmount}
      />

      <Button 
        className="w-full bg-primary hover:bg-primary/90"
        onClick={handleSwapClick}
        disabled={!fromAmount || !isWalletConnected}
      >
        Swap Tokens
      </Button>

      <SwapConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmSwap}
        fromAmount={fromAmount}
        toAmount={toAmount}
        priceImpact={priceImpact}
        minimumReceived={calculateMinimumReceived()}
        isHighImpact={isHighImpact}
      />
    </div>
  );
};