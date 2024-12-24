import { useState } from 'react';
import { TokenSymbol } from '@/constants/tokens';

export const useSwapState = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<{
    from: TokenSymbol;
    to: TokenSymbol;
  }>({
    from: "SOL",
    to: "USDC",
  });

  const handleQuickAmountSelect = (percentage: number) => {
    const mockBalance = 100;
    const amount = (mockBalance * percentage) / 100;
    setFromAmount(amount.toString());
    return amount.toString();
  };

  return {
    fromAmount,
    setFromAmount,
    toAmount,
    setToAmount,
    slippage,
    setSlippage,
    isTokenSelectorOpen,
    setIsTokenSelectorOpen,
    selectedTokens,
    setSelectedTokens,
    handleQuickAmountSelect,
  };
};