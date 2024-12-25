import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenInput } from "./TokenInput";
import { SwapButton } from "./SwapButton";
import { useSwap } from "@/contexts/SwapContext";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PriceImpactWarning } from "../PriceImpactWarning";
import { SlippageSettings } from "./SlippageSettings";

export const SwapCard = () => {
  const { state } = useSwap();

  // Calculate exchange rate
  const exchangeRate = state.tokenIn && state.tokenOut && state.amountIn && state.amountOut
    ? Number(state.amountOut) / Number(state.amountIn)
    : null;

  // Determine if price impact is high (> 5%)
  const isHighImpact = state.priceImpact > 5;
  const isLoading = state.status === 'loading' || state.status === 'quoting';

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Swap Tokens</CardTitle>
        <SlippageSettings />
      </CardHeader>
      <CardContent className="space-y-4">
        <TokenInput
          type="input"
          token={state.tokenIn}
          amount={state.amountIn}
        />
        <SwapButton />
        <TokenInput
          type="output"
          token={state.tokenOut}
          amount={state.amountOut}
        />
        
        {/* Price Impact Warning */}
        <PriceImpactWarning 
          isHighImpact={isHighImpact} 
          fromAmount={state.amountIn} 
        />
        
        {/* Price Impact and Exchange Rate */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[160px]" />
          </div>
        ) : (
          state.tokenIn && state.tokenOut && exchangeRate && (
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Price Impact</span>
                <span className={cn(
                  "font-medium",
                  isHighImpact ? "text-destructive" : "text-gray-700"
                )}>
                  {state.priceImpact.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Exchange Rate</span>
                <span className="font-medium">
                  1 {state.tokenIn.symbol} = {exchangeRate.toFixed(6)} {state.tokenOut.symbol}
                </span>
              </div>
            </div>
          )
        )}

        {/* Route Information */}
        {state.route && state.route.length > 0 && (
          <div className="text-sm text-gray-500 border rounded-lg p-2">
            <div className="font-medium mb-1">Route</div>
            <div className="flex items-center gap-2">
              {state.route.map((token, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <span className="mx-1">→</span>}
                  <span>{token.symbol}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};