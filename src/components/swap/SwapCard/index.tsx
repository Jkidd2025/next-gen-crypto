import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenInput } from "./TokenInput";
import { SwapButton } from "./SwapButton";
import { useSwap } from "@/contexts/SwapContext";

export const SwapCard = () => {
  const { state } = useSwap();

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle>Swap Tokens</CardTitle>
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
      </CardContent>
    </Card>
  );
};