export interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface SwapState {
  tokenIn: TokenInfo | null;
  tokenOut: TokenInfo | null;
  amountIn: string;
  amountOut: string;
  slippage: number;
}

export interface SwapQuote {
  inAmount: string;
  outAmount: string;
  priceImpact: number;
  fee: number;
}

export interface SwapError {
  code: string;
  message: string;
  details?: any;
}

export type SwapStatus = 'idle' | 'loading' | 'success' | 'error';