import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuickAmountButtons } from "./QuickAmountButtons";
import { ChevronDown } from "lucide-react";

interface SwapInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  isWalletConnected?: boolean;
  onQuickAmountSelect?: (percentage: number) => void;
  showQuickAmounts?: boolean;
  minimumReceived?: string;
  onTokenSelect?: () => void;
}

export const SwapInput = ({
  label,
  value,
  onChange,
  readOnly,
  isWalletConnected,
  onQuickAmountSelect,
  showQuickAmounts,
  minimumReceived,
  onTokenSelect,
}: SwapInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="0.0"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          disabled={!isWalletConnected}
          className="flex-1"
        />
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onTokenSelect}
        >
          {label.split(" ")[1].replace(/[()]/g, "")}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      {showQuickAmounts && onQuickAmountSelect && (
        <QuickAmountButtons
          onSelect={onQuickAmountSelect}
          isWalletConnected={isWalletConnected}
        />
      )}
      {minimumReceived && (
        <div className="mt-2 text-sm text-muted-foreground">
          Minimum received: {minimumReceived}
        </div>
      )}
    </div>
  );
};