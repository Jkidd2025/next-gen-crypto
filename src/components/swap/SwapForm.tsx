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
import { initJupiter, getRoutes, executeSwap, getTokensList } from "@/services/jupiter";
import { PublicKey } from "@solana/web3.js";

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

  const [availableTokens, setAvailableTokens] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const tokens = await getTokensList();
        setAvailableTokens(tokens);
      } catch (error) {
        console.error('Error loading tokens:', error);
        toast({
          title: "Error",
          description: "Failed to load available tokens",
          variant: "destructive",
        });
      }
    };

    loadTokens();
  }, []);

  const calculateToAmount = async (value: string) => {
    if (!value || !isWalletConnected) {
      setToAmount("");
      return;
    }

    setIsRefreshing(true);
    setFromAmount(value);

    try {
      // Initialize Jupiter
      const userPublicKey = new PublicKey(""); // TODO: Get from wallet
      const jupiter = await initJupiter(userPublicKey);

      // Get routes
      const routes = await getRoutes(
        jupiter,
        selectedTokens.from,
        selectedTokens.to,
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

  const handleConfirmSwap = async () => {
    if (!selectedRoute || !isWalletConnected) return;

    try {
      const userPublicKey = new PublicKey(""); // TODO: Get from wallet
      const jupiter = await initJupiter(userPublicKey);
      
      const txid = await executeSwap(jupiter, selectedRoute, userPublicKey);

      // Save transaction to Supabase
      const { error } = await supabase.from("swap_transactions").insert({
        user_id: user?.id,
        from_token: selectedTokens.from,
        to_token: selectedTokens.to,
        from_amount: parseFloat(fromAmount),
        to_amount: parseFloat(toAmount),
        slippage: slippage,
        status: "completed",
        gas_fee: gasFee,
        swap_route: selectedRoute,
      });

      if (error) throw error;

      toast({
        title: "Swap Successful",
        description: `Swapped ${fromAmount} ${selectedTokens.from} for ${toAmount} ${selectedTokens.to}`,
      });
    } catch (error) {
      console.error('Error executing swap:', error);
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
