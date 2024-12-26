import { TokenInfo as SolanaTokenInfo } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

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
  validation?: TokenValidationState;
  metadata?: TokenMetadata;
}

export interface TokenValidationError {
  code: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface TokenValidationState {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  lastChecked: number;
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply?: string;
  mintAuthority?: string;
  freezeAuthority?: string;
}

export type TokenImportStatus = 'existing' | 'imported' | 'failed';

export interface ImportedTokenInfo extends TokenInfo {
  status: TokenImportStatus;
}

export interface TokenImportError {
  mintAddress: string;
  error: string;
}

export interface TokenSearchFilters {
  verified: boolean;
  favorite: boolean;
  hasBalance: boolean;
  tags: string[];
  minBalance?: number;
}

export interface PoolState {
  address: PublicKey;
  tokenA: PublicKey;
  tokenB: PublicKey;
  tickSpacing: number;
  liquidity: BN;
  sqrtPriceX64: BN;
  currentTickIndex: number;
  fee: number;
  loading: boolean;
  error: Error | null;
}

export interface SwapState {
  tokenIn: TokenInfo | null;
  tokenOut: TokenInfo | null;
  amountIn: string;
  amountOut: string;
  slippage: number;
  priceImpact: number;
  route: RouteStep[] | null;
  status: 'idle' | 'loading' | 'quoting' | 'error';
  error: SwapError | null;
  pool: PoolState | null;
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
