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

  const isHighImpact = false; // TODO: Implement price impact calculation
  const priceImpact = 0; // TODO: Implement price impact calculation
  const swapRoute = []; // TODO: Implement swap route display

  const handleSwapClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmSwap = async () => {
    try {
      await handleSwap(selectedTokens.from, selectedTokens.to);
      setIsConfirmationOpen(false);
    } catch (error) {
      // Error is already handled in handleSwap
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