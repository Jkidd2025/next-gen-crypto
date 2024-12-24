import { COMMON_TOKENS } from "@/constants/tokens";
import type { TokenSymbol } from "@/constants/tokens";

export const findTokenInfo = (symbol: string) => {
  return Object.values(COMMON_TOKENS).find(t => t.symbol === symbol);
};

export const calculateMockBalance = (percentage: number) => {
  const mockBalance = 100;
  return (mockBalance * percentage) / 100;
};