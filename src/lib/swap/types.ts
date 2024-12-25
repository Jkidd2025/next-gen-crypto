import { TokenInfo, SwapQuote, RouteStep } from "@/types/token-swap";

export interface SwapParams {
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  amountIn: string;
  slippage: number;
}

export interface SwapResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export interface TokenPair {
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  poolAddress: string;
}

export interface SwapSettings {
  slippage: number;
  deadline: number;
  autoRouting: boolean;
}