import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SwapConfirmationDialog } from "./SwapConfirmationDialog";
import { SwapInput } from "./SwapInput";
import { SlippageControl } from "./SlippageControl";
import { PriceImpactWarning } from "./PriceImpactWarning";
import { TransactionHistory } from "./TransactionHistory";
import { TokenSelector } from "./TokenSelector";
import { SwapRoute } from "./SwapRoute";
import { RefreshCw } from "lucide-react";
import { useSwap } from "@/hooks/useSwap";
import { useToast } from "@/hooks/use-toast";

interface SwapFormProps {
  isWalletConnected: boolean;
}

export const SwapForm = ({ isWalletConnected }: SwapFormProps) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState({
    from: "SOL",
    to: "MEME",
  });

  const { toast } = useToast();

  const {
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
  } = useSwap();

  const handleSwapClick = () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to proceed with the swap",
        variant: "destructive",
      });
      return;
    }
    setIsConfirmationOpen(true);
  };

  const handleConfirmSwap = async () => {
    try {
      await handleSwap(selectedTokens.from, selectedTokens.to);
      setIsConfirmationOpen(false);
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
      setIsConfirmationOpen(false);
    }
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
        onChange={(value) => calculateToAmount(value, selectedTokens.from, selectedTokens.to)}
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
        route={[]}
      />

      <div className="text-sm text-muted-foreground">
        Estimated Gas Fee: {gasFee} SOL
      </div>

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
        priceImpact={0}
        minimumReceived={calculateMinimumReceived()}
        isHighImpact={false}
      />

      <TokenSelector
        isOpen={isTokenSelectorOpen}
        onClose={() => setIsTokenSelectorOpen(false)}
        onSelect={(token) => {
          setSelectedTokens((prev) => ({
            ...prev,
            from: token.symbol,
          }));
          setIsTokenSelectorOpen(false);
        }}
      />

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Transaction History</h3>
        <TransactionHistory />
      </div>
    </div>
  );
};