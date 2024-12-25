import { TokenInfo, SwapQuote, RouteStep } from "@/types/token-swap";
import { PublicKey } from "@solana/web3.js";

export interface SwapParams {
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  amountIn: string;
  slippage: number;
  wallet: PublicKey;
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