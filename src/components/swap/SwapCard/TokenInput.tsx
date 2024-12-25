import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TokenInfo } from "@/types/token-swap";
import { ChevronDown } from "lucide-react";
import { useSwap } from "@/contexts/SwapContext";

interface TokenInputProps {
  type: "input" | "output";
  token: TokenInfo | null;
  amount: string;
}

export const TokenInput = ({ type, token, amount }: TokenInputProps) => {
  const { setAmountIn, setAmountOut } = useSwap();

  const handleAmountChange = (value: string) => {
    if (type === "input") {
      setAmountIn(value);
    } else {
      setAmountOut(value);
    }
  };

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex justify-between items-center">
        <Input
          type="number"
          placeholder="0.0"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          className="border-none text-2xl focus-visible:ring-0"
        />
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {}}
        >
          {token ? (
            <>
              {token.logoURI && (
                <img
                  src={token.logoURI}
                  alt={token.symbol}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span>{token.symbol}</span>
            </>
          ) : (
            <span>Select token</span>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};