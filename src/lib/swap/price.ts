import { TokenInfo, SwapQuote } from "@/types/token-swap";
import { HIGH_PRICE_IMPACT_THRESHOLD } from "./constants";

export const calculatePriceImpact = (
  amountIn: string,
  amountOut: string,
  tokenIn: TokenInfo,
  tokenOut: TokenInfo
): number => {
  if (!amountIn || !amountOut || !tokenIn.usdPrice || !tokenOut.usdPrice) {
    return 0;
  }

  const inputValue = parseFloat(amountIn) * tokenIn.usdPrice;
  const outputValue = parseFloat(amountOut) * tokenOut.usdPrice;
  
  return ((inputValue - outputValue) / inputValue) * 100;
};

export const isHighPriceImpact = (priceImpact: number): boolean => {
  return priceImpact > HIGH_PRICE_IMPACT_THRESHOLD;
};

export const calculateMinimumReceived = (
  amount: string,
  slippage: number
): string => {
  if (!amount) return "0";
  const parsedAmount = parseFloat(amount);
  return (parsedAmount * (1 - slippage / 100)).toString();
};

export const formatPrice = (price: number, decimals: number = 6): string => {
  return price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
};