import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SwapFormProps {
  isWalletConnected: boolean;
}

export const SwapForm = ({ isWalletConnected }: SwapFormProps) => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const { toast } = useToast();

  const calculateToAmount = (value: string) => {
    setFromAmount(value);
    setToAmount((parseFloat(value) * 1000).toString());
  };

  const handleSwap = async () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }
    console.log("Swapping tokens:", { fromAmount, toAmount });
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
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">To (MEME)</label>
        <Input 
          type="number" 
          placeholder="0.0" 
          value={toAmount}
          readOnly 
        />
      </div>
      <Button 
        className="w-full bg-primary hover:bg-primary/90"
        onClick={handleSwap}
        disabled={!fromAmount}
      >
        Swap Tokens
      </Button>
    </div>
  );
};