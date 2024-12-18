import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { SwapConfirmationDialog } from "./SwapConfirmationDialog";
import { SwapInput } from "./SwapInput";
import { SlippageControl } from "./SlippageControl";
import { PriceImpactWarning } from "./PriceImpactWarning";
import { TransactionHistory } from "./TransactionHistory";
import { TokenSelector } from "./TokenSelector";
import { SwapRoute } from "./SwapRoute";
import { RefreshCw } from "lucide-react";
import { getAccountBalance, getSolanaConnection } from "@/utils/solana";

interface SwapFormProps {
  isWalletConnected: boolean;
}

export const SwapForm = ({ isWalletConnected }: SwapFormProps) => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState({
    from: "SOL",
    to: "MEME",
  });
  const [gasFee, setGasFee] = useState(0.000005); // Example gas fee
  const [swapRoute, setSwapRoute] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
    const amount = ((maxAmount * percentage) / 100).toString();
    calculateToAmount(amount);
  };

  const refreshPrice = async () => {
    setIsRefreshing(true);
    // Simulate price refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    calculateToAmount(fromAmount);
    setIsRefreshing(false);
  };

  const priceImpact = calculatePriceImpact(fromAmount);
  const isHighImpact = priceImpact > 5;

  const handleSwapClick = async () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    // Verify balance before proceeding
    try {
      const balance = await getAccountBalance(window.solana.publicKey.toString());
      if (balance < parseFloat(fromAmount)) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough SOL for this swap",
          variant: "destructive",
        });
        return;
      }
      setIsConfirmationOpen(true);
    } catch (error) {
      console.error("Error checking balance:", error);
      toast({
        title: "Error",
        description: "Failed to verify balance",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const updateBalance = async () => {
      if (isWalletConnected && window.solana?.publicKey) {
        try {
          const balance = await getAccountBalance(window.solana.publicKey.toString());
          // Update max amount based on balance
          const maxAmount = balance * 0.99; // Leave some for gas
          setFromAmount(maxAmount.toString());
          calculateToAmount(maxAmount.toString());
        } catch (error) {
          console.error("Error updating balance:", error);
        }
      }
    };

    if (isWalletConnected) {
      updateBalance();
    }
  }, [isWalletConnected]);

  const handleConfirmSwap = async () => {
    try {
      const { error } = await supabase.from("swap_transactions").insert({
        user_id: user?.id,
        from_token: selectedTokens.from,
        to_token: selectedTokens.to,
        from_amount: parseFloat(fromAmount),
        to_amount: parseFloat(toAmount),
        slippage: slippage,
        status: "completed",
        gas_fee: gasFee,
        swap_route: swapRoute,
      });

      if (error) throw error;

      toast({
        title: "Swap Successful",
        description: `Swapped ${fromAmount} ${selectedTokens.from} for ${toAmount} ${selectedTokens.to}`,
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Swap Tokens</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={refreshPrice}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      <SwapInput
        label={`From (${selectedTokens.from})`}
        value={fromAmount}
        onChange={calculateToAmount}
        isWalletConnected={isWalletConnected}
        onQuickAmountSelect={handleQuickAmountSelect}
        showQuickAmounts={true}
        onTokenSelect={() => setIsTokenSelectorOpen(true)}
      />

      <SwapInput
        label={`To (${selectedTokens.to})`}
        value={toAmount}
        readOnly={true}
        minimumReceived={fromAmount ? calculateMinimumReceived() : undefined}
        onTokenSelect={() => setIsTokenSelectorOpen(true)}
      />

      <SlippageControl value={slippage} onChange={setSlippage} />

      <SwapRoute
        fromToken={selectedTokens.from}
        toToken={selectedTokens.to}
        route={swapRoute}
      />

      <div className="text-sm text-muted-foreground">
        Estimated Gas Fee: {gasFee} SOL
      </div>

      <PriceImpactWarning isHighImpact={isHighImpact} fromAmount={fromAmount} />

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

      <TokenSelector
        isOpen={isTokenSelectorOpen}
        onClose={() => setIsTokenSelectorOpen(false)}
        onSelect={(token) => {
          setSelectedTokens((prev) => ({
            ...prev,
            from: token.symbol,
          }));
        }}
      />

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Transaction History</h3>
        <TransactionHistory />
      </div>
    </div>
  );
};
