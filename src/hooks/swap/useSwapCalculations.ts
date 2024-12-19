import { useState } from "react";

export const useSwapCalculations = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const calculateToAmount = async (
    value: string,
    fromToken: string,
    toToken: string
  ) => {
    if (!value) return "0";

    setIsRefreshing(true);
    try {
      // Mock exchange rate calculation
      const mockRate = 1.5;
      const calculatedAmount = parseFloat(value) * mockRate;
      return calculatedAmount.toString();
    } catch (error) {
      console.error('Error calculating amount:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  };

  const calculateMinimumReceived = (amount: string, slippage: number) => {
    if (!amount) return "0";
    const parsedAmount = parseFloat(amount);
    return (parsedAmount * (1 - slippage / 100)).toFixed(6);
  };

  return {
    isRefreshing,
    calculateToAmount,
    calculateMinimumReceived,
  };
};