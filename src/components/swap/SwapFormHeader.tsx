import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface SwapFormHeaderProps {
  refreshPrice: () => void;
  isRefreshing: boolean;
}

export const SwapFormHeader = ({ refreshPrice, isRefreshing }: SwapFormHeaderProps) => {
  return (
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
  );
};