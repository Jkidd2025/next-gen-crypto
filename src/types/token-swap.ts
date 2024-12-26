export interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: number;
  usdPrice?: number;
  verified?: boolean;
  favorite?: boolean;
  tags?: string[];
}

export interface TokenSearchFilters {
  verified: boolean;
  favorite: boolean;
  hasBalance: boolean;
  tags: string[];
  minBalance?: number;
}

export interface SwapState {
  tokenIn: TokenInfo | null;
  tokenOut: TokenInfo | null;
  amountIn: string;
  amountOut: string;
  slippage: number;
  priceImpact: number;
  status: 'idle' | 'loading' | 'quoting' | 'error';
  error: Error | null;
  route: RouteStep[] | null;
}

export interface SwapQuote {
  inAmount: string;
  outAmount: string;
  priceImpact: number;
  route: RouteStep[];
  fee: number;
  executionPrice: number;
  minimumReceived: string;
}

export interface RouteStep {
  poolId: string;
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  amountIn: string;
  amountOut: string;
  symbol: string;
  mint: string;
}

export interface PoolInfo {
  id: string;
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  tokenAReserves: string;
  tokenBReserves: string;
  liquidity: string;
  fee: number;
  address?: string;
}

export interface TokenListVersion {
  major: number;
  minor: number;
  patch: number;
  timestamp: number;
}

export interface RaydiumTokenList {
  name: string;
  timestamp: string;
  version: TokenListVersion;
  tokens: TokenInfo[];
}

export interface SwapError extends Error {
  code: string;
  details?: any;
}