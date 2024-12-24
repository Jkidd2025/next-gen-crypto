import { SwapInput } from "./SwapInput";
import { TokenSymbol } from "@/constants/tokens";

interface SwapInputSectionProps {
  fromToken: TokenSymbol;
  toToken: TokenSymbol;
  fromAmount: string;
  toAmount: string;
  isWalletConnected: boolean;
  onFromAmountChange: (value: string) => void;
  onQuickAmountSelect: (percentage: number) => void;
  onTokenSelect: () => void;
  calculateMinimumReceived: () => string | undefined;
}

export const SwapInputSection = ({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  isWalletConnected,
  onFromAmountChange,
  onQuickAmountSelect,
  onTokenSelect,
  calculateMinimumReceived,
}: SwapInputSectionProps) => {
  return (
    <>
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
    </>
  );
};