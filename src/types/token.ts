export type TokenSymbol = 'SOL' | 'USDC' | 'USDT';

export interface Token {
  symbol: TokenSymbol;
  address: string;
  decimals: number;
  name: string;
  logoURI?: string;
}

export interface TokenPair {
  from: Token;
  to: Token;
}

export interface AmmInfo {
  label: string;
}

export interface MarketInfo {
  amm: AmmInfo;
  inputMint: string;
  outputMint: string;
}

export interface Route {
  marketInfos: MarketInfo[];
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];