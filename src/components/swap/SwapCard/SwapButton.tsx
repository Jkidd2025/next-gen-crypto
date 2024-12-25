import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";
import { useSwap } from "@/contexts/SwapContext";

export const SwapButton = () => {
  const { state } = useSwap();

  const handleSwap = () => {
    // Swap implementation will be added in next phase
    console.log("Swap tokens:", state);
  };

  return (
    <div className="flex justify-center -my-2">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background h-10 w-10"
        onClick={handleSwap}
      >
        <ArrowDownUp className="h-4 w-4" />
      </Button>
    </div>
  );
};