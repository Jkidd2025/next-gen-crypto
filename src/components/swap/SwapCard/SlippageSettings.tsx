import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings2 } from "lucide-react";
import { useSwap } from "@/contexts/SwapContext";

const PRESET_VALUES = [0.1, 0.5, 1.0];

export const SlippageSettings = () => {
  const { state, setSlippage } = useSwap();
  const [customValue, setCustomValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handlePresetClick = (value: number) => {
    setError(null);
    setCustomValue("");
    setSlippage(value);
  };

  const handleCustomValueChange = (value: string) => {
    setCustomValue(value);
    const numValue = parseFloat(value);

    if (value && isNaN(numValue)) {
      setError("Please enter a valid number");
      return;
    }

    if (numValue < 0 || numValue > 100) {
      setError("Slippage must be between 0 and 100");
      return;
    }

    if (numValue > 5) {
      setError("Warning: High slippage tolerance");
    } else {
      setError(null);
    }

    setSlippage(numValue);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transaction Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Slippage Tolerance</label>
            <div className="mt-2 flex gap-2">
              {PRESET_VALUES.map((value) => (
                <Button
                  key={value}
                  variant={state.slippage === value ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handlePresetClick(value)}
                >
                  {value}%
                </Button>
              ))}
              <div className="relative flex-1">
                <Input
                  type="number"
                  placeholder="Custom"
                  value={customValue}
                  onChange={(e) => handleCustomValueChange(e.target.value)}
                  className="pr-6"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  %
                </span>
              </div>
            </div>
            {error && (
              <p className={`mt-1 text-sm ${error.includes("Warning") ? "text-yellow-500" : "text-red-500"}`}>
                {error}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Details</label>
            <div className="rounded-lg bg-gray-50 p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Slippage:</span>
                <span className="font-medium">{state.slippage}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Minimum Received:</span>
                <span className="font-medium">
                  {state.amountOut
                    ? `${(parseFloat(state.amountOut) * (1 - state.slippage / 100)).toFixed(6)} ${
                        state.tokenOut?.symbol || ""
                      }`
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};