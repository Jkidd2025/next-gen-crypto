import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { SwapConfirmationDialog } from "./SwapConfirmationDialog";

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

  // Calculate price impact (mock implementation - replace with actual calculation)
  const calculatePriceImpact = (amount: string): number => {
    return parseFloat(amount) * 0.2; // Mock implementation
  };

  const calculateMinimumReceived = (): string => {
    const minimumAmount = parseFloat(toAmount) * (1 - slippage / 100);
    return minimumAmount.toFixed(6);
  };

  const calculateToAmount = (value: string) => {
    setFromAmount(value);
    // Mock exchange rate: 1 SOL = 1000 MEME
    setToAmount((parseFloat(value) * 1000).toString());
  };

  const handleQuickAmountSelect = (percentage: number) => {
    // Mock max amount of 10 SOL
    const maxAmount = 10;
    const amount = (maxAmount * percentage / 100).toString();
    calculateToAmount(amount);
  };

  const priceImpact = calculatePriceImpact(fromAmount);
  const isHighImpact = priceImpact > 5; // Warning if impact > 5%

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
      // Record the transaction in Supabase
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
      <div>
        <label className="block text-sm font-medium mb-2">From (SOL)</label>
        <Input 
          type="number" 
          placeholder="0.0" 
          value={fromAmount}
          onChange={(e) => calculateToAmount(e.target.value)}
          disabled={!isWalletConnected}
        />
        <div className="flex gap-2 mt-2">
          {[25, 50, 75, 100].map((percentage) => (
            <Button
              key={percentage}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAmountSelect(percentage)}
              disabled={!isWalletConnected}
            >
              {percentage === 100 ? 'MAX' : `${percentage}%`}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">To (MEME)</label>
        <Input 
          type="number" 
          placeholder="0.0" 
          value={toAmount}
          readOnly 
        />
        {fromAmount && (
          <div className="mt-2 text-sm text-muted-foreground">
            Minimum received: {calculateMinimumReceived()} MEME
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Slippage Tolerance: {slippage}%
        </label>
        <Slider
          value={[slippage]}
          onValueChange={(value) => setSlippage(value[0])}
          max={5}
          step={0.1}
          className="w-full"
        />
      </div>

      {isHighImpact && fromAmount && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <span className="text-sm text-destructive">
            High price impact! The size of your trade may significantly affect the market price.
          </span>
        </div>
      )}

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