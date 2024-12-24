export type TokenSymbol = string;

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface TokenInfo {
  symbol: TokenSymbol;
  name: string;
  decimals: number;
  address: string;
  mint_address?: string;
  logoURI?: string;
}

export interface MarketInfo {
  amm: {
    label: string;
  };
  inputMint: string;
  outputMint: string;
}

export interface QuoteResponse {
  data: {
    outAmount: string;
    priceImpactPct: number;
    marketInfos: MarketInfo[];
  };
}