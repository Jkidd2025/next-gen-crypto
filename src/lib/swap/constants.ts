import { TokenInfo } from "@/types/token-swap";

export const SLIPPAGE_OPTIONS = [0.1, 0.5, 1.0, 5.0];
export const DEFAULT_SLIPPAGE = 0.5;

export const MAX_PRICE_IMPACT_PERCENTAGE = 15;
export const HIGH_PRICE_IMPACT_THRESHOLD = 5;

export const COMMON_BASES: TokenInfo[] = [
  {
    mint: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
    decimals: 9,
  },
  {
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
  }
];

export const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
export const SWAP_PROGRAM_ID = "SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8";
export const MIN_LIQUIDITY = "1000";
export const MAX_TOKENS_TO_FETCH = 1000;
export const DEFAULT_TOKEN_DECIMALS = 9;