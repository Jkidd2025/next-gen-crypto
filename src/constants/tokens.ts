export const COMMON_TOKENS = {
  SOL: {
    symbol: "SOL",
    address: "So11111111111111111111111111111111111111112",
    decimals: 9,
    name: "Solana"
  },
  USDC: {
    symbol: "USDC",
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
    name: "USD Coin"
  },
  USDT: {
    symbol: "USDT",
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    decimals: 6,
    name: "Tether USD"
  }
} as const;

export type TokenSymbol = keyof typeof COMMON_TOKENS;

export interface Token {
  symbol: string;
  address: string;
  decimals: number;
  name: string;
}