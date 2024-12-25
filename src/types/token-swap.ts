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
  priceImpact: number;
  route: RouteStep[] | null;
  status: SwapStatus;
  error: SwapError | null;
}

export interface SwapQuote {
  inAmount: string;
  outAmount: string;
  priceImpact: number;
  fee: number;
  route: RouteStep[];
  executionPrice: number;
  minimumReceived: string;
}

export interface SwapError {
  code: string;
  message: string;
  details?: any;
}

export interface RouteStep {
  symbol: string;
  mint: string;
  poolAddress?: string;
  poolFee?: number;
  percentage?: number;
}

export type SwapStatus = 'idle' | 'loading' | 'quoting' | 'swapping' | 'success' | 'error';

export interface PoolInfo {
  address: string;
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  fee: number;
  liquidity: string;
  price: number;
}