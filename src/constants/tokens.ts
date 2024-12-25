import { TokenInfo } from '@/types/token-swap';

export const COMMON_TOKENS: Record<string, TokenInfo> = {
  SOL: {
    mint: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
    decimals: 9,
    logoURI: undefined
  },
  USDC: {
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI: undefined
  },
  USDT: {
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    logoURI: undefined
  }
} as const;

export type TokenSymbol = keyof typeof COMMON_TOKENS;

export interface Token {
  symbol: string;
  mint: string;
  decimals: number;
  name: string;
  logoURI?: string;
}