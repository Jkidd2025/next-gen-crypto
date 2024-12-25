import { TokenInfo } from "@/types/token-swap";
import { MAX_PRICE_IMPACT_PERCENTAGE } from "./constants";

export const validateSwapInput = (
  tokenIn: TokenInfo | null,
  tokenOut: TokenInfo | null,
  amountIn: string,
  balance?: number
): string | null => {
  if (!tokenIn || !tokenOut) {
    return "Please select tokens";
  }

  if (!amountIn || parseFloat(amountIn) <= 0) {
    return "Enter an amount";
  }

  if (balance !== undefined && parseFloat(amountIn) > balance) {
    return "Insufficient balance";
  }

  return null;
};

export const validatePriceImpact = (priceImpact: number): string | null => {
  if (priceImpact > MAX_PRICE_IMPACT_PERCENTAGE) {
    return "Price impact too high";
  }

  return null;
};

export const validateSlippage = (slippage: number): string | null => {
  if (slippage <= 0) {
    return "Slippage must be greater than 0";
  }

  if (slippage > 100) {
    return "Slippage cannot exceed 100%";
  }

  return null;
};