import { Input } from "@/components/ui/input";
import { QuickAmountButtons } from "./QuickAmountButtons";

interface SwapInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  isWalletConnected?: boolean;
  onQuickAmountSelect?: (percentage: number) => void;
  showQuickAmounts?: boolean;
  minimumReceived?: string;
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
}: SwapInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <Input 
        type="number" 
        placeholder="0.0" 
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        disabled={!isWalletConnected}
      />
      {showQuickAmounts && onQuickAmountSelect && (
        <QuickAmountButtons 
          onSelect={onQuickAmountSelect}
          isWalletConnected={isWalletConnected}
        />
      )}
      {minimumReceived && (
        <div className="mt-2 text-sm text-muted-foreground">
          Minimum received: {minimumReceived} MEME
        </div>
      )}
    </div>
  );
};