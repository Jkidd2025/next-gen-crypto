import { useState } from "react";

export const useSwapState = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);

  const handleQuickAmountSelect = (percentage: number) => {
    // Mock balance calculation
    const mockBalance = 100;
    const amount = (mockBalance * percentage) / 100;
    setFromAmount(amount.toString());
    return amount.toString();
  };

  return {
    fromAmount,
    toAmount,
    slippage,
    setFromAmount,
    setToAmount,
    setSlippage,
    handleQuickAmountSelect,
  };
};