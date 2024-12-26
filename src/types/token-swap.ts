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
}

export interface SwapState {
  tokenIn: TokenInfo | null;
  tokenOut: TokenInfo | null;
  amountIn: string;
  amountOut: string;
  slippage: number;
  priceImpact: number | null;
}

export interface SwapQuote {
  amountOut: string;
  priceImpact: number;
  route: RouteStep[];
}

export interface RouteStep {
  poolId: string;
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  amountIn: string;
  amountOut: string;
}

export interface PoolInfo {
  id: string;
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  liquidity: string;
}

export interface SwapError {
  code: string;
  message: string;
  details?: any;
}

export interface RaydiumTokenList {
  name: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tokens: TokenInfo[];
}