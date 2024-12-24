import { SwapInput } from "./SwapInput";

interface SwapInputsSectionProps {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  isWalletConnected: boolean;
  onFromAmountChange: (value: string) => void;
  onQuickAmountSelect: (percentage: number) => void;
  onTokenSelect: () => void;
  calculateMinimumReceived: () => string;
}

export const SwapInputsSection = ({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  isWalletConnected,
  onFromAmountChange,
  onQuickAmountSelect,
  onTokenSelect,
  calculateMinimumReceived,
}: SwapInputsSectionProps) => {
  return (
    <div className="space-y-4">
      <SwapInput
        label={`From (${fromToken})`}
        value={fromAmount}
        onChange={onFromAmountChange}
        isWalletConnected={isWalletConnected}
        onQuickAmountSelect={onQuickAmountSelect}
        showQuickAmounts={true}
        onTokenSelect={onTokenSelect}
      />

      <SwapInput
        label={`To (${toToken})`}
        value={toAmount}
        readOnly={true}
        minimumReceived={fromAmount ? calculateMinimumReceived() : undefined}
        onTokenSelect={onTokenSelect}
      />
    </div>
  );
};